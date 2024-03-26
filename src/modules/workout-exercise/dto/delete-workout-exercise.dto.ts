import { IsUUID } from 'class-validator';

export class DeleteWorkoutExerciseDto {
  @IsUUID()
  id: string;
}
