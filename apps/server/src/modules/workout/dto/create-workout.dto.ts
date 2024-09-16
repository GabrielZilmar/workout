import {
  IsBoolean,
  IsNotEmpty,
  IsOptional,
  IsString,
  MaxLength,
} from 'class-validator';
import { MAX_VARCHAR_LENGTH } from '~/shared/constants/values';

export class CreateWorkoutDto {
  @IsString()
  @MaxLength(MAX_VARCHAR_LENGTH)
  @IsNotEmpty()
  name: string;

  @IsBoolean()
  @IsOptional()
  isPrivate?: boolean;

  @IsBoolean()
  @IsOptional()
  isRoutine?: boolean;
}
