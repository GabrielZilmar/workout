import { HttpStatus } from '@nestjs/common';
import { SetDomainMock } from 'test/utils/domains/set-domain-mock';
import { SetDomainError } from '~/modules/set/domain/errors';
import SetDomain, {
  SetDomainCreateParams,
  SetDomainProps,
} from '~/modules/set/domain/set.domain';
import { Either } from '~/shared/either';

type SetDomainPublicClass = SetDomain & {
  isValid: () => boolean;
  mountValueObjects: (
    props: SetDomainCreateParams,
  ) => Either<SetDomainError, SetDomainProps>;
};

describe('SetDomain', () => {
  afterEach(() => {
    jest.clearAllMocks();
  });

  it('Should create a set domain', () => {
    const setParams = SetDomainMock.getSetCreateParams();
    const set = SetDomain.create(setParams);

    expect(set.isRight()).toBeTruthy();
    expect(set.value).toBeInstanceOf(SetDomain);

    const setProps = SetDomainMock.getSetDomainProps();
    expect({ ...(set.value as SetDomain).props }).toEqual(setProps);
    expect((set.value as SetDomain).workoutExerciseId).toBe(
      setParams.workoutExerciseId,
    );
    expect((set.value as SetDomain).numReps.value).toBe(setParams.numReps);
    expect((set.value as SetDomain).setWeight.value).toBe(setParams.setWeight);
    expect((set.value as SetDomain).numDrops.value).toBe(setParams.numDrops);
  });

  it('Should not create a set domain with invalid propd', () => {
    const isValidSpy = jest.spyOn(
      SetDomain as unknown as SetDomainPublicClass,
      'isValid',
    );
    const mountValueObjectsSpy = jest.spyOn(
      SetDomain as unknown as SetDomainPublicClass,
      'mountValueObjects',
    );

    const setParams = SetDomainMock.getSetCreateParams({
      workoutExerciseId: '',
    });
    const set = SetDomain.create(setParams);

    expect(set.isLeft()).toBeTruthy();
    expect(set.value).toEqual(
      SetDomainError.create(
        SetDomainError.messages.invalidSetWeight,
        HttpStatus.BAD_REQUEST,
      ),
    );
    expect(mountValueObjectsSpy).not.toHaveBeenCalled();
    expect(isValidSpy).toHaveBeenCalled();
  });

  it('Should not create a set domain with invalid value objects', () => {
    const mountValueObjectsSpy = jest.spyOn(
      SetDomain as unknown as SetDomainPublicClass,
      'mountValueObjects',
    );

    const setParams = SetDomainMock.getSetCreateParams({
      setWeight: -1,
    });
    const set = SetDomain.create(setParams);

    expect(set.isLeft()).toBeTruthy();
    expect(set.value).toEqual(
      SetDomainError.create(
        SetDomainError.messages.invalidSetWeight,
        HttpStatus.BAD_REQUEST,
      ),
    );
    expect(mountValueObjectsSpy).toHaveBeenCalled();
  });

  it('Should update a set domain', () => {
    const setDomain = SetDomainMock.mountSetDomain();

    const updatedSetParams = SetDomainMock.getSetCreateParams({
      numReps: 10,
      setWeight: 10,
      numDrops: 10,
    });

    expect(setDomain.numDrops).not.toBe(updatedSetParams.numDrops);
    expect(setDomain.setWeight).not.toBe(updatedSetParams.setWeight);
    expect(setDomain.numDrops).not.toBe(updatedSetParams.numDrops);

    const updatedSet = setDomain.update(updatedSetParams);

    expect(updatedSet.isRight()).toBeTruthy();
    expect(updatedSet.value).toBeInstanceOf(SetDomain);

    const updatedSetProps = SetDomainMock.getSetDomainProps({
      numReps: 10,
      setWeight: 10,
      numDrops: 10,
    });
    expect({ ...(updatedSet.value as SetDomain).props }).toEqual(
      updatedSetProps,
    );
    expect((updatedSet.value as SetDomain).numReps.value).toBe(
      updatedSetParams.numDrops,
    );
    expect((updatedSet.value as SetDomain).setWeight.value).toBe(
      updatedSetParams.setWeight,
    );
    expect((updatedSet.value as SetDomain).numDrops.value).toBe(
      updatedSetParams.numDrops,
    );
  });

  it('Should not update if any value objects fails', () => {
    const setDomain = SetDomainMock.mountSetDomain();

    const updatedSetParams = SetDomainMock.getSetCreateParams({
      setWeight: -1,
    });

    const updatedSet = setDomain.update(updatedSetParams);
    expect(updatedSet.value).toEqual(
      SetDomainError.create(
        SetDomainError.messages.invalidSetWeight,
        HttpStatus.BAD_REQUEST,
      ),
    );
  });
});
