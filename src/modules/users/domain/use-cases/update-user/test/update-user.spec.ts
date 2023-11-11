import { v4 as uuid } from 'uuid';
import UserMapper from '~/modules/users/domain/mappers/users.mapper';
import {
  UpdateUser,
  UpdateUserParams,
} from '~/modules/users/domain/use-cases/update-user';
import { UpdateUserMock } from '~/modules/users/domain/use-cases/update-user/test/update-user.mock';
import { UserDomain } from '~/modules/users/domain/users.domain';
import UserRepository from '~/services/database/typeorm/repositories/users-repository';
import { UniqueEntityID } from '~/shared/domain/unique-entity-id';
import { right } from '~/shared/either';

describe('Update user use case', () => {
  const userMapper = new UserMapper();
  let userRepository: UserRepository;
  let updateUser: UpdateUser;
  let userDomain: UserDomain;

  const mountUserDomain = async () => {
    const userDomainOrError = await UserDomain.create(
      UpdateUserMock.userParams,
      new UniqueEntityID(uuid()),
    );
    if (userDomainOrError.isLeft()) {
      throw new Error('Invalid user domain');
    }

    userDomain = userDomainOrError.value;
  };

  const mockUserRepository = async () => {
    const repositoryUpdateUserMock = jest.fn().mockResolvedValue(right(true));

    const userRepositoryMock = new UserRepository(userMapper) as jest.Mocked<
      InstanceType<typeof UserRepository>
    >;
    userRepositoryMock.update = repositoryUpdateUserMock;

    const repositoryFindOneByIdMock = jest.fn().mockResolvedValue(userDomain);
    userRepositoryMock.findOneById = repositoryFindOneByIdMock;

    userRepository = userRepositoryMock;
  };

  beforeEach(async () => {
    await mountUserDomain();
    await mockUserRepository();
    updateUser = new UpdateUser(userRepository, userMapper);
  });

  it('should update a user', async () => {
    const userHasBeenUpdated = await updateUser.execute(
      UpdateUserMock.updateUserParams,
    );
    expect(userHasBeenUpdated).toBeTruthy();
  });
});
