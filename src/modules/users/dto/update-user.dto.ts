import {
  IsNumber,
  IsOptional,
  IsString,
  IsUUID,
  Min,
  MinLength,
} from 'class-validator';
import { MIN_AGE } from '~/modules/users/domain/value-objects/age';
import { MIN_HEIGHT } from '~/modules/users/domain/value-objects/height';
import { MIN_USERNAME_LENGTH } from '~/modules/users/domain/value-objects/username';
import { MIN_WEIGHT } from '~/modules/users/domain/value-objects/weight';

export class CreateUserParamsDto {
  @IsString()
  @IsUUID()
  id: string;
}

export class UpdateUserBodyDto {
  @IsString()
  @MinLength(MIN_USERNAME_LENGTH)
  @IsOptional()
  username?: string;

  @IsNumber()
  @Min(MIN_AGE)
  @IsOptional()
  age?: number;

  @IsNumber()
  @Min(MIN_WEIGHT)
  @IsOptional()
  weight?: number;

  @IsNumber()
  @Min(MIN_HEIGHT)
  @IsOptional()
  height?: number;
}
