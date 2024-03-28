import { HttpStatus } from '@nestjs/common';
import { SetDomainError } from '~/modules/set/domain/errors';
import SetWeight from '~/modules/set/domain/value-objects/set-weight';

type SetWeightPublicClass = SetWeight & {
  isValid(): boolean;
};

describe('SetWeight value object', () => {
  afterEach(() => {
    jest.restoreAllMocks();
  });

  it('Should create a set weight value object', () => {
    const isValidSpy = jest.spyOn(
      SetWeight as unknown as SetWeightPublicClass,
      'isValid',
    );

    const setWeightValue = 10;
    const setWeight = SetWeight.create({ value: setWeightValue });

    expect(setWeight.value).toBeInstanceOf(SetWeight);
    expect((setWeight.value as SetWeight).value).toBe(setWeightValue);
    expect(setWeight.isRight()).toBeTruthy();
    expect(isValidSpy).toHaveBeenCalled();
  });

  it('Should not create a set weight value object with an invalid value', () => {
    const isValidSpy = jest.spyOn(
      SetWeight as unknown as SetWeightPublicClass,
      'isValid',
    );

    const setWeightValue = -1;
    const setWeight = SetWeight.create({ value: setWeightValue });

    expect(setWeight.isLeft()).toBeTruthy();
    expect(setWeight.value).toEqual(
      SetDomainError.create(
        SetDomainError.messages.invalidSetWeight,
        HttpStatus.BAD_REQUEST,
      ),
    );
    expect(isValidSpy).toHaveBeenCalled();
  });
});
