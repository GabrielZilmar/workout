import { MailerModule } from '@nestjs-modules/mailer';
import { Module } from '@nestjs/common';
import SessionUseCaseProviders from '~/modules/session/domain/use-cases/providers';
import { SessionController } from '~/modules/session/session.controller';
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
  providers: [EmailSender, ...SessionUseCaseProviders],
})
export class SessionModule {}
