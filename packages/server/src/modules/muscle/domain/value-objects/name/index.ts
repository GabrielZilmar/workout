import { HttpStatus } from '@nestjs/common';
import { MuscleDomainError } from '~/modules/muscle/domain/errors';
import { ValueObject } from '~/shared/domain/value-object';
import { Either, left, right } from '~/shared/either';
import UtilFormatter from '~/shared/utils/formatter';

export const MIN_MUSCLE_NAME_LENGTH = 3;

type MuscleNameProps = {
  value: string;
};

export default class MuscleName extends ValueObject<MuscleNameProps> {
  private constructor(props: MuscleNameProps) {
    super(props);
  }

  get value(): string {
    return this.props.value;
  }

  private static isValid(muscle: string): boolean {
    return muscle.length >= MIN_MUSCLE_NAME_LENGTH;
  }

  public static create(
    props: MuscleNameProps,
  ): Either<MuscleDomainError, MuscleName> {
    const isValid = this.isValid(props.value);
    if (!isValid) {
      return left(
        MuscleDomainError.create(
          MuscleDomainError.messages.invalidMuscleName,
          HttpStatus.BAD_REQUEST,
        ),
      );
    }

    props.value = UtilFormatter.capitalize(props.value);
    return right(new MuscleName(props));
  }
}
