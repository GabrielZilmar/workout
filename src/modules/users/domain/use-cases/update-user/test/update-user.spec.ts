import { BadRequestException, HttpException, HttpStatus } from '@nestjs/common';
import { v4 as uuid } from 'uuid';
import UserMapper from '~/modules/users/domain/mappers/users.mapper';
import { UserUseCaseError } from '~/modules/users/domain/use-cases/errors';
import {
  UpdateUser,
  UpdateUserParams,
} from '~/modules/users/domain/use-cases/update-user';
import { UpdateUserMock } from '~/modules/users/domain/use-cases/update-user/test/update-user.mock';
import { UserDomain } from '~/modules/users/domain/users.domain';
import { RepositoryError } from '~/services/database/typeorm/repositories/error';
import UserRepository from '~/services/database/typeorm/repositories/users-repository';
import { UniqueEntityID } from '~/shared/domain/unique-entity-id';
import { left, right } from '~/shared/either';

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

  it('Should update a user', async () => {
    const userHasBeenUpdated = await updateUser.execute(
      UpdateUserMock.updateUserParams,
    );
    expect(userHasBeenUpdated).toBeTruthy();
  });

  it('Should not update a user if it user does not exists', async () => {
    const repositoryFindOneByIdMock = jest.fn().mockResolvedValue(null);
    userRepository.findOneById = repositoryFindOneByIdMock;

    const userParams = UpdateUserMock.updateUserParams;

    await expect(updateUser.execute(userParams)).rejects.toThrowError(
      new HttpException(
        UserUseCaseError.messages.userNotFound(userParams.id),
        HttpStatus.NOT_FOUND,
      ),
    );
  });

  it('Should not update a user if the username is duplicated', async () => {
    const userParams = UpdateUserMock.updateUserParams;
    const itemsDuplicated = {
      username: userParams.username,
    };

    const repositoryError = RepositoryError.create(
      RepositoryError.messages.itemDuplicated,
      itemsDuplicated,
      HttpStatus.BAD_REQUEST,
    );
    const repositoryUpdateUserMock = jest
      .fn()
      .mockResolvedValue(left(repositoryError));
    userRepository.update = repositoryUpdateUserMock;

    await expect(updateUser.execute(userParams)).rejects.toThrowError(
      new BadRequestException({
        statusCode: repositoryError.code,
        message: repositoryError.message,
        duplicatedItems: repositoryError.payload,
      }),
    );
  });
});
