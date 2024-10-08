import { HttpException, HttpStatus } from '@nestjs/common';
import { UserDomainMock } from 'test/utils/domains/user-domain-mock';
import { SessionUseCaseError } from '~/modules/session/domain/use-cases/errors';
import { Login } from '~/modules/session/domain/use-cases/login';
import UserMapper from '~/modules/users/domain/mappers/users.mapper';
import { UserDomain } from '~/modules/users/domain/users.domain';
import { User } from '~/modules/users/entities/user.entity';
import UserRepository from '~/services/database/typeorm/repositories/users-repository';
import JwtService from '~/services/jwt/jsonwebtoken';

describe('Login Use Case', () => {
  let userRepository: UserRepository;
  let userDomainParams: User;
  let userDomain: UserDomain;
  let login: Login;
  let jwtService: JwtService;

  const mockUserRepository = () => {
    const userMapper = new UserMapper();

    const findByEmailUserMock = jest.fn().mockResolvedValue(userDomain);
    const userRepositoryMock = new UserRepository(userMapper) as jest.Mocked<
      InstanceType<typeof UserRepository>
    >;
    userRepositoryMock.findByEmail = findByEmailUserMock;

    userRepository = userRepositoryMock;
  };

  beforeAll(async () => {
    userDomainParams = UserDomainMock.userMockParams;
    userDomain = await UserDomainMock.mountUserDomain();
    mockUserRepository();
    login = new Login(userRepository);
    jwtService = new JwtService();
  });

  it('Should login successfully', async () => {
    const result = await login.execute({
      email: userDomainParams.email,
      password: userDomainParams.password,
    });

    expect(result).toBeTruthy();

    const [type, token] = result.accessToken.split(' ') ?? [];
    expect(type).toBe('Bearer');
    const decodedToken = jwtService.decodeToken(token as string);
    expect(decodedToken).toEqual({
      id: userDomainParams.id,
      email: userDomainParams.email,
      username: userDomainParams.username.toLowerCase(),
      isAdmin: userDomainParams.isAdmin,
      isEmailVerified: userDomainParams.isEmailVerified,
      iat: expect.any(Number),
      exp: expect.any(Number),
    });
  });

  it('Should not login if user does not exists', async () => {
    const findByEmailUserMock = jest.fn().mockResolvedValue(null);
    userRepository.findByEmail = findByEmailUserMock;

    await expect(
      login.execute({
        email: userDomainParams.email,
        password: userDomainParams.password,
      }),
    ).rejects.toThrowError();
  });

  it('Should not login if password not match', async () => {
    const findByEmailUserMock = jest.fn().mockResolvedValue(userDomain);
    userRepository.findByEmail = findByEmailUserMock;

    await expect(
      login.execute({
        email: userDomainParams.email,
        password: 'wrong_password',
      }),
    ).rejects.toThrowError(
      new HttpException(
        SessionUseCaseError.messages.invalidPassword,
        HttpStatus.UNAUTHORIZED,
      ),
    );
  });
});
