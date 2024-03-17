import { HttpStatus } from '@nestjs/common';
import { MuscleDomainMock } from 'test/utils/domains/muscle-domain-mock';
import { MuscleDomainError } from '~/modules/muscle/domain/errors';
import MuscleDomain, {
  MuscleDomainCreateParams,
  MuscleDomainProps,
} from '~/modules/muscle/domain/muscle.domain';
import { Either, left } from '~/shared/either';

type MuscleDomainPublicClass = MuscleDomain & {
  isValid: () => boolean;
  mountValueObjects: (
    props: MuscleDomainCreateParams,
  ) => Either<MuscleDomainError, MuscleDomainProps>;
};

describe('MuscleDomain', () => {
  afterEach(() => {
    jest.clearAllMocks();
  });

  it('Should create a Muscle domain', () => {
    const muscleParams = MuscleDomainMock.getMuscleCreateParams();
    const muscle = MuscleDomain.create(muscleParams);

    expect(muscle.isRight()).toBeTruthy();
    expect(muscle.value).toBeInstanceOf(MuscleDomain);

    const muscleProps = MuscleDomainMock.getMuscleDomainProps();
    expect({ ...(muscle.value as MuscleDomain).props }).toEqual(muscleProps);
    expect((muscle.value as MuscleDomain).name.value).toBe(muscleParams.name);
  });

  it('Should not create a Muscle with invalid props', () => {
    const muscleParams = MuscleDomainMock.getMuscleCreateParams({ name: '' });
    const muscle = MuscleDomain.create(muscleParams);

    expect(muscle.isLeft()).toBeTruthy();
    expect(muscle.value).toEqual(
      MuscleDomainError.create(MuscleDomainError.messages.missingProps),
    );
  });

  it('Should not create a Muscle if mount value objects fails', () => {
    const mockErrorMessage = 'Error';
    const mockErrorCode = 500;
    const mockError = MuscleDomainError.create(mockErrorMessage, mockErrorCode);

    jest
      .spyOn(
        MuscleDomain as unknown as MuscleDomainPublicClass,
        'mountValueObjects',
      )
      .mockReturnValueOnce(left(mockError));

    const muscleParams = MuscleDomainMock.getMuscleCreateParams();
    const muscle = MuscleDomain.create(muscleParams);

    expect(muscle.isLeft()).toBeTruthy();
    expect(muscle.value).toEqual(mockError);
  });

  it('Should not create a Muscle if name is invalid', () => {
    const mountValueObjectsSpy = jest.spyOn(
      MuscleDomain as unknown as MuscleDomainPublicClass,
      'mountValueObjects',
    );
    const muscleParams = MuscleDomainMock.getMuscleCreateParams({ name: 'a' });
    const muscle = MuscleDomain.create(muscleParams);

    expect(muscle.isLeft()).toBeTruthy();
    expect(mountValueObjectsSpy).toReturnWith(
      left(
        MuscleDomainError.create(
          MuscleDomainError.messages.invalidMuscleName,
          HttpStatus.BAD_REQUEST,
        ),
      ),
    );
  });
});
