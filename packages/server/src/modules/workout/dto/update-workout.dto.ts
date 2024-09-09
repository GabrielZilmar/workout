import {
  IsBoolean,
  IsOptional,
  IsString,
  IsUUID,
  MaxLength,
} from 'class-validator';
import { MAX_VARCHAR_LENGTH } from '~/shared/constants/values';

export class UpdateWorkoutParamsDto {
  @IsString()
  @IsUUID()
  id: string;
}

export class UpdateWorkoutBodyDto {
  @IsString()
  @MaxLength(MAX_VARCHAR_LENGTH)
  @IsOptional()
  name?: string;

  @IsBoolean()
  @IsOptional()
  isPrivate?: boolean;

  @IsBoolean()
  @IsOptional()
  isRoutine?: boolean;
}
