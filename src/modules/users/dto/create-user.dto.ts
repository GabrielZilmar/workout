import { Injectable } from '@nestjs/common';
import {
  IsNotEmpty,
  IsNumber,
  IsString,
  IsUUID,
  Min,
  MinLength,
} from 'class-validator';
import { MIN_AGE } from '~/modules/users/domain/value-objects/age';
import { MIN_HEIGHT } from '~/modules/users/domain/value-objects/height';
import { MIN_USERNAME_LENGTH } from '~/modules/users/domain/value-objects/username';
import { MIN_WEIGHT } from '~/modules/users/domain/value-objects/weight';

@Injectable()
export class CreateUserDto {
  @IsUUID()
  @IsNotEmpty()
  ssoId: string;

  @IsString()
  @MinLength(MIN_USERNAME_LENGTH)
  @IsNotEmpty()
  username: string;

  @IsNumber()
  @Min(MIN_AGE)
  @IsNotEmpty()
  age: number;

  @IsNumber()
  @Min(MIN_WEIGHT)
  @IsNotEmpty()
  weight: number;

  @IsNumber()
  @Min(MIN_HEIGHT)
  @IsNotEmpty()
  height: number;
}
