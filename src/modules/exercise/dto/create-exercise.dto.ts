import {
  IsOptional,
  IsString,
  IsUUID,
  IsUrl,
  MinLength,
} from 'class-validator';
import { MIN_EXERCISE_NAME_LENGTH } from '~/modules/exercise/domain/value-objects/name';

export class CreateExerciseDto {
  @IsString()
  @MinLength(MIN_EXERCISE_NAME_LENGTH)
  name: string;

  @IsUUID()
  muscleId: string;

  @IsUrl()
  @IsOptional()
  tutorialUrl?: string;

  @IsString()
  @IsOptional()
  info?: string;
}
