import { MailerService } from '@nestjs-modules/mailer';
import { Provider } from '@nestjs/common';
import EmailSender from '~/services/email-sender';
import EmailSenderError from '~/services/email-sender/errors';

export const EMAIL_SENDER_MOCK_ERROR = 'Mock Error';

const getEmailSenderProvider = (rejectValue?: boolean) =>
  ({
    provide: EmailSender,
    useFactory: (mailerService: MailerService) => {
      const emailSender = new EmailSender(mailerService);
      if (rejectValue) {
        emailSender.send = jest
          .fn()
          .mockRejectedValue(
            EmailSenderError.create({ message: EMAIL_SENDER_MOCK_ERROR }),
          );
      } else {
        emailSender.send = jest.fn().mockResolvedValue(void 0);
      }

      return emailSender;
    },
    inject: [MailerService],
  } as Provider);

export default getEmailSenderProvider;
