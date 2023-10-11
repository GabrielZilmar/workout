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
    const { id, ssoId, username, age, weight, height } = raw;

    const entityId = new UniqueEntityID(id);
    const userOrError = await UserDomain.create(
      {
        ssoId,
        username,
        age,
        weight,
        height,
      },
      entityId,
    );

    if (userOrError.isLeft()) {
      return left(userOrError.value);
    }

    return right(userOrError.value);
  }

  public toPersistence(item: UserDomain): Partial<UserEntity> {
    const { id, ssoId, username, age, weight, height } = item;

    const userEntity: Partial<UserEntity> = {
      id: id?.toString(),
      ssoId: ssoId.value,
      username: username.value,
      age: age?.value,
      weight: weight?.value,
      height: height?.value,
    };

    return userEntity;
  }
}
