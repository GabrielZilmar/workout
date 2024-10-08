import { HttpStatus } from '@nestjs/common';
import { SetDomainError } from '~/modules/set/domain/errors';
import NumDrops from '~/modules/set/domain/value-objects/num-drops';
import NumReps from '~/modules/set/domain/value-objects/num-reps';
import SetWeight from '~/modules/set/domain/value-objects/set-weight';
import { SetDto } from '~/modules/set/dto/set.dto';
import { AggregateRoot } from '~/shared/domain/aggregate-root';
import { UniqueEntityID } from '~/shared/domain/unique-entity-id';
import SetOrder from '~/shared/domain/value-objects/order';
import { Either, left, right } from '~/shared/either';

export type SetDomainProps = {
  workoutExerciseId: string;
  order: SetOrder;
  numReps: NumReps;
  setWeight: SetWeight;
  numDrops: NumDrops;
};

export type SetDomainCreateParams = {
  workoutExerciseId: string;
  order?: number | null;
  numReps?: number;
  setWeight?: number;
  numDrops?: number;
};

export type SetDomainUpdateParams = Partial<SetDomainCreateParams>;

export default class SetDomain extends AggregateRoot<SetDomainProps> {
  get workoutExerciseId(): string {
    return this.props.workoutExerciseId;
  }

  get order(): SetOrder {
    return this.props.order;
  }

  get numReps(): NumReps {
    return this.props.numReps;
  }

  get setWeight(): SetWeight {
    return this.props.setWeight;
  }

  get numDrops(): NumDrops {
    return this.props.numDrops;
  }

  public toDto() {
    return SetDto.domainToDto(this);
  }

  public update({
    order,
    numReps,
    setWeight,
    numDrops,
  }: SetDomainUpdateParams): Either<SetDomainError, SetDomain> {
    if (order !== undefined) {
      const orderOrError = SetOrder.create({ value: order });
      if (orderOrError.isLeft()) {
        return left(orderOrError.value);
      }
      this.props.order = orderOrError.value;
    }

    if (numReps) {
      const numRepsOrError = NumReps.create({ value: numReps });
      if (numRepsOrError.isLeft()) {
        return left(numRepsOrError.value);
      }
      this.props.numReps = numRepsOrError.value;
    }

    if (setWeight) {
      const setWeightOrError = SetWeight.create({ value: setWeight });
      if (setWeightOrError.isLeft()) {
        return left(setWeightOrError.value);
      }

      this.props.setWeight = setWeightOrError.value;
    }

    if (numDrops) {
      const numDropsOrError = NumDrops.create({ value: numDrops });
      if (numDropsOrError.isLeft()) {
        return left(numDropsOrError.value);
      }

      this.props.numDrops = numDropsOrError.value;
    }

    return right(this);
  }

  private static mountValueObjects({
    order = null,
    ...props
  }: SetDomainCreateParams): Either<SetDomainError, SetDomainProps> {
    const orderOrError = SetOrder.create({ value: order });

    if (orderOrError && orderOrError.isLeft()) {
      return left(orderOrError.value);
    }

    const numRepsOrError = NumReps.create({ value: props.numReps ?? 0 });
    if (numRepsOrError.isLeft()) {
      return left(numRepsOrError.value);
    }

    const setWeightOrError = SetWeight.create({
      value: props.setWeight ?? 0,
    });
    if (setWeightOrError.isLeft()) {
      return left(setWeightOrError.value);
    }

    const numDropsOrError = NumDrops.create({ value: props.numDrops ?? 0 });
    if (numDropsOrError.isLeft()) {
      return left(numDropsOrError.value);
    }

    const setDomainProps: SetDomainProps = {
      order: orderOrError.value,
      workoutExerciseId: props.workoutExerciseId,
      numReps: numRepsOrError.value,
      setWeight: setWeightOrError.value,
      numDrops: numDropsOrError.value,
    };
    return right(setDomainProps);
  }

  private static isValid({
    workoutExerciseId,
  }: SetDomainCreateParams): boolean {
    return !!workoutExerciseId;
  }

  public static create(
    props: SetDomainCreateParams,
    id?: UniqueEntityID,
  ): Either<SetDomainError, SetDomain> {
    if (!SetDomain.isValid(props)) {
      return left(
        SetDomainError.create(
          SetDomainError.messages.missingProps,
          HttpStatus.BAD_REQUEST,
        ),
      );
    }

    const valueObjectsOrError = this.mountValueObjects(props);
    if (valueObjectsOrError.isLeft()) {
      return left(valueObjectsOrError.value);
    }

    const setDomain = new SetDomain(valueObjectsOrError.value, id);
    return right(setDomain);
  }
}
