import { InternalServerErrorException } from '@nestjs/common';
import UserMapper from '~/modules/users/domain/mappers/users.mapper';
import { ListUsers } from '~/modules/users/domain/use-cases/list-users';
import { ListUsersMock } from '~/modules/users/domain/use-cases/list-users/test/list-users.mock';
import { UserDomain } from '~/modules/users/domain/users.domain';
import { UserDto } from '~/modules/users/dto/user.dto';
import UserRepository from '~/services/database/typeorm/repositories/users-repository';

jest.mock('~/services/database/typeorm/repositories/users-repository');

describe('List users use case', () => {
  let useMapper = new UserMapper();
  let userRepository: UserRepository;
  let listUsers: ListUsers;
  let usersDomain: UserDomain[];

  beforeAll(async () => {
    useMapper = new UserMapper();

    usersDomain = await ListUsersMock.mountUsersDomains();
    const repositoryListUserMock = jest.fn().mockResolvedValue(usersDomain);
    const userRepositoryMock = new UserRepository(useMapper) as jest.Mocked<
      InstanceType<typeof UserRepository>
    >;
    userRepositoryMock.find = repositoryListUserMock;

    userRepository = userRepositoryMock;
    listUsers = new ListUsers(userRepository);
  });

  afterEach(() => {
    jest.restoreAllMocks();
    jest.clearAllMocks();
  });

  it('Should list all users', async () => {
    const usersDto = await Promise.all(
      usersDomain.map((user) => UserDto.domainToDto(user).value),
    );

    const users = await listUsers.execute({});
    expect(users).toMatchObject(usersDto);
  });

  it('Should throw http exception if failed to pass users to dto', async () => {
    const invalidUsersDomain = ListUsersMock.mountUsersDomains(true);
    const userRepositoryMock = new UserRepository(useMapper) as jest.Mocked<
      InstanceType<typeof UserRepository>
    >;
    const repositoryListUserMock = jest
      .fn()
      .mockRejectedValue(invalidUsersDomain);
    userRepositoryMock.find = repositoryListUserMock;
    userRepository = userRepositoryMock;
  });

  it('Should throw internal error if user repository failed to get users', async () => {
    const userRepositoryMock = new UserRepository(useMapper) as jest.Mocked<
      InstanceType<typeof UserRepository>
    >;
    const repositoryListUserMock = jest.fn().mockRejectedValue(usersDomain);
    userRepositoryMock.find = repositoryListUserMock;
    userRepository = userRepositoryMock;

    await expect(listUsers.execute({})).rejects.toThrow(
      InternalServerErrorException,
    );
  });
});
