import { HttpStatus } from '@nestjs/common';
import { UserDomainMock } from 'test/utils/domains/user-domain-mock';
import { UserDomainError } from '~/modules/users/domain/errors';
import UserMapper from '~/modules/users/domain/mappers/users.mapper';
import {
  CreateUser,
  CreateUserParams,
} from '~/modules/users/domain/use-cases/create-user';
import {
  UserDomain,
  UserDomainCreateParams,
} from '~/modules/users/domain/users.domain';
import { UserDto } from '~/modules/users/dto/user.dto';
import { RepositoryError } from '~/services/database/typeorm/repositories/error';
import UserRepository from '~/services/database/typeorm/repositories/users-repository';
import { left, right } from '~/shared/either';

jest.mock('~/modules/users/domain/event/user-created');

describe('CreateUser', () => {
  let userRepository: UserRepository;
  let createUser: CreateUser;
  let userParams: UserDomainCreateParams;
  let userDomain: UserDomain;

  const mockUserRepository = () => {
    const userMapper = new UserMapper();

    const repositoryCreateUserMock = jest
      .fn()
      .mockResolvedValue(right(userDomain));
    const userRepositoryMock = new UserRepository(userMapper) as jest.Mocked<
      InstanceType<typeof UserRepository>
    >;
    userRepositoryMock.create = repositoryCreateUserMock;

    userRepository = userRepositoryMock;
  };

  const mockCreateUser = () => {
    createUser = new CreateUser(userRepository);
  };

  beforeAll(async () => {
    userDomain = await UserDomainMock.mountUserDomain();
    userParams = UserDomainMock.getUserDomainCreateParams();
    mockUserRepository();
    mockCreateUser();
  });

  afterEach(() => {
    jest.restoreAllMocks();
    jest.clearAllMocks();
  });

  it('Should create a user', async () => {
    const createUserParams: CreateUserParams = {
      username: userParams.username,
      email: userParams.email,
      password: userParams.password.value,
      age: userParams.age,
      weight: userParams.weight,
      height: userParams.height,
    };

    const newUser = await createUser.execute(createUserParams);
    expect(newUser).toBeInstanceOf(UserDto);
    expect(newUser).toMatchObject({
      username: userParams.username.toLowerCase(),
      email: userParams.email,
      age: userParams.age,
      weight: userParams.weight,
      height: userParams.height,
    });
  });

  it('Should not create a user with invalid domain', async () => {
    const invalidCreateUserParams: CreateUserParams = {
      username: '',
      email: userParams.email,
      password: userParams.password.value,
      age: userParams.age,
      weight: userParams.weight,
      height: userParams.height,
    };

    await expect(createUser.execute(invalidCreateUserParams)).rejects.toThrow(
      UserDomainError.create(UserDomainError.messages.missingProps),
    );
  });

  it('Should not create a user with duplicated username', async () => {
    const createUserParams: CreateUserParams = {
      username: userParams.username,
      email: userParams.email,
      password: userParams.password.value,
      age: userParams.age,
      weight: userParams.weight,
      height: userParams.height,
    };
    const errorMock = RepositoryError.create(
      RepositoryError.messages.itemDuplicated,
      { username: createUserParams.username },
      HttpStatus.BAD_REQUEST,
    );

    userRepository.create = jest.fn().mockResolvedValue(left(errorMock));
    await expect(createUser.execute(createUserParams)).rejects.toThrow(
      errorMock,
    );
  });

  it('Should not create a user with duplicated email', async () => {
    const createUserParams: CreateUserParams = {
      username: userParams.username,
      email: userParams.email,
      password: userParams.password.value,
      age: userParams.age,
      weight: userParams.weight,
      height: userParams.height,
    };
    const errorMock = RepositoryError.create(
      RepositoryError.messages.itemDuplicated,
      { email: createUserParams.email },
      HttpStatus.BAD_REQUEST,
    );

    userRepository.create = jest.fn().mockResolvedValue(left(errorMock));
    await expect(createUser.execute(createUserParams)).rejects.toThrow(
      errorMock,
    );
  });
});
