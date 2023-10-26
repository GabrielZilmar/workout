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
import UserRepository from '~/services/database/typeorm/repositories/users-repository';

describe('CreateUser', () => {
  let userMapper: UserMapper;
  let userRepository: UserRepository;
  let createUser: CreateUser;
  let userParams: UserDomainCreateParams;
  let userDomain: UserDomain;

  beforeAll(async () => {
    const repositoryCreateUserMock = jest.fn().mockResolvedValue(userDomain);
    // const userRepositoryMock = jest.fn().mockImplementation(() => ({
    //   create: repositoryCreateUserMock,
    // }));
    const userRepositoryMock = jest.fn().mockImplementation(() => {
      return { create: repositoryCreateUserMock };
    }) as any;

    userMapper = new UserMapper();
    userRepository = userRepositoryMock;
    createUser = new CreateUser(userRepository);
    userParams = {
      username: 'valid_username',
      email: 'valid@email.com',
      password: {
        value: 'valid_password',
      },
      age: 20,
      weight: 80,
      height: 180,
    };

    const userDomainOrError = await UserDomain.create(userParams);
    if (userDomainOrError.isLeft()) {
      throw new Error('Invalid user domain');
    }
    userDomain = userDomainOrError.value;
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

    const newUser = createUser.execute(createUserParams);
    expect(newUser).resolves.toBeInstanceOf(UserDto);
  });
});
