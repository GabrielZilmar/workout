import {
  HttpException,
  HttpStatus,
  Injectable,
  InternalServerErrorException,
} from '@nestjs/common';
import SessionDomain from '~/modules/session/domain/session.domain';
import { SessionUseCaseError } from '~/modules/session/domain/use-cases/errors';
import { SessionLoginDto } from '~/modules/session/dto/login.dto';
import { SessionDto } from '~/modules/session/dto/session.dto';
import { TokenTypeMap } from '~/modules/session/entities/token.entity';
import { UserTokenDataDto } from '~/modules/users/dto/user-token-data.dto';
import UserRepository from '~/services/database/typeorm/repositories/users-repository';
import { UseCase } from '~/shared/core/use-case';

export type LoginParams = SessionLoginDto;
export type LoginResult = SessionDto;

@Injectable()
export class Login implements UseCase<LoginParams, LoginResult> {
  constructor(private readonly userRepository: UserRepository) {}

  public async execute({ email, password }: LoginParams): Promise<LoginResult> {
    const userDomainOrError = await this.userRepository.findByEmail(email);

    if (userDomainOrError.isLeft()) {
      throw new HttpException(
        {
          message: SessionUseCaseError.messages.userNotExits(email),
        },
        HttpStatus.NOT_FOUND,
      );
    }

    const userDomain = userDomainOrError.value;
    if (!userDomain.id) {
      throw new InternalServerErrorException(userDomain.props);
    }

    const passwordMatch = await userDomain.password.comparePassword(password);

    if (!passwordMatch) {
      throw new HttpException(
        {
          message: SessionUseCaseError.messages.invalidPassword,
        },
        HttpStatus.UNAUTHORIZED,
      );
    }

    const userDto = UserTokenDataDto.domainToDto(userDomain);
    if (userDto.isLeft()) {
      throw new HttpException(
        {
          message: userDto.value.message,
        },
        userDto.value.code,
      );
    }

    const sessionDomainOrError = SessionDomain.create({
      userId: userDomain.id.toValue(),
      token: {
        value: { ...userDto.value },
      },
      tokenType: TokenTypeMap.LOGIN,
    });
    if (sessionDomainOrError.isLeft()) {
      throw new HttpException(
        {
          message: sessionDomainOrError.value.message,
        },
        sessionDomainOrError.value.code,
      );
    }

    const sessionDto = sessionDomainOrError.value.toDto();
    if (sessionDto.isLeft()) {
      throw new HttpException(
        {
          message: sessionDto.value.message,
        },
        sessionDto.value.code,
      );
    }

    return sessionDto.value;
  }
}
