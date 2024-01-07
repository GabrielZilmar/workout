import { MailerModule } from '@nestjs-modules/mailer';
import { Module } from '@nestjs/common';
import SessionUseCaseProviders from '~/modules/session/domain/use-cases/providers';
import { SessionController } from '~/modules/session/session.controller';
import UserMapper from '~/modules/users/domain/mappers/users.mapper';
import UserRepository from '~/services/database/typeorm/repositories/users-repository';
import EmailSender from '~/services/email-sender';
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
    UserMapper,
    EmailSender,
    ...SessionUseCaseProviders,
  ],
})
export class SessionModule {}
