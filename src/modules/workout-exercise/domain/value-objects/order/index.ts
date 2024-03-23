import { HttpStatus } from '@nestjs/common';
import { WorkoutExerciseDomainError } from '~/modules/workout-exercise/domain/errors';
import { Either, left, right } from '~/shared/either';

export type OrderProps = {
  value: number;
};

export default class WorkoutExerciseOrder {
  private constructor(private props: OrderProps) {}

  get value(): number {
    return this.props.value;
  }

  private static isValid(order: number): boolean {
    return order >= 0;
  }

  public static create(
    props: OrderProps,
  ): Either<WorkoutExerciseDomainError, WorkoutExerciseOrder> {
    const isValid = this.isValid(props.value);
    if (!isValid) {
      return left(
        WorkoutExerciseDomainError.create(
          WorkoutExerciseDomainError.messages.invalidOrder,
          HttpStatus.BAD_REQUEST,
        ),
      );
    }

    return right(new WorkoutExerciseOrder(props));
  }
}
