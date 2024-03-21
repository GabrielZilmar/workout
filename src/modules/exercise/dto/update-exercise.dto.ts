import {
  IsNotEmpty,
  IsOptional,
  IsString,
  IsUUID,
  IsUrl,
} from 'class-validator';

export class UpdateExerciseParamsDto {
  @IsUUID()
  @IsNotEmpty()
  id: string;
}

export class UpdateExerciseBodyDto {
  @IsString()
  @IsOptional()
  name?: string;

  @IsUUID()
  @IsOptional()
  muscleId?: string;

  @IsUrl()
  @IsOptional()
  tutorialUrl?: string;

  @IsString()
  @IsOptional()
  info?: string;
}
