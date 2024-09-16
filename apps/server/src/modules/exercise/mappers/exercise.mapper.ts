import { Injectable } from '@nestjs/common';
import { ExerciseDomainError } from '~/modules/exercise/domain/errors';
import ExerciseDomain from '~/modules/exercise/domain/exercise.domain';
import { Exercise as ExerciseEntity } from '~/modules/exercise/entities/exercise.entity';
import MuscleDomain from '~/modules/muscle/domain/muscle.domain';
import { Muscle } from '~/modules/muscle/entities/muscle.entity';
import MuscleMapper from '~/modules/muscle/mappers/muscle.mapper';
import { Mapper } from '~/shared/domain/mapper';
import { UniqueEntityID } from '~/shared/domain/unique-entity-id';
import { Either, left } from '~/shared/either';

@Injectable()
export default class ExerciseMapper
  implements Mapper<ExerciseDomain, Partial<ExerciseEntity>>
{
  constructor(private readonly muscleMapper: MuscleMapper) {}

  public toDomain(
    raw: ExerciseEntity,
  ): Either<ExerciseDomainError, ExerciseDomain> {
    const { id, name, info, tutorialUrl, muscleId, muscle } = raw;

    let muscleDomain: MuscleDomain | undefined;
    if (muscle) {
      const muscleDomainOrError = this.muscleMapper.toDomain(muscle);
      if (muscleDomainOrError.isLeft()) {
        return left(muscleDomainOrError.value);
      }
      muscleDomain = muscleDomainOrError.value;
    }

    const entityId = new UniqueEntityID(id);
    const exerciseDomainOrError = ExerciseDomain.create(
      {
        name,
        info: info ?? undefined,
        tutorialUrl: tutorialUrl ?? undefined,
        muscleId,
        muscleDomain,
      },
      entityId,
    );

    if (exerciseDomainOrError.isLeft()) {
      return exerciseDomainOrError;
    }

    return exerciseDomainOrError;
  }

  public toPersistence(item: ExerciseDomain): Partial<ExerciseEntity> {
    const { id, name, info, tutorialUrl, muscleId, muscleDomain } = item;

    const exerciseEntity: Partial<ExerciseEntity> = {
      id: id?.toString(),
      name: name.value,
      info: info === null ? info : info?.value,
      tutorialUrl: tutorialUrl === null ? tutorialUrl : tutorialUrl?.value,
      muscleId,
    };

    if (muscleDomain) {
      exerciseEntity.muscle = this.muscleMapper.toPersistence(
        muscleDomain,
      ) as Muscle;
    }

    return exerciseEntity;
  }
}
