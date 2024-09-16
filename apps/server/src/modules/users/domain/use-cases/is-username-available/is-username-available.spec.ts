import { Provider } from '@nestjs/common';
import { Test, TestingModule } from '@nestjs/testing';
import { UserDomainMock } from 'test/utils/domains/user-domain-mock';
import getUserRepositoryProvider from 'test/utils/providers/user-repository';
import UserMapper from '~/modules/users/domain/mappers/users.mapper';
import { IsUsernameAvailable } from '~/modules/users/domain/use-cases/is-username-available';
import { UserDomain } from '~/modules/users/domain/users.domain';

describe('Is username available use case', () => {
  let userDomain: UserDomain;
  let module: TestingModule;

  beforeEach(async () => {
    userDomain = await UserDomainMock.mountUserDomain();
    module = await getModuleTest();
  });

  afterEach(() => {
    jest.restoreAllMocks();
    jest.clearAllMocks();
  });

  const getModuleTest = async (userRepositoryProvider?: Provider) => {
    if (!userRepositoryProvider) {
      userRepositoryProvider = await getUserRepositoryProvider({ userDomain });
    }

    return Test.createTestingModule({
      imports: [],
      providers: [userRepositoryProvider, UserMapper, IsUsernameAvailable],
    }).compile();
  };

  it('Should return true if username is available', async () => {
    const isUsernameAvailable =
      module.get<IsUsernameAvailable>(IsUsernameAvailable);
    jest
      .spyOn(isUsernameAvailable['userRepository'], 'findOneByUsername')
      .mockResolvedValueOnce(null);

    const isAvailable = await isUsernameAvailable.execute({
      username: userDomain.username.value,
    });

    expect(isAvailable).toBe(true);
  });

  it('Should return false if email is not available', async () => {
    const isUsernameAvailable =
      module.get<IsUsernameAvailable>(IsUsernameAvailable);

    const isAvailable = await isUsernameAvailable.execute({
      username: userDomain.username.value,
    });

    expect(isAvailable).toBe(false);
  });
});
