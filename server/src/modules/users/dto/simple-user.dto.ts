import { HttpStatus } from '@nestjs/common';
import { IsString, IsUUID } from 'class-validator';
import { UserDomain } from '~/modules/users/domain/users.domain';
import { UserDtoError } from '~/modules/users/dto/errors/user-dto-errors';
import { Either, left, right } from '~/shared/either';

export class SimpleUserDto {
  @IsUUID()
  id: string;

  @IsString()
  username: string;

  public static domainToDto(
    domain: UserDomain,
  ): Either<UserDtoError, SimpleUserDto> {
    const { id, username } = domain;

    if (!id) {
      return left(
        UserDtoError.create(
          UserDtoError.messages.missingId,
          HttpStatus.BAD_REQUEST,
        ),
      );
    }

    const userDto = new SimpleUserDto();
    userDto.id = id.toString();
    userDto.username = username.value;

    return right(userDto);
  }
}
