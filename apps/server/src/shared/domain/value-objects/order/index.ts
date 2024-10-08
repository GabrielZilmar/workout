import { HttpStatus } from '@nestjs/common';
import { SharedValueObjectError } from '~/shared/domain/value-objects/errors';
import { Either, left, right } from '~/shared/either';

export type OrderProps = {
  value: number | null;
};

export default class Order {
  private constructor(private props: OrderProps) {}

  get value(): number | null {
    return this.props.value;
  }

  private static isValid(order: number | null): boolean {
    return order === null || order >= 0;
  }

  public static create(
    props: OrderProps,
  ): Either<SharedValueObjectError, Order> {
    const isValid = this.isValid(props.value);
    if (!isValid) {
      return left(
        SharedValueObjectError.create(
          SharedValueObjectError.messages.invalidOrder,
          HttpStatus.BAD_REQUEST,
        ),
      );
    }

    return right(new Order(props));
  }
}
