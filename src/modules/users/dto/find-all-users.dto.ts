import { Injectable } from '@nestjs/common';
import { Type } from 'class-transformer';
import { IsNumber, IsOptional, IsString } from 'class-validator';
import { PaginatedDto } from '~/shared/dto/paginated';

@Injectable()
export class FindAllUsersDto extends PaginatedDto {
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
}
