import { IsInt, IsOptional, IsUUID } from 'class-validator';

export class CreateSetDto {
  @IsUUID()
  workoutExerciseId: string;

  @IsInt()
  @IsOptional()
  numReps?: number;

  @IsInt()
  @IsOptional()
  setWeight?: number;

  @IsInt()
  @IsOptional()
  numDrops?: number;
}
