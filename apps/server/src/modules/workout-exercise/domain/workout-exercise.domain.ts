import { HttpStatus } from '@nestjs/common';
import ExerciseDomain from '~/modules/exercise/domain/exercise.domain';
import { SetDto } from '~/modules/set/dto/set.dto';
import { WorkoutExerciseDomainError } from '~/modules/workout-exercise/domain/errors';
import WorkoutExerciseOrder from '~/shared/domain/value-objects/order';
import { WorkoutExerciseDetailsDto } from '~/modules/workout-exercise/dto/workout-exercise-details.dto';
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
  setDtos?: SetDto[];
};

export type WorkoutExerciseDomainCreateParams = {
  workoutId: string;
  exerciseId: string;
  order: number | null;
  workoutDomain?: WorkoutDomain;
  exerciseDomain?: ExerciseDomain;
  setDtos?: SetDto[];
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

  get setDtos(): SetDto[] {
    return this.props.setDtos || [];
  }

  public toDto() {
    return WorkoutExerciseDto.domainToDto(this);
  }

  public toDetailsDto() {
    return WorkoutExerciseDetailsDto.domainToDto(this);
  }

  public update({
    workoutId,
    exerciseId,
    order,
    workoutDomain,
    exerciseDomain,
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

    if (workoutDomain?.id?.toValue()) {
      if (workoutId && workoutId !== workoutDomain.id.toValue()) {
        return left(
          WorkoutExerciseDomainError.create(
            WorkoutExerciseDomainError.messages
              .workoutDomainAndWorkoutIdDoNotMatch,
            HttpStatus.BAD_REQUEST,
          ),
        );
      }

      this.props.workoutDomain = workoutDomain;
      this.props.workoutId = workoutDomain.id.toValue();
    }
    if (workoutId) {
      this.props.workoutId = workoutId;
      if (!workoutDomain && this.workoutDomain?.id?.toValue() !== workoutId) {
        this.props.workoutDomain = undefined;
      }
    }

    if (exerciseDomain?.id?.toValue()) {
      if (exerciseId && exerciseId !== exerciseDomain.id.toValue()) {
        return left(
          WorkoutExerciseDomainError.create(
            WorkoutExerciseDomainError.messages
              .exerciseDomainAndExerciseIdDoNotMatch,
            HttpStatus.BAD_REQUEST,
          ),
        );
      }

      this.props.exerciseDomain = exerciseDomain;
      this.props.exerciseId = exerciseDomain.id.toValue();
    }
    if (exerciseId) {
      this.props.exerciseId = exerciseId;

      if (
        !exerciseDomain &&
        this.exerciseDomain?.id?.toValue() !== exerciseId
      ) {
        this.props.exerciseDomain = undefined;
      }
    }

    return right(this);
  }

  private static mountValueObjects({
    workoutId,
    exerciseId,
    order = null,
    workoutDomain,
    exerciseDomain,
    setDtos = [],
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
      setDtos,
    };
    return right(workoutExerciseProps);
  }

  private static isValid({
    workoutId,
    exerciseId,
    workoutDomain,
    exerciseDomain,
  }: WorkoutExerciseDomainCreateParams): Either<
    WorkoutExerciseDomainError,
    boolean
  > {
    if (workoutDomain && workoutDomain.id?.toValue() !== workoutId) {
      return left(
        WorkoutExerciseDomainError.create(
          WorkoutExerciseDomainError.messages
            .workoutDomainAndWorkoutIdDoNotMatch,
          HttpStatus.BAD_REQUEST,
        ),
      );
    }

    if (exerciseDomain && exerciseDomain.id?.toValue() !== exerciseId) {
      return left(
        WorkoutExerciseDomainError.create(
          WorkoutExerciseDomainError.messages
            .exerciseDomainAndExerciseIdDoNotMatch,
          HttpStatus.BAD_REQUEST,
        ),
      );
    }

    const isMissingProps = !workoutId && !exerciseId;
    if (isMissingProps) {
      return left(
        WorkoutExerciseDomainError.create(
          WorkoutExerciseDomainError.messages.missingProps,
          HttpStatus.BAD_REQUEST,
        ),
      );
    }

    return right(true);
  }

  public static create(
    props: WorkoutExerciseDomainCreateParams,
    id?: UniqueEntityID,
  ): Either<WorkoutExerciseDomainError, WorkoutExerciseDomain> {
    const isValid = this.isValid(props);
    if (isValid.isLeft()) {
      return left(isValid.value);
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
