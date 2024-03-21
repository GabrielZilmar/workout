import { HttpStatus } from '@nestjs/common';
import { SetsDomainError } from '~/modules/sets/domain/errors';
import SetsWeight from '~/modules/sets/domain/value-objects/sets-weight';

type SetsWeightPublicClass = SetsWeight & {
  isValid(): boolean;
};

describe('SetsWeight value object', () => {
  afterEach(() => {
    jest.restoreAllMocks();
  });

  it('Should create a sets weight value object', () => {
    const isValidSpy = jest.spyOn(
      SetsWeight as unknown as SetsWeightPublicClass,
      'isValid',
    );

    const setsWeightValue = 10;
    const setsWeight = SetsWeight.create({ value: setsWeightValue });

    expect(setsWeight.value).toBeInstanceOf(SetsWeight);
    expect((setsWeight.value as SetsWeight).value).toBe(setsWeightValue);
    expect(setsWeight.isRight()).toBeTruthy();
    expect(isValidSpy).toHaveBeenCalled();
  });

  it('Should not create a sets weight value object with an invalid value', () => {
    const isValidSpy = jest.spyOn(
      SetsWeight as unknown as SetsWeightPublicClass,
      'isValid',
    );

    const setsWeightValue = 0;
    const setsWeight = SetsWeight.create({ value: setsWeightValue });

    expect(setsWeight.isLeft()).toBeTruthy();
    expect(setsWeight.value).toEqual(
      SetsDomainError.create(
        SetsDomainError.messages.invalidSetsWeight,
        HttpStatus.BAD_REQUEST,
      ),
    );
    expect(isValidSpy).toHaveBeenCalled();
  });
});
