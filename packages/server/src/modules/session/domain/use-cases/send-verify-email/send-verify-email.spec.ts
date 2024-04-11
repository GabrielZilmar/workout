import { MailerModule } from '@nestjs-modules/mailer';
import { HttpException, HttpStatus, Provider } from '@nestjs/common';
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
import { SendVerifyEmail } from '~/modules/session/domain/use-cases/send-verify-email';
import UserMapper from '~/modules/users/domain/mappers/users.mapper';
import { UserDomain } from '~/modules/users/domain/users.domain';
import TokenRepository from '~/services/database/typeorm/repositories/token-repository';
import UserRepository from '~/services/database/typeorm/repositories/users-repository';
import EmailSender from '~/services/email-sender';

type GetModuleTestParams = {
  userRepositoryProvider?: Provider;
  tokenRepositoryProvider?: Provider;
  emailSender?: Provider;
};

describe('SendVerifyEmail Use Case', () => {
  let userDomain: UserDomain;
  let sendVerifyEmail: SendVerifyEmail;
  let module: TestingModule;
  const userMapper = new UserMapper();

  const getModuleTest = async ({
    userRepositoryProvider,
    tokenRepositoryProvider = getTokenRepositoryProvider(),
    emailSender = getEmailSenderProvider(),
  }: GetModuleTestParams = {}) => {
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
        SendVerifyEmail,
      ],
    }).compile();
  };

  beforeAll(async () => {
    userDomain = await UserDomainMock.mountUserDomain();
    module = await getModuleTest();

    sendVerifyEmail = module.get<SendVerifyEmail>(SendVerifyEmail);
  });

  it('Should send verify email successfully', async () => {
    const sendMailSpy = jest.spyOn(
      module.get<EmailSender>(EmailSender),
      'send',
    );

    await sendVerifyEmail.execute({
      userId: userDomain.id?.toValue() as string,
      baseUrl: 'http://localhost:3000',
    });
    expect(sendMailSpy).toHaveBeenCalled();
  });

  it('Should not send verify email if not find user and repository return null', async () => {
    const findOneByIdMock = jest.fn().mockResolvedValue(() => null);
    const userRepositoryMock = new UserRepository(userMapper) as jest.Mocked<
      InstanceType<typeof UserRepository>
    >;
    userRepositoryMock.findOneById = findOneByIdMock;

    const userRepositoryProvider = await getUserRepositoryProvider({
      userRepositoryMock: userRepositoryMock,
      userDomain,
    });
    const module = await getModuleTest({ userRepositoryProvider });
    const sendVerifyEmail = module.get<SendVerifyEmail>(SendVerifyEmail);

    const userId = 'non-existing-id';
    await expect(
      sendVerifyEmail.execute({
        userId,
        baseUrl: 'http://localhost:3000',
      }),
    ).rejects.toThrow(
      new HttpException(
        {
          message: SessionUseCaseError.messages.userIdNotFound(userId),
        },
        HttpStatus.NOT_FOUND,
      ),
    );
  });

  it('Should not send verify email if user is already verified', async () => {
    const userDomain = await UserDomainMock.mountUserDomain({
      isEmailVerified: true,
    });
    const findOneByIdMock = jest.fn().mockResolvedValue(userDomain);
    const userRepositoryMock = new UserRepository(userMapper) as jest.Mocked<
      InstanceType<typeof UserRepository>
    >;
    userRepositoryMock.findOneById = findOneByIdMock;

    const userRepositoryProvider = await getUserRepositoryProvider({
      userRepositoryMock,
      userDomain,
    });
    const module = await getModuleTest({ userRepositoryProvider });
    const sendVerifyEmail = module.get<SendVerifyEmail>(SendVerifyEmail);

    await expect(
      sendVerifyEmail.execute({
        userId: 'user-id',
        baseUrl: 'http://localhost:3000',
      }),
    ).rejects.toThrow(
      new HttpException(
        {
          message: SessionUseCaseError.messages.emailAlreadyVerified,
        },
        HttpStatus.BAD_REQUEST,
      ),
    );
  });

  it('Should not send verify email if the token still valid', async () => {
    const sessionDomain = SessionDomainMock.mountSessionDomain({
      withoutId: true,
    });
    const findLastByUserIdAndTypedMock = jest
      .fn()
      .mockResolvedValue(sessionDomain);
    const tokenRepositoryMock = new TokenRepository(
      new SessionMapper(),
    ) as jest.Mocked<InstanceType<typeof TokenRepository>>;
    tokenRepositoryMock.findLastByUserIdAndType = findLastByUserIdAndTypedMock;

    const tokenRepositoryProvider = getTokenRepositoryProvider({
      tokenRepositoryMock,
    });

    const module = await getModuleTest({ tokenRepositoryProvider });
    const sendVerifyEmail = module.get<SendVerifyEmail>(SendVerifyEmail);

    await expect(
      sendVerifyEmail.execute({
        userId: sessionDomain.userId,
        baseUrl: 'http://localhost:3000',
      }),
    ).rejects.toThrow(
      new HttpException(
        {
          message: SessionUseCaseError.messages.tokenStillValid,
        },
        HttpStatus.BAD_REQUEST,
      ),
    );
  });

  it('Should not send verify email if email sender fails', async () => {
    const module = await getModuleTest({
      emailSender: getEmailSenderProvider(true),
    });
    const sendVerifyEmail = module.get<SendVerifyEmail>(SendVerifyEmail);

    await expect(
      sendVerifyEmail.execute({
        userId: 'user-id',
        baseUrl: 'http://localhost:3000',
      }),
    ).rejects.toThrowError(
      new HttpException(
        {
          message: EMAIL_SENDER_MOCK_ERROR,
        },
        HttpStatus.INTERNAL_SERVER_ERROR,
      ),
    );
  });
});
