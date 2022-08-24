import { CatsDao } from './cats.dao';
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
import { ApiTags, ApiOkResponse, ApiOperation } from '@nestjs/swagger';
import { logger } from '../core/logger';
import {
  ServerException,
  ServerExceptionCode,
} from '../core/models/server.exception.model';
import { ValidationPipe } from '../core/pipes/validation.pipe';
import { CatsService } from './cats.service';
import { CatDto, CreateCatDto } from './cats.dto';
import { QueryUserId } from '../core/decorators/user.query.decorator';
import { Roles } from '../core/decorators/roles.decorator';
import { TimeoutInterceptor } from '../core/interceptors/timeout.interceptor';

@Controller('cats')
@ApiTags('cats')
export class CatsController {
  @Inject()
  private readonly catsService: CatsService;

  @Get()
  @ApiOperation({ summary: '查询所有cats', description: '' })
  @ApiOkResponse({ type: [CatDto] })
  @UseInterceptors(TimeoutInterceptor)
  async findBy(@Query(new ValidationPipe()) catDto: CatDto): Promise<CatDto[]> {
    logger.info(catDto);
    return this.catsService.findBy(catDto.name);
  }

  @Get(':id')
  @ApiOperation({ summary: '根据ID查cat', description: 'id为必填' })
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
