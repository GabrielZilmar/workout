import {
  BadRequestException,
  HttpException,
  InternalServerErrorException,
  Provider,
  UnauthorizedException,
} from '@nestjs/common';
import { Test, TestingModule } from '@nestjs/testing';
import UtilClone from 'test/utils/clone';
import { SessionDomainMock } from 'test/utils/domains/session-domain-mock';
import { UserDomainMock } from 'test/utils/domains/user-domain-mock';
import getTokenRepositoryProvider from 'test/utils/providers/token-repository';
import getUserRepositoryProvider from 'test/utils/providers/user-repository';
import { DataSource } from 'typeorm';
import SessionMapper from '~/modules/session/domain/mappers/session.mapper';
import SessionDomain from '~/modules/session/domain/session.domain';
import { SessionUseCaseError } from '~/modules/session/domain/use-cases/errors';
import { RecoverPassword } from '~/modules/session/domain/use-cases/recover-password';
import Token from '~/modules/session/domain/value-objects/token';
import { UserDomainError } from '~/modules/users/domain/errors';
import UserMapper from '~/modules/users/domain/mappers/users.mapper';
import { UserDomain } from '~/modules/users/domain/users.domain';
import Crypto from '~/services/cryptography/crypto';
import TokenRepository from '~/services/database/typeorm/repositories/token-repository';
import JwtService from '~/services/jwt/jsonwebtoken';
import { right } from '~/shared/either';

jest.mock('~/services/database/typeorm/config/data-source');
jest.mock('~/services/database/typeorm/repositories/token-repository');
jest.mock('~/services/database/typeorm/repositories/users-repository');

type GetModuleParams = {
  userRepositoryProvider?: Provider;
  tokenRepositoryProvider?: Provider;
};

describe('Recover password Use Case', () => {
  let userDomain: UserDomain;
  let sessionDomain: SessionDomain;
  let module: TestingModule;
  const crypto = new Crypto();

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

  const getModule = async ({
    userRepositoryProvider,
    tokenRepositoryProvider = getTokenRepositoryProvider({
      tokenRepositoryMock: getTokenRepositoryMock(),
      sessionDomain,
    }),
  }: GetModuleParams = {}) => {
    if (!userRepositoryProvider) {
      userRepositoryProvider = await getUserRepositoryProvider({ userDomain });
    }
    const dataSourceProvider = {
      provide: DataSource,
      useValue: {
        manager: {
          transaction: jest.fn().mockImplementation((callback) =>
            callback({
              getRepository: jest.fn().mockReturnValue({
                update: jest.fn().mockResolvedValue({ affected: 1 }),
              }),
            }),
          ),
        },
      },
    } as Provider;

    return Test.createTestingModule({
      imports: [],
      providers: [
        userRepositoryProvider,
        tokenRepositoryProvider,
        dataSourceProvider,
        UserMapper,
        SessionMapper,
        JwtService,
        Crypto,
        RecoverPassword,
      ],
    }).compile();
  };

  beforeEach(async () => {
    userDomain = await UserDomainMock.mountUserDomain();
    sessionDomain = SessionDomainMock.mountSessionDomain();
    module = await getModule();
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  it('Should recover user password', async () => {
    const recoverPassword = module.get<RecoverPassword>(RecoverPassword);
    const token = crypto.encryptValue(
      (
        Token.create({ value: { userId: userDomain.id?.toValue() } })
          .value as Token
      ).value,
    );

    expect(
      await recoverPassword.execute({
        newPassword: 'NewValidPassword!!007',
        token,
      }),
    ).toBeTruthy();
  });

  it('Should throw error if token is malformed', async () => {
    const recoverPassword = module.get<RecoverPassword>(RecoverPassword);

    jest
      .spyOn(recoverPassword['cryptoService'], 'decryptValue')
      .mockImplementation(() => {
        throw new Error('Decryption failed');
      });

    await expect(
      recoverPassword.execute({
        newPassword: 'NewValidPassword!!007',
        token: crypto.encryptValue(
          (
            Token.create({ value: { userId: userDomain.id?.toValue() } })
              .value as Token
          ).value,
        ),
      }),
    ).rejects.toThrow(
      new BadRequestException({
        message: SessionUseCaseError.messages.invalidToken,
      }),
    );
  });

  it('Should throw invalid token if token is expired', async () => {
    const recoverPassword = module.get<RecoverPassword>(RecoverPassword);

    await expect(
      recoverPassword.execute({
        newPassword: 'NewValidPassword!!007',
        token: crypto.encryptValue(
          (
            Token.create(
              { value: { userId: userDomain.id?.toValue() } },
              { expiresIn: '-1' },
            ).value as Token
          ).value,
        ),
      }),
    ).rejects.toThrow(
      new UnauthorizedException({
        message: SessionUseCaseError.messages.invalidToken,
      }),
    );
  });

  it('Should throw error if decode token fails', async () => {
    const recoverPassword = module.get<RecoverPassword>(RecoverPassword);
    jest
      .spyOn(recoverPassword['jwtService'], 'isValidToken')
      .mockImplementation(() => true);
    jest
      .spyOn(recoverPassword['jwtService'], 'decodeToken')
      .mockImplementation(() => null);

    await expect(
      recoverPassword.execute({
        newPassword: 'NewValidPassword!!007',
        token: crypto.encryptValue(
          (
            Token.create(
              { value: { userId: userDomain.id?.toValue() } },
              { expiresIn: '-1' },
            ).value as Token
          ).value,
        ),
      }),
    ).rejects.toThrow(
      new InternalServerErrorException(
        SessionUseCaseError.messages.decodeTokenError,
      ),
    );
  });

  it('Should throw error if userDomain is invalid', async () => {
    const recoverPassword = module.get<RecoverPassword>(RecoverPassword);
    const userWithoutId = await UserDomainMock.mountUserDomain({
      withoutId: true,
    });

    jest
      .spyOn(recoverPassword['jwtService'], 'isValidToken')
      .mockImplementation(() => true);
    jest
      .spyOn(recoverPassword['userRepository'], 'findOneById')
      .mockResolvedValue(userWithoutId);

    await expect(
      recoverPassword.execute({
        newPassword: 'NewValidPassword!!007',
        token: crypto.encryptValue(
          (
            Token.create(
              { value: { userId: userDomain.id?.toValue() } },
              { expiresIn: '-1' },
            ).value as Token
          ).value,
        ),
      }),
    ).rejects.toThrow(
      new BadRequestException({
        message: SessionUseCaseError.messages.userIdNotFound(
          userWithoutId.id?.toValue() as string,
        ),
      }),
    );
  });

  it('Should throw error if session domain fails', async () => {
    const recoverPassword = module.get<RecoverPassword>(RecoverPassword);
    jest
      .spyOn(recoverPassword['jwtService'], 'isValidToken')
      .mockImplementation(() => true);
    jest
      .spyOn(recoverPassword['tokenRepository'], 'findLastByUserIdAndType')
      .mockResolvedValue(null);

    await expect(
      recoverPassword.execute({
        newPassword: 'NewValidPassword!!007',
        token: crypto.encryptValue(
          (
            Token.create(
              { value: { userId: userDomain.id?.toValue() } },
              { expiresIn: '-1' },
            ).value as Token
          ).value,
        ),
      }),
    ).rejects.toThrow(
      new BadRequestException({
        message: SessionUseCaseError.messages.tokenNotFound,
      }),
    );
  });

  it('Should throw error if session domain token is already used', async () => {
    const recoverPassword = module.get<RecoverPassword>(RecoverPassword);

    const sessionUsed = SessionDomainMock.mountSessionDomain();
    sessionUsed.token.useToken();
    jest
      .spyOn(recoverPassword['jwtService'], 'isValidToken')
      .mockImplementation(() => true);
    jest
      .spyOn(recoverPassword['tokenRepository'], 'findLastByUserIdAndType')
      .mockResolvedValue(sessionUsed);

    await expect(
      recoverPassword.execute({
        newPassword: 'NewValidPassword!!007',
        token: crypto.encryptValue(
          (
            Token.create(
              { value: { userId: userDomain.id?.toValue() } },
              { expiresIn: '-1' },
            ).value as Token
          ).value,
        ),
      }),
    ).rejects.toThrow(
      new BadRequestException({
        message: SessionUseCaseError.messages.tokenAlreadyUsed,
      }),
    );
  });

  it('Should throw error if change password fails', async () => {
    const recoverPassword = module.get<RecoverPassword>(RecoverPassword);
    jest
      .spyOn(recoverPassword['jwtService'], 'isValidToken')
      .mockImplementation(() => true);

    const invalidPasswordError = UserDomainError.create(
      UserDomainError.messages.invalidPassword,
    );
    await expect(
      recoverPassword.execute({
        newPassword: 'invalid',
        token: crypto.encryptValue(
          (
            Token.create(
              { value: { userId: userDomain.id?.toValue() } },
              { expiresIn: '-1' },
            ).value as Token
          ).value,
        ),
      }),
    ).rejects.toThrow(
      new HttpException(
        { message: invalidPasswordError.message },
        invalidPasswordError.code,
      ),
    );
  });
});
