import { MailerModule, MailerService } from '@nestjs-modules/mailer';
import { Provider } from '@nestjs/common';
import { Test, TestingModule } from '@nestjs/testing';
import { UserDomainMock } from 'test/utils/user-domain-mock';
import { SendVerifyEmail } from '~/modules/session/domain/use-cases/send-verify-email';
import UserMapper from '~/modules/users/domain/mappers/users.mapper';
import { UserDomain } from '~/modules/users/domain/users.domain';
import UserRepository from '~/services/database/typeorm/repositories/users-repository';
import EmailSender from '~/services/email-sender';

describe('SendVerifyEmail Use Case', () => {
  let userRepository: UserRepository;
  let userDomain: UserDomain;
  let sendVerifyEmail: SendVerifyEmail;
  let module: TestingModule;

  const getUserRepositoryProvider = (userRepositoryMock?: UserRepository) =>
    ({
      provide: UserRepository,
      useFactory: (userMapper: UserMapper) => {
        if (!userRepositoryMock) {
          const findByEmailIdMock = jest.fn().mockResolvedValue(userDomain);
          userRepositoryMock = new UserRepository(userMapper) as jest.Mocked<
            InstanceType<typeof UserRepository>
          >;
          userRepositoryMock.findOneById = findByEmailIdMock;
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
        UserMapper,
        emailSender,
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

  it('Should not send verify email if user does not exists and repository throw an error', async () => {
    const userMapper = new UserMapper();
    const findByEmailIdMock = jest.fn().mockRejectedValue(new Error());
    const userRepositoryMock = new UserRepository(userMapper) as jest.Mocked<
      InstanceType<typeof UserRepository>
    >;
    userRepositoryMock.findOneById = findByEmailIdMock;

    const userRepositoryProvider =
      getUserRepositoryProvider(userRepositoryMock);

    const module = await getModuleTest(userRepositoryProvider);
    const sendVerifyEmail = module.get<SendVerifyEmail>(SendVerifyEmail);

    await expect(
      sendVerifyEmail.execute({
        userId: 'non-existing-id',
        baseUrl: 'http://localhost:3000',
      }),
    ).rejects.toThrowError();
  });

  it('Should not send verify email if not find user and repository return null', async () => {
    const userMapper = new UserMapper();
    const findByEmailIdMock = jest.fn().mockResolvedValue(() => null);
    const userRepositoryMock = new UserRepository(userMapper) as jest.Mocked<
      InstanceType<typeof UserRepository>
    >;
    userRepositoryMock.findOneById = findByEmailIdMock;

    const userRepositoryProvider =
      getUserRepositoryProvider(userRepositoryMock);
    const module = await getModuleTest(userRepositoryProvider);
    const sendVerifyEmail = module.get<SendVerifyEmail>(SendVerifyEmail);

    await expect(
      sendVerifyEmail.execute({
        userId: 'non-existing-id',
        baseUrl: 'http://localhost:3000',
      }),
    ).rejects.toThrowError();
  });

  // it('Should not send verify email if user is already verified', () => {});

  // it('Should not send verify email if email sender fails', () => {});
});
