import { Transform } from 'class-transformer';
import { IsInt, IsOptional, IsUUID } from 'class-validator';

export class UpdateWorkoutExerciseParamsDto {
  @IsUUID()
  id: string;
}

export class UpdateWorkoutExerciseDto {
  @IsUUID()
  @IsOptional()
  workoutId?: string;

  @IsUUID()
  @IsOptional()
  exerciseId?: string;

  @IsInt()
  @Transform(({ value }) => value && parseInt(value))
  @IsOptional()
  order?: number | null;
}
