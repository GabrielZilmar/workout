import { HttpStatus } from '@nestjs/common';
import { SetDomainError } from '~/modules/set/domain/errors';
import { Either, left, right } from '~/shared/either';

export type NumDropsProps = {
  value: number;
};

export default class NumDrops {
  private constructor(private props: NumDropsProps) {}

  get value(): number {
    return this.props.value;
  }

  private static isValid(numDrops: number): boolean {
    return numDrops >= 0;
  }

  public static create(props: NumDropsProps): Either<SetDomainError, NumDrops> {
    const isValid = this.isValid(props.value);
    if (!isValid) {
      return left(
        SetDomainError.create(
          SetDomainError.messages.invalidNumDrops,
          HttpStatus.BAD_REQUEST,
        ),
      );
    }

    return right(new NumDrops(props));
  }
}
