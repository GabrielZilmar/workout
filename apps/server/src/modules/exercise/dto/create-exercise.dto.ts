import { Type } from 'class-transformer';
import {
  IsArray,
  IsEnum,
  IsOptional,
  IsString,
  IsUUID,
  IsUrl,
  MaxLength,
  MinLength,
  ValidateNested,
} from 'class-validator';
import {
  LANGUAGE_ENUM,
  Languages,
} from '~/modules/exercise-translations/entities/exercise-translation.entity';
import { MIN_EXERCISE_NAME_LENGTH } from '~/modules/exercise/domain/value-objects/name';
import { MAX_VARCHAR_LENGTH } from '~/shared/constants/values';

class ExerciseTranslationDto {
  @IsString()
  @MinLength(MIN_EXERCISE_NAME_LENGTH)
  @MaxLength(MAX_VARCHAR_LENGTH)
  name: string;

  @IsString()
  @IsOptional()
  info?: string;

  @IsEnum(LANGUAGE_ENUM)
  language: Languages;
}

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

  @IsOptional()
  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => ExerciseTranslationDto)
  translations?: ExerciseTranslationDto[];
}
