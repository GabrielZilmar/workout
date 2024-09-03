import { Login } from '~/modules/session/domain/use-cases/login';
import { SendVerifyEmail } from '~/modules/session/domain/use-cases/send-verify-email';
import { VerifyEmail } from '~/modules/session/domain/use-cases/verify-email';

const SessionUseCaseProviders = [Login, SendVerifyEmail, VerifyEmail];

export default SessionUseCaseProviders;
