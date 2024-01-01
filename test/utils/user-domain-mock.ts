import {
  UserDomain,
  UserDomainCreateParams,
} from '~/modules/users/domain/users.domain';
import { User } from '~/modules/users/entities/user.entity';
import { UniqueEntityID } from '~/shared/domain/unique-entity-id';

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

  public static async mountUserDomain(withoutId = false): Promise<UserDomain> {
    const user = this.userMockParams;

    const userParams = {
      params: {
        username: user.username,
        email: user.email,
        password: {
          value: user.password,
        },
        age: user.age,
        weight: user.weight,
        height: user.height,
        isEmailVerified: user.isEmailVerified,
        isAdmin: user.isAdmin,
        deletedAt: user.deletedAt,
      } as UserDomainCreateParams,
      id: user.id,
    };
    let id: UniqueEntityID | undefined;
    if (!withoutId) {
      id = new UniqueEntityID(user.id);
    }

    const userDomain = await UserDomain.create(userParams.params, id);
    return userDomain.value as UserDomain;
  }
}
