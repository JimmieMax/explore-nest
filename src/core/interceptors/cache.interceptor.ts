import {
  CacheInterceptor,
  CACHE_TTL_METADATA,
  CallHandler,
  ExecutionContext,
  Injectable,
} from '@nestjs/common';
import { Observable, of, tap } from 'rxjs';
import { Lock } from '../lock';
import { logger } from '../logger';
import {
  ServerException,
  ServerExceptionCode,
} from '../models/server.exception.model';

const UserIdQueryKey = 'user-id';
@Injectable()
export class HttpCacheInterceptor extends CacheInterceptor {
  private lock = new Lock();

  async intercept(
    context: ExecutionContext,
    next: CallHandler<any>,
  ): Promise<Observable<any>> {
    if (!this.isRequestCacheable(context)) {
      return next.handle();
    }
    const key = this.trackBy(context);
    if (!key) {
      return next.handle();
    }
    let value = await this.cacheManager.get(key);
    if (value) {
      logger.info(`使用缓存: ${key}`);
      return of(value);
    }
    try {
      // 防止缓存击穿：在缓存失效的瞬间，大量的请求进来，会直接访问到数据库
      // 因为node是单线程的，没法加锁，通过异步锁来实现，保证同一个key只能有一个拿到锁
      await this.lock.lock(key);
      // 拿到锁后，还需要查下缓存，因为这个时候可能由之前请求设置了缓存了
      value = await this.cacheManager.get(key);
      if (value) {
        this.lock.unlock(key);
        return of(value);
      }
      const ttlValueOrFactory =
        this.reflector.get(CACHE_TTL_METADATA, context.getHandler()) ?? null;
      const ttl =
        typeof ttlValueOrFactory === 'function'
          ? await ttlValueOrFactory(context)
          : ttlValueOrFactory;
      return next.handle().pipe(
        tap({
          next: (value) => {
            const args = ttl ? [key, value, { ttl }] : [key, value];
            this.cacheManager.set(...args);
            // 一定得解锁，不然会导致锁无法释放，触发锁超时
            this.lock.unlock(key);
          },
          error: () => {
            // 一定得解锁，不然会导致锁无法释放，触发锁超时
            this.lock.unlock(key);
          },
        }),
      );
    } catch (error) {
      // 一定得解锁，不然会导致锁无法释放，触发锁超时
      this.lock.unlock(key);
      logger.error(`缓存失效，获取数据失败：${error}`);
      throw new ServerException(ServerExceptionCode.ServiceError, '请稍后重试');
    }
  }

  protected trackBy(context: ExecutionContext): string | null {
    if (!this.isRequestCacheable(context)) {
      return null;
    }
    const req = context.switchToHttp().getRequest();
    let key = req.path + '?';
    const query = req.query;
    const merchantId = req[UserIdQueryKey];
    if (merchantId) {
      query['merchantId'] = merchantId;
    }
    const queryKeys = Object.keys(query).sort();
    for (const queryKey of queryKeys) {
      if (queryKey.startsWith('_')) {
        continue;
      }
      key += `&${queryKey}=${query[queryKey]}`;
    }
    return key;
  }

  protected isRequestCacheable(context: ExecutionContext): boolean {
    const req = context.switchToHttp().getRequest();
    // 如果没有merchantid，说明没登录，则不考虑缓存，防止数据串
    if (!req[UserIdQueryKey]) {
      return false;
    }
    const method = req.method as string;
    return method && method.toUpperCase() === 'GET';
  }
}
