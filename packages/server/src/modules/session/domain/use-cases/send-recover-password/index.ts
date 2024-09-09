import {
  BadRequestException,
  HttpException,
  HttpStatus,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import SessionMapper from '~/modules/session/domain/mappers/session.mapper';
import SessionDomain from '~/modules/session/domain/session.domain';
import { SessionUseCaseError } from '~/modules/session/domain/use-cases/errors';
import { SendRecoverPasswordEmailParamsDTO } from '~/modules/session/dto/send-recover-password-email';
import { TokenTypeMap } from '~/modules/session/entities/token.entity';
import TokenRepository from '~/services/database/typeorm/repositories/token-repository';
import UserRepository from '~/services/database/typeorm/repositories/users-repository';
import EmailSender from '~/services/email-sender';
import EmailSenderError from '~/services/email-sender/errors';
import { UseCase } from '~/shared/core/use-case';
import Env from '~/shared/env';
import ForgotPasswordTemplate from '~/shared/templates/email/forgot-password';

const EXPIRES_IN_15_MIN = '15min';

export type SendRecoverPasswordParams = SendRecoverPasswordEmailParamsDTO;
export type SendRecoverPasswordResult = Promise<boolean>;

@Injectable()
export class SendRecoverPassword
  implements UseCase<SendRecoverPasswordParams, SendRecoverPasswordResult>
{
  constructor(
    private readonly userRepository: UserRepository,
    private readonly tokenRepository: TokenRepository,
    private readonly sessionMapper: SessionMapper,
    private readonly emailSender: EmailSender,
  ) {}

  public async execute({
    userId,
  }: SendRecoverPasswordParams): Promise<SendRecoverPasswordResult> {
    const userDomain = await this.userRepository.findOneById(userId);

    if (!userDomain?.id) {
      throw new NotFoundException({
        message: SessionUseCaseError.messages.userIdNotFound(userId),
      });
    }

    const sessionDomainOrError = SessionDomain.create({
      userId: userDomain.id.toValue(),
      token: {
        value: { userId },
        expiresIn: EXPIRES_IN_15_MIN,
      },
      tokenType: TokenTypeMap.RECOVER_PASSWORD,
    });
    if (sessionDomainOrError.isLeft()) {
      throw new HttpException(
        { message: sessionDomainOrError.value.message },
        sessionDomainOrError.value.code,
      );
    }

    const lastToken = await this.tokenRepository.findLastByUserIdAndType(
      userDomain.id.toValue(),
      TokenTypeMap.EMAIL_AUTH,
    );
    if (lastToken) {
      throw new BadRequestException({
        message: SessionUseCaseError.messages.tokenStillValid,
      });
    }

    const sessionDomain = sessionDomainOrError.value;

    try {
      await this.emailSender.send({
        to: userDomain.email.value,
        subject: ForgotPasswordTemplate.subject,
        html: ForgotPasswordTemplate.renderTemplate({
          username: userDomain.username.value,
          baseUrl: Env.recoverPasswordUrl,
          forgotPasswordToken: sessionDomain.token.getEncryptValue(),
        }),
      });

      await this.tokenRepository.create(
        this.sessionMapper.toPersistence(sessionDomain),
      );
    } catch (err) {
      throw new HttpException(
        {
          message: (err as EmailSenderError).message,
          payload: (err as EmailSenderError).payload,
        },
        (err as EmailSenderError).code || HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }

    return true;
  }
}
