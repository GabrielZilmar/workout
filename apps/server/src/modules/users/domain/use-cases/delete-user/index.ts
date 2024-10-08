import {
  ForbiddenException,
  HttpException,
  HttpStatus,
  Injectable,
  InternalServerErrorException,
} from '@nestjs/common';
import { UserUseCaseError } from '~/modules/users/domain/use-cases/errors';
import { DeleteUserParamsDto } from '~/modules/users/dto/delete-user.dto';
import UserRepository from '~/services/database/typeorm/repositories/users-repository';
import { UseCase } from '~/shared/core/use-case';

type DeleteUserParams = DeleteUserParamsDto & { userId: string };
type DeleteUserResult = Promise<boolean>;

@Injectable()
export class DeleteUser implements UseCase<DeleteUserParams, DeleteUserResult> {
  constructor(private readonly userRepository: UserRepository) {}

  public async execute({ id, userId }: DeleteUserParams): DeleteUserResult {
    const user = await this.userRepository.findOneById(id);
    if (!user) {
      throw new HttpException(
        UserUseCaseError.messages.userNotFound(id),
        HttpStatus.NOT_FOUND,
      );
    }

    if (user?.id?.toValue() !== userId) {
      throw new ForbiddenException(UserUseCaseError.messages.cannotDeleteUser);
    }

    user.delete();

    try {
      const userHasBeenDeleted =
        await this.userRepository.repository.softDelete(id);

      return !!userHasBeenDeleted.affected;
    } catch (error) {
      throw new InternalServerErrorException((error as Error).message);
    }
  }
}
