import { UserDomainError } from '~/module/users/domain/errors';
import Height from '~/module/users/domain/value-objects/height';

describe('User Height Value Objects', () => {
  type HeightPublicClass = Height & {
    isValid(): boolean;
  };

  it('should create a height value object', () => {
    const isValidSpy = jest.spyOn(
      Height as unknown as HeightPublicClass,
      'isValid',
    );

    const heightValue = 180;
    const height = Height.create({ value: heightValue });

    expect(height.value).toBeInstanceOf(Height);
    expect(height.isRight()).toBeTruthy();
    expect(isValidSpy).toHaveBeenCalled();

    const heightValueObject = height.value as Height;
    expect(heightValueObject.value).toBe(heightValue);
  });

  it('should not create a height value object with an invalid value', () => {
    const isValidSpy = jest.spyOn(
      Height as unknown as HeightPublicClass,
      'isValid',
    );

    const heightValue = 10;
    const height = Height.create({ value: heightValue });

    expect(height.value).toBeInstanceOf(UserDomainError);
    expect(height.isLeft()).toBeTruthy();
    expect(isValidSpy).toHaveBeenCalled();

    const heightValueObject = height.value as UserDomainError;
    expect(heightValueObject.message).toBe(
      UserDomainError.messages.invalidHeight,
    );
  });
});
