import { IsString, IsInt, Length, IsOptional, Min, Max } from 'class-validator';

export class CreateCatDto {
  @IsString()
  @Length(1, 10)
  name: string;

  @IsInt()
  @Min(0)
  @Max(100)
  age: number;

  @IsString()
  breed: string;
}

export class FindCatsDto {
  @IsOptional()
  @Length(1, 10)
  name: string;

  @IsOptional()
  age: string;

  @IsOptional()
  @IsString()
  breed: string;
}
