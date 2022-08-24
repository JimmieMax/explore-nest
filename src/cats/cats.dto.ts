import { IsString, IsInt, Length, IsOptional, Min, Max } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';
export class CreateCatDto {
  @IsString()
  @Length(1, 10, { message: '名称长度在1-10之间' })
  name: string;

  @IsInt()
  @Min(0)
  @Max(100)
  age: number;

  @IsString()
  breed: string;
}

export class CatDto {
  @ApiProperty()
  @IsOptional()
  @Length(1, 10, { message: '名称长度在1-10之间' })
  name: string;

  @ApiProperty()
  @IsOptional()
  age: string;

  @ApiProperty()
  @IsOptional()
  @IsString()
  breed: string;

  constructor(name, age) {
    this.name = name;
    this.age = age;
  }
}
