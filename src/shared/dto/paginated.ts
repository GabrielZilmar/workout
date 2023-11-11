import { Type } from 'class-transformer';
import { IsNumber, IsOptional } from 'class-validator';

export class PaginatedDto {
  @IsNumber()
  @Type(() => Number)
  @IsOptional()
  skip?: number;

  @IsNumber()
  @Type(() => Number)
  @IsOptional()
  take?: number;
}
