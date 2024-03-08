import { MailerModule } from '@nestjs-modules/mailer';
import { Module } from '@nestjs/common';
import SessionMapper from '~/modules/session/domain/mappers/session.mapper';
import SessionUseCaseProviders from '~/modules/session/domain/use-cases/providers';
import { SessionController } from '~/modules/session/session.controller';
import UserMapper from '~/modules/users/domain/mappers/users.mapper';
import TokenRepository from '~/services/database/typeorm/repositories/token-repository';
import UserRepository from '~/services/database/typeorm/repositories/users-repository';
import EmailSender from '~/services/email-sender';
import JwtService from '~/services/jwt/jsonwebtoken';
import Env from '~/shared/env';

@Module({
  imports: [
    MailerModule.forRoot({
      transport: {
        host: Env.emailHost,
        port: Env.emailPort,
        secure: true,
        auth: {
          user: Env.emailSender,
          pass: Env.emailPassword,
        },
      },
    }),
  ],
  controllers: [SessionController],
  providers: [
    UserRepository,
    TokenRepository,
    UserMapper,
    SessionMapper,
    EmailSender,
    JwtService,
    ...SessionUseCaseProviders,
  ],
})
export class SessionModule {}
