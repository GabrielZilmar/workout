import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import SessionMapper from '~/modules/session/domain/mappers/session.mapper';
import SessionDomain from '~/modules/session/domain/session.domain';
import { SessionUseCaseError } from '~/modules/session/domain/use-cases/errors';
import { SendVerifyEmailDto } from '~/modules/session/dto/send-verify-email.dto';
import { TokenTypeMap } from '~/modules/session/entities/token.entity';
import TokenRepository from '~/services/database/typeorm/repositories/token-repository';
import UserRepository from '~/services/database/typeorm/repositories/users-repository';
import EmailSender from '~/services/email-sender';
import EmailSenderError from '~/services/email-sender/errors';
import { UseCase } from '~/shared/core/use-case';
import Env from '~/shared/env';
import VerifyEmailTemplate from '~/shared/templates/email/verify-email';

const EXPIRES_IN_15_MIN = '15min';

export type SendVerifyEmailParams = SendVerifyEmailDto;
export type SendVerifyEmailResult = Promise<boolean>;

@Injectable()
export class SendVerifyEmail
  implements UseCase<SendVerifyEmailParams, SendVerifyEmailResult>
{
  constructor(
    private readonly userRepository: UserRepository,
    private readonly tokenRepository: TokenRepository,
    private readonly sessionMapper: SessionMapper,
    private readonly emailSender: EmailSender,
  ) {}

  public async execute({
    userId,
  }: SendVerifyEmailParams): SendVerifyEmailResult {
    const userDomain = await this.userRepository.findOneById(userId);

    if (!userDomain?.id) {
      throw new HttpException(
        { message: SessionUseCaseError.messages.userIdNotFound(userId) },
        HttpStatus.NOT_FOUND,
      );
    }

    if (userDomain.emailVerification.isVerified) {
      throw new HttpException(
        { message: SessionUseCaseError.messages.emailAlreadyVerified },
        HttpStatus.BAD_REQUEST,
      );
    }

    const sessionDomainOrError = SessionDomain.create({
      userId: userDomain.id.toValue(),
      token: {
        value: { userId },
        expiresIn: EXPIRES_IN_15_MIN,
      },
      tokenType: TokenTypeMap.EMAIL_AUTH,
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
      throw new HttpException(
        { message: SessionUseCaseError.messages.tokenStillValid },
        HttpStatus.BAD_REQUEST,
      );
    }

    const sessionDomain = sessionDomainOrError.value;

    try {
      await this.emailSender.send({
        to: userDomain.email.value,
        subject: VerifyEmailTemplate.subject,
        html: VerifyEmailTemplate.renderTemplate({
          username: userDomain.username.value,
          baseUrl: Env.verifyEmailUrl,
          verifyEmailToken: sessionDomain.token.getEncryptValue(),
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
