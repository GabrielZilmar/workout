import { HttpException, Injectable, NotFoundException } from '@nestjs/common';
import { UserUseCaseError } from '~/modules/users/domain/use-cases/errors';
import { UserDto } from '~/modules/users/dto/user.dto';
import UserRepository from '~/services/database/typeorm/repositories/users-repository';
import { UseCase } from '~/shared/core/use-case';

type GetMeParams = { userId: string };
type GetMeResult = Promise<UserDto>;

@Injectable()
export class GetMe implements UseCase<GetMeParams, GetMeResult> {
  constructor(private readonly userRepository: UserRepository) {}

  public async execute({ userId }: GetMeParams): Promise<GetMeResult> {
    const user = await this.userRepository.findOneById(userId);

    if (!user) {
      throw new NotFoundException(
        UserUseCaseError.messages.userNotFound(userId),
      );
    }

    const userDto = user.toDto();
    if (userDto.isLeft()) {
      throw new HttpException(userDto.value.message, userDto.value.code);
    }

    return userDto.value;
  }
}
