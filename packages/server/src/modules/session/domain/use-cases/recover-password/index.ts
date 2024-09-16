import {
  BadRequestException,
  HttpException,
  Injectable,
  InternalServerErrorException,
  UnauthorizedException,
} from '@nestjs/common';
import { DataSource } from 'typeorm';
import { SessionUseCaseError } from '~/modules/session/domain/use-cases/errors';
import { RecoverPasswordBodyDto } from '~/modules/session/dto/recover-password.dto';
import { Token, TokenTypeMap } from '~/modules/session/entities/token.entity';
import { User } from '~/modules/users/entities/user.entity';
import Crypto from '~/services/cryptography/crypto';
import { RepositoryError } from '~/services/database/typeorm/repositories/error';
import TokenRepository from '~/services/database/typeorm/repositories/token-repository';
import UserRepository from '~/services/database/typeorm/repositories/users-repository';
import JwtService from '~/services/jwt/jsonwebtoken';
import { UseCase } from '~/shared/core/use-case';
import { UniqueEntityID } from '~/shared/domain/unique-entity-id';

export type RecoverPasswordParams = RecoverPasswordBodyDto;
export type RecoverPasswordResult = boolean;

type TokenDecoded = { userId: string };

@Injectable()
export class RecoverPassword
  implements UseCase<RecoverPasswordParams, RecoverPasswordResult>
{
  constructor(
    private readonly dataSource: DataSource,
    private readonly userRepository: UserRepository,
    private readonly tokenRepository: TokenRepository,
    private readonly jwtService: JwtService,
    private readonly cryptoService: Crypto,
  ) {}

  public async execute({
    token,
    newPassword,
  }: RecoverPasswordBodyDto): Promise<boolean> {
    let decryptedToken: string;
    try {
      decryptedToken = this.cryptoService.decryptValue(token);
    } catch (error) {
      throw new BadRequestException({
        message: SessionUseCaseError.messages.invalidToken,
      });
    }
    const isTokenValid = this.jwtService.isValidToken(decryptedToken);
    if (!isTokenValid) {
      throw new UnauthorizedException({
        message: SessionUseCaseError.messages.invalidToken,
      });
    }

    const decodedToken = this.jwtService.decodeToken(
      decryptedToken,
    ) as TokenDecoded | null;
    if (!decodedToken) {
      throw new InternalServerErrorException(
        SessionUseCaseError.messages.decodeTokenError,
      );
    }

    const userDomain = await this.userRepository.findOneById(
      decodedToken.userId,
    );
    if (!userDomain?.id) {
      throw new BadRequestException({
        message: SessionUseCaseError.messages.userIdNotFound(
          decodedToken.userId,
        ),
      });
    }

    const sessionDomain = await this.tokenRepository.findLastByUserIdAndType(
      userDomain.id.toValue(),
      TokenTypeMap.RECOVER_PASSWORD,
    );
    if (!sessionDomain?.id) {
      throw new BadRequestException({
        message: SessionUseCaseError.messages.tokenNotFound,
      });
    }
    if (sessionDomain.token.usedAt) {
      throw new BadRequestException({
        message: SessionUseCaseError.messages.tokenAlreadyUsed,
      });
    }

    sessionDomain.token.useToken();

    const userDomainUpdateOrError = await userDomain.changePassword({
      value: newPassword,
    });
    if (userDomainUpdateOrError.isLeft()) {
      throw new HttpException(
        { message: userDomainUpdateOrError.value.message },
        userDomainUpdateOrError.value.code,
      );
    }

    await this.dataSource.manager.transaction(
      async (transactionalEntityManager) => {
        const userRepository = transactionalEntityManager.getRepository(User);
        const tokenRepository = transactionalEntityManager.getRepository(Token);

        const updatedUser = await userRepository.update(
          (userDomainUpdateOrError.value.id as UniqueEntityID).toValue(),
          { password: userDomainUpdateOrError.value.password.value },
        );
        if (!updatedUser.affected) {
          throw new InternalServerErrorException({
            message: RepositoryError.messages.updateError,
          });
        }

        const updatedToken = await tokenRepository.update(
          (sessionDomain.id as UniqueEntityID).toValue(),
          { usedAt: sessionDomain.token.usedAt },
        );

        if (!updatedToken.affected) {
          throw new InternalServerErrorException({
            message: RepositoryError.messages.updateError,
          });
        }
      },
    );

    return true;
  }
}
