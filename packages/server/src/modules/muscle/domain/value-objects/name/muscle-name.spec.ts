import { HttpStatus } from '@nestjs/common';
import { MuscleDomainError } from '~/modules/muscle/domain/errors';
import MuscleName from '~/modules/muscle/domain/value-objects/name';

type MuscleNamePublicClass = MuscleName & {
  isValid(): boolean;
};
describe('MuscleName value object', () => {
  afterEach(() => {
    jest.restoreAllMocks();
  });

  it('It should create a muscle name value object', () => {
    const isValidSpy = jest.spyOn(
      MuscleName as unknown as MuscleNamePublicClass,
      'isValid',
    );

    const muscleNameValue = 'gluTeus maximus tesT ';
    const muscleName = MuscleName.create({ value: muscleNameValue });

    expect(muscleName.value).toBeInstanceOf(MuscleName);
    expect(muscleName.isRight()).toBeTruthy();
    expect(isValidSpy).toHaveBeenCalled();

    const muscleNameValueObject = muscleName.value as MuscleName;
    const capitalizedMuscleNameValue = 'Gluteus Maximus Test';
    expect(muscleNameValueObject.value).toBe(capitalizedMuscleNameValue);
  });

  it('It should not create a muscle name value object with an invalid value', () => {
    const isValidSpy = jest.spyOn(
      MuscleName as unknown as MuscleNamePublicClass,
      'isValid',
    );

    const muscleNameValue = 'a';
    const muscleName = MuscleName.create({ value: muscleNameValue });

    expect(muscleName.value).toBeInstanceOf(Error);
    expect(muscleName.isLeft()).toBeTruthy();
    expect(isValidSpy).toHaveBeenCalled();

    expect(muscleName.value).toEqual(
      MuscleDomainError.create(
        MuscleDomainError.messages.invalidMuscleName,
        HttpStatus.BAD_REQUEST,
      ),
    );
  });
});
