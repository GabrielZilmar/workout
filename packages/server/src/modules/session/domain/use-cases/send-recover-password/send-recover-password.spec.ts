import { MailerModule } from '@nestjs-modules/mailer';
import {
  BadRequestException,
  HttpException,
  HttpStatus,
  NotFoundException,
  Provider,
} from '@nestjs/common';
import { Test, TestingModule } from '@nestjs/testing';
import { SessionDomainMock } from 'test/utils/domains/session-domain-mock';
import { UserDomainMock } from 'test/utils/domains/user-domain-mock';
import getEmailSenderProvider, {
  EMAIL_SENDER_MOCK_ERROR,
} from 'test/utils/providers/email-sender';
import getTokenRepositoryProvider from 'test/utils/providers/token-repository';
import getUserRepositoryProvider from 'test/utils/providers/user-repository';
import SessionMapper from '~/modules/session/domain/mappers/session.mapper';
import { SessionUseCaseError } from '~/modules/session/domain/use-cases/errors';
import { SendRecoverPassword } from '~/modules/session/domain/use-cases/send-recover-password';
import UserMapper from '~/modules/users/domain/mappers/users.mapper';
import { UserDomain } from '~/modules/users/domain/users.domain';
import Crypto from '~/services/cryptography/crypto';
import EmailSender from '~/services/email-sender';
import EmailSenderError from '~/services/email-sender/errors';

type GetModuleParams = {
  userRepositoryProvider?: Provider;
  tokenRepositoryProvider?: Provider;
  emailSender?: Provider;
};

describe('SendRecoverPassword Use Case', () => {
  let userDomain: UserDomain;
  let module: TestingModule;

  const getModule = async ({
    userRepositoryProvider,
    tokenRepositoryProvider = getTokenRepositoryProvider(),
    emailSender = getEmailSenderProvider(),
  }: GetModuleParams = {}) => {
    if (!userRepositoryProvider) {
      userRepositoryProvider = await getUserRepositoryProvider({ userDomain });
    }

    return Test.createTestingModule({
      imports: [
        MailerModule.forRoot({
          transport: {
            host: 'emailHost',
            port: 0,
            secure: true,
            auth: {
              user: 'emailSender',
              pass: 'emailPassword',
            },
          },
        }),
      ],
      providers: [
        userRepositoryProvider,
        tokenRepositoryProvider,
        emailSender,
        UserMapper,
        SessionMapper,
        SendRecoverPassword,
        Crypto,
      ],
    }).compile();
  };

  beforeEach(async () => {
    userDomain = await UserDomainMock.mountUserDomain();
    module = await getModule();
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  it('Should send forgot password', async () => {
    const sendForgotEmail =
      module.get<SendRecoverPassword>(SendRecoverPassword);
    const sendMailSpy = jest.spyOn(
      module.get<EmailSender>(EmailSender),
      'send',
    );

    await sendForgotEmail.execute({
      userId: userDomain.id?.toValue() as string,
    });
    expect(sendMailSpy).toHaveBeenCalled();
  });

  it('Should not send recover password email if the token still valid', async () => {
    const sendForgotEmail =
      module.get<SendRecoverPassword>(SendRecoverPassword);

    const sessionDomain = SessionDomainMock.mountSessionDomain();
    jest
      .spyOn(sendForgotEmail['tokenRepository'], 'findLastByUserIdAndType')
      .mockResolvedValue(sessionDomain);

    await expect(
      sendForgotEmail.execute({
        userId: sessionDomain.userId,
      }),
    ).rejects.toThrow(
      new BadRequestException({
        message: SessionUseCaseError.messages.tokenStillValid,
      }),
    );
  });

  it('Should not send forgot email if not find user and repository return null', async () => {
    const sendForgotEmail =
      module.get<SendRecoverPassword>(SendRecoverPassword);
    jest
      .spyOn(sendForgotEmail['userRepository'], 'findOneById')
      .mockResolvedValue(null);

    const userId = 'non-existing-id';
    await expect(
      sendForgotEmail.execute({
        userId,
      }),
    ).rejects.toThrow(
      new NotFoundException({
        message: SessionUseCaseError.messages.userIdNotFound(userId),
      }),
    );
  });

  it('Should not send verify email if email sender fails', async () => {
    const sendForgotEmail =
      module.get<SendRecoverPassword>(SendRecoverPassword);
    jest
      .spyOn(sendForgotEmail['emailSender'], 'send')
      .mockRejectedValue(
        EmailSenderError.create({ message: EMAIL_SENDER_MOCK_ERROR }),
      );

    await expect(
      sendForgotEmail.execute({
        userId: 'user-id',
      }),
    ).rejects.toThrow(
      new HttpException(
        { message: EMAIL_SENDER_MOCK_ERROR },
        HttpStatus.INTERNAL_SERVER_ERROR,
      ),
    );
  });
});
