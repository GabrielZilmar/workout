import { HttpStatus } from '@nestjs/common';
import { SetsDomainError } from '~/modules/sets/domain/errors';
import NumDrops from '~/modules/sets/domain/value-objects/num-drops';

type NumDropsPublicClass = NumDrops & {
  isValid(): boolean;
};

describe('NumDrops value object', () => {
  afterEach(() => {
    jest.restoreAllMocks();
  });

  it('Should create a num drops value object', () => {
    const isValidSpy = jest.spyOn(
      NumDrops as unknown as NumDropsPublicClass,
      'isValid',
    );

    const numDropsValue = 3;
    const numDrops = NumDrops.create({ value: numDropsValue });

    expect(numDrops.value).toBeInstanceOf(NumDrops);
    expect((numDrops.value as NumDrops).value).toBe(numDropsValue);
    expect(numDrops.isRight()).toBeTruthy();
    expect(isValidSpy).toHaveBeenCalled();
  });

  it('Should not create a num drops value object with an invalid value', () => {
    const isValidSpy = jest.spyOn(
      NumDrops as unknown as NumDropsPublicClass,
      'isValid',
    );

    const numDropsValue = -1;
    const numDrops = NumDrops.create({ value: numDropsValue });

    expect(numDrops.isLeft()).toBeTruthy();
    expect(numDrops.value).toEqual(
      SetsDomainError.create(
        SetsDomainError.messages.invalidNumDrops,
        HttpStatus.BAD_REQUEST,
      ),
    );
    expect(isValidSpy).toHaveBeenCalled();
  });
});
