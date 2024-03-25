import WorkoutExerciseDomain from '~/modules/workout-exercise/domain/workout-exercise.domain';
import { WorkoutExercise as WorkoutExerciseEntity } from '~/modules/workout-exercise/entities/workout-exercise.entity';
import { WorkoutDomainError } from '~/modules/workout/domain/errors';
import { Mapper } from '~/shared/domain/mapper';
import { UniqueEntityID } from '~/shared/domain/unique-entity-id';
import { Either } from '~/shared/either';

export default class WorkoutExerciseMapper
  implements Mapper<WorkoutExerciseDomain, Partial<WorkoutExerciseEntity>>
{
  public toDomain(
    raw: WorkoutExerciseEntity,
  ): Either<WorkoutDomainError, WorkoutExerciseDomain> {
    const { id, workoutId, exerciseId, order } = raw;

    const entityId = new UniqueEntityID(id);
    const workoutExerciseDomainOrError = WorkoutExerciseDomain.create(
      {
        workoutId,
        exerciseId,
        order,
      },
      entityId,
    );

    return workoutExerciseDomainOrError;
  }

  public toPersistence(
    item: WorkoutExerciseDomain,
  ): Partial<WorkoutExerciseEntity> {
    const { id, workoutId, exerciseId, order } = item;

    const workoutExerciseEntity: Partial<WorkoutExerciseEntity> = {
      id: id?.toString(),
      workoutId,
      exerciseId,
      order: order.value,
    };

    return workoutExerciseEntity;
  }
}
