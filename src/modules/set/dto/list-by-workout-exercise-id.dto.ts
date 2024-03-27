import { IsUUID } from 'class-validator';

export class ListByWorkoutExerciseIdDto {
  @IsUUID()
  workoutExerciseId: string;
}
