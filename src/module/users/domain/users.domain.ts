import { UserDomainError } from '~/module/users/domain/errors';
import UserCreated, {
  UserCreatedEventPayload,
} from '~/module/users/domain/event/user-created';
import Age from '~/module/users/domain/value-objects/age';
import Height from '~/module/users/domain/value-objects/height';
import SSOId from '~/module/users/domain/value-objects/sso-id';
import Username from '~/module/users/domain/value-objects/username';
import Weight from '~/module/users/domain/value-objects/weight';
import { AggregateRoot } from '~/shared/domain/aggregate-root';
import { UniqueEntityID } from '~/shared/domain/unique-entity-id';
import { Either, left, right } from '~/shared/either';

export type UserDomainProps = {
  ssoId: SSOId;
  userName: Username;
  age: Age;
  weight: Weight;
  height: Height;
};

export class UserDomain extends AggregateRoot<UserDomainProps> {
  constructor(props: UserDomainProps, id?: UniqueEntityID) {
    super(props, id);
  }

  get ssoId(): SSOId {
    return this.props.ssoId;
  }

  get userName(): Username {
    return this.props.userName;
  }

  get age(): Age {
    return this.props.age;
  }

  get weight(): Weight {
    return this.props.weight;
  }

  get height(): Height {
    return this.props.height;
  }

  private static isValid(props: UserDomainProps): boolean {
    const hasAllProps = Object.values(props).every((prop) => !!prop);
    if (!hasAllProps) {
      return false;
    }

    return (
      props.ssoId instanceof SSOId &&
      props.userName instanceof Username &&
      props.age instanceof Age &&
      props.weight instanceof Weight &&
      props.height instanceof Height
    );
  }

  public static async create(
    props: UserDomainProps,
    id?: UniqueEntityID,
  ): Promise<Either<UserDomainError, UserDomain>> {
    const isValid = this.isValid(props);
    if (!isValid) {
      return left(
        UserDomainError.create(UserDomainError.messages.missingProps),
      );
    }

    const user = new UserDomain(props, id);

    const isNewUser = !id;
    if (isNewUser) {
      const eventPayload: UserCreatedEventPayload = { user };
      await user.emitEvent(UserCreated.eventName, eventPayload);
    }

    return right(user);
  }
}
