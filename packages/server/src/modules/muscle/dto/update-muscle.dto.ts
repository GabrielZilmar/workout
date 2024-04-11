import { IsNotEmpty, IsString, IsUUID } from 'class-validator';

export class UpdateMuscleParamsDto {
  @IsUUID()
  @IsNotEmpty()
  id: string;
}

export class UpdateMuscleBodyDto {
  @IsString()
  @IsNotEmpty()
  name: string;
}
