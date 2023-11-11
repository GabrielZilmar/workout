import { HttpException, HttpStatus } from '@nestjs/common';
import { v4 as uuid } from 'uuid';
import UserMapper from '~/modules/users/domain/mappers/users.mapper';
import { DeleteUser } from '~/modules/users/domain/use-cases/delete-user';
import { UserUseCaseError } from '~/modules/users/domain/use-cases/errors';
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

  it('Should not delete a user if it user does not exists', async () => {
    const repositoryFindOneByIdMock = jest.fn().mockResolvedValue(null);
    userRepository.findOneById = repositoryFindOneByIdMock;

    const id = uuid();
    await expect(deleteUser.execute({ id })).rejects.toThrowError(
      new HttpException(
        UserUseCaseError.messages.userNotFound(id),
        HttpStatus.NOT_FOUND,
      ),
    );
  });
});
