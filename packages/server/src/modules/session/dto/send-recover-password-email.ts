import { IsUUID } from 'class-validator';

export class SendRecoverPasswordEmailParamsDTO {
  @IsUUID()
  userId: string;
}
