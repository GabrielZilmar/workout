import { v4 as uuid } from 'uuid';
import SessionDomainError from '~/modules/session/domain/errors';
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
import { Either } from '~/shared/either';

describe('SessionDomain', () => {
  afterEach(() => {
    jest.restoreAllMocks();
  });

  type SessionDomainPublicClass = SessionDomain & {
    mountValueObject(
      props: SessionDomainCreateParams,
    ): Either<SessionDomainError, SessionDomainProps>;
    isValid(): boolean;
  };

  const sessionParams: SessionDomainCreateParams = {
    userId: uuid(),
    token: {
      value: { token: 'valid_token' },
    },
    tokenType: TOKEN_TYPES_ENUM[
      Math.floor(Math.random() * TOKEN_TYPES_ENUM.length)
    ] as TokenTypes,
  };

  const getSessionDomainProps = () => {
    const userId = sessionParams.userId;
    const token = Token.create(sessionParams.token.value);
    const tokenType = TokenType.create(sessionParams.tokenType);

    const props: SessionDomainProps = {
      userId,
      token: token.value as Token,
      tokenType: tokenType.value as TokenType,
    };

    return props;
  };

  const getSessionDomainMock = ({
    userId,
    token,
    tokenType,
  }: Partial<SessionDomainCreateParams> = {}) => {
    const session = SessionDomain.create({
      userId: userId ?? sessionParams.userId,
      token: {
        value: token?.value ?? sessionParams.token.value,
      },
      tokenType: tokenType ?? sessionParams.tokenType,
    });

    return session.value as SessionDomain;
  };

  it('Should create a session domain', async () => {
    const isValidSpy = jest.spyOn(
      SessionDomain as unknown as SessionDomainPublicClass,
      'isValid',
    );
    const mountValueObjectSpy = jest.spyOn(
      SessionDomain as unknown as SessionDomainPublicClass,
      'isValid',
    );

    const sessionProps = getSessionDomainProps();
    const session = SessionDomain.create(sessionParams);

    expect(session.isRight()).toBeTruthy();
    expect(session.value).toBeInstanceOf(SessionDomain);

    const sessionValueObject = session.value as SessionDomain;
    expect(sessionValueObject.props).toEqual(sessionProps);
    expect(isValidSpy).toHaveBeenCalled();
    expect(mountValueObjectSpy).toHaveBeenCalled();
  });
});
