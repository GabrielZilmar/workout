import { UserDomainError } from '~/module/users/domain/errors';
import Weight from '~/module/users/domain/value-objects/weight';

describe('User Weight Value Objects', () => {
  afterEach(() => {
    jest.restoreAllMocks();
  });

  type WeightPublicClass = Weight & {
    isValid(): boolean;
  };

  it('should create an weight value object', () => {
    const isValidSpy = jest.spyOn(
      Weight as unknown as WeightPublicClass,
      'isValid',
    );

    const weightValue = 50;
    const weight = Weight.create({ value: weightValue });

    expect(weight.value).toBeInstanceOf(Weight);
    expect(weight.isRight()).toBeTruthy();
    expect(isValidSpy).toHaveBeenCalled();

    const weightValueObject = weight.value as Weight;
    expect(weightValueObject.value).toBe(weightValue);
  });

  it('should not create an weight value object with an invalid value', () => {
    const isValidSpy = jest.spyOn(
      Weight as unknown as WeightPublicClass,
      'isValid',
    );

    const weightValue = -5;
    const weight = Weight.create({ value: weightValue });

    expect(weight.value).toBeInstanceOf(UserDomainError);
    expect(weight.isLeft()).toBeTruthy();
    expect(isValidSpy).toHaveBeenCalled();

    const weightValueObject = weight.value as UserDomainError;
    expect(weightValueObject.message).toBe(
      UserDomainError.messages.invalidWeight,
    );
  });
});
