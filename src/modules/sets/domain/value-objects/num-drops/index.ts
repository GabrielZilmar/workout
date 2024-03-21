import { HttpStatus } from '@nestjs/common';
import { SetsDomainError } from '~/modules/sets/domain/errors';
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

  public static create(
    props: NumDropsProps,
  ): Either<SetsDomainError, NumDrops> {
    const isValid = this.isValid(props.value);
    if (!isValid) {
      return left(
        SetsDomainError.create(
          SetsDomainError.messages.invalidNumDrops,
          HttpStatus.BAD_REQUEST,
        ),
      );
    }

    return right(new NumDrops(props));
  }
}
