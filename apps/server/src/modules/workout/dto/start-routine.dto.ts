import { IsUUID } from 'class-validator';

export class StartRoutineBodyDTO {
  @IsUUID()
  workoutId: string;
}
