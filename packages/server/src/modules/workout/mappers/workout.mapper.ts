import { Injectable } from '@nestjs/common';
import UserMapper from '~/modules/users/domain/mappers/users.mapper';
import { UserDomain } from '~/modules/users/domain/users.domain';
import { User } from '~/modules/users/entities/user.entity';
import { WorkoutDomainError } from '~/modules/workout/domain/errors';
import WorkoutDomain from '~/modules/workout/domain/workout.domain';
import { Workout as WorkoutEntity } from '~/modules/workout/entities/workout.entity';
import { Mapper } from '~/shared/domain/mapper';
import { UniqueEntityID } from '~/shared/domain/unique-entity-id';
import { Either, left } from '~/shared/either';

@Injectable()
export default class WorkoutMapper
  implements Mapper<WorkoutDomain, Partial<WorkoutEntity>>
{
  constructor(private readonly userMapper: UserMapper) {}

  public async toDomain(
    raw: WorkoutEntity,
  ): Promise<Either<WorkoutDomainError, WorkoutDomain>> {
    const { id, name, userId, isPrivate, isRoutine, user } = raw;

    let userDomain: UserDomain | undefined;
    if (user) {
      const userDomainOrError = await this.userMapper.toDomain(user);
      if (userDomainOrError.isLeft()) {
        return left(userDomainOrError.value);
      }
      userDomain = userDomainOrError.value;
    }

    const entityId = new UniqueEntityID(id);
    const workoutDomainOrError = WorkoutDomain.create(
      {
        name,
        userId,
        isPrivate,
        isRoutine,
        userDomain,
      },
      entityId,
    );

    if (workoutDomainOrError.isLeft()) {
      return workoutDomainOrError;
    }

    return workoutDomainOrError;
  }

  public toPersistence(item: WorkoutDomain): Partial<WorkoutEntity> {
    const { id, name, userId, privateStatus, routineStatus, userDomain } = item;

    const workoutEntity: Partial<WorkoutEntity> = {
      id: id?.toString(),
      name: name.value,
      userId,
      isPrivate: privateStatus.isPrivate(),
      isRoutine: routineStatus.isRoutine(),
    };
    if (userDomain) {
      workoutEntity.user = this.userMapper.toPersistence(userDomain) as User;
    }

    return workoutEntity;
  }
}
