import { Type } from 'class-transformer';
import { IsBoolean, IsOptional } from 'class-validator';
import { PaginatedDto } from '~/shared/dto/paginated';

export class ListWorkoutsDto extends PaginatedDto {
  @IsBoolean()
  @Type(() => Boolean)
  @IsOptional()
  isRoutine?: boolean;
}
