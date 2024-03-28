import { IsUUID } from 'class-validator';

export class FindByWorkoutIdDto {
  @IsUUID()
  workoutId: string;
}
