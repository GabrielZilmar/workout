import { HttpStatus } from '@nestjs/common';
import { ExerciseTranslationDomainError } from '~/modules/exercise-translations/domain/error';
import { ValueObject } from '~/shared/domain/value-object';
import { Either, left, right } from '~/shared/either';

type ExerciseInfoProps = {
  value: string;
};

export default class ExerciseTranslationInfo extends ValueObject<ExerciseInfoProps> {
  private constructor(props: ExerciseInfoProps) {
    super(props);
  }

  get value(): string {
    return this.props.value;
  }

  private static isValid(info: string): boolean {
    return !!info;
  }

  public static create(
    props: ExerciseInfoProps,
  ): Either<ExerciseTranslationDomainError, ExerciseTranslationInfo> {
    const isValid = this.isValid(props.value);
    if (!isValid) {
      return left(
        ExerciseTranslationDomainError.create(
          ExerciseTranslationDomainError.messages.invalidInfo,
          HttpStatus.BAD_REQUEST,
        ),
      );
    }
    return right(new ExerciseTranslationInfo(props));
  }
}
