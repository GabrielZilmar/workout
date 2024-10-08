import {
  IsEmail,
  IsNotEmpty,
  IsNumber,
  IsOptional,
  IsString,
  IsStrongPassword,
  MaxLength,
  Min,
  MinLength,
} from 'class-validator';
import { MIN_AGE } from '~/modules/users/domain/value-objects/age';
import { MIN_HEIGHT } from '~/modules/users/domain/value-objects/height';
import { MIN_PASSWORD_LENGTH } from '~/modules/users/domain/value-objects/password';
import { MIN_USERNAME_LENGTH } from '~/modules/users/domain/value-objects/username';
import { MIN_WEIGHT } from '~/modules/users/domain/value-objects/weight';
import { MAX_VARCHAR_LENGTH } from '~/shared/constants/values';

export class CreateUserDto {
  @IsString()
  @MaxLength(MAX_VARCHAR_LENGTH)
  @MinLength(MIN_USERNAME_LENGTH)
  @IsNotEmpty()
  username: string;

  @IsString()
  @IsEmail()
  @MaxLength(MAX_VARCHAR_LENGTH)
  @IsNotEmpty()
  email: string;

  @IsString()
  @IsStrongPassword()
  @MaxLength(MAX_VARCHAR_LENGTH)
  @MinLength(MIN_PASSWORD_LENGTH)
  @IsNotEmpty()
  password: string;

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
