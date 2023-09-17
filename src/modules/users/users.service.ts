import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import Age from '~/modules/users/domain/value-objects/age';
import Height from '~/modules/users/domain/value-objects/height';
import SSOId from '~/modules/users/domain/value-objects/sso-id';
import Username from '~/modules/users/domain/value-objects/username';
import Weight from '~/modules/users/domain/value-objects/weight';
import { CreateUserDto } from '~/modules/users/dto/create-user.dto';
import { UpdateUserDto } from '~/modules/users/dto/update-user.dto';
import { UserDto } from '~/modules/users/dto/user.dto';
import { User } from '~/modules/users/entities/user.entity';
import UserRepository from '~/services/database/typeorm/repositories/users-repository';

@Injectable()
export class UsersService {
  constructor(private readonly userRepository: UserRepository) {}

  public async create({
    ssoId,
    username,
    age,
    weight,
    height,
  }: CreateUserDto): Promise<UserDto> {
    const ssoIdOrError = await SSOId.create({ value: ssoId });
    if (ssoIdOrError.isLeft()) {
      throw new HttpException(
        ssoIdOrError.value.message,
        ssoIdOrError.value.code,
      );
    }

    const usernameOrError = Username.create({ value: username });
    if (usernameOrError.isLeft()) {
      throw new HttpException(
        usernameOrError.value.message,
        usernameOrError.value.code,
      );
    }

    const ageOrError = Age.create({ value: age });
    if (ageOrError.isLeft()) {
      throw new HttpException(ageOrError.value.message, ageOrError.value.code);
    }

    const weightOrError = Weight.create({ value: weight });
    if (weightOrError.isLeft()) {
      throw new HttpException(
        weightOrError.value.message,
        weightOrError.value.code,
      );
    }

    const heightOrError = Height.create({ value: height });
    if (heightOrError.isLeft()) {
      throw new HttpException(
        heightOrError.value.message,
        heightOrError.value.code,
      );
    }

    const user: Partial<User> = {
      ssoId: ssoIdOrError.value.value,
      username: usernameOrError.value.value,
      age: ageOrError.value.value,
      weight: weightOrError.value.value,
      height: heightOrError.value.value,
    };
    const userCreated = await this.userRepository.create(user);

    if (userCreated.isLeft()) {
      throw new HttpException(
        userCreated.value.message,
        userCreated.value.code,
      );
    }

    const userDto = UserDto.domainToDto(userCreated.value);
    return userDto;
  }

  findAll() {
    return `This action returns all users`;
  }

  findOne(id: number) {
    return `This action returns a #${id} user`;
  }

  update(id: number, updateUserDto: UpdateUserDto) {
    return `This action updates a #${id} user`;
  }

  remove(id: number) {
    return `This action removes a #${id} user`;
  }
}
