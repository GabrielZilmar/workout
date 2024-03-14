import { Type } from 'class-transformer';
import { IsBoolean, IsOptional, IsString } from 'class-validator';
import { PaginatedDto } from '~/shared/dto/paginated';

export class ListWorkoutsDto extends PaginatedDto {
  @IsBoolean()
  @Type(() => Boolean)
  @IsOptional()
  isRoutine?: boolean;

  @IsString()
  @IsOptional()
  name?: string;
}
