import { HttpStatus } from '@nestjs/common';
import { ValueObject } from '~/shared/domain/value-object';
import { SharedValueObjectError } from '~/shared/domain/value-objects/errors';
import { Either, left, right } from '~/shared/either';

export type CreatedAtValueType = Date | string;

type CreatedAtProps = {
  value: CreatedAtValueType;
};

export default class CreatedAt extends ValueObject<CreatedAtProps> {
  private constructor(props: CreatedAtProps) {
    super(props);
  }

  get value(): CreatedAtValueType {
    return this.props.value;
  }

  private static isValid(createdAt: CreatedAtValueType): boolean {
    if (!createdAt) {
      return false;
    }

    const parsedDate =
      typeof createdAt === 'string' ? new Date(createdAt) : createdAt;
    return parsedDate instanceof Date && !isNaN(parsedDate.getTime());
  }

  public getDateValue(): Date {
    const value = this.props.value;
    return typeof value === 'string' ? new Date(value) : value;
  }

  public static create(
    props: CreatedAtProps,
  ): Either<SharedValueObjectError, CreatedAt> {
    const isValid = this.isValid(props.value);
    if (!isValid) {
      return left(
        SharedValueObjectError.create(
          SharedValueObjectError.messages.invalidCreatedAt,
          HttpStatus.BAD_REQUEST,
        ),
      );
    }

    return right(new CreatedAt(props));
  }
}
