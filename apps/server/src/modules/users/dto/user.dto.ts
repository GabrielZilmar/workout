import { HttpStatus } from '@nestjs/common';
import {
  IsNumber,
  IsOptional,
  IsString,
  IsUUID,
  IsEmail,
  IsBoolean,
} from 'class-validator';
import { UserDomain } from '~/modules/users/domain/users.domain';
import { UserDtoError } from '~/modules/users/dto/errors/user-dto-errors';
import { Either, left, right } from '~/shared/either';

export class UserDto {
  @IsUUID()
  id: string;

  @IsString()
  username: string;

  @IsString()
  @IsEmail()
  email: string;

  @IsBoolean()
  isAdmin: boolean;

  @IsNumber()
  @IsOptional()
  age?: number;

  @IsNumber()
  @IsOptional()
  weight?: number;

  @IsNumber()
  @IsOptional()
  height?: number;

  public static domainToDto(domain: UserDomain): Either<UserDtoError, UserDto> {
    const { id, username, email, isAdmin, age, weight, height } = domain;

    if (!id) {
      return left(
        UserDtoError.create(
          UserDtoError.messages.missingId,
          HttpStatus.BAD_REQUEST,
        ),
      );
    }

    const userDto = new UserDto();
    userDto.id = id.toString();
    userDto.username = username.value;
    userDto.email = email.value;
    userDto.isAdmin = isAdmin.value;
    userDto.age = age?.value;
    userDto.weight = weight?.value;
    userDto.height = height?.value;

    return right(userDto);
  }
}
