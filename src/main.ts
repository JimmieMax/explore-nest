import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { LimitationInterceptor } from './core/middlewares/limitation.interceptor';
import { PerformanceInterceptor } from './core/middlewares/performance.interceptor';
import { ResponseInterceptor } from './core/middlewares/response.interceptor';
import {
  HttpExceptionFilter,
  ServerExceptionFilter,
} from './core/middlewares/server.exception.filter';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  app.useGlobalFilters(app.get(ServerExceptionFilter));
  app.useGlobalFilters(app.get(HttpExceptionFilter));
  app.useGlobalInterceptors(app.get(PerformanceInterceptor));
  app.useGlobalInterceptors(app.get(LimitationInterceptor));
  app.useGlobalInterceptors(app.get(ResponseInterceptor));

  await app.listen(10011);
}
bootstrap();
