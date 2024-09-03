import {
  UserDomain,
  UserDomainCreateParams,
} from '~/modules/users/domain/users.domain';
import { User } from '~/modules/users/entities/user.entity';
import { UniqueEntityID } from '~/shared/domain/unique-entity-id';

export class ListUsersMock {
  public static userEntityMock: User[] = [
    {
      id: '46ccf0f8-ec5c-46f0-ae4e-cff06a4b01fe',
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
    },
    {
      id: '31ba7304-862b-49ab-8cc7-ae629130836d',
      username: 'User Test 2',
      email: 'username2@email.com',
      password: 'v#$6D=W9',
      isEmailVerified: false,
      isAdmin: false,
      age: 23,
      weight: 88,
      height: 180,
      deletedAt: null,
      createdAt: new Date(),
      updatedAt: new Date(),
    },
    {
      id: '7a232350-c91e-4362-9e5c-2a3d2e7fea71',
      username: 'User Test 2',
      email: 'username2@email.com',
      password: 'v#$6D=W9',
      isEmailVerified: false,
      isAdmin: false,
      age: 25,
      weight: 92,
      height: 182,
      deletedAt: null,
      createdAt: new Date(),
      updatedAt: new Date(),
    },
  ];

  public static async mountUsersDomains(
    withoutId = false,
  ): Promise<UserDomain[]> {
    const usersParams = this.userEntityMock.map((user) => ({
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
    }));
    const usersDomains = await Promise.all(
      usersParams.map(async (user) => {
        let id: UniqueEntityID | undefined;
        if (!withoutId) {
          id = new UniqueEntityID(user.id);
        }

        const userDomain = await UserDomain.create(user.params, id);
        return userDomain.value as UserDomain;
      }),
    );

    return usersDomains;
  }
}
