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
import { UserDto } from '~/modules/users/dto/user.dto';
import UserRepository from '~/services/database/typeorm/repositories/users-repository';
import { UseCase } from '~/shared/core/use-case';

type GetUserParams = GetUserDto;
type GetUserResult = Promise<UserDto>;

@Injectable()
export class GetUser implements UseCase<GetUserParams, GetUserResult> {
  constructor(private readonly userRepository: UserRepository) {}

  public async execute({
    idOrUsername,
  }: GetUserParams): Promise<GetUserResult> {
    try {
      let user: UserDomain | null = null;

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

      if (!user) {
        throw new HttpException(
          UserUseCaseError.messages.userNotFound(idOrUsername),
          HttpStatus.NOT_FOUND,
        );
      }

      const userDto = UserDto.domainToDto(user);
      if (userDto.isLeft()) {
        throw new HttpException(
          { message: userDto.value.message },
          userDto.value.code,
        );
      }

      return userDto.value;
    } catch (e) {
      throw new InternalServerErrorException((e as Error).message);
    }
  }
}
