import { IsString, MaxLength, MinLength } from 'class-validator';
import { MIN_MUSCLE_NAME_LENGTH } from '~/modules/muscle/domain/value-objects/name';
import { MAX_VARCHAR_LENGTH } from '~/shared/constants/values';

export class CreateMuscleDto {
  @IsString()
  @MaxLength(MAX_VARCHAR_LENGTH)
  @MinLength(MIN_MUSCLE_NAME_LENGTH)
  name: string;
}
