import { Type } from 'class-transformer';
import {
  IsArray,
  IsEnum,
  IsNotEmpty,
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

export class UpdateExerciseTranslationDto {
  @IsUUID()
  @IsOptional()
  id?: string;

  @IsString()
  @MinLength(MIN_EXERCISE_NAME_LENGTH)
  @MaxLength(MAX_VARCHAR_LENGTH)
  @IsOptional()
  name?: string;

  @IsString()
  @IsOptional()
  info?: string;

  @IsEnum(LANGUAGE_ENUM)
  @IsOptional()
  language?: Languages;
}

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

  @IsOptional()
  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => UpdateExerciseTranslationDto)
  translations?: UpdateExerciseTranslationDto[];
}
