import { HttpStatus } from '@nestjs/common';
import { WorkoutDomainError } from '~/modules/workout/domain/errors';
import WorkoutName from '~/modules/workout/domain/value-objects/name';
import PrivateStatus from '~/modules/workout/domain/value-objects/private-status';
import RoutineStatus from '~/modules/workout/domain/value-objects/routine-status';
import { WorkoutDto } from '~/modules/workout/dto/workout.dto';
import { AggregateRoot } from '~/shared/domain/aggregate-root';
import { UniqueEntityID } from '~/shared/domain/unique-entity-id';
import { Either, left, right } from '~/shared/either';

export type WorkoutDomainProps = {
  name: WorkoutName;
  userId: string;
  privateStatus: PrivateStatus;
  routineStatus: RoutineStatus;
};

export type WorkoutDomainCreateParams = {
  name: string;
  userId: string;
  isPrivate?: boolean;
  isRoutine?: boolean;
};

export type WorkoutDomainUpdateParams = {
  name?: string;
  isPrivate?: boolean;
  isRoutine?: boolean;
};

export default class WorkoutDomain extends AggregateRoot<WorkoutDomainProps> {
  get name(): WorkoutName {
    return this.props.name;
  }

  get userId(): string {
    return this.props.userId;
  }

  get privateStatus(): PrivateStatus {
    return this.props.privateStatus;
  }

  get routineStatus(): RoutineStatus {
    return this.props.routineStatus;
  }

  public toDto() {
    return WorkoutDto.domainToDto(this);
  }

  private static mountValueObjects(
    props: WorkoutDomainCreateParams,
  ): Either<WorkoutDomainError, WorkoutDomainProps> {
    const nameOrError = WorkoutName.create({ value: props.name });
    if (nameOrError.isLeft()) {
      return left(nameOrError.value);
    }

    const privateStatus = PrivateStatus.create({
      value: props.isPrivate ?? false,
    });
    const routineStatus = RoutineStatus.create({
      value: props.isRoutine ?? false,
    });

    const workoutProps: WorkoutDomainProps = {
      name: nameOrError.value,
      userId: props.userId,
      privateStatus,
      routineStatus,
    };
    return right(workoutProps);
  }

  public update({
    name,
    isPrivate,
    isRoutine,
  }: WorkoutDomainUpdateParams): Either<WorkoutDomainError, this> {
    if (name) {
      const nameOrError = WorkoutName.create({ value: name });
      if (nameOrError.isLeft()) {
        return left(nameOrError.value);
      }

      this.props.name = nameOrError.value;
    }

    if (isPrivate !== undefined) {
      const privateStatus = PrivateStatus.create({ value: isPrivate });
      this.props.privateStatus = privateStatus;
    }

    if (isRoutine !== undefined) {
      const routineStatus = RoutineStatus.create({ value: isRoutine });
      this.props.routineStatus = routineStatus;
    }

    return right(this);
  }

  private static isValid(props: WorkoutDomainCreateParams): boolean {
    const hasAllRequiredProps = !!props.name && !!props.userId;

    return hasAllRequiredProps;
  }

  public static create(
    props: WorkoutDomainCreateParams,
    id?: UniqueEntityID,
  ): Either<WorkoutDomainError, WorkoutDomain> {
    const isValid = this.isValid(props);
    if (!isValid) {
      return left(
        WorkoutDomainError.create(
          WorkoutDomainError.messages.missingProps,
          HttpStatus.BAD_REQUEST,
        ),
      );
    }

    const workoutPropsMountedOrError = this.mountValueObjects(props);
    if (workoutPropsMountedOrError.isLeft()) {
      return left(workoutPropsMountedOrError.value);
    }

    const workout = new WorkoutDomain(workoutPropsMountedOrError.value, id);

    return right(workout);
  }
}
