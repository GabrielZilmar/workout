import { Injectable } from '@nestjs/common';
import { VerifyEmailDto } from '~/modules/session/dto/verify-email.dto';
import { UseCase } from '~/shared/core/use-case';

export type VerifyEmailParams = VerifyEmailDto;
export type VerifyEmailResult = Promise<boolean>;

@Injectable()
export class VerifyEmail
  implements UseCase<VerifyEmailParams, VerifyEmailResult>
{
  execute({ token }: VerifyEmailParams): VerifyEmailResult {
    throw new Error('Method not implemented.');
  }
}
