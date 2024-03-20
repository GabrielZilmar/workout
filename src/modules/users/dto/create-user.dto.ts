import {
  IsBoolean,
  IsDate,
  IsEmail,
  IsNotEmpty,
  IsNumber,
  IsOptional,
  IsString,
  Min,
  MinLength,
} from 'class-validator';
import { MIN_AGE } from '~/modules/users/domain/value-objects/age';
import { MIN_HEIGHT } from '~/modules/users/domain/value-objects/height';
import { MIN_PASSWORD_LENGTH } from '~/modules/users/domain/value-objects/password';
import { MIN_USERNAME_LENGTH } from '~/modules/users/domain/value-objects/username';
import { MIN_WEIGHT } from '~/modules/users/domain/value-objects/weight';

export class CreateUserDto {
  @IsString()
  @MinLength(MIN_USERNAME_LENGTH)
  @IsNotEmpty()
  username: string;

  @IsString()
  @IsEmail()
  @IsNotEmpty()
  email: string;

  @IsString()
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

  @IsBoolean()
  @IsOptional()
  isEmailVerified?: boolean;

  @IsBoolean()
  @IsOptional()
  isAdmin?: boolean;

  @IsDate()
  @IsOptional()
  deletedAt?: Date | null;
}
