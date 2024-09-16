import { Transform } from 'class-transformer';
import { IsEmail, IsString, MaxLength } from 'class-validator';
import { MAX_VARCHAR_LENGTH } from '~/shared/constants/values';

export class SessionLoginDto {
  @IsEmail()
  @MaxLength(MAX_VARCHAR_LENGTH)
  @Transform(({ value }) => value.toLowerCase())
  email: string;

  @IsString()
  @MaxLength(MAX_VARCHAR_LENGTH)
  password: string;
}
