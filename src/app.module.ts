import { CacheInterceptor, Module } from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { TasksModule } from './task/task.module';
import { ScheduleModule } from '@nestjs/schedule';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { ThrottlerModule, ThrottlerGuard } from '@nestjs/throttler';
import { LimitationInterceptor } from './core/interceptors/limitation.interceptor';
import { PerformanceInterceptor } from './core/interceptors/performance.interceptor';
import { ResponseInterceptor } from './core/interceptors/response.interceptor';
import {
  HttpExceptionFilter,
  ServerExceptionFilter,
} from './core/filters/server.exception.filter';
import { HealthCheckController } from './health-check/health-check.controller';
import { HealthCheckModule } from './health-check/health-check.module';
import { UserModule } from './user/user.module';
import { APP_GUARD } from '@nestjs/core';
import { RolesGuard } from './core/guards/roles.guard';
import { AuthGuard } from './core/guards/auth.guard';
import { TypeOrmModule } from '@nestjs/typeorm';
import { TimeoutInterceptor } from './core/interceptors/timeout.interceptor';
import { CatsModule } from './cats/cats.module';

@Module({
  imports: [
    ThrottlerModule.forRoot({
      ttl: 60, //1分钟
      limit: 10, //请求10次
    }),
    ConfigModule.forRoot({
      isGlobal: true,
      envFilePath: '/opt/nest_configs/cyy_bff_node/config.txt',
    }),
    TypeOrmModule.forRootAsync({
      imports: [ConfigModule],
      inject: [ConfigService],
      useFactory: async (configService: ConfigService) => ({
        type: 'mysql',
        database: configService.get('DB_NAME'),
        host: configService.get('DB_HOST'),
        port: configService.get<number>('DB_PORT'),
        username: configService.get('DB_USERNAME'),
        password: configService.get('DB_PASSWORD'),
        synchronize: false, // 这里千万不要开启同步，会导致数据库数据丢失
        autoLoadEntities: true,
        logging: true,
      }),
    }),
    ScheduleModule.forRoot(),
    TasksModule,
    HealthCheckModule,
    UserModule,
    CatsModule,
  ],
  controllers: [AppController, HealthCheckController],
  providers: [
    AppService,
    HttpExceptionFilter,
    ServerExceptionFilter,
    LimitationInterceptor,
    ResponseInterceptor,
    PerformanceInterceptor,
    TimeoutInterceptor,
    // CacheInterceptor,
    {
      provide: APP_GUARD,
      useClass: ThrottlerGuard,
    },
    {
      provide: APP_GUARD,
      useClass: AuthGuard,
    },
    {
      provide: APP_GUARD,
      useClass: RolesGuard,
    },
  ],
})
export class AppModule {}
