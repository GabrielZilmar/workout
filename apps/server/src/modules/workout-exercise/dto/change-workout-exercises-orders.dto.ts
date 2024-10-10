import { Type } from 'class-transformer';
import { IsArray, IsInt, IsUUID, ValidateNested } from 'class-validator';

class WorkoutExercise {
  @IsUUID()
  id: string;

  @IsInt()
  order: number;
}

export class ChangeWorkoutExerciseOrdersBodyDTO {
  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => WorkoutExercise)
  items: WorkoutExercise[];
}
