import { Inject, Injectable } from '@nestjs/common';
import { CatsDao } from './cats.dao';
import { CreateCatDto } from './cats.dto';

@Injectable()
export class CatsService {
  @Inject()
  private readonly catsDao: CatsDao;

  create(createCatDto: CreateCatDto) {
    return true;
  }

  findBy(keyword: string) {
    return this.catsDao.findBy(keyword);
  }
}
