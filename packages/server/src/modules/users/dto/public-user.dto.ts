import { HttpStatus } from '@nestjs/common';
import { IsString, IsUUID, IsEmail } from 'class-validator';
import { UserDomain } from '~/modules/users/domain/users.domain';
import { UserDtoError } from '~/modules/users/dto/errors/user-dto-errors';
import { Either, left, right } from '~/shared/either';

export class PublicUserDto {
  @IsUUID()
  id: string;

  @IsString()
  username: string;

  @IsString()
  @IsEmail()
  email: string;

  public static domainToDto(
    domain: UserDomain,
  ): Either<UserDtoError, PublicUserDto> {
    const { id, username, email } = domain;

    if (!id) {
      return left(
        UserDtoError.create(
          UserDtoError.messages.missingId,
          HttpStatus.BAD_REQUEST,
        ),
      );
    }

    const userDto = new PublicUserDto();
    userDto.id = id.toString();
    userDto.username = username.value;
    userDto.email = email.value;

    return right(userDto);
  }
}
