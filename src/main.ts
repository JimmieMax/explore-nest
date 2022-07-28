import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { LimitationInterceptor } from './core/interceptors/limitation.interceptor';
import { PerformanceInterceptor } from './core/interceptors/performance.interceptor';
import { ResponseInterceptor } from './core/interceptors/response.interceptor';
import {
  HttpExceptionFilter,
  ServerExceptionFilter,
} from './core/filters/server.exception.filter';
import { TimeoutInterceptor } from './core/interceptors/timeout.interceptor';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  // app.useGlobalGuards(new AuthGuard());
  app.useGlobalFilters(app.get(ServerExceptionFilter));
  app.useGlobalFilters(app.get(HttpExceptionFilter));
  app.useGlobalFilters(app.get(HttpExceptionFilter));
  app.useGlobalInterceptors(app.get(TimeoutInterceptor));
  app.useGlobalInterceptors(app.get(PerformanceInterceptor));
  app.useGlobalInterceptors(app.get(LimitationInterceptor));
  app.useGlobalInterceptors(app.get(ResponseInterceptor));

  await app.listen(10011);
}
bootstrap();
