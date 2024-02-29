import {
  HttpException,
  HttpStatus,
  InternalServerErrorException,
} from '@nestjs/common';
import { UserDomainMock } from 'test/utils/user-domain-mock';
import { v4 as uuid } from 'uuid';
import UserMapper from '~/modules/users/domain/mappers/users.mapper';
import { DeleteUser } from '~/modules/users/domain/use-cases/delete-user';
import { UserUseCaseError } from '~/modules/users/domain/use-cases/errors';
import { UserDomain } from '~/modules/users/domain/users.domain';
import UserRepository from '~/services/database/typeorm/repositories/users-repository';

describe('Delete user use case', () => {
  const userMapper = new UserMapper();
  let userRepository: UserRepository;
  let userDomain: UserDomain;
  let deleteUser: DeleteUser;

  const mockUserRepository = async () => {
    const userDomainMock = await UserDomainMock.mountUserDomain();
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

  beforeEach(async () => {
    await mockUserRepository();
    deleteUser = new DeleteUser(userRepository);
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

  it('Should not update a user if throws an internal error in repository', async () => {
    const deleteRepositoryMock = jest.fn().mockRejectedValue(false);
    userRepository.repository.softDelete = deleteRepositoryMock;

    await expect(deleteUser.execute({ id: uuid() })).rejects.toThrow(
      InternalServerErrorException,
    );
  });
});
