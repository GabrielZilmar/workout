import { IsEmail, IsString } from 'class-validator';

export class SessionLoginDto {
  @IsEmail()
  email: string;

  @IsString()
  password: string;
}
