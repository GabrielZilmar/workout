import {
  IsNotEmpty,
  IsString,
  IsStrongPassword,
  MaxLength,
  MinLength,
} from 'class-validator';
import { MIN_PASSWORD_LENGTH } from '~/modules/users/domain/value-objects/password';
import { MAX_VARCHAR_LENGTH } from '~/shared/constants/values';

export class RecoverPasswordBodyDto {
  @IsString()
  token: string;

  @IsString()
  @IsStrongPassword()
  @MaxLength(MAX_VARCHAR_LENGTH)
  @MinLength(MIN_PASSWORD_LENGTH)
  @IsNotEmpty()
  newPassword: string;
}
