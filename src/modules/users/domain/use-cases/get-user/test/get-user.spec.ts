import { HttpException, InternalServerErrorException } from '@nestjs/common';
import UserMapper from '~/modules/users/domain/mappers/users.mapper';
import { GetUser } from '~/modules/users/domain/use-cases/get-user';
import { GetUserMock } from '~/modules/users/domain/use-cases/get-user/test/get-user.mock';
import { UserDto } from '~/modules/users/dto/user.dto';
import UserRepository from '~/services/database/typeorm/repositories/users-repository';

describe('Get user use case', () => {
  const userMapper = new UserMapper();

  afterEach(() => {
    jest.restoreAllMocks();
    jest.clearAllMocks();
  });

  it('Should get user by id or username', async () => {
    const userDomain = await GetUserMock.mountUserDomain();
    const userRepositoryMock = new UserRepository(userMapper) as jest.Mocked<
      InstanceType<typeof UserRepository>
    >;
    const repositoryGetUserMock = jest.fn().mockResolvedValue(userDomain);
    userRepositoryMock.findOne = repositoryGetUserMock;
    const userRepository = userRepositoryMock;
    const getUser = new GetUser(userRepository);

    const userDto = UserDto.domainToDto(userDomain).value;
    const user = await getUser.execute({
      idOrUsername: GetUserMock.userMock.id,
    });
    expect(user).toMatchObject(userDto);
  });

  it('Should throw http exception if failed to pass user to dto', async () => {
    const userDomain = await GetUserMock.mountUserDomain(true);
    const userRepositoryMock = new UserRepository(userMapper) as jest.Mocked<
      InstanceType<typeof UserRepository>
    >;
    const repositoryGetUserMock = jest.fn().mockResolvedValue(userDomain);
    userRepositoryMock.findOne = repositoryGetUserMock;
    const userRepository = userRepositoryMock;
    const getUser = new GetUser(userRepository);

    await expect(
      getUser.execute({ idOrUsername: GetUserMock.userMock.id }),
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
      getUser.execute({ idOrUsername: GetUserMock.userMock.id }),
    ).rejects.toThrowError(InternalServerErrorException);
  });
});
