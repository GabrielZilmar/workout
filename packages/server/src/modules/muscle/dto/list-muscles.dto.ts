import { IsOptional, IsString } from 'class-validator';
import { PaginatedDto } from '~/shared/dto/paginated';

export class ListMusclesDto extends PaginatedDto {
  @IsString()
  @IsOptional()
  name?: string;
}
