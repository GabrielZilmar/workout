import { HttpStatus } from '@nestjs/common';
import { WorkoutExerciseDomainError } from '~/modules/workout-exercise/domain/errors';
import WorkoutExerciseOrder from '~/modules/workout-exercise/domain/value-objects/order';
import { WorkoutDomainError } from '~/modules/workout/domain/errors';
import { AggregateRoot } from '~/shared/domain/aggregate-root';
import { UniqueEntityID } from '~/shared/domain/unique-entity-id';
import { Either, left, right } from '~/shared/either';

export type WorkoutExerciseDomainProps = {
  workoutId: string;
  exerciseId: string;
  order: WorkoutExerciseOrder | null;
};

export type WorkoutExerciseDomainCreateParams = {
  workoutId: string;
  exerciseId: string;
  order?: number | null;
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

  get order(): WorkoutExerciseOrder | null {
    return this.props.order;
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
