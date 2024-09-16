import { Injectable } from '@nestjs/common';
import { IsEmailAvailableQueryDTO } from '~/modules/users/dto/is-email-available.dto';
import UserRepository from '~/services/database/typeorm/repositories/users-repository';
import { UseCase } from '~/shared/core/use-case';

export type IsEmailAvailableParams = IsEmailAvailableQueryDTO;
export type IsEmailAvailableResult = Promise<boolean>;

@Injectable()
export class IsEmailAvailable
  implements UseCase<IsEmailAvailableParams, IsEmailAvailableResult>
{
  constructor(private readonly userRepository: UserRepository) {}

  async execute({ email }: IsEmailAvailableParams): IsEmailAvailableResult {
    const user = await this.userRepository.findByEmail(email);

    return !user;
  }
}
