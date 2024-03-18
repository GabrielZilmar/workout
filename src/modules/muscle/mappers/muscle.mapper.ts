import { MuscleDomainError } from '~/modules/muscle/domain/errors';
import MuscleDomain from '~/modules/muscle/domain/muscle.domain';
import { Muscle as MuscleEntity } from '~/modules/muscle/entities/muscle.entity';
import { Mapper } from '~/shared/domain/mapper';
import { UniqueEntityID } from '~/shared/domain/unique-entity-id';
import { Either } from '~/shared/either';

export default class MuscleMapper
  implements Mapper<MuscleDomain, Partial<MuscleEntity>>
{
  public toDomain(raw: MuscleEntity): Either<MuscleDomainError, MuscleDomain> {
    const { id, name } = raw;

    const entityId = new UniqueEntityID(id);
    const muscleOrError = MuscleDomain.create({ name }, entityId);

    if (muscleOrError.isLeft()) {
      return muscleOrError;
    }

    return muscleOrError;
  }

  public toPersistence(item: MuscleDomain): Partial<MuscleEntity> {
    const { id, name } = item;

    const muscleEntity: Partial<MuscleEntity> = {
      id: id?.toString(),
      name: name.value,
    };

    return muscleEntity;
  }
}
