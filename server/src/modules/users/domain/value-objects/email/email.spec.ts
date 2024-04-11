import { UserDomainError } from '~/modules/users/domain/errors';
import Email from '~/modules/users/domain/value-objects/email';

describe('Email Value Objects', () => {
  afterEach(() => {
    jest.restoreAllMocks();
  });

  type EmailPublicClass = Email & {
    isValid(): boolean;
  };

  it('should create a email value object', () => {
    const isValidSpy = jest.spyOn(
      Email as unknown as EmailPublicClass,
      'isValid',
    );

    const emailValue = 'valid@email.com';
    const email = Email.create({ value: emailValue });

    expect(email.value).toBeInstanceOf(Email);
    expect(email.isRight()).toBeTruthy();
    expect(isValidSpy).toHaveBeenCalled();
  });

  it('should not create a email value object with an invalid value', () => {
    const isValidSpy = jest.spyOn(
      Email as unknown as EmailPublicClass,
      'isValid',
    );

    const emailValue = 'invalid-email';
    const email = Email.create({ value: emailValue });

    expect(email.value).toBeInstanceOf(UserDomainError);
    expect(email.isLeft()).toBeTruthy();
    expect(isValidSpy).toHaveBeenCalled();

    const emailValueObject = email.value as UserDomainError;
    expect(emailValueObject.message).toBe(
      UserDomainError.messages.invalidEmail,
    );
  });
});
