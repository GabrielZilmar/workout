import { IsUUID } from 'class-validator';

export class SendRecoverPasswordEmailBodyDTO {
  @IsUUID()
  userId: string;
}
