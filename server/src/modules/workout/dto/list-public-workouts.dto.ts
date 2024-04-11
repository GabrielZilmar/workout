import { IsOptional, IsString, IsUUID } from 'class-validator';
import { ListWorkoutsDto } from '~/modules/workout/dto/list-workouts.dto';

export class ListPublicWorkoutsDto extends ListWorkoutsDto {
  @IsString()
  @IsUUID()
  @IsOptional()
  userId?: string;
}
