import { IsString } from 'class-validator';

export class VerifyEmailBodyDto {
  @IsString()
  token: string;
}
