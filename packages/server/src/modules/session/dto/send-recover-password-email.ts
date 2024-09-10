import { IsEmail } from 'class-validator';

export class SendRecoverPasswordEmailBodyDTO {
  @IsEmail()
  email: string;
}
