import {
  HttpException,
  HttpStatus,
  Injectable,
  InternalServerErrorException,
} from '@nestjs/common';
import { SessionUseCaseError } from '~/modules/session/domain/use-cases/errors';
import { VerifyEmailDto } from '~/modules/session/dto/verify-email.dto';
import { TokenTypeMap } from '~/modules/session/entities/token.entity';
import TokenRepository from '~/services/database/typeorm/repositories/token-repository';
import UserRepository from '~/services/database/typeorm/repositories/users-repository';
import JwtService from '~/services/jwt/jsonwebtoken';
import { UseCase } from '~/shared/core/use-case';

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

    userDomain.isEmailVerified.verifyEmail();
    const updatedUser = await this.userRepository.update(
      userDomain.id.toValue(),
      { isEmailVerified: userDomain.isEmailVerified.value },
    );

    if (updatedUser.isLeft()) {
      throw new HttpException(
        {
          message: updatedUser.value.message,
        },
        updatedUser.value.code,
      );
    }

    sessionDomain.token.useToken();
    const updatedToken = await this.tokenRepository.update(
      sessionDomain.id.toValue(),
      {
        usedAt: sessionDomain.token.usedAt,
      },
    );

    if (updatedToken.isLeft()) {
      throw new HttpException(
        {
          message: updatedToken.value.message,
        },
        updatedToken.value.code,
      );
    }

    return true;
  }
}
