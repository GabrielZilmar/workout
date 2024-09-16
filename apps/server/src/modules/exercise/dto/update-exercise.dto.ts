import {
  IsNotEmpty,
  IsOptional,
  IsString,
  IsUUID,
  IsUrl,
  MaxLength,
} from 'class-validator';
import { MAX_VARCHAR_LENGTH } from '~/shared/constants/values';

export class UpdateExerciseParamsDto {
  @IsUUID()
  @IsNotEmpty()
  id: string;
}

export class UpdateExerciseBodyDto {
  @IsString()
  @MaxLength(MAX_VARCHAR_LENGTH)
  @IsOptional()
  name?: string;

  @IsUUID()
  @IsOptional()
  muscleId?: string;

  @IsUrl()
  @MaxLength(MAX_VARCHAR_LENGTH)
  @IsOptional()
  tutorialUrl?: string;

  @IsString()
  @IsOptional()
  info?: string;
}
