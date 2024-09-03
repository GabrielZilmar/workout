import { HttpStatus } from '@nestjs/common';
import { ExerciseDomainError } from '~/modules/exercise/domain/errors';
import { ValueObject } from '~/shared/domain/value-object';
import { Either, left, right } from '~/shared/either';

type ExerciseTutorialUrlProps = {
  value: string;
};

export default class ExerciseTutorialUrl extends ValueObject<ExerciseTutorialUrlProps> {
  private constructor(props: ExerciseTutorialUrlProps) {
    super(props);
  }

  get value(): string {
    return this.props.value;
  }

  private static isValid(url: string): boolean {
    const expression =
      /^(https?|ftp):\/\/(([a-z\d]([a-z\d-]*[a-z\d])?\.)+[a-z]{2,}|localhost)(\/[-a-z\d%_.~+]*)*(\?[;&a-z\d%_.~+=-]*)?(\#[-a-z\d_]*)?$/i;
    const regex = new RegExp(expression);

    return !!url.match(regex);
  }

  public static create(
    props: ExerciseTutorialUrlProps,
  ): Either<ExerciseDomainError, ExerciseTutorialUrl> {
    const isValid = this.isValid(props.value);
    if (!isValid) {
      return left(
        ExerciseDomainError.create(
          ExerciseDomainError.messages.invalidTutorialUrl,
          HttpStatus.BAD_REQUEST,
        ),
      );
    }

    return right(new ExerciseTutorialUrl(props));
  }
}
