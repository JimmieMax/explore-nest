import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { CatDto } from './cats.dto';
import { CatsEntity } from './cats.entity';

@Injectable()
export class CatsDao {
  constructor(
    @InjectRepository(CatsEntity)
    private readonly repository: Repository<CatsEntity>,
  ) {}

  async findBy(keyword?: string) {
    const qb = this.repository.createQueryBuilder('cats').orderBy('id');
    if (keyword) {
      qb.andWhere('channel_name like :keyword', {
        keyword: `%${keyword}%`,
      });
    }
    const rawValues = await qb.getMany();
    if (!rawValues) {
      return [];
    }
    return rawValues.map((raw) => new CatDto(raw['id'], raw['name']));
  }
}
