import { v4 as uuid } from 'uuid';
import SessionDomain, {
  SessionDomainCreateParams,
  SessionDomainProps,
} from '~/modules/session/domain/session.domain';
import Token from '~/modules/session/domain/value-objects/token';
import TokenType from '~/modules/session/domain/value-objects/token-type';
import {
  TOKEN_TYPES_ENUM,
  TokenTypes,
} from '~/modules/session/entities/token.entity';

const USER_ID = uuid();

type MountSessionDomainParams = Partial<SessionDomainCreateParams>;

export class SessionDomainMock {
  public static sessionMockParams: SessionDomainCreateParams = {
    userId: USER_ID,
    token: {
      value: { userId: USER_ID },
    },
    tokenType: TOKEN_TYPES_ENUM[
      Math.floor(Math.random() * TOKEN_TYPES_ENUM.length)
    ] as TokenTypes,
  };

  public static getSessionDomainProps = ({
    userId,
    token,
    tokenType,
  }: MountSessionDomainParams = {}): SessionDomainProps => {
    const { value, ...tokenOptions } = token || this.sessionMockParams.token;
    const tokenVO = Token.create(value, { ...tokenOptions });

    const tokenTypeVO = TokenType.create(
      tokenType || this.sessionMockParams.tokenType,
    );

    const props: SessionDomainProps = {
      userId: userId || this.sessionMockParams.userId,
      token: tokenVO.value as Token,
      tokenType: tokenTypeVO.value as TokenType,
    };

    return props;
  };

  public static mountSessionDomain({
    ...props
  }: MountSessionDomainParams = {}): SessionDomain {
    const session = this.sessionMockParams;

    const sessionParams: SessionDomainCreateParams = {
      userId: props.userId ?? session.userId,
      token: props.token ?? session.token,
      tokenType: props.tokenType ?? session.tokenType,
    };

    const sessionDomain = SessionDomain.create(sessionParams);
    return sessionDomain.value as SessionDomain;
  }
}
