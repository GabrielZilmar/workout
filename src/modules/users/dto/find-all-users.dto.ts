import { Injectable } from '@nestjs/common';
import { Type } from 'class-transformer';
import { IsNumber, IsOptional, IsString } from 'class-validator';

@Injectable()
export class FindAllUsersDto {
  @IsString()
  @IsOptional()
  username?: string;

  @IsString()
  @IsOptional()
  email?: string;

  @IsNumber()
  @Type(() => Number)
  @IsOptional()
  age?: number;

  @IsNumber()
  @Type(() => Number)
  @IsOptional()
  weight?: number;

  @IsNumber()
  @Type(() => Number)
  @IsOptional()
  height?: number;

  @IsNumber()
  @Type(() => Number)
  @IsOptional()
  skip?: number;

  @IsNumber()
  @Type(() => Number)
  @IsOptional()
  take?: number;
}
