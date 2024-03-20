import { HttpStatus } from '@nestjs/common';
import { ExerciseDomainError } from '~/modules/exercise/domain/errors';
import NumReps from '~/modules/exercise/domain/value-objects/num-reps';

type NumRepsPublicClass = NumReps & {
  isValid(): boolean;
};

describe('NumReps value object', () => {
  afterEach(() => {
    jest.restoreAllMocks();
  });

  it('Should create a num reps value object', () => {
    const isValidSpy = jest.spyOn(
      NumReps as unknown as NumRepsPublicClass,
      'isValid',
    );

    const numRepsValue = 10;
    const numReps = NumReps.create({ value: numRepsValue });

    expect(numReps.value).toBeInstanceOf(NumReps);
    expect((numReps.value as NumReps).value).toBe(numRepsValue);
    expect(numReps.isRight()).toBeTruthy();
    expect(isValidSpy).toHaveBeenCalled();
  });

  it('Should not create a num reps value object with an invalid value', () => {
    const isValidSpy = jest.spyOn(
      NumReps as unknown as NumRepsPublicClass,
      'isValid',
    );

    const numRepsValue = 0;
    const numReps = NumReps.create({ value: numRepsValue });

    expect(numReps.isLeft()).toBeTruthy();
    expect(numReps.value).toEqual(
      ExerciseDomainError.create(
        ExerciseDomainError.messages.invalidNumReps,
        HttpStatus.BAD_REQUEST,
      ),
    );
    expect(isValidSpy).toHaveBeenCalled();
  });
});
