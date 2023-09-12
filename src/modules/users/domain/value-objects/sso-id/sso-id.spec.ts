import fetch from 'node-fetch';
import { UserDomainError } from '~/modules/users/domain/errors';
import SSOId from '~/modules/users/domain/value-objects/sso-id';
import requestSsoUserMock from '~/modules/users/domain/value-objects/sso-id/mocks/sso-user.mock';

jest.mock('node-fetch');

describe('User SSO ID Value Object', () => {
  type SSOIdPublicClass = SSOId & {
    isValid(): boolean;
  };
  const { Response } = jest.requireActual('node-fetch');

  afterEach(() => {
    jest.restoreAllMocks();
  });

  it('Should create a valid SSO ID value object', async () => {
    const isValidSpy = jest.spyOn(
      SSOId as unknown as SSOIdPublicClass,
      'isValid',
    );

    const successRequestMock = requestSsoUserMock.successRequest;
    (fetch as jest.MockedFunction<typeof fetch>).mockResolvedValue(
      new Response(JSON.stringify(successRequestMock)),
    );

    const ssoId = await SSOId.create({
      value: successRequestMock.userId,
    });

    expect(ssoId.value).toBeInstanceOf(SSOId);
    expect(ssoId.isRight()).toBeTruthy();
    expect(isValidSpy).toHaveBeenCalled();

    const ssoIdValueObject = ssoId.value as SSOId;
    expect(ssoIdValueObject.value).toBe(successRequestMock.userId);
  });

  it('Should not create a SSO ID value object with an invalid value', async () => {
    const isValidSpy = jest.spyOn(
      SSOId as unknown as SSOIdPublicClass,
      'isValid',
    );

    const rejectedRequestMock = requestSsoUserMock.rejectedRequest;
    (fetch as jest.MockedFunction<typeof fetch>).mockRejectedValue(
      new Response(JSON.stringify(rejectedRequestMock)),
    );

    const ssoId = await SSOId.create({
      value: rejectedRequestMock.userId,
    });

    expect(ssoId.value).toBeInstanceOf(UserDomainError);
    expect(ssoId.isLeft()).toBeTruthy();
    expect(isValidSpy).toHaveBeenCalled();

    const ssoIdValueObject = ssoId.value as UserDomainError;
    expect(ssoIdValueObject.message).toBe(
      UserDomainError.messages.invalidSSOId,
    );
  });
});
