import { HttpStatus } from '@nestjs/common';
import { IsString, IsUUID, IsEmail, IsBoolean } from 'class-validator';
import { UserDomain } from '~/modules/users/domain/users.domain';
import { UserDtoError } from '~/modules/users/dto/errors/user-dto-errors';
import { Either, left, right } from '~/shared/either';

export class UserTokenDataDto {
  @IsUUID()
  id: string;

  @IsString()
  username: string;

  @IsString()
  @IsEmail()
  email: string;

  @IsBoolean()
  isAdmin: boolean;

  @IsBoolean()
  isEmailVerified: boolean;

  public static domainToDto(
    domain: UserDomain,
  ): Either<UserDtoError, UserTokenDataDto> {
    const { id, username, email, isAdmin, emailVerification } = domain;

    if (!id) {
      return left(
        UserDtoError.create(
          UserDtoError.messages.missingId,
          HttpStatus.BAD_REQUEST,
        ),
      );
    }

    const userDto = new UserTokenDataDto();
    userDto.id = id.toString();
    userDto.username = username.value;
    userDto.email = email.value;
    userDto.isAdmin = isAdmin?.value;
    userDto.isEmailVerified = emailVerification?.isVerified;

    return right(userDto);
  }
}
