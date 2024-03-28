import { SessionDomainMock } from 'test/utils/domains/session-domain-mock';
import SessionDomainError from '~/modules/session/domain/errors';
import SessionDomain, {
  SessionDomainCreateParams,
  SessionDomainProps,
} from '~/modules/session/domain/session.domain';
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

  it('Should create a session domain', async () => {
    const isValidSpy = jest.spyOn(
      SessionDomain as unknown as SessionDomainPublicClass,
      'isValid',
    );
    const mountValueObjectSpy = jest.spyOn(
      SessionDomain as unknown as SessionDomainPublicClass,
      'mountValueObject',
    );

    const sessionProps = SessionDomainMock.getSessionDomainProps();
    const session = SessionDomain.create(SessionDomainMock.sessionMockParams);

    expect(session.isRight()).toBeTruthy();
    expect(session.value).toBeInstanceOf(SessionDomain);

    const sessionValueObject = session.value as SessionDomain;
    expect(sessionValueObject.props).toEqual(sessionProps);
    expect(isValidSpy).toHaveBeenCalled();
    expect(mountValueObjectSpy).toHaveBeenCalled();
  });

  it('Should not create a session domain with invalid params', async () => {
    const isValidSpy = jest.spyOn(
      SessionDomain as unknown as SessionDomainPublicClass,
      'isValid',
    );
    const mountValueObjectSpy = jest.spyOn(
      SessionDomain as unknown as SessionDomainPublicClass,
      'mountValueObject',
    );

    const session = SessionDomain.create({} as SessionDomainCreateParams);

    expect(session.isLeft()).toBeTruthy();
    expect(session.value).toBeInstanceOf(Error);
    expect(isValidSpy).toHaveBeenCalled();
    expect(mountValueObjectSpy).not.toHaveBeenCalled();
  });
});
