import { BadRequestException, HttpException, HttpStatus } from '@nestjs/common';
import { UserDomainMock } from 'test/utils/domains/user-domain-mock';
import { v4 as uuid } from 'uuid';
import UserMapper from '~/modules/users/domain/mappers/users.mapper';
import { UserUseCaseError } from '~/modules/users/domain/use-cases/errors';
import {
  UpdateUser,
  UpdateUserParams,
} from '~/modules/users/domain/use-cases/update-user';
import { UserDomain } from '~/modules/users/domain/users.domain';
import { RepositoryError } from '~/services/database/typeorm/repositories/error';
import UserRepository from '~/services/database/typeorm/repositories/users-repository';
import { left, right } from '~/shared/either';

describe('Update user use case', () => {
  const userMapper = new UserMapper();
  let userRepository: UserRepository;
  let updateUser: UpdateUser;
  let userDomain: UserDomain;

  const id = uuid();
  const updateUserParams: UpdateUserParams = {
    id: id,
    username: 'valid_username',
    age: 20,
    weight: 80,
    height: 180,
  };
  const userParams = {
    username: 'valid_username',
    email: 'valid@email.com',
    password: {
      value: 'valid_password',
    },
    age: 20,
    weight: 80,
    height: 180,
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
    userDomain = await UserDomainMock.mountUserDomain({
      ...userParams,
    });
    await mockUserRepository();
    updateUser = new UpdateUser(userRepository, userMapper);
  });

  it('Should update a user', async () => {
    const userHasBeenUpdated = await updateUser.execute(updateUserParams);
    expect(userHasBeenUpdated).toBeTruthy();
  });

  it('Should not update a user if it user does not exists', async () => {
    const repositoryFindOneByIdMock = jest.fn().mockResolvedValue(null);
    userRepository.findOneById = repositoryFindOneByIdMock;

    const userParams = updateUserParams;

    await expect(updateUser.execute(userParams)).rejects.toThrowError(
      new HttpException(
        UserUseCaseError.messages.userNotFound(userParams.id),
        HttpStatus.NOT_FOUND,
      ),
    );
  });

  it('Should not update a user if the username is duplicated', async () => {
    const userParams = updateUserParams;
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

  it('Should not update a user if throws an internal error in repository', async () => {
    const updateError = RepositoryError.create(
      RepositoryError.messages.updateError,
    );
    const repositoryUpdateUserMock = jest
      .fn()
      .mockResolvedValue(left(updateError));
    userRepository.update = repositoryUpdateUserMock;

    await expect(updateUser.execute(updateUserParams)).rejects.toThrowError(
      new HttpException(updateError.message, updateError.code),
    );
  });
});
