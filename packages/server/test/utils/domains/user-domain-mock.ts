import { GenericCreateDomainParams } from 'test/utils/types/domain';
import { v4 as uuid } from 'uuid';
import {
  UserDomain,
  UserDomainCreateParams,
  UserDomainProps,
} from '~/modules/users/domain/users.domain';
import Age from '~/modules/users/domain/value-objects/age';
import DeletedAt from '~/modules/users/domain/value-objects/deleted-at';
import Email from '~/modules/users/domain/value-objects/email';
import Height from '~/modules/users/domain/value-objects/height';
import IsAdmin from '~/modules/users/domain/value-objects/is-admin';
import EmailVerification from '~/modules/users/domain/value-objects/email-verification';
import Password from '~/modules/users/domain/value-objects/password';
import Username from '~/modules/users/domain/value-objects/username';
import Weight from '~/modules/users/domain/value-objects/weight';
import { User } from '~/modules/users/entities/user.entity';
import { UniqueEntityID } from '~/shared/domain/unique-entity-id';

type MountUserDomainParams = Partial<UserDomainCreateParams> &
  GenericCreateDomainParams;

export class UserDomainMock {
  public static userMockParams: Required<User> = {
    id: uuid(),
    username: 'User Test 1',
    email: 'username1@email.com',
    password: 'v#$6D=W9',
    isEmailVerified: false,
    isAdmin: false,
    age: 21,
    weight: 80,
    height: 181,
    deletedAt: null,
    createdAt: new Date(),
    updatedAt: new Date(),
  };

  public static async getUserDomainProps({
    username,
    email,
    password,
    age,
    weight,
    height,
    isEmailVerified = false,
    isAdmin = false,
    deletedAt = null,
  }: Partial<UserDomainCreateParams> = {}) {
    const usernameVO = Username.create({
      value: username ?? this.userMockParams.username,
    });
    const emailVO = Email.create({ value: email ?? this.userMockParams.email });
    const passwordVO = await Password.create({
      value: password?.value ?? this.userMockParams.password,
    });
    const ageVO = Age.create({
      value: age ?? (this.userMockParams.age as number),
    });
    const weightVO = Weight.create({
      value: weight ?? (this.userMockParams.weight as number),
    });
    const heightVO = Height.create({
      value: height ?? (this.userMockParams.height as number),
    });
    const emailVerifiedVO = EmailVerification.create({
      value: isEmailVerified,
    });
    const isAdminVO = IsAdmin.create({ value: isAdmin });
    const deletedAtVO = DeletedAt.create({ value: deletedAt });

    const userProps: UserDomainProps = {
      username: usernameVO.value as Username,
      email: emailVO.value as Email,
      password: passwordVO.value as Password,
      age: ageVO.value as Age,
      weight: weightVO.value as Weight,
      height: heightVO.value as Height,
      emailVerification: emailVerifiedVO,
      isAdmin: isAdminVO,
      deletedAt: deletedAtVO,
    };

    return userProps;
  }

  public static getUserDomainCreateParams(
    props?: Partial<UserDomainCreateParams>,
  ): UserDomainCreateParams {
    const user = this.userMockParams;

    return {
      username: props?.username || user.username,
      email: props?.email || user.email,
      password: props?.password || {
        value: user.password,
      },
      age: props?.age || user.age || undefined,
      weight: props?.weight || user.weight || undefined,
      height: props?.height || user.height || undefined,
      isEmailVerified: props?.isEmailVerified || user.isEmailVerified,
      isAdmin: props?.isAdmin || user.isAdmin,
      deletedAt: props?.deletedAt || user.deletedAt,
    };
  }

  public static async mountUserDomain({
    withoutId,
    ...props
  }: MountUserDomainParams = {}): Promise<UserDomain> {
    const user = this.userMockParams;
    const usersDomainCreateParams = this.getUserDomainCreateParams(props);

    const userParams = {
      params: usersDomainCreateParams,
      id: props.id || user.id,
    };
    let id: UniqueEntityID | undefined;
    if (!withoutId) {
      id = new UniqueEntityID(props.id || user.id);
    }

    const userDomain = await UserDomain.create(userParams.params, id);
    return userDomain.value as UserDomain;
  }
}
