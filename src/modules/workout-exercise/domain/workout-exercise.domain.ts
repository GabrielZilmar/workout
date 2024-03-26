import { HttpStatus } from '@nestjs/common';
import ExerciseDomain from '~/modules/exercise/domain/exercise.domain';
import { WorkoutExerciseDomainError } from '~/modules/workout-exercise/domain/errors';
import WorkoutExerciseOrder from '~/modules/workout-exercise/domain/value-objects/order';
import { WorkoutExerciseDto } from '~/modules/workout-exercise/dto/workout-exercise.dto';
import { WorkoutDomainError } from '~/modules/workout/domain/errors';
import WorkoutDomain from '~/modules/workout/domain/workout.domain';
import { AggregateRoot } from '~/shared/domain/aggregate-root';
import { UniqueEntityID } from '~/shared/domain/unique-entity-id';
import { Either, left, right } from '~/shared/either';

export type WorkoutExerciseDomainProps = {
  workoutId: string;
  exerciseId: string;
  order: WorkoutExerciseOrder;
  workoutDomain?: WorkoutDomain;
  exerciseDomain?: ExerciseDomain;
};

export type WorkoutExerciseDomainCreateParams = {
  workoutId: string;
  exerciseId: string;
  order: number | null;
  workoutDomain?: WorkoutDomain;
  exerciseDomain?: ExerciseDomain;
};

export type WorkoutExerciseDomainUpdateParams =
  Partial<WorkoutExerciseDomainCreateParams>;

export default class WorkoutExerciseDomain extends AggregateRoot<WorkoutExerciseDomainProps> {
  get workoutId(): string {
    return this.props.workoutId;
  }

  get exerciseId(): string {
    return this.props.exerciseId;
  }

  get order(): WorkoutExerciseOrder {
    return this.props.order;
  }

  get workoutDomain(): WorkoutDomain | undefined {
    return this.props.workoutDomain;
  }

  get exerciseDomain(): ExerciseDomain | undefined {
    return this.props.exerciseDomain;
  }

  public toDto() {
    return WorkoutExerciseDto.domainToDto(this);
  }

  public update({
    workoutId,
    exerciseId,
    order,
  }: WorkoutExerciseDomainUpdateParams): Either<
    WorkoutExerciseDomainError,
    WorkoutExerciseDomain
  > {
    if (order !== undefined) {
      const orderOrError = WorkoutExerciseOrder.create({ value: order });
      if (orderOrError.isLeft()) {
        return left(orderOrError.value);
      }
      this.props.order = orderOrError.value;
    }

    if (workoutId) {
      this.props.workoutId = workoutId;
    }

    if (exerciseId) {
      this.props.exerciseId = exerciseId;
    }

    return right(this);
  }

  private static mountValueObjects({
    workoutId,
    exerciseId,
    order = null,
    workoutDomain,
    exerciseDomain,
  }: WorkoutExerciseDomainCreateParams): Either<
    WorkoutDomainError,
    WorkoutExerciseDomainProps
  > {
    const orderOrError = WorkoutExerciseOrder.create({ value: order });

    if (orderOrError && orderOrError.isLeft()) {
      return left(orderOrError.value);
    }

    const workoutExerciseProps: WorkoutExerciseDomainProps = {
      order: orderOrError.value,
      workoutId,
      exerciseId,
      workoutDomain,
      exerciseDomain,
    };
    return right(workoutExerciseProps);
  }

  private static isValid({
    workoutId,
    exerciseId,
  }: WorkoutExerciseDomainCreateParams): boolean {
    return !!workoutId && !!exerciseId;
  }

  public static create(
    props: WorkoutExerciseDomainCreateParams,
    id?: UniqueEntityID,
  ): Either<WorkoutExerciseDomainError, WorkoutExerciseDomain> {
    const isValid = this.isValid(props);
    if (!isValid) {
      return left(
        WorkoutExerciseDomainError.create(
          WorkoutExerciseDomainError.messages.missingProps,
          HttpStatus.BAD_REQUEST,
        ),
      );
    }

    const valueObjectsOrError = this.mountValueObjects(props);
    if (valueObjectsOrError.isLeft()) {
      return left(valueObjectsOrError.value);
    }

    const workoutExerciseDomain = new WorkoutExerciseDomain(
      valueObjectsOrError.value,
      id,
    );
    return right(workoutExerciseDomain);
  }
}
