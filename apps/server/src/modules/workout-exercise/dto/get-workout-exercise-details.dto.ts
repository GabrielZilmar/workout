import { IsUUID } from 'class-validator';

export class GetWorkoutExerciseDetailsParamsDto {
  @IsUUID()
  id: string;
}
