import { MuscleDomainError } from '~/modules/muscle/domain/errors';
import MuscleName from '~/modules/muscle/domain/value-objects/name';
import { AggregateRoot } from '~/shared/domain/aggregate-root';
import { UniqueEntityID } from '~/shared/domain/unique-entity-id';
import { Either, left, right } from '~/shared/either';

export type MuscleDomainProps = {
  name: MuscleName;
};

export type MuscleDomainCreateParams = {
  name: string;
};

export type MuscleDomainUpdateParams = Partial<MuscleDomainCreateParams>;

export default class MuscleDomain extends AggregateRoot<MuscleDomainProps> {
  get name(): MuscleName {
    return this.props.name;
  }

  private static mountValueObjects(
    props: MuscleDomainCreateParams,
  ): Either<MuscleDomainError, MuscleDomainProps> {
    const nameValueObject = MuscleName.create({ value: props.name });
    if (nameValueObject.isLeft()) {
      return left(nameValueObject.value);
    }

    const muscleDomainProps = {
      name: nameValueObject.value,
    };
    return right(muscleDomainProps);
  }

  private static isValid({ name }: MuscleDomainCreateParams): boolean {
    return !!name;
  }

  public static create(
    props: MuscleDomainCreateParams,
    id?: UniqueEntityID,
  ): Either<MuscleDomainError, MuscleDomain> {
    const isValid = this.isValid(props);
    if (!isValid) {
      return left(
        MuscleDomainError.create(MuscleDomainError.messages.missingProps),
      );
    }

    const valueObjects = this.mountValueObjects(props);
    if (valueObjects.isLeft()) {
      return left(valueObjects.value);
    }

    const muscle = new MuscleDomain(valueObjects.value, id);
    return right(muscle);
  }
}
