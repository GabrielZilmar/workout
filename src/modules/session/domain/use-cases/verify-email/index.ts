import {
  HttpException,
  HttpStatus,
  Injectable,
  InternalServerErrorException,
} from '@nestjs/common';
import { SessionUseCaseError } from '~/modules/session/domain/use-cases/errors';
import { VerifyEmailDto } from '~/modules/session/dto/verify-email.dto';
import { Token, TokenTypeMap } from '~/modules/session/entities/token.entity';
import { User } from '~/modules/users/entities/user.entity';
import { AppDataSource } from '~/services/database/typeorm/config/data-source';
import { RepositoryError } from '~/services/database/typeorm/repositories/error';
import TokenRepository from '~/services/database/typeorm/repositories/token-repository';
import UserRepository from '~/services/database/typeorm/repositories/users-repository';
import JwtService from '~/services/jwt/jsonwebtoken';
import { UseCase } from '~/shared/core/use-case';
import { UniqueEntityID } from '~/shared/domain/unique-entity-id';

export type VerifyEmailParams = VerifyEmailDto;
export type VerifyEmailResult = Promise<boolean>;

type TokenDecoded = { userId: string };

@Injectable()
export class VerifyEmail
  implements UseCase<VerifyEmailParams, VerifyEmailResult>
{
  constructor(
    private readonly userRepository: UserRepository,
    private readonly tokenRepository: TokenRepository,
    private readonly jwtService: JwtService,
  ) {}

  public async execute({ token }: VerifyEmailParams): VerifyEmailResult {
    const isTokenValid = this.jwtService.isValidToken(token);
    if (!isTokenValid) {
      throw new HttpException(
        {
          message: SessionUseCaseError.messages.invalidToken,
        },
        HttpStatus.UNAUTHORIZED,
      );
    }

    const decodedToken = this.jwtService.decodeToken(
      token,
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
      throw new HttpException(
        {
          message: SessionUseCaseError.messages.userIdNotFound(
            decodedToken.userId,
          ),
        },
        HttpStatus.BAD_REQUEST,
      );
    }

    if (userDomain.isEmailVerified.value) {
      return true;
    }

    const sessionDomain = await this.tokenRepository.findLastByUserIdAndType(
      userDomain.id.toValue(),
      TokenTypeMap.EMAIL_AUTH,
    );

    if (!sessionDomain?.id) {
      throw new HttpException(
        {
          message: SessionUseCaseError.messages.tokenNotFound,
        },
        HttpStatus.BAD_REQUEST,
      );
    }

    if (sessionDomain.token.usedAt) {
      throw new HttpException(
        {
          message: SessionUseCaseError.messages.tokenAlreadyUsed,
        },
        HttpStatus.BAD_REQUEST,
      );
    }

    await AppDataSource.manager.transaction(
      async (transactionalEntityManager) => {
        userDomain.isEmailVerified.verifyEmail();
        const userRepository = transactionalEntityManager.getRepository(User);
        const updatedUser = await userRepository.update(
          (userDomain.id as UniqueEntityID).toValue(),
          { isEmailVerified: userDomain.isEmailVerified.value },
        );

        if (!updatedUser.affected) {
          throw new InternalServerErrorException({
            message: RepositoryError.messages.updateError,
          });
        }

        sessionDomain.token.useToken();
        const tokenRepository = transactionalEntityManager.getRepository(Token);
        const updatedToken = await tokenRepository.update(
          (sessionDomain.id as UniqueEntityID).toValue(),
          {
            usedAt: sessionDomain.token.usedAt,
          },
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
