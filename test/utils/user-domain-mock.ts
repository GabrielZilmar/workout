import {
  UserDomain,
  UserDomainCreateParams,
} from '~/modules/users/domain/users.domain';
import { User } from '~/modules/users/entities/user.entity';
import { UniqueEntityID } from '~/shared/domain/unique-entity-id';

type MountUserDomainParams = Partial<UserDomainCreateParams> & {
  id?: string;
  withoutId?: boolean;
};

export class UserDomainMock {
  public static userMockParams: User = {
    id: '46ccf0f8-ec5c-46f0-ae4e-cff06a4b01fe',
    username: 'User Test 1',
    email: 'username1@email.com',
    password: 'password',
    isEmailVerified: false,
    isAdmin: false,
    age: 21,
    weight: 80,
    height: 181,
    deletedAt: null,
    createdAt: new Date(),
    updatedAt: new Date(),
  };

  public static async mountUserDomain({
    withoutId,
    ...props
  }: MountUserDomainParams = {}): Promise<UserDomain> {
    const user = this.userMockParams;

    const userParams = {
      params: {
        username: props.username || user.username,
        email: props.email || user.email,
        password: {
          value: props.password || user.password,
        },
        age: props.age || user.age,
        weight: props.weight || user.weight,
        height: props.height || user.height,
        isEmailVerified: props.isEmailVerified || user.isEmailVerified,
        isAdmin: props.isAdmin || user.isAdmin,
        deletedAt: props.deletedAt || user.deletedAt,
      } as UserDomainCreateParams,
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
