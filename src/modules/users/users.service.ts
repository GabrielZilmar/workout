import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { UserDomain } from '~/modules/users/domain/users.domain';
import Age from '~/modules/users/domain/value-objects/age';
import Height from '~/modules/users/domain/value-objects/height';
import SSOId from '~/modules/users/domain/value-objects/sso-id';
import Username from '~/modules/users/domain/value-objects/username';
import Weight from '~/modules/users/domain/value-objects/weight';
import { CreateUserDto } from '~/modules/users/dto/create-user.dto';
import { UpdateUserDto } from '~/modules/users/dto/update-user.dto';

@Injectable()
export class UsersService {
  public async create({
    ssoId,
    username,
    age,
    weight,
    height,
  }: CreateUserDto): Promise<UserDomain> {
    const ssoIdOrError = await SSOId.create({ value: ssoId });
    if (ssoIdOrError.isLeft()) {
      throw new HttpException(
        ssoIdOrError.value.message,
        HttpStatus.BAD_REQUEST,
      );
    }

    const usernameOrError = Username.create({ value: username });
    if (usernameOrError.isLeft()) {
      throw new HttpException(
        usernameOrError.value.message,
        HttpStatus.BAD_REQUEST,
      );
    }

    const ageOrError = Age.create({ value: age });
    if (ageOrError.isLeft()) {
      throw new HttpException(ageOrError.value.message, HttpStatus.BAD_REQUEST);
    }

    const weightOrError = Weight.create({ value: weight });
    if (weightOrError.isLeft()) {
      throw new HttpException(
        weightOrError.value.message,
        HttpStatus.BAD_REQUEST,
      );
    }

    const heightOrError = Height.create({ value: height });
    if (heightOrError.isLeft()) {
      throw new HttpException(
        heightOrError.value.message,
        HttpStatus.BAD_REQUEST,
      );
    }

    const userOrError = await UserDomain.create({
      ssoId: ssoIdOrError.value,
      username: usernameOrError.value,
      age: ageOrError.value,
      weight: weightOrError.value,
      height: heightOrError.value,
    });
    if (userOrError.isLeft()) {
      throw new HttpException(userOrError.value, HttpStatus.BAD_REQUEST);
    }

    return userOrError.value; // Todo: create dto to return and save on db
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
