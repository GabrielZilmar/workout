import { Login } from '~/modules/session/domain/use-cases/login';
import { SendRecoverPassword } from '~/modules/session/domain/use-cases/send-recover-password';
import { SendVerifyEmail } from '~/modules/session/domain/use-cases/send-verify-email';
import { VerifyEmail } from '~/modules/session/domain/use-cases/verify-email';

const SessionUseCaseProviders = [
  Login,
  SendVerifyEmail,
  VerifyEmail,
  SendRecoverPassword,
];

export default SessionUseCaseProviders;
