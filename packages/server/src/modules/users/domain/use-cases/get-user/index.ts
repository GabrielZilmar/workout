import {
  HttpException,
  HttpStatus,
  Injectable,
  InternalServerErrorException,
} from '@nestjs/common';
import { validate as validateUUID } from 'uuid';
import { UserUseCaseError } from '~/modules/users/domain/use-cases/errors';
import { UserDomain } from '~/modules/users/domain/users.domain';
import { GetUserDto } from '~/modules/users/dto/get-user.dto';
import { SimpleUserDto } from '~/modules/users/dto/simple-user.dto';
import { UserDto } from '~/modules/users/dto/user.dto';
import UserRepository from '~/services/database/typeorm/repositories/users-repository';
import { UseCase } from '~/shared/core/use-case';

type GetUserParams = GetUserDto & { userId: string };
type GetUserResult = Promise<UserDto | SimpleUserDto>;

@Injectable()
export class GetUser implements UseCase<GetUserParams, GetUserResult> {
  constructor(private readonly userRepository: UserRepository) {}

  public async execute({
    userId,
    idOrUsername,
  }: GetUserParams): Promise<GetUserResult> {
    let user: UserDomain | null = null;

    try {
      const isId = validateUUID(idOrUsername);
      if (isId) {
        user = await this.userRepository.findOne({
          where: { id: idOrUsername },
        });
      } else {
        user = await this.userRepository.findOne({
          where: { username: idOrUsername },
        });
      }
    } catch (error) {
      throw new InternalServerErrorException((error as Error).message);
    }

    if (!user) {
      throw new HttpException(
        UserUseCaseError.messages.userNotFound(idOrUsername),
        HttpStatus.NOT_FOUND,
      );
    }

    const userDto =
      user.id?.toValue() === userId ? user.toDto() : user.toSimpleDto();
    if (userDto.isLeft()) {
      throw new HttpException(userDto.value.message, userDto.value.code);
    }

    return userDto.value;
  }
}
