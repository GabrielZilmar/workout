import {
  HttpException,
  Injectable,
  InternalServerErrorException,
} from '@nestjs/common';
import { FindManyOptions, ILike } from 'typeorm';
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

  // TODO: Make it generic and reusable in the base-repository
  private mountSearch(params: ListUsersParams): FindManyOptions<User> {
    const search: FindManyOptions<User> = Object.entries(params).reduce(
      (acc, [key, value]) => {
        const isSkipOrTake = key === 'skip' || key === 'take';
        if (isSkipOrTake) {
          return {
            ...acc,
            [key]: value,
          };
        }

        if (typeof value === 'string') {
          return {
            where: {
              ...acc.where,
              [key]: ILike(`%${value}%`),
            },
          };
        }
        if (typeof value === 'number') {
          return {
            where: {
              ...acc.where,
              [key]: value,
            },
          };
        }

        return acc;
      },
      {} as FindManyOptions<User>,
    );

    return search;
  }

  public async execute(params: ListUsersParams): Promise<ListUsersResult> {
    try {
      const search = this.mountSearch({ ...params });
      const users = await this.userRepository.find(search);

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
