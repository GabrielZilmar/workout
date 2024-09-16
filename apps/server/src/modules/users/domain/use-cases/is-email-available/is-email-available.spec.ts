import { Provider } from '@nestjs/common';
import { Test, TestingModule } from '@nestjs/testing';
import { UserDomainMock } from 'test/utils/domains/user-domain-mock';
import getUserRepositoryProvider from 'test/utils/providers/user-repository';
import UserMapper from '~/modules/users/domain/mappers/users.mapper';
import { IsEmailAvailable } from '~/modules/users/domain/use-cases/is-email-available';
import { UserDomain } from '~/modules/users/domain/users.domain';

describe('Is email available use case', () => {
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
      providers: [userRepositoryProvider, UserMapper, IsEmailAvailable],
    }).compile();
  };

  it('Should return true if email is available', async () => {
    const isEmailAvailable = module.get<IsEmailAvailable>(IsEmailAvailable);
    jest
      .spyOn(isEmailAvailable['userRepository'], 'findByEmail')
      .mockResolvedValueOnce(null);

    const isAvailable = await isEmailAvailable.execute({
      email: userDomain.email.value,
    });

    expect(isAvailable).toBe(true);
  });

  it('Should return false if email is not available', async () => {
    const isEmailAvailable = module.get<IsEmailAvailable>(IsEmailAvailable);

    const isAvailable = await isEmailAvailable.execute({
      email: userDomain.email.value,
    });

    expect(isAvailable).toBe(false);
  });
});
