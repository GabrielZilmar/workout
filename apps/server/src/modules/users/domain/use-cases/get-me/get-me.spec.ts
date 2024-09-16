import {
  HttpException,
  HttpStatus,
  NotFoundException,
  Provider,
} from '@nestjs/common';
import { Test, TestingModule } from '@nestjs/testing';
import { UserDomainMock } from 'test/utils/domains/user-domain-mock';
import getUserRepositoryProvider from 'test/utils/providers/user-repository';
import UserMapper from '~/modules/users/domain/mappers/users.mapper';
import { UserUseCaseError } from '~/modules/users/domain/use-cases/errors';
import { GetMe } from '~/modules/users/domain/use-cases/get-me';
import { UserDomain } from '~/modules/users/domain/users.domain';
import { UserDtoError } from '~/modules/users/dto/errors/user-dto-errors';

describe('Get me use case', () => {
  let userDomain: UserDomain;
  let module: TestingModule;

  beforeEach(async () => {
    userDomain = await UserDomainMock.mountUserDomain();
    module = await getModuleTest();
  });

  afterEach(() => {
    jest.restoreAllMocks();
    jest.clearAllMocks();
  });

  const getModuleTest = async (userRepositoryProvider?: Provider) => {
    if (!userRepositoryProvider) {
      userRepositoryProvider = await getUserRepositoryProvider({ userDomain });
    }

    return Test.createTestingModule({
      imports: [],
      providers: [userRepositoryProvider, UserMapper, GetMe],
    }).compile();
  };

  it('Should return me', async () => {
    const getMe = module.get<GetMe>(GetMe);

    const user = await getMe.execute({
      userId: userDomain.id?.toValue() as string,
    });

    expect(user).toEqual(userDomain.toDto().value);
  });

  it('Should not return me if user not found', async () => {
    const getMe = module.get<GetMe>(GetMe);
    jest
      .spyOn(getMe['userRepository'], 'findOneById')
      .mockResolvedValueOnce(null);

    await expect(
      getMe.execute({
        userId: userDomain.id?.toValue() as string,
      }),
    ).rejects.toThrowError(
      new NotFoundException(
        UserUseCaseError.messages.userNotFound(
          userDomain.id?.toValue() as string,
        ),
      ),
    );
  });

  it('Should throw error if user dto is invalid', async () => {
    const userDomainWithoutId = await UserDomainMock.mountUserDomain({
      withoutId: true,
    });

    const module = await getModuleTest(
      await getUserRepositoryProvider({
        userDomain: userDomainWithoutId,
      }),
    );
    const getMe = module.get<GetMe>(GetMe);

    await expect(
      getMe.execute({
        userId: userDomain.id?.toValue() as string,
      }),
    ).rejects.toThrowError(
      new HttpException(
        { message: UserDtoError.messages.missingId },
        HttpStatus.INTERNAL_SERVER_ERROR,
      ),
    );
  });
});
