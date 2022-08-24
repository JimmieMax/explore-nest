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
import { SwaggerModule, DocumentBuilder } from '@nestjs/swagger';
import helmet from 'helmet';
import * as csurf from 'csurf';
import { logger } from './core/logger';

const PORT = process.env.PORT || 10011;
const PREFIX = 'api/v1';

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
  // Swagger document
  const config = new DocumentBuilder()
    .setTitle('Cats example')
    .setDescription('The cats API description')
    .setVersion('1.0')
    .addTag('cats')
    .build();
  const document = SwaggerModule.createDocument(app, config);
  SwaggerModule.setup('api', app, document);

  // 路径前缀：如：http://www.dmyxs.com/api/v1/user
  app.setGlobalPrefix(PREFIX);

  //cors：跨域资源共享，方式一：允许跨站访问
  app.enableCors();
  // 方式二：const app = await NestFactory.create(AppModule, { cors: true });

  //防止跨站脚本攻击
  app.use(helmet());

  //CSRF保护：跨站点请求伪造
  // app.use(csurf());

  await app.listen(PORT, () => {
    logger.info(`服务已经启动,接口请访问:http://localhost:${PORT}/${PREFIX}`);
  });
}
bootstrap();
