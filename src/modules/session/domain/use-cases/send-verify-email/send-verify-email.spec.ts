import { MailerModule, MailerService } from '@nestjs-modules/mailer';
import { HttpException, HttpStatus, Provider } from '@nestjs/common';
import { Test, TestingModule } from '@nestjs/testing';
import { UserDomainMock } from 'test/utils/user-domain-mock';
import SessionMapper from '~/modules/session/domain/mappers/session.mapper';
import { SessionUseCaseError } from '~/modules/session/domain/use-cases/errors';
import { SendVerifyEmail } from '~/modules/session/domain/use-cases/send-verify-email';
import UserMapper from '~/modules/users/domain/mappers/users.mapper';
import { UserDomain } from '~/modules/users/domain/users.domain';
import TokenRepository from '~/services/database/typeorm/repositories/token-repository';
import UserRepository from '~/services/database/typeorm/repositories/users-repository';
import EmailSender from '~/services/email-sender';

describe('SendVerifyEmail Use Case', () => {
  let tokenRepository: TokenRepository;
  let userRepository: UserRepository;
  let userDomain: UserDomain;
  let sendVerifyEmail: SendVerifyEmail;
  let module: TestingModule;

  const getTokenRepositoryProvider = (tokenRepositoryMock?: TokenRepository) =>
    ({
      provide: TokenRepository,
      useFactory: (sessionMapper: SessionMapper) => {
        if (!tokenRepositoryMock) {
          const findLastByUserIdAndTypedMock = jest
            .fn()
            .mockResolvedValue(null);
          tokenRepositoryMock = new TokenRepository(
            sessionMapper,
          ) as jest.Mocked<InstanceType<typeof TokenRepository>>;
          tokenRepositoryMock.findLastByUserIdAndType =
            findLastByUserIdAndTypedMock;
        }

        tokenRepository = tokenRepositoryMock;

        return tokenRepository;
      },
      inject: [SessionMapper],
    } as Provider);

  const getUserRepositoryProvider = (userRepositoryMock?: UserRepository) =>
    ({
      provide: UserRepository,
      useFactory: (userMapper: UserMapper) => {
        if (!userRepositoryMock) {
          const findOneByIdMock = jest.fn().mockResolvedValue(userDomain);
          userRepositoryMock = new UserRepository(userMapper) as jest.Mocked<
            InstanceType<typeof UserRepository>
          >;
          userRepositoryMock.findOneById = findOneByIdMock;
        }

        userRepository = userRepositoryMock;

        return userRepository;
      },
      inject: [UserMapper],
    } as Provider);

  const getEmailSenderProvider = () =>
    ({
      provide: EmailSender,
      useFactory: (mailerService: MailerService) => {
        const emailSender = new EmailSender(mailerService);
        emailSender.send = jest.fn().mockResolvedValue(void 0);

        return emailSender;
      },
      inject: [MailerService],
    } as Provider);

  const getModuleTest = async (
    userRepositoryProvider = getUserRepositoryProvider(),
    tokenRepositoryProvider = getTokenRepositoryProvider(),
  ) => {
    const emailSender = getEmailSenderProvider();

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
    const userMapper = new UserMapper();
    const findOneByIdMock = jest.fn().mockResolvedValue(() => null);
    const userRepositoryMock = new UserRepository(userMapper) as jest.Mocked<
      InstanceType<typeof UserRepository>
    >;
    userRepositoryMock.findOneById = findOneByIdMock;

    const userRepositoryProvider =
      getUserRepositoryProvider(userRepositoryMock);
    const module = await getModuleTest(userRepositoryProvider);
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

  // it('Should not send verify email if user is already verified', () => {});

  // it('Should not send verify email if email sender fails', () => {});
});
