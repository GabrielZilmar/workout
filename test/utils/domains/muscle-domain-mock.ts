import { GenericCreateDomainParams } from 'test/utils/types/domain';
import MuscleDomain, {
  MuscleDomainCreateParams,
} from '~/modules/muscle/domain/muscle.domain';
import MuscleName from '~/modules/muscle/domain/value-objects/name';
import { UniqueEntityID } from '~/shared/domain/unique-entity-id';

type MountMuscleDomainParams = Partial<MuscleDomainCreateParams> &
  GenericCreateDomainParams;

export class MuscleDomainMock {
  public static readonly muscleMockCreateParams: MuscleDomainCreateParams = {
    name: 'Muscle Test 1',
  };

  public static getMuscleDomainProps({
    name,
  }: Partial<MuscleDomainCreateParams> = {}) {
    const muscleName = MuscleName.create({
      value: this.muscleMockCreateParams.name ?? name,
    });

    return {
      name: muscleName.value,
    };
  }

  public static getMuscleCreateParams(
    props?: Partial<MuscleDomainCreateParams>,
  ) {
    return {
      ...this.muscleMockCreateParams,
      ...props,
    };
  }

  public static mountMuscleDomain({
    withoutId,
    ...props
  }: MountMuscleDomainParams = {}) {
    const createParams = this.getMuscleCreateParams(props);

    const muscleParams = {
      params: createParams,
      id: props.id,
    };

    let id: UniqueEntityID | undefined;
    if (!withoutId) {
      id = new UniqueEntityID(muscleParams.id);
    }

    const muscleDomain = MuscleDomain.create(muscleParams.params, id);
    return muscleDomain.value as MuscleDomain;
  }
}
