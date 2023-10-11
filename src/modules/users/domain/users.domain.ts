import { HttpStatus } from '@nestjs/common';
import { UserDomainError } from '~/modules/users/domain/errors';
import UserCreated, {
  UserCreatedEventPayload,
} from '~/modules/users/domain/event/user-created';
import Age from '~/modules/users/domain/value-objects/age';
import Height from '~/modules/users/domain/value-objects/height';
import SSOId from '~/modules/users/domain/value-objects/sso-id';
import Username from '~/modules/users/domain/value-objects/username';
import Weight from '~/modules/users/domain/value-objects/weight';
import { AggregateRoot } from '~/shared/domain/aggregate-root';
import { UniqueEntityID } from '~/shared/domain/unique-entity-id';
import { Either, left, right } from '~/shared/either';

export type UserDomainCreateParams = {
  ssoId: string;
  username: string;
  age?: number;
  weight?: number;
  height?: number;
};

export type UserDomainProps = {
  ssoId: SSOId;
  username: Username;
  age?: Age;
  weight?: Weight;
  height?: Height;
};

export class UserDomain extends AggregateRoot<UserDomainProps> {
  constructor(props: UserDomainProps, id?: UniqueEntityID) {
    super(props, id);
  }

  get ssoId(): SSOId {
    return this.props.ssoId;
  }

  get username(): Username {
    return this.props.username;
  }

  get age(): Age | undefined {
    return this.props.age;
  }

  get weight(): Weight | undefined {
    return this.props.weight;
  }

  get height(): Height | undefined {
    return this.props.height;
  }

  private static async mountValueObjects(
    valueObjects: UserDomainCreateParams,
  ): Promise<Either<UserDomainError, UserDomainProps>> {
    const ssoIdOrError = await SSOId.create({ value: valueObjects.ssoId });
    if (ssoIdOrError.isLeft()) {
      return left(ssoIdOrError.value);
    }

    const usernameOrError = Username.create({ value: valueObjects.username });
    if (usernameOrError.isLeft()) {
      return left(usernameOrError.value);
    }

    const userProps: UserDomainProps = {
      ssoId: ssoIdOrError.value,
      username: usernameOrError.value,
    };

    if (valueObjects.age) {
      const ageOrError = Age.create({ value: valueObjects.age });
      if (ageOrError.isLeft()) {
        return left(ageOrError.value);
      }

      userProps.age = ageOrError.value;
    }

    if (valueObjects.weight) {
      const weightOrError = Weight.create({ value: valueObjects.weight });
      if (weightOrError.isLeft()) {
        return left(weightOrError.value);
      }

      userProps.weight = weightOrError.value;
    }

    if (valueObjects.height) {
      const heightOrError = Height.create({ value: valueObjects.height });
      if (heightOrError.isLeft()) {
        return left(heightOrError.value);
      }

      userProps.height = heightOrError.value;
    }

    return right(userProps);
  }

  private static isValid(props: UserDomainCreateParams): boolean {
    const hasAllRequiredProps = !!props.ssoId && !!props.username;

    return hasAllRequiredProps;
  }

  public static async create(
    props: UserDomainCreateParams,
    id?: UniqueEntityID,
  ): Promise<Either<UserDomainError, UserDomain>> {
    const isValid = this.isValid(props);
    if (!isValid) {
      return left(
        UserDomainError.create(
          UserDomainError.messages.missingProps,
          HttpStatus.BAD_REQUEST,
        ),
      );
    }

    const userPropsMounted = await this.mountValueObjects(props);
    if (userPropsMounted.isLeft()) {
      return left(userPropsMounted.value);
    }
    const user = new UserDomain(userPropsMounted.value, id);

    const isNewUser = !id;
    if (isNewUser) {
      const eventPayload: UserCreatedEventPayload = { user };
      await user.emitEvent(UserCreated.eventName, eventPayload);
    }

    return right(user);
  }
}
