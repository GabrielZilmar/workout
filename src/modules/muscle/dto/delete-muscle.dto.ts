import { IsNotEmpty, IsUUID } from 'class-validator';

export class DeleteMuscleParamsDto {
  @IsUUID()
  @IsNotEmpty()
  id: string;
}
