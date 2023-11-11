import { v4 as uuid } from 'uuid';
import UserMapper from '~/modules/users/domain/mappers/users.mapper';
import { DeleteUser } from '~/modules/users/domain/use-cases/delete-user';
import { GetUserMock } from '~/modules/users/domain/use-cases/get-user/test/get-user.mock';
import { UserDomain } from '~/modules/users/domain/users.domain';
import UserRepository from '~/services/database/typeorm/repositories/users-repository';

describe('Delete user use case', () => {
  const userMapper = new UserMapper();
  let userRepository: UserRepository;
  let userDomain: UserDomain;
  let deleteUser: DeleteUser;

  const mockUserRepository = async () => {
    const userDomainMock = await GetUserMock.mountUserDomain();
    userDomain = userDomainMock;

    const userRepositoryMock = new UserRepository(userMapper) as jest.Mocked<
      InstanceType<typeof UserRepository>
    >;

    const deleteRepositoryMock = jest.fn().mockResolvedValue({
      raw: [],
      affected: 1,
    });
    userRepositoryMock.repository.softDelete = deleteRepositoryMock;

    const repositoryFindOneByIdMock = jest.fn().mockResolvedValue(userDomain);
    userRepositoryMock.findOneById = repositoryFindOneByIdMock;

    userRepository = userRepositoryMock;
  };

  beforeAll(async () => {
    await mockUserRepository();
    deleteUser = new DeleteUser(userRepository);
  });

  afterEach(() => {
    jest.restoreAllMocks();
    jest.clearAllMocks();
  });

  it('Should delete a user', async () => {
    const userHasBeenUpdated = await deleteUser.execute({ id: uuid() });
    expect(userHasBeenUpdated).toBeTruthy();
  });
});
