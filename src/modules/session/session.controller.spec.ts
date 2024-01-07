import { MailerModule } from '@nestjs-modules/mailer';
import { Test, TestingModule } from '@nestjs/testing';
import SessionUseCaseProviders from '~/modules/session/domain/use-cases/providers';
import { SessionController } from '~/modules/session/session.controller';
import UserMapper from '~/modules/users/domain/mappers/users.mapper';
import UserRepository from '~/services/database/typeorm/repositories/users-repository';
import EmailSender from '~/services/email-sender';

describe('SessionController', () => {
  let controller: SessionController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
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
      controllers: [SessionController],
      providers: [
        UserRepository,
        UserMapper,
        EmailSender,
        ...SessionUseCaseProviders,
      ],
    }).compile();

    controller = module.get<SessionController>(SessionController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
