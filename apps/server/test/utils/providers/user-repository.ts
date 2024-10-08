import { Provider } from '@nestjs/common';
import { UserDomainMock } from 'test/utils/domains/user-domain-mock';
import UserMapper from '~/modules/users/domain/mappers/users.mapper';
import { UserDomain } from '~/modules/users/domain/users.domain';
import UserRepository from '~/services/database/typeorm/repositories/users-repository';

type GetUserRepositoryProviderParams = {
  userRepositoryMock?: UserRepository;
  userDomain?: UserDomain;
};

const getUserRepositoryProvider = async ({
  userRepositoryMock,
  userDomain,
}: GetUserRepositoryProviderParams = {}) => {
  if (!userDomain) {
    userDomain = await UserDomainMock.mountUserDomain();
  }

  return {
    provide: UserRepository,
    useFactory: (userMapper: UserMapper) => {
      if (!userRepositoryMock) {
        userRepositoryMock = new UserRepository(userMapper) as jest.Mocked<
          InstanceType<typeof UserRepository>
        >;

        userRepositoryMock.findOneById = jest
          .fn()
          .mockResolvedValue(userDomain);
        userRepositoryMock.findByEmail = jest
          .fn()
          .mockResolvedValue(userDomain);
        userRepositoryMock.findOneByUsername = jest
          .fn()
          .mockResolvedValue(userDomain);
        userRepositoryMock.findOneByEmail = jest
          .fn()
          .mockResolvedValue(userDomain);
      }

      return userRepositoryMock;
    },
    inject: [UserMapper],
  } as Provider;
};

export default getUserRepositoryProvider;
