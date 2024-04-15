import { HttpStatus } from '@nestjs/common';
import { IsString } from 'class-validator';
import SessionDomainError from '~/modules/session/domain/errors';
import SessionDomain from '~/modules/session/domain/session.domain';
import { Either, left, right } from '~/shared/either';

export class SessionDto {
  @IsString()
  accessToken: string;

  public static domainToDto(
    domain: SessionDomain,
  ): Either<SessionDomainError, SessionDto> {
    const { token } = domain;

    if (!token.isAuth) {
      return left(
        SessionDomainError.create(
          SessionDomainError.messages.tokenNotAuth,
          HttpStatus.UNAUTHORIZED,
        ),
      );
    }

    const sessionDto = new SessionDto();
    sessionDto.accessToken = token.value;

    return right(sessionDto);
  }
}
