import { IsUUID } from 'class-validator';

export class ListSetByWorkoutExerciseIdDto {
  @IsUUID()
  workoutExerciseId: string;
}
