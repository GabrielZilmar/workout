import { MailerModule } from '@nestjs-modules/mailer';
import { Test, TestingModule } from '@nestjs/testing';
import SessionMapper from '~/modules/session/domain/mappers/session.mapper';
import SessionUseCaseProviders from '~/modules/session/domain/use-cases/providers';
import { SessionController } from '~/modules/session/session.controller';
import UserMapper from '~/modules/users/domain/mappers/users.mapper';
import Crypto from '~/services/cryptography/crypto';
import TokenRepository from '~/services/database/typeorm/repositories/token-repository';
import UserRepository from '~/services/database/typeorm/repositories/users-repository';
import EmailSender from '~/services/email-sender';
import JwtService from '~/services/jwt/jsonwebtoken';

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
        SessionMapper,
        TokenRepository,
        JwtService,
        Crypto,
        ...SessionUseCaseProviders,
      ],
    }).compile();

    controller = module.get<SessionController>(SessionController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
