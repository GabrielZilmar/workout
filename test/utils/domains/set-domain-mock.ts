import { GenericCreateDomainParams } from 'test/utils/types/domain';
import { v4 as uuid } from 'uuid';
import SetDomain, {
  SetDomainCreateParams,
  SetDomainProps,
} from '~/modules/set/domain/set.domain';
import NumDrops from '~/modules/set/domain/value-objects/num-drops';
import NumReps from '~/modules/set/domain/value-objects/num-reps';
import SetWeight from '~/modules/set/domain/value-objects/set-weight';
import { UniqueEntityID } from '~/shared/domain/unique-entity-id';

type MountSetDomainParams = Partial<SetDomainCreateParams> &
  GenericCreateDomainParams;

export class SetDomainMock {
  public static readonly setMockCreateParams: Required<SetDomainCreateParams> =
    {
      workoutExerciseId: uuid(),
      numReps: 10,
      setWeight: 20,
      numDrops: 3,
    };

  public static getSetCreateParams(props?: Partial<SetDomainCreateParams>) {
    return {
      ...this.setMockCreateParams,
      ...props,
    };
  }

  public static getSetDomainProps({
    workoutExerciseId,
    numReps,
    setWeight,
    numDrops,
  }: Partial<SetDomainCreateParams> = {}): SetDomainProps {
    const numRepsValueObject = NumReps.create({
      value: numReps ?? this.setMockCreateParams.numReps,
    }).value as NumReps;
    const setWeightValueObject = SetWeight.create({
      value: setWeight ?? this.setMockCreateParams.setWeight,
    }).value as SetWeight;
    const numDropsValueObject = NumDrops.create({
      value: numDrops ?? this.setMockCreateParams.numDrops,
    }).value as NumDrops;

    return {
      workoutExerciseId:
        workoutExerciseId ?? this.setMockCreateParams.workoutExerciseId,
      numReps: numRepsValueObject,
      setWeight: setWeightValueObject,
      numDrops: numDropsValueObject,
    };
  }

  public static mountSetDomain({
    withoutId,
    ...props
  }: MountSetDomainParams = {}): SetDomain {
    const createParams = this.getSetCreateParams(props);

    const setParams = {
      params: createParams,
      id: props.id,
    };

    let id: UniqueEntityID | undefined;
    if (!withoutId) {
      id = new UniqueEntityID(setParams.id);
    }

    return SetDomain.create(setParams.params, id).value as SetDomain;
  }
}
