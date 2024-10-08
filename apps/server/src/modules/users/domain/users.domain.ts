import { HttpStatus } from '@nestjs/common';
import { UserDomainError } from '~/modules/users/domain/errors';
import UserCreated, {
  UserCreatedEventPayload,
} from '~/modules/users/domain/event/user-created';
import Age from '~/modules/users/domain/value-objects/age';
import DeletedAt from '~/modules/users/domain/value-objects/deleted-at';
import Email from '~/modules/users/domain/value-objects/email';
import Height from '~/modules/users/domain/value-objects/height';
import IsAdmin from '~/modules/users/domain/value-objects/is-admin';
import EmailVerification from '~/modules/users/domain/value-objects/email-verification';
import Password from '~/modules/users/domain/value-objects/password';
import Username from '~/modules/users/domain/value-objects/username';
import Weight from '~/modules/users/domain/value-objects/weight';
import { UserDto } from '~/modules/users/dto/user.dto';
import { AggregateRoot } from '~/shared/domain/aggregate-root';
import { UniqueEntityID } from '~/shared/domain/unique-entity-id';
import { Either, left, right } from '~/shared/either';
import { SimpleUserDto } from '~/modules/users/dto/simple-user.dto';

type UserDomainPasswordParams = {
  value: string;
  isHashed?: boolean;
};

export type UserDomainCreateParams = {
  username: string;
  email: string;
  password: UserDomainPasswordParams;
  age?: number;
  weight?: number;
  height?: number;
  isEmailVerified?: boolean;
  isAdmin?: boolean;
  deletedAt?: Date | null;
};

export type UserDomainUpdateParams = {
  username?: string;
  age?: number;
  weight?: number;
  height?: number;
};

export type UserDomainProps = {
  username: Username;
  email: Email;
  password: Password;
  age: Age | null;
  weight: Weight | null;
  height: Height | null;
  emailVerification: EmailVerification;
  isAdmin: IsAdmin;
  deletedAt: DeletedAt;
};

export class UserDomain extends AggregateRoot<UserDomainProps> {
  get username(): Username {
    return this.props.username;
  }

  get email(): Email {
    return this.props.email;
  }

  get password(): Password {
    return this.props.password;
  }

  get age(): Age | null {
    return this.props.age;
  }

  get weight(): Weight | null {
    return this.props.weight;
  }

  get height(): Height | null {
    return this.props.height;
  }

  get emailVerification(): EmailVerification {
    return this.props.emailVerification;
  }

  get isAdmin(): IsAdmin {
    return this.props.isAdmin;
  }
  get deletedAt(): DeletedAt {
    return this.props.deletedAt;
  }

  public toDto() {
    return UserDto.domainToDto(this);
  }

  public toSimpleDto() {
    return SimpleUserDto.domainToDto(this);
  }

  public async update({
    username,
    age,
    weight,
    height,
  }: UserDomainUpdateParams): Promise<Either<UserDomainError, this>> {
    if (username) {
      const usernameOrError = Username.create({ value: username });
      if (usernameOrError.isLeft()) {
        return left(usernameOrError.value);
      }

      this.props.username = usernameOrError.value;
    }

    if (age) {
      const ageOrError = Age.create({ value: age });
      if (ageOrError.isLeft()) {
        return left(ageOrError.value);
      }

      this.props.age = ageOrError.value;
    }

    if (weight) {
      const weightOrError = Weight.create({ value: weight });
      if (weightOrError.isLeft()) {
        return left(weightOrError.value);
      }

      this.props.weight = weightOrError.value;
    }

    if (height) {
      const heightOrError = Height.create({ value: height });
      if (heightOrError.isLeft()) {
        return left(heightOrError.value);
      }

      this.props.height = heightOrError.value;
    }

    return right(this);
  }

  public async changePassword(
    params: UserDomainPasswordParams,
  ): Promise<Either<UserDomainError, this>> {
    const passwordOrError = await Password.create(params);
    if (passwordOrError.isLeft()) {
      return left(passwordOrError.value);
    }

    this.props.password = passwordOrError.value;
    return right(this);
  }

  public delete(date?: Date): this {
    const deletedAt = DeletedAt.create({ value: date ?? new Date() });
    this.props.deletedAt = deletedAt;

    return this;
  }

  private static async mountValueObjects(
    valueObjects: UserDomainCreateParams,
  ): Promise<Either<UserDomainError, UserDomainProps>> {
    const usernameOrError = Username.create({ value: valueObjects.username });
    if (usernameOrError.isLeft()) {
      return left(usernameOrError.value);
    }

    const emailOrError = Email.create({ value: valueObjects.email });
    if (emailOrError.isLeft()) {
      return left(emailOrError.value);
    }

    const passwordOrError = await Password.create(valueObjects.password);
    if (passwordOrError.isLeft()) {
      return left(passwordOrError.value);
    }

    const emailVerification = EmailVerification.create({
      value: valueObjects.isEmailVerified ?? false,
    });
    const isAdmin = IsAdmin.create({
      value: valueObjects.isAdmin ?? false,
    });
    const deletedAt = DeletedAt.create({
      value: valueObjects.deletedAt ?? null,
    });

    const userProps: UserDomainProps = {
      username: usernameOrError.value,
      email: emailOrError.value,
      password: passwordOrError.value,
      age: null,
      weight: null,
      height: null,
      emailVerification,
      isAdmin,
      deletedAt,
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
    const hasAllRequiredProps =
      !!props.username && !!props.email && !!props.password;

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
