import {
  HttpException,
  HttpStatus,
  InternalServerErrorException,
  Provider,
} from '@nestjs/common';
import { Test, TestingModule } from '@nestjs/testing';
import UtilClone from 'test/utils/clone';
import { SessionDomainMock } from 'test/utils/domains/session-domain-mock';
import { UserDomainMock } from 'test/utils/domains/user-domain-mock';
import getTokenRepositoryProvider from 'test/utils/providers/token-repository';
import getUserRepositoryProvider from 'test/utils/providers/user-repository';
import SessionMapper from '~/modules/session/domain/mappers/session.mapper';
import SessionDomain from '~/modules/session/domain/session.domain';
import { SessionUseCaseError } from '~/modules/session/domain/use-cases/errors';
import { VerifyEmail } from '~/modules/session/domain/use-cases/verify-email';
import Token from '~/modules/session/domain/value-objects/token';
import UserMapper from '~/modules/users/domain/mappers/users.mapper';
import { UserDomain } from '~/modules/users/domain/users.domain';
import Crypto from '~/services/cryptography/crypto';
import { AppDataSource } from '~/services/database/typeorm/config/data-source';
import { RepositoryError } from '~/services/database/typeorm/repositories/error';
import TokenRepository from '~/services/database/typeorm/repositories/token-repository';
import UserRepository from '~/services/database/typeorm/repositories/users-repository';
import JwtService from '~/services/jwt/jsonwebtoken';
import { right } from '~/shared/either';

jest.mock('~/services/database/typeorm/config/data-source');

type GetModuleTestParams = {
  userRepositoryProvider?: Provider;
  tokenRepositoryProvider?: Provider;
};

describe('VerifyEmail Use Case', () => {
  let userDomain: UserDomain;
  let sessionDomain: SessionDomain;
  let module: TestingModule;
  const userMapper = new UserMapper();
  let token: string;

  const getUserRepositoryMock = () => {
    const findOneByIdMock = jest.fn().mockResolvedValue(userDomain);
    const userRepositoryMock = new UserRepository(userMapper) as jest.Mocked<
      InstanceType<typeof UserRepository>
    >;
    userRepositoryMock.findOneById = findOneByIdMock;

    const userDomainClone = UtilClone.deepInstanceClone(userDomain);
    userDomainClone.emailVerification.verifyEmail();
    userRepositoryMock.update = jest
      .fn()
      .mockResolvedValue(right(userDomainClone));

    return userRepositoryMock;
  };

  const getTokenRepositoryMock = () => {
    const findLastByUserIdAndTypedMock = jest
      .fn()
      .mockResolvedValue(sessionDomain);
    const tokenRepositoryMock = new TokenRepository(
      new SessionMapper(),
    ) as jest.Mocked<InstanceType<typeof TokenRepository>>;
    tokenRepositoryMock.findLastByUserIdAndType = findLastByUserIdAndTypedMock;

    const sessionDomainClone = UtilClone.deepInstanceClone(sessionDomain);
    sessionDomainClone.token.useToken();
    tokenRepositoryMock.update = jest
      .fn()
      .mockResolvedValue(right(sessionDomainClone));

    return tokenRepositoryMock;
  };

  const getModuleTest = async ({
    userRepositoryProvider,
    tokenRepositoryProvider,
  }: GetModuleTestParams = {}) => {
    if (!userRepositoryProvider) {
      userRepositoryProvider = await getUserRepositoryProvider({
        userRepositoryMock: getUserRepositoryMock(),
        userDomain,
      });
    }

    if (!tokenRepositoryProvider) {
      tokenRepositoryProvider = getTokenRepositoryProvider({
        tokenRepositoryMock: getTokenRepositoryMock(),
        sessionDomain,
      });
    }

    return Test.createTestingModule({
      imports: [],
      providers: [
        userRepositoryProvider,
        tokenRepositoryProvider,
        UserMapper,
        SessionMapper,
        VerifyEmail,
        JwtService,
        Crypto,
      ],
    }).compile();
  };

  beforeEach(async () => {
    userDomain = await UserDomainMock.mountUserDomain();
    sessionDomain = SessionDomainMock.mountSessionDomain();
    const crypto = new Crypto();
    token = crypto.encryptValue(
      (
        Token.create({ value: { userId: userDomain.id?.toValue() } })
          .value as Token
      ).value,
    );
    module = await getModuleTest();
  });

  it('Should verify user email', async () => {
    const mockUserRepository = {
      update: jest.fn().mockResolvedValue({ affected: 1 }),
    };
    const mockTokenRepository = {
      update: jest.fn().mockResolvedValue({ affected: 1 }),
    };

    AppDataSource.manager.transaction = jest
      .fn()
      .mockImplementation(async (fn) => {
        const entityManagerMock = {
          getRepository: jest
            .fn()
            .mockReturnValueOnce(mockUserRepository)
            .mockReturnValueOnce(mockTokenRepository),
        };

        return fn(entityManagerMock);
      });

    const verifyEmail = module.get<VerifyEmail>(VerifyEmail);
    const verifyEmailSpy = jest.spyOn(
      userDomain.emailVerification,
      'verifyEmail',
    );
    const useTokenSpy = jest.spyOn(sessionDomain.token, 'useToken');

    expect(await verifyEmail.execute({ token })).toBe(true);
    expect(mockUserRepository.update).toHaveBeenCalled();
    expect(mockTokenRepository.update).toHaveBeenCalled();
    expect(verifyEmailSpy).toHaveBeenCalled();
    expect(useTokenSpy).toHaveBeenCalled();
  });

  it('Should not verify user email if token is invalid', async () => {
    const mockUserRepository = {
      update: jest.fn().mockResolvedValue({ affected: 1 }),
    };
    const mockTokenRepository = {
      update: jest.fn().mockResolvedValue({ affected: 1 }),
    };

    AppDataSource.manager.transaction = jest
      .fn()
      .mockImplementation(async (fn) => {
        const entityManagerMock = {
          getRepository: jest
            .fn()
            .mockReturnValueOnce(mockUserRepository)
            .mockReturnValueOnce(mockTokenRepository),
        };

        return fn(entityManagerMock);
      });

    const verifyEmail = module.get<VerifyEmail>(VerifyEmail);
    await expect(
      verifyEmail.execute({ token: 'invalidToken' }),
    ).rejects.toThrow(
      new HttpException(
        {
          message: SessionUseCaseError.messages.invalidToken,
        },
        HttpStatus.UNAUTHORIZED,
      ),
    );
    expect(mockUserRepository.update).not.toHaveBeenCalled();
    expect(mockTokenRepository.update).not.toHaveBeenCalled();
  });

  it('Should not verify user email if token is expired', async () => {
    const mockUserRepository = {
      update: jest.fn().mockResolvedValue({ affected: 1 }),
    };
    const mockTokenRepository = {
      update: jest.fn().mockResolvedValue({ affected: 1 }),
    };

    AppDataSource.manager.transaction = jest
      .fn()
      .mockImplementation(async (fn) => {
        const entityManagerMock = {
          getRepository: jest
            .fn()
            .mockReturnValueOnce(mockUserRepository)
            .mockReturnValueOnce(mockTokenRepository),
        };

        return fn(entityManagerMock);
      });

    const jwtService = module.get<JwtService>(JwtService);
    const expiredToken = jwtService.signToken(
      { userId: userDomain.id?.toValue() },
      '-1h',
    );

    const verifyEmail = module.get<VerifyEmail>(VerifyEmail);
    await expect(verifyEmail.execute({ token: expiredToken })).rejects.toThrow(
      new HttpException(
        {
          message: SessionUseCaseError.messages.invalidToken,
        },
        HttpStatus.UNAUTHORIZED,
      ),
    );
    expect(mockUserRepository.update).not.toHaveBeenCalled();
    expect(mockTokenRepository.update).not.toHaveBeenCalled();
  });

  it('Should not verify user if decode token failed', async () => {
    const mockUserRepository = {
      update: jest.fn().mockResolvedValue({ affected: 1 }),
    };
    const mockTokenRepository = {
      update: jest.fn().mockResolvedValue({ affected: 1 }),
    };

    AppDataSource.manager.transaction = jest
      .fn()
      .mockImplementation(async (fn) => {
        const entityManagerMock = {
          getRepository: jest
            .fn()
            .mockReturnValueOnce(mockUserRepository)
            .mockReturnValueOnce(mockTokenRepository),
        };

        return fn(entityManagerMock);
      });

    const jwtService = module.get<JwtService>(JwtService);
    const crypto = module.get<Crypto>(Crypto);
    const token = crypto.encryptValue(
      jwtService.signToken({ userId: userDomain.id?.toValue() }),
    );
    jwtService.decodeToken = jest.fn().mockReturnValue(null);

    const verifyEmail = module.get<VerifyEmail>(VerifyEmail);
    await expect(verifyEmail.execute({ token })).rejects.toThrow(
      new InternalServerErrorException(
        SessionUseCaseError.messages.decodeTokenError,
      ),
    );
    expect(mockUserRepository.update).not.toHaveBeenCalled();
    expect(mockTokenRepository.update).not.toHaveBeenCalled();
  });

  it('Should not verify user if user not found', async () => {
    const userRepositoryMock = getUserRepositoryMock();
    userRepositoryMock.findOneById = jest.fn().mockResolvedValue(null);
    const userRepositoryProvider = await getUserRepositoryProvider({
      userRepositoryMock,
      userDomain,
    });

    const module = await getModuleTest({ userRepositoryProvider });
    const mockUserRepository = {
      update: jest.fn().mockResolvedValue({ affected: 1 }),
    };
    const mockTokenRepository = {
      update: jest.fn().mockResolvedValue({ affected: 1 }),
    };

    AppDataSource.manager.transaction = jest
      .fn()
      .mockImplementation(async (fn) => {
        const entityManagerMock = {
          getRepository: jest
            .fn()
            .mockReturnValueOnce(mockUserRepository)
            .mockReturnValueOnce(mockTokenRepository),
        };

        return fn(entityManagerMock);
      });

    const jwtService = module.get<JwtService>(JwtService);
    const crypto = module.get<Crypto>(Crypto);
    const token = crypto.encryptValue(
      jwtService.signToken({ userId: userDomain.id?.toValue() }),
    );
    const verifyEmail = module.get<VerifyEmail>(VerifyEmail);

    await expect(verifyEmail.execute({ token })).rejects.toThrow(
      new HttpException(
        {
          message: SessionUseCaseError.messages.userIdNotFound(
            userDomain.id?.toValue() as string,
          ),
        },
        HttpStatus.BAD_REQUEST,
      ),
    );
    expect(mockUserRepository.update).not.toHaveBeenCalled();
    expect(mockTokenRepository.update).not.toHaveBeenCalled();
  });

  it('Should return true if the user is already verified', async () => {
    userDomain.emailVerification.verifyEmail();
    const userRepositoryMock = getUserRepositoryMock();
    const userRepositoryProvider = await getUserRepositoryProvider({
      userRepositoryMock,
      userDomain,
    });

    const module = await getModuleTest({ userRepositoryProvider });
    const mockUserRepository = {
      update: jest.fn().mockResolvedValue({ affected: 1 }),
    };
    const mockTokenRepository = {
      update: jest.fn().mockResolvedValue({ affected: 1 }),
    };

    AppDataSource.manager.transaction = jest
      .fn()
      .mockImplementation(async (fn) => {
        const entityManagerMock = {
          getRepository: jest
            .fn()
            .mockReturnValueOnce(mockUserRepository)
            .mockReturnValueOnce(mockTokenRepository),
        };

        return fn(entityManagerMock);
      });

    const verifyEmail = module.get<VerifyEmail>(VerifyEmail);

    expect(await verifyEmail.execute({ token })).toBe(true);
    expect(mockUserRepository.update).not.toHaveBeenCalled();
    expect(mockTokenRepository.update).not.toHaveBeenCalled();
  });

  it('Should not verify user if token not found', async () => {
    const tokenRepositoryProvider = getTokenRepositoryProvider();
    const module = await getModuleTest({ tokenRepositoryProvider });
    const mockUserRepository = {
      update: jest.fn().mockResolvedValue({ affected: 1 }),
    };
    const mockTokenRepository = {
      update: jest.fn().mockResolvedValue({ affected: 1 }),
    };

    AppDataSource.manager.transaction = jest
      .fn()
      .mockImplementation(async (fn) => {
        const entityManagerMock = {
          getRepository: jest
            .fn()
            .mockReturnValueOnce(mockUserRepository)
            .mockReturnValueOnce(mockTokenRepository),
        };

        return fn(entityManagerMock);
      });

    const verifyEmail = module.get<VerifyEmail>(VerifyEmail);

    await expect(verifyEmail.execute({ token })).rejects.toThrow(
      new HttpException(
        {
          message: SessionUseCaseError.messages.tokenNotFound,
        },
        HttpStatus.BAD_REQUEST,
      ),
    );
    expect(mockUserRepository.update).not.toHaveBeenCalled();
    expect(mockTokenRepository.update).not.toHaveBeenCalled();
  });

  it('Should not verify user if token already used', async () => {
    const sessionDomain = SessionDomainMock.mountSessionDomain();
    sessionDomain.token.useToken();
    const tokenRepositoryMock = getTokenRepositoryMock();
    tokenRepositoryMock.findLastByUserIdAndType = jest
      .fn()
      .mockResolvedValue(sessionDomain);
    const tokenRepositoryProvider = getTokenRepositoryProvider({
      tokenRepositoryMock,
      sessionDomain,
    });

    const module = await getModuleTest({ tokenRepositoryProvider });
    const mockUserRepository = {
      update: jest.fn().mockResolvedValue({ affected: 1 }),
    };
    const mockTokenRepository = {
      update: jest.fn().mockResolvedValue({ affected: 1 }),
    };

    AppDataSource.manager.transaction = jest
      .fn()
      .mockImplementation(async (fn) => {
        const entityManagerMock = {
          getRepository: jest
            .fn()
            .mockReturnValueOnce(mockUserRepository)
            .mockReturnValueOnce(mockTokenRepository),
        };

        return fn(entityManagerMock);
      });

    const verifyEmail = module.get<VerifyEmail>(VerifyEmail);

    await expect(verifyEmail.execute({ token })).rejects.toThrow(
      new HttpException(
        {
          message: SessionUseCaseError.messages.tokenAlreadyUsed,
        },
        HttpStatus.BAD_REQUEST,
      ),
    );
    expect(mockUserRepository.update).not.toHaveBeenCalled();
    expect(mockTokenRepository.update).not.toHaveBeenCalled();
  });

  it('Should not verify user if update user failed', async () => {
    const mockUserRepository = {
      update: jest.fn().mockResolvedValue({ affected: 0 }),
    };
    const mockTokenRepository = {
      update: jest.fn().mockResolvedValue({ affected: 1 }),
    };

    AppDataSource.manager.transaction = jest
      .fn()
      .mockImplementation(async (fn) => {
        const entityManagerMock = {
          getRepository: jest
            .fn()
            .mockReturnValueOnce(mockUserRepository)
            .mockReturnValueOnce(mockTokenRepository),
        };

        return fn(entityManagerMock);
      });

    const verifyEmail = module.get<VerifyEmail>(VerifyEmail);

    await expect(verifyEmail.execute({ token })).rejects.toThrow(
      new InternalServerErrorException({
        message: RepositoryError.messages.updateError,
      }),
    );
    expect(mockUserRepository.update).toHaveBeenCalled();
    expect(mockTokenRepository.update).not.toHaveBeenCalled();
  });

  it('Should not verify user if update token failed', async () => {
    const mockUserRepository = {
      update: jest.fn().mockResolvedValue({ affected: 1 }),
    };
    const mockTokenRepository = {
      update: jest.fn().mockResolvedValue({ affected: 0 }),
    };

    AppDataSource.manager.transaction = jest
      .fn()
      .mockImplementation(async (fn) => {
        const entityManagerMock = {
          getRepository: jest
            .fn()
            .mockReturnValueOnce(mockUserRepository)
            .mockReturnValueOnce(mockTokenRepository),
        };

        return fn(entityManagerMock);
      });

    const verifyEmail = module.get<VerifyEmail>(VerifyEmail);

    await expect(verifyEmail.execute({ token })).rejects.toThrow(
      new InternalServerErrorException({
        message: RepositoryError.messages.updateError,
      }),
    );
  });
});
