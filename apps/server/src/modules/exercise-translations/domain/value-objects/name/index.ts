import { HttpStatus } from '@nestjs/common';
import { ExerciseTranslationDomainError } from '~/modules/exercise-translations/domain/error';
import { ValueObject } from '~/shared/domain/value-object';
import { Either, left, right } from '~/shared/either';
import UtilFormatter from '~/shared/utils/formatter';

export const MIN_EXERCISE_TRANSLATION_NAME_LENGTH = 3;

type ExerciseTranslationProps = {
  value: string;
};

export default class ExerciseTranslationName extends ValueObject<ExerciseTranslationProps> {
  private constructor(props: ExerciseTranslationProps) {
    super(props);
  }

  get value(): string {
    return this.props.value;
  }

  private static isValid(name: string): boolean {
    return name.length >= MIN_EXERCISE_TRANSLATION_NAME_LENGTH;
  }

  public static create(
    props: ExerciseTranslationProps,
  ): Either<ExerciseTranslationDomainError, ExerciseTranslationName> {
    const isValid = this.isValid(props.value);
    if (!isValid) {
      return left(
        ExerciseTranslationDomainError.create(
          ExerciseTranslationDomainError.messages.invalidName,
          HttpStatus.BAD_REQUEST,
        ),
      );
    }
    props.value = UtilFormatter.capitalize(props.value);
    return right(new ExerciseTranslationName(props));
  }
}
