import { UserDomainError } from '~/modules/users/domain/errors';
import Password from '~/modules/users/domain/value-objects/password';

describe('Password Value Objects', () => {
  afterEach(() => {
    jest.restoreAllMocks();
  });

  type PasswordPublicClass = Password & {
    isValid(): boolean;
  };

  it('should create a password value object', async () => {
    const isValidSpy = jest.spyOn(
      Password as unknown as PasswordPublicClass,
      'isValid',
    );

    const passwordValue = 'v#$6D=W9';
    const password = await Password.create({ value: passwordValue });

    expect(password.value).toBeInstanceOf(Password);
    expect(password.isRight()).toBeTruthy();
    expect(isValidSpy).toHaveBeenCalled();

    const passwordValueObject = password.value as Password;
    const passwordCompared = await passwordValueObject.comparePassword(
      passwordValue,
    );
    expect(passwordCompared).toBeTruthy();
  });

  it('should not create a password value object with an invalid min length', async () => {
    const isValidSpy = jest.spyOn(
      Password as unknown as PasswordPublicClass,
      'isValid',
    );

    const passwordValue = '123';
    const password = await Password.create({ value: passwordValue });

    expect(password.value).toBeInstanceOf(UserDomainError);
    expect(password.isLeft()).toBeTruthy();
    expect(isValidSpy).toHaveBeenCalled();

    const passwordValueObject = password.value as UserDomainError;
    expect(passwordValueObject.message).toBe(
      UserDomainError.messages.invalidPassword,
    );
  });

  it('should not create a password value object with an weak value', async () => {
    const isValidSpy = jest.spyOn(
      Password as unknown as PasswordPublicClass,
      'isValid',
    );

    const passwordValue = 'WeakPassword';
    const password = await Password.create({ value: passwordValue });

    expect(password.value).toBeInstanceOf(UserDomainError);
    expect(password.isLeft()).toBeTruthy();
    expect(isValidSpy).toHaveBeenCalled();

    const passwordValueObject = password.value as UserDomainError;
    expect(passwordValueObject.message).toBe(
      UserDomainError.messages.invalidPassword,
    );
  });
});
