import { Injectable } from '@nestjs/common';
import { IsUsernameAvailableQueryDTO } from '~/modules/users/dto/is-username-available.dto';
import UserRepository from '~/services/database/typeorm/repositories/users-repository';
import { UseCase } from '~/shared/core/use-case';

export type IsUsernameAvailableParams = IsUsernameAvailableQueryDTO;
export type IsUsernameAvailableResult = Promise<boolean>;

@Injectable()
export class IsUsernameAvailable
  implements UseCase<IsUsernameAvailableParams, IsUsernameAvailableResult>
{
  constructor(private readonly userRepository: UserRepository) {}

  async execute({
    username,
  }: IsUsernameAvailableParams): IsUsernameAvailableResult {
    const user = await this.userRepository.findOneByUsername(username);

    return !user;
  }
}
