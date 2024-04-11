import { IsOptional, IsString, IsUUID } from 'class-validator';
import { PaginatedDto } from '~/shared/dto/paginated';

export class ListExercisesDto extends PaginatedDto {
  @IsString()
  @IsOptional()
  name?: string;

  @IsUUID()
  @IsOptional()
  muscleId?: string;
}
