import { SetDomainError } from '~/modules/set/domain/errors';
import SetDomain from '~/modules/set/domain/set.domain';
import { Set } from '~/modules/set/entities/set.entity';
import { Mapper } from '~/shared/domain/mapper';
import { UniqueEntityID } from '~/shared/domain/unique-entity-id';
import { Either } from '~/shared/either';

export default class SetMapper implements Mapper<SetDomain, Partial<Set>> {
  public toDomain(raw: Set): Either<SetDomainError, SetDomain> {
    const { id, workoutExerciseId, numReps, weight, numDrops } = raw;

    const entityId = new UniqueEntityID(id);
    const setDomainOrError = SetDomain.create(
      {
        workoutExerciseId,
        numReps,
        setWeight: weight,
        numDrops,
      },
      entityId,
    );

    if (setDomainOrError.isLeft()) {
      return setDomainOrError;
    }

    return setDomainOrError;
  }

  public toPersistence(item: SetDomain): Partial<Set> {
    const { id, workoutExerciseId, numReps, setWeight, numDrops } = item;

    const setEntity: Partial<Set> = {
      id: id?.toString(),
      workoutExerciseId,
      numReps: numReps.value,
      weight: setWeight.value,
      numDrops: numDrops.value,
    };

    return setEntity;
  }
}
