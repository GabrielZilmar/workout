import { HttpStatus } from '@nestjs/common';
import { SetsDomainError } from '~/modules/sets/domain/errors';
import NumDrops from '~/modules/sets/domain/value-objects/num-drops';
import NumReps from '~/modules/sets/domain/value-objects/num-reps';
import SetsWeight from '~/modules/sets/domain/value-objects/sets-weight';
import { AggregateRoot } from '~/shared/domain/aggregate-root';
import { UniqueEntityID } from '~/shared/domain/unique-entity-id';
import { Either, left, right } from '~/shared/either';

export type SetsDomainProps = {
  workoutExerciseId: string;
  numReps: NumReps;
  setsWeight: SetsWeight;
  numDrops: NumDrops;
};

export type SetsDomainCreateParams = {
  workoutExerciseId: string;
  numReps?: number;
  setsWeight?: number;
  numDrops?: number;
};

export type SetDomainUpdateParams = Partial<SetsDomainCreateParams>;

export default class SetsDomain extends AggregateRoot<SetsDomainProps> {
  get workoutExerciseId(): string {
    return this.props.workoutExerciseId;
  }

  get numReps(): NumReps {
    return this.props.numReps;
  }

  get setsWeight(): SetsWeight {
    return this.props.setsWeight;
  }

  get numDrops(): NumDrops {
    return this.props.numDrops;
  }

  public update({
    numReps,
    setsWeight,
    numDrops,
  }: SetDomainUpdateParams): Either<SetsDomainError, SetsDomain> {
    if (numReps) {
      const numRepsOrError = NumReps.create({ value: numReps });
      if (numRepsOrError.isLeft()) {
        return left(numRepsOrError.value);
      }
      this.props.numReps = numRepsOrError.value;
    }

    if (setsWeight) {
      const setsWeightOrError = SetsWeight.create({ value: setsWeight });
      if (setsWeightOrError.isLeft()) {
        return left(setsWeightOrError.value);
      }

      this.props.setsWeight = setsWeightOrError.value;
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

  private static mountValueObjects(
    props: SetsDomainCreateParams,
  ): Either<SetsDomainError, SetsDomainProps> {
    const numRepsOrError = NumReps.create({ value: props.numReps ?? 0 });
    if (numRepsOrError.isLeft()) {
      return left(numRepsOrError.value);
    }

    const setsWeightOrError = SetsWeight.create({
      value: props.setsWeight ?? 0,
    });
    if (setsWeightOrError.isLeft()) {
      return left(setsWeightOrError.value);
    }

    const numDropsOrError = NumDrops.create({ value: props.numDrops ?? 0 });
    if (numDropsOrError.isLeft()) {
      return left(numDropsOrError.value);
    }

    const setsDomainProps: SetsDomainProps = {
      workoutExerciseId: props.workoutExerciseId,
      numReps: numRepsOrError.value,
      setsWeight: setsWeightOrError.value,
      numDrops: numDropsOrError.value,
    };
    return right(setsDomainProps);
  }

  private static isValid({
    workoutExerciseId,
  }: SetsDomainCreateParams): boolean {
    return !!workoutExerciseId;
  }

  public static create(
    props: SetsDomainCreateParams,
    id?: UniqueEntityID,
  ): Either<SetsDomainError, SetsDomain> {
    if (!SetsDomain.isValid(props)) {
      return left(
        SetsDomainError.create(
          SetsDomainError.messages.invalidSetsWeight,
          HttpStatus.BAD_REQUEST,
        ),
      );
    }

    const valueObjectsOrError = this.mountValueObjects(props);
    if (valueObjectsOrError.isLeft()) {
      return left(valueObjectsOrError.value);
    }

    const setsDomain = new SetsDomain(valueObjectsOrError.value, id);
    return right(setsDomain);
  }
}
