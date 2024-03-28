import { Transform } from 'class-transformer';
import { IsInt, IsOptional, IsUUID } from 'class-validator';

export class CreateWorkoutExerciseDto {
  @IsUUID()
  workoutId: string;

  @IsUUID()
  exerciseId: string;

  @IsInt()
  @Transform(({ value }) => (value === undefined ? null : parseInt(value)))
  @IsOptional()
  order: number | null;
}
