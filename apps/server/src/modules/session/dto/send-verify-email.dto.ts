import { IsUUID } from 'class-validator';

export class SendVerifyEmailDto {
  @IsUUID()
  userId: string;
}
