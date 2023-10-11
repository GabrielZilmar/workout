import { HttpException, Injectable } from '@nestjs/common';
import { UserDomain } from '~/modules/users/domain/users.domain';
import { CreateUserDto } from '~/modules/users/dto/create-user.dto';
import { UserDto } from '~/modules/users/dto/user.dto';
import { User } from '~/modules/users/entities/user.entity';
import UserRepository from '~/services/database/typeorm/repositories/users-repository';
import { UseCase } from '~/shared/core/use-case';

type CreateUserParams = CreateUserDto;
type CreateUserResult = Promise<UserDto>;

@Injectable()
export class CreateUser implements UseCase<CreateUserParams, CreateUserResult> {
  constructor(private readonly userRepository: UserRepository) {}

  public async execute({
    ssoId,
    username,
    age,
    weight,
    height,
  }: CreateUserParams): Promise<CreateUserResult> {
    const userDomainOrError = await UserDomain.create({
      ssoId,
      username,
      age,
      weight,
      height,
    });
    if (userDomainOrError.isLeft()) {
      throw new HttpException(
        { message: userDomainOrError.value.message },
        userDomainOrError.value.code,
      );
    }

    const user: Partial<User> = {
      ssoId: userDomainOrError.value.ssoId.value,
      username: userDomainOrError.value.username.value,
      age: userDomainOrError.value.age?.value,
      weight: userDomainOrError.value.weight?.value,
      height: userDomainOrError.value.height?.value,
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

    const userDto = UserDto.domainToDto(userCreated.value);
    if (userDto.isLeft()) {
      throw new HttpException(
        { message: userDto.value.message },
        userDto.value.code,
      );
    }

    return userDto.value;
  }
}
