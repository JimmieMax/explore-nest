import { ConfigService } from '@nestjs/config';
import {
  CallHandler,
  ExecutionContext,
  Inject,
  Injectable,
  NestInterceptor,
} from '@nestjs/common';
import { Observable } from 'rxjs';
import { logger } from '../logger';
import {
  ServerException,
  ServerExceptionCode,
} from '../models/server.exception';

const RequestAccessTokenKey = 'access-token';

@Injectable()
export class AuthInterceptor implements NestInterceptor {
  @Inject()
  private readonly configService: ConfigService;

  async intercept(
    context: ExecutionContext,
    next: CallHandler<any>,
  ): Promise<Observable<any>> {
    const request = context.switchToHttp().getRequest();
    const token = request.headers[RequestAccessTokenKey] as string;
    if (!token) {
      throw new ServerException(ServerExceptionCode.TokenExpired, '请先登录');
    }
    let userId;
    try {
      const result: any = await this.exchangeToken(token);
      userId = result.userId;
    } catch (error) {
      logger.error(`登录认证失败：${error}`);
      throw new ServerException(
        ServerExceptionCode.RpcNotFoundService,
        '登录认证失败',
      );
    }
    if (!userId) {
      throw new ServerException(ServerExceptionCode.TokenExpired, '请重新登录');
    }
    request.userId = userId;
    return next.handle();
  }

  private async exchangeToken(token: string) {
    return { userId: '' };
  }
}
