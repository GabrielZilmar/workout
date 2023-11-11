import { HttpException, InternalServerErrorException } from '@nestjs/common';
import UserMapper from '~/modules/users/domain/mappers/users.mapper';
import { ListUsers } from '~/modules/users/domain/use-cases/list-users';
import { ListUsersMock } from '~/modules/users/domain/use-cases/list-users/test/list-users.mock';
import { UserDto } from '~/modules/users/dto/user.dto';
import UserRepository from '~/services/database/typeorm/repositories/users-repository';

jest.mock('~/services/database/typeorm/repositories/users-repository');

describe('List users use case', () => {
  const userMapper = new UserMapper();

  afterEach(() => {
    jest.restoreAllMocks();
    jest.clearAllMocks();
  });

  it('Should list all users', async () => {
    const usersDomain = await ListUsersMock.mountUsersDomains();
    const userRepositoryMock = new UserRepository(userMapper) as jest.Mocked<
      InstanceType<typeof UserRepository>
    >;
    const repositoryListUserMock = jest
      .fn()
      .mockResolvedValue({ items: usersDomain, count: usersDomain.length });
    userRepositoryMock.find = repositoryListUserMock;
    const userRepository = userRepositoryMock;
    const listUsers = new ListUsers(userRepository);

    const usersDto = usersDomain.map((user) => UserDto.domainToDto(user).value);

    const users = await listUsers.execute({});
    expect(users).toMatchObject({ users: usersDto, count: usersDto.length });
  });

  it('Should throw http exception if failed to pass users to dto', async () => {
    const invalidUsersDomain = await ListUsersMock.mountUsersDomains(true);
    const userRepositoryMock = new UserRepository(userMapper) as jest.Mocked<
      InstanceType<typeof UserRepository>
    >;
    const repositoryListUserMock = jest.fn().mockResolvedValue({
      items: invalidUsersDomain,
      count: invalidUsersDomain.length,
    });
    userRepositoryMock.find = repositoryListUserMock;
    const userRepository = userRepositoryMock;
    const listUsers = new ListUsers(userRepository);

    await expect(listUsers.execute({})).rejects.toThrowError(HttpException);
  });

  it('Should throw internal error if user repository failed to get users', async () => {
    const userRepositoryMock = new UserRepository(userMapper) as jest.Mocked<
      InstanceType<typeof UserRepository>
    >;
    const repositoryListUserMock = jest.fn().mockRejectedValue(false);
    userRepositoryMock.find = repositoryListUserMock;
    const userRepository = userRepositoryMock;
    const listUsers = new ListUsers(userRepository);

    await expect(listUsers.execute({})).rejects.toThrowError(
      InternalServerErrorException,
    );
  });
});
