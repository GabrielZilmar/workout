import { Login } from '~/modules/session/domain/use-cases/login';
import { SendVerifyEmail } from '~/modules/session/domain/use-cases/send-verify-email';

const SessionUseCaseProviders = [Login, SendVerifyEmail];

export default SessionUseCaseProviders;
