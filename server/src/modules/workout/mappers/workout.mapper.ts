import { Injectable } from '@nestjs/common';
import { WorkoutDomainError } from '~/modules/workout/domain/errors';
import WorkoutDomain from '~/modules/workout/domain/workout.domain';
import { Workout as WorkoutEntity } from '~/modules/workout/entities/workout.entity';
import { Mapper } from '~/shared/domain/mapper';
import { UniqueEntityID } from '~/shared/domain/unique-entity-id';
import { Either } from '~/shared/either';

@Injectable()
export default class WorkoutMapper
  implements Mapper<WorkoutDomain, Partial<WorkoutEntity>>
{
  public toDomain(
    raw: WorkoutEntity,
  ): Either<WorkoutDomainError, WorkoutDomain> {
    const { id, name, userId, isPrivate, isRoutine } = raw;

    const entityId = new UniqueEntityID(id);
    const workoutDomainOrError = WorkoutDomain.create(
      {
        name,
        userId,
        isPrivate,
        isRoutine,
      },
      entityId,
    );

    if (workoutDomainOrError.isLeft()) {
      return workoutDomainOrError;
    }

    return workoutDomainOrError;
  }

  public toPersistence(item: WorkoutDomain): Partial<WorkoutEntity> {
    const { id, name, userId, privateStatus, routineStatus } = item;

    const workoutEntity: Partial<WorkoutEntity> = {
      id: id?.toString(),
      name: name.value,
      userId,
      isPrivate: privateStatus.isPrivate(),
      isRoutine: routineStatus.isRoutine(),
    };

    return workoutEntity;
  }
}
