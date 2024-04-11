import { ExerciseDomainError } from '~/modules/exercise/domain/errors';
import ExerciseDomain from '~/modules/exercise/domain/exercise.domain';
import { Exercise as ExerciseEntity } from '~/modules/exercise/entities/exercise.entity';
import { Mapper } from '~/shared/domain/mapper';
import { UniqueEntityID } from '~/shared/domain/unique-entity-id';
import { Either } from '~/shared/either';

export default class ExerciseMapper
  implements Mapper<ExerciseDomain, Partial<ExerciseEntity>>
{
  public toDomain(
    raw: ExerciseEntity,
  ): Either<ExerciseDomainError, ExerciseDomain> {
    const { id, name, info, tutorialUrl, muscleId } = raw;

    const entityId = new UniqueEntityID(id);
    const exerciseDomainOrError = ExerciseDomain.create(
      {
        name,
        info,
        tutorialUrl,
        muscleId,
      },
      entityId,
    );

    if (exerciseDomainOrError.isLeft()) {
      return exerciseDomainOrError;
    }

    return exerciseDomainOrError;
  }

  public toPersistence(item: ExerciseDomain): Partial<ExerciseEntity> {
    const { id, name, info, tutorialUrl, muscleId } = item;

    const exerciseEntity: Partial<ExerciseEntity> = {
      id: id?.toString(),
      name: name.value,
      info: info?.value,
      tutorialUrl: tutorialUrl?.value,
      muscleId,
    };

    return exerciseEntity;
  }
}
