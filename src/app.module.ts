import { CacheInterceptor, Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { AuthInterceptor } from './core/middlewares/auth.interceptor';
import { LimitationInterceptor } from './core/middlewares/limitation.interceptor';
import { PerformanceInterceptor } from './core/middlewares/performance.interceptor';
import { ResponseInterceptor } from './core/middlewares/response.interceptor';
import {
  HttpExceptionFilter,
  ServerExceptionFilter,
} from './core/middlewares/server.exception.filter';

@Module({
  imports: [],
  controllers: [AppController],
  providers: [
    AppService,
    AuthInterceptor,
    HttpExceptionFilter,
    ServerExceptionFilter,
    LimitationInterceptor,
    ResponseInterceptor,
    PerformanceInterceptor,
    // CacheInterceptor,
  ],
})
export class AppModule {}
