import { Injectable } from '@nestjs/common';
import { DeepPartial } from 'typeorm';
import UserMapper from '~/modules/users/domain/mappers/users.mapper';
import { UserDomain } from '~/modules/users/domain/users.domain';
import { User } from '~/modules/users/entities/user.entity';
import { BaseRepository } from '~/services/database/typeorm/repositories/base/base-repository';
import { RepositoryError } from '~/services/database/typeorm/repositories/error';
import { Either, left, right } from '~/shared/either';

export type PreventDuplicatedParams = {
  id?: string;
  userName?: string;
};

@Injectable()
export default class UserRepository extends BaseRepository<User, UserDomain> {
  constructor(userMapper: UserMapper) {
    super(User, userMapper);
  }

  private async preventDuplicatedUser({
    id,
    userName,
  }: PreventDuplicatedParams): Promise<Either<RepositoryError, boolean>> {
    const itemExist = await this.findOneByCriteria({ userName });

    if (itemExist) {
      const isSameUser = itemExist.id?.toValue() === id;
      if (isSameUser) {
        return right(true);
      }

      const itemsDuplicated: { userName?: string } = {};
      if (itemExist.userName.value === userName) {
        itemsDuplicated.userName = userName;
      }

      return left(
        RepositoryError.create(
          RepositoryError.messages.itemDuplicated,
          itemsDuplicated,
        ),
      );
    }

    return right(true);
  }

  async create(
    item: DeepPartial<User>,
  ): Promise<Either<RepositoryError, UserDomain>> {
    const preventDuplicated = await this.preventDuplicatedUser({
      userName: item.userName,
    });
    if (preventDuplicated.isLeft()) {
      return left(preventDuplicated.value);
    }

    try {
      const newItem = await this.repository.save(item);

      const newItemDomain = await this.mapper.toDomain(newItem);

      if (newItemDomain.isLeft()) {
        return left(
          RepositoryError.create(RepositoryError.messages.createError),
        );
      }

      return right(newItemDomain.value);
    } catch (err) {
      return left(
        RepositoryError.create(
          RepositoryError.messages.createError,
          (err as Error).message,
        ),
      );
    }
  }

  async update(
    id: string,
    item: DeepPartial<User>,
  ): Promise<Either<RepositoryError, boolean>> {
    const preventDuplicated = await this.preventDuplicatedUser({
      id,
      userName: item.userName,
    });
    if (preventDuplicated.isLeft()) {
      return left(preventDuplicated.value);
    }

    try {
      await this.repository.update(id, item);

      return right(true);
    } catch (err) {
      return left(
        RepositoryError.create(
          RepositoryError.messages.updateError,
          (err as Error).message,
        ),
      );
    }
  }
}
