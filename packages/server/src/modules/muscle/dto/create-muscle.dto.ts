import { IsString, Min, MinLength } from 'class-validator';
import { MIN_MUSCLE_NAME_LENGTH } from '~/modules/muscle/domain/value-objects/name';

export class CreateMuscleDto {
  @IsString()
  @MinLength(MIN_MUSCLE_NAME_LENGTH)
  name: string;
}
