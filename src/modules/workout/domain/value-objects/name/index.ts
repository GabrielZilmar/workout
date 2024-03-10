import { HttpStatus } from '@nestjs/common';
import { WorkoutDomainError } from '~/modules/workout/domain/errors';
import { ValueObject } from '~/shared/domain/value-object';
import { Either, left, right } from '~/shared/either';

export type WorkoutNameProps = {
  value: string;
};

export default class WorkoutName extends ValueObject<WorkoutNameProps> {
  private constructor(props: WorkoutNameProps) {
    super(props);
  }

  get value(): string {
    return this.props.value;
  }

  private static isValid(name: string): boolean {
    return !!name;
  }

  public static create(
    props: WorkoutNameProps,
  ): Either<WorkoutDomainError, WorkoutName> {
    const isValid = this.isValid(props.value);
    if (!isValid) {
      return left(
        WorkoutDomainError.create(
          WorkoutDomainError.messages.emptyWorkoutName,
          HttpStatus.BAD_REQUEST,
        ),
      );
    }

    return right(new WorkoutName(props));
  }
}
