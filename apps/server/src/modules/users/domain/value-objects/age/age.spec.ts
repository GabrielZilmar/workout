import { UserDomainError } from '~/modules/users/domain/errors';
import Age from '~/modules/users/domain/value-objects/age';

describe('User Age Value Objects', () => {
  afterEach(() => {
    jest.restoreAllMocks();
  });

  type AgePublicClass = Age & {
    isValid(): boolean;
  };

  it('should create an age value object', () => {
    const isValidSpy = jest.spyOn(Age as unknown as AgePublicClass, 'isValid');

    const ageValue = 20;
    const age = Age.create({ value: ageValue });

    expect(age.value).toBeInstanceOf(Age);
    expect(age.isRight()).toBeTruthy();
    expect(isValidSpy).toHaveBeenCalled();

    const ageValueObject = age.value as Age;
    expect(ageValueObject.value).toBe(ageValue);
  });

  it('should not create an age value object with an invalid value', () => {
    const isValidSpy = jest.spyOn(Age as unknown as AgePublicClass, 'isValid');

    const ageValue = -5;
    const age = Age.create({ value: ageValue });

    expect(age.value).toBeInstanceOf(UserDomainError);
    expect(age.isLeft()).toBeTruthy();
    expect(isValidSpy).toHaveBeenCalled();

    const ageValueObject = age.value as UserDomainError;
    expect(ageValueObject.message).toBe(UserDomainError.messages.invalidAge);
  });
});
