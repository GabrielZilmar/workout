import { HttpException, Injectable } from '@nestjs/common';
import { UserDomain } from '~/modules/users/domain/users.domain';
import { CreateUserDto } from '~/modules/users/dto/create-user.dto';
import { UserDto } from '~/modules/users/dto/user.dto';
import { User } from '~/modules/users/entities/user.entity';
import UserRepository from '~/services/database/typeorm/repositories/users-repository';
import { UseCase } from '~/shared/core/use-case';

export type CreateUserParams = CreateUserDto;
export type CreateUserResult = Promise<UserDto>;

@Injectable()
export class CreateUser implements UseCase<CreateUserParams, CreateUserResult> {
  constructor(private readonly userRepository: UserRepository) {}

  public async execute({
    username,
    email,
    password,
    age,
    weight,
    height,
    isEmailVerified,
    isAdmin,
    deletedAt,
  }: CreateUserParams): Promise<CreateUserResult> {
    const userDomainOrError = await UserDomain.create({
      username,
      email,
      password: {
        value: password,
      },
      age,
      weight,
      height,
      isEmailVerified,
      isAdmin,
      deletedAt,
    });
    if (userDomainOrError.isLeft()) {
      throw new HttpException(
        { message: userDomainOrError.value.message },
        userDomainOrError.value.code,
      );
    }

    const user: Partial<User> = {
      username: userDomainOrError.value.username.value,
      email: userDomainOrError.value.email.value,
      password: userDomainOrError.value.password.value,
      age: userDomainOrError.value.age?.value,
      weight: userDomainOrError.value.weight?.value,
      height: userDomainOrError.value.height?.value,
      isEmailVerified: userDomainOrError.value.emailVerification.isVerified,
      isAdmin: userDomainOrError.value.isAdmin.value,
      deletedAt: userDomainOrError.value.deletedAt.value,
    };
    const userCreated = await this.userRepository.create(user);

    if (userCreated.isLeft()) {
      throw new HttpException(
        {
          message: userCreated.value.message,
          duplicatedItems: userCreated.value.payload,
        },
        userCreated.value.code,
      );
    }

    const userDto = userCreated.value.toDto();
    if (userDto.isLeft()) {
      throw new HttpException(
        { message: userDto.value.message },
        userDto.value.code,
      );
    }

    return userDto.value;
  }
}
