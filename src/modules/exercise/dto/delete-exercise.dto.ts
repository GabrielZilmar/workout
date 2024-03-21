import { IsNotEmpty, IsUUID } from 'class-validator';

export class DeleteExerciseParamsDto {
  @IsUUID()
  @IsNotEmpty()
  id: string;
}
