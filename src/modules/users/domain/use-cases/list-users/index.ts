import {
  HttpException,
  Injectable,
  InternalServerErrorException,
} from '@nestjs/common';
import { FindOptionsWhere, ILike } from 'typeorm';
import { FindAllUsersDto } from '~/modules/users/dto/find-all-users.dto';
import { UserDto } from '~/modules/users/dto/user.dto';
import { User } from '~/modules/users/entities/user.entity';
import UserRepository from '~/services/database/typeorm/repositories/users-repository';
import { UseCase } from '~/shared/core/use-case';

export type ListUsersParams = FindAllUsersDto;
export type ListUsersResult = Promise<UserDto[]>;

@Injectable()
export class ListUsers implements UseCase<ListUsersParams, ListUsersResult> {
  constructor(private readonly userRepository: UserRepository) {}

  private mountSearch(
    params: Record<string, string | number>,
  ): FindOptionsWhere<User> {
    const search: FindOptionsWhere<User> = Object.entries(params).reduce(
      (acc, [key, value]) => {
        if (typeof value === 'string') {
          return {
            ...acc,
            [key]: ILike(`%${value}%`),
          };
        }
        if (typeof value === 'number') {
          return {
            ...acc,
            [key]: value,
          };
        }

        return acc;
      },
      {} as FindOptionsWhere<User>,
    );

    return search;
  }

  public async execute({
    skip,
    take,
    ...params
  }: ListUsersParams): Promise<ListUsersResult> {
    try {
      const search = this.mountSearch({ ...params });
      const users = await this.userRepository.find({
        where: { ...search },
        skip,
        take,
      });

      const usersDto: UserDto[] = [];
      users.forEach((user) => {
        const userDto = UserDto.domainToDto(user);

        if (userDto.isLeft()) {
          throw new HttpException(
            { message: userDto.value.message },
            userDto.value.code,
          );
        }

        usersDto.push(userDto.value);
      });

      return usersDto; // Missing count
    } catch (e) {
      throw new InternalServerErrorException();
    }
  }
}
