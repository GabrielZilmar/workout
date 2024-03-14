import { Transform } from 'class-transformer';
import { IsBoolean, IsOptional, IsString } from 'class-validator';
import { PaginatedDto } from '~/shared/dto/paginated';

export class ListWorkoutsDto extends PaginatedDto {
  @IsBoolean()
  @Transform(({ value }) => value === 'true')
  @IsOptional()
  isRoutine?: boolean;

  @IsString()
  @IsOptional()
  name?: string;
}
