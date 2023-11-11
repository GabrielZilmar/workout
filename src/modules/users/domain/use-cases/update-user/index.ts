import {
  BadRequestException,
  HttpException,
  HttpStatus,
  Injectable,
} from '@nestjs/common';
import UserMapper from '~/modules/users/domain/mappers/users.mapper';
import { UserUseCaseError } from '~/modules/users/domain/use-cases/errors';
import {
  CreateUserParamsDto,
  UpdateUserBodyDto,
} from '~/modules/users/dto/update-user.dto';
import UserRepository from '~/services/database/typeorm/repositories/users-repository';
import { UseCase } from '~/shared/core/use-case';

export type UpdateUserParams = CreateUserParamsDto & UpdateUserBodyDto;
export type UpdateUserResult = Promise<boolean>;

@Injectable()
export class UpdateUser implements UseCase<UpdateUserParams, UpdateUserResult> {
  constructor(
    private readonly userRepository: UserRepository,
    private readonly userMapper: UserMapper,
  ) {}

  public async execute({ id, ...params }: UpdateUserParams): UpdateUserResult {
    const user = await this.userRepository.findOneById(id);
    if (!user) {
      throw new HttpException(
        UserUseCaseError.messages.userNotFound(id),
        HttpStatus.NOT_FOUND,
      );
    }

    // TODO: Create update user method in UserDomain
    const userData = this.userMapper.toPersistence(user);
    const userUpdatedOrError = await this.userRepository.update(id, {
      ...userData,
      ...params,
    });

    if (userUpdatedOrError.isLeft()) {
      if (userUpdatedOrError.value.code === HttpStatus.BAD_REQUEST) {
        throw new BadRequestException({
          statusCode: userUpdatedOrError.value.code,
          message: userUpdatedOrError.value.message,
          duplicatedItems: userUpdatedOrError.value.payload,
        });
      }

      throw new HttpException(
        userUpdatedOrError.value.message,
        userUpdatedOrError.value.code,
      );
    }

    return userUpdatedOrError.value;
  }
}
