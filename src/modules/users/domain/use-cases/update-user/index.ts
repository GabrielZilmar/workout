import { HttpException, Injectable } from '@nestjs/common';
import {
  CreateUserParamsDto,
  UpdateUserBodyDto,
} from '~/modules/users/dto/update-user.dto';
import UserRepository from '~/services/database/typeorm/repositories/users-repository';
import { UseCase } from '~/shared/core/use-case';

type UpdateUserParams = CreateUserParamsDto & UpdateUserBodyDto;
type UpdateUserResult = Promise<boolean>;

@Injectable()
export class UpdateUser implements UseCase<UpdateUserParams, UpdateUserResult> {
  constructor(private readonly userRepository: UserRepository) {}

  public async execute({ id, ...params }: UpdateUserParams): UpdateUserResult {
    try {
      const userUpdatedOrError = await this.userRepository.update(id, params);

      if (userUpdatedOrError.isLeft()) {
        throw new HttpException(
          {
            message: userUpdatedOrError.value.message,
            duplicatedItems: userUpdatedOrError.value.payload,
          },
          userUpdatedOrError.value.code,
        );
      }

      return userUpdatedOrError.value;
    } catch (e) {
      throw new Error((e as Error).message);
    }
  }
}
