import { Mapper } from '~/shared/domain/mapper';
import { UserDomain } from '~/modules/users/domain/users.domain';
import { User as UserEntity } from '~/modules/users/entities/user.entity';
import { UserDomainError } from '~/modules/users/domain/errors';
import { Either, left, right } from '~/shared/either';
import { UniqueEntityID } from '~/shared/domain/unique-entity-id';
import { Injectable } from '@nestjs/common';

@Injectable()
export default class UserMapper
  implements Mapper<UserDomain, Partial<UserEntity>>
{
  public async toDomain(
    raw: UserEntity,
  ): Promise<Either<UserDomainError, UserDomain>> {
    const {
      id,
      username,
      email,
      password,
      age,
      weight,
      height,
      isEmailVerified,
      isAdmin,
      deletedAt,
    } = raw;

    const entityId = new UniqueEntityID(id);
    const userOrError = await UserDomain.create(
      {
        username,
        email,
        password: {
          value: password,
        },
        age,
        weight,
        height,
        isEmailVerified,
        isAdmin,
        deletedAt,
      },
      entityId,
    );

    if (userOrError.isLeft()) {
      return left(userOrError.value);
    }

    return right(userOrError.value);
  }

  public toPersistence(item: UserDomain): Partial<UserEntity> {
    const { id, username, age, weight, height, email } = item;

    const userEntity: Partial<UserEntity> = {
      id: id?.toString(),
      username: username.value,
      email: email.value,
      age: age?.value,
      weight: weight?.value,
      height: height?.value,
    };

    return userEntity;
  }
}
