import SessionDomain, {
  SessionDomainCreateParams,
} from '~/modules/session/domain/session.domain';
import { TokenTypeMap } from '~/modules/session/entities/token.entity';

const USER_ID = '46ccf0f8-ec5c-46f0-ae4e-cff06a4b01fe';

type MountSessionDomainParams = Partial<SessionDomainCreateParams>;

export class SessionDomainMock {
  public static sessionMockParams: SessionDomainCreateParams = {
    userId: USER_ID,
    token: {
      value: { userId: USER_ID },
    },
    tokenType: TokenTypeMap.EMAIL_AUTH,
  };

  public static mountSessionDomain({
    ...props
  }: MountSessionDomainParams = {}): SessionDomain {
    const session = this.sessionMockParams;

    const sessionParams: SessionDomainCreateParams = {
      userId: props.userId ?? session.userId,
      token: {
        value: props.token?.value ?? session.token.value,
        expiresIn: props.token?.expiresIn ?? session.token.expiresIn,
        isEncrypted: props.token?.isEncrypted ?? session.token.isEncrypted,
      },
      tokenType: props.tokenType ?? session.tokenType,
    };

    const sessionDomain = SessionDomain.create(sessionParams);
    return sessionDomain.value as SessionDomain;
  }
}
