import {
  Body,
  Controller,
  Get,
  HttpException,
  HttpStatus,
  Inject,
  Injectable,
  Param,
  ParseArrayPipe,
  Post,
  Put,
  Query,
  UseInterceptors,
  UsePipes,
} from '@nestjs/common';
import { logger } from 'src/core/logger';
import {
  ServerException,
  ServerExceptionCode,
} from 'src/core/models/server.exception.model';
import { ValidationPipe } from 'src/core/pipes/validation.pipe';
import { CatsService } from './cats.service';
import { CreateCatDto, FindCatsDto } from './cats.dto';
import { QueryUserId } from 'src/core/decorators/user.query.decorator';
import { Roles } from 'src/core/decorators/roles.decorator';
import { TimeoutInterceptor } from 'src/core/interceptors/timeout.interceptor';

@Controller('cats')
export class CatsController {
  @Inject()
  private readonly catsService: CatsService;

  @Get()
  @UseInterceptors(TimeoutInterceptor)
  async findBy(
    @Query(new ValidationPipe()) findCatsDto: FindCatsDto,
  ): Promise<any> {
    logger.info(findCatsDto);
    const wait = () => {
      return new Promise((resolve) => {
        setTimeout(() => {
          resolve(true);
        }, 2000);
      });
    };
    await wait();
    return this.catsService.findBy(findCatsDto.name);
  }

  @Get(':id')
  findByName(@Param('id') name: string): string {
    if (!['pig', 'chicken'].includes(name)) {
      throw new ServerException(
        ServerExceptionCode.InvalidParam,
        '未知的cat name!',
      );
    }
    return name;
  }

  @Post()
  @Roles('admin')
  async create(
    @QueryUserId() userId: string,
    @Body(new ValidationPipe()) createCatDto: CreateCatDto,
  ): Promise<boolean> {
    return this.catsService.create(createCatDto);
  }

  // @Put()
  // async edit(
  //   @Body(new ValidationPipe()) editCatDto: CreateCatDto,
  // ): Promise<boolean> {
  //   return this.catsService.edit(editCatDto);
  // }
}
