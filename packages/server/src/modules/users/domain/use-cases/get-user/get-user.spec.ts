import { HttpException, InternalServerErrorException } from '@nestjs/common';
import { UserDomainMock } from 'test/utils/domains/user-domain-mock';
import UserMapper from '~/modules/users/domain/mappers/users.mapper';
import { GetUser } from '~/modules/users/domain/use-cases/get-user';
import { SimpleUserDto } from '~/modules/users/dto/simple-user.dto';
import { UserDto } from '~/modules/users/dto/user.dto';
import UserRepository from '~/services/database/typeorm/repositories/users-repository';

describe('Get user use case', () => {
  const userMapper = new UserMapper();

  afterEach(() => {
    jest.restoreAllMocks();
    jest.clearAllMocks();
  });

  it('Should get user by id or username', async () => {
    const userDomain = await UserDomainMock.mountUserDomain();
    const userRepositoryMock = new UserRepository(userMapper) as jest.Mocked<
      InstanceType<typeof UserRepository>
    >;
    const repositoryGetUserMock = jest.fn().mockResolvedValue(userDomain);
    userRepositoryMock.findOne = repositoryGetUserMock;
    const userRepository = userRepositoryMock;
    const getUser = new GetUser(userRepository);

    const userDto = UserDto.domainToDto(userDomain).value;
    const user = await getUser.execute({
      userId: UserDomainMock.userMockParams.id,
      idOrUsername: UserDomainMock.userMockParams.id,
    });
    expect(user).toMatchObject(userDto);
  });

  it('Should get simple user dto if user is not the same as the requester', async () => {
    const userDomain = await UserDomainMock.mountUserDomain();
    const userRepositoryMock = new UserRepository(userMapper) as jest.Mocked<
      InstanceType<typeof UserRepository>
    >;
    const repositoryGetUserMock = jest.fn().mockResolvedValue(userDomain);
    userRepositoryMock.findOne = repositoryGetUserMock;
    const userRepository = userRepositoryMock;
    const getUser = new GetUser(userRepository);

    const userDto = SimpleUserDto.domainToDto(userDomain).value;
    const user = await getUser.execute({
      userId: 'other-user',
      idOrUsername: UserDomainMock.userMockParams.id,
    });
    expect(user).toMatchObject(userDto);
  });

  it('Should throw http exception if failed to pass user to dto', async () => {
    const userDomain = await UserDomainMock.mountUserDomain({
      withoutId: true,
    });
    const userRepositoryMock = new UserRepository(userMapper) as jest.Mocked<
      InstanceType<typeof UserRepository>
    >;
    const repositoryGetUserMock = jest.fn().mockResolvedValue(userDomain);
    userRepositoryMock.findOne = repositoryGetUserMock;
    const userRepository = userRepositoryMock;
    const getUser = new GetUser(userRepository);

    await expect(
      getUser.execute({
        userId: UserDomainMock.userMockParams.id,
        idOrUsername: UserDomainMock.userMockParams.id,
      }),
    ).rejects.toThrowError(HttpException);
  });

  it('Should throw internal error if user repository failed to get users', () => {
    const userRepositoryMock = new UserRepository(userMapper) as jest.Mocked<
      InstanceType<typeof UserRepository>
    >;
    const repositoryGetUserMock = jest.fn().mockRejectedValue(false);
    userRepositoryMock.findOne = repositoryGetUserMock;
    const userRepository = userRepositoryMock;
    const getUser = new GetUser(userRepository);

    expect(
      getUser.execute({
        userId: UserDomainMock.userMockParams.id,
        idOrUsername: UserDomainMock.userMockParams.id,
      }),
    ).rejects.toThrowError(InternalServerErrorException);
  });
});
