import { UserDomainError } from '~/modules/users/domain/errors';
import Username from '~/modules/users/domain/value-objects/username';

describe('User Username Value Objects', () => {
  afterEach(() => {
    jest.restoreAllMocks();
  });

  type UsernamePublicClass = Username & {
    isValid(): boolean;
  };

  it('should create a username value object', () => {
    const isValidSpy = jest.spyOn(
      Username as unknown as UsernamePublicClass,
      'isValid',
    );

    const usernameValue = 'username';
    const username = Username.create({ value: usernameValue });

    expect(username.value).toBeInstanceOf(Username);
    expect(username.isRight()).toBeTruthy();
    expect(isValidSpy).toHaveBeenCalled();

    const usernameValueObject = username.value as Username;
    expect(usernameValueObject.value).toBe(usernameValue);
  });

  it('should not create a username value object with an invalid value', () => {
    const isValidSpy = jest.spyOn(
      Username as unknown as UsernamePublicClass,
      'isValid',
    );

    const usernameValue = 'a';
    const username = Username.create({ value: usernameValue });

    expect(username.value).toBeInstanceOf(UserDomainError);
    expect(username.isLeft()).toBeTruthy();
    expect(isValidSpy).toHaveBeenCalled();

    const usernameValueObject = username.value as UserDomainError;
    expect(usernameValueObject.message).toBe(
      UserDomainError.messages.invalidUsername,
    );
  });
});
