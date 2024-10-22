import { forwardRef, Inject } from '@nestjs/common';
import { SetDomainError } from '~/modules/set/domain/errors';
import SetDomain from '~/modules/set/domain/set.domain';
import { Set } from '~/modules/set/entities/set.entity';
import WorkoutExerciseDomain from '~/modules/workout-exercise/domain/workout-exercise.domain';
import { WorkoutExercise } from '~/modules/workout-exercise/entities/workout-exercise.entity';
import WorkoutExerciseMapper from '~/modules/workout-exercise/mappers/workout-exercise.mapper';
import { Mapper } from '~/shared/domain/mapper';
import { UniqueEntityID } from '~/shared/domain/unique-entity-id';
import { Either, left } from '~/shared/either';

export default class SetMapper implements Mapper<SetDomain, Partial<Set>> {
  constructor(
    @Inject(forwardRef(() => WorkoutExerciseMapper))
    private readonly workoutExerciseMapper?: WorkoutExerciseMapper,
  ) {}

  public async toDomain(raw: Set): Promise<Either<SetDomainError, SetDomain>> {
    const {
      id,
      createdAt,
      workoutExerciseId,
      workoutExercise,
      order,
      numReps,
      weight,
      numDrops,
    } = raw;

    const entityId = new UniqueEntityID(id);

    let workoutExerciseDomain: WorkoutExerciseDomain | undefined;
    if (workoutExercise && this.workoutExerciseMapper) {
      const workoutExerciseOrError = await this.workoutExerciseMapper.toDomain(
        workoutExercise,
      );
      if (workoutExerciseOrError.isLeft()) {
        return left(workoutExerciseOrError.value);
      }

      workoutExerciseDomain = workoutExerciseOrError.value;
    }

    const setDomainOrError = SetDomain.create(
      {
        workoutExerciseId,
        workoutExerciseDomain,
        createdAt,
        order,
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
    const {
      id,
      workoutExerciseDomain,
      workoutExerciseId,
      createdAt,
      order,
      numReps,
      setWeight,
      numDrops,
    } = item;

    const setEntity: Partial<Set> = {
      id: id?.toString(),
      workoutExerciseId,
      createdAt: createdAt.getDateValue(),
      order: order.value,
      numReps: numReps.value,
      weight: setWeight.value,
      numDrops: numDrops.value,
    };
    if (workoutExerciseDomain && !!this.workoutExerciseMapper) {
      setEntity.workoutExercise = this.workoutExerciseMapper.toPersistence(
        workoutExerciseDomain,
      ) as WorkoutExercise;
    }

    return setEntity;
  }
}
