import { CatsService } from './cats.service';
import { CatsDao } from './cats.dao';
import { CatsController } from './cats.controller';
import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { CatsEntity } from './cats.entity';

@Module({
  imports: [TypeOrmModule.forFeature([CatsEntity])],
  controllers: [CatsController],
  providers: [CatsService, CatsDao],
})
export class CatsModule {}
