import {
  IsOptional,
  IsString,
  IsUUID,
  IsUrl,
  MaxLength,
  MinLength,
} from 'class-validator';
import { MIN_EXERCISE_NAME_LENGTH } from '~/modules/exercise/domain/value-objects/name';
import { MAX_VARCHAR_LENGTH } from '~/shared/constants/values';

export class CreateExerciseDto {
  @IsString()
  @MinLength(MIN_EXERCISE_NAME_LENGTH)
  @MaxLength(MAX_VARCHAR_LENGTH)
  name: string;

  @IsUUID()
  muscleId: string;

  @IsUrl()
  @IsOptional()
  @MaxLength(MAX_VARCHAR_LENGTH)
  tutorialUrl?: string;

  @IsString()
  @IsOptional()
  info?: string;
}
