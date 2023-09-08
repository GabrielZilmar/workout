import { Mapper } from '~/shared/domain/mapper';
import { UserDomain } from '~/modules/users/domain/users.domain';
import { User as UserEntity } from '~/modules/users/entities/user.entity';
import SSOId from '~/modules/users/domain/value-objects/sso-id';
import { UserDomainError } from '~/modules/users/domain/errors';
import { Either, left, right } from '~/shared/either';
import Username from '~/modules/users/domain/value-objects/username';
import Age from '~/modules/users/domain/value-objects/age';
import Weight from '~/modules/users/domain/value-objects/weight';
import Height from '~/modules/users/domain/value-objects/height';
import { UniqueEntityID } from '~/shared/domain/unique-entity-id';
import { Injectable } from '@nestjs/common';

@Injectable()
export default class UserMapper implements Mapper<UserDomain, UserEntity> {
  public async toDomain(
    raw: UserEntity,
  ): Promise<Either<UserDomainError, UserDomain>> {
    const { id, ssoId, userName, age, weight, height } = raw;

    const ssoIdOrError = await SSOId.create({ value: ssoId });
    if (ssoIdOrError.isLeft()) {
      return left(ssoIdOrError.value);
    }

    const userNameOrError = Username.create({ value: userName });
    if (userNameOrError.isLeft()) {
      return left(userNameOrError.value);
    }

    const ageOrError = Age.create({ value: age });
    if (ageOrError.isLeft()) {
      return left(ageOrError.value);
    }

    const weightOrError = Weight.create({ value: weight });
    if (weightOrError.isLeft()) {
      return left(weightOrError.value);
    }

    const heightOrError = Height.create({ value: height });
    if (heightOrError.isLeft()) {
      return left(heightOrError.value);
    }

    const entityId = new UniqueEntityID(id);

    const userOrError = await UserDomain.create(
      {
        ssoId: ssoIdOrError.value,
        userName: userNameOrError.value,
        age: ageOrError.value,
        weight: weightOrError.value,
        height: heightOrError.value,
      },
      entityId,
    );

    if (userOrError.isLeft()) {
      return left(userOrError.value);
    }

    return right(userOrError.value);
  }

  public toPersistence(item: UserDomain): UserEntity {
    const { id, ssoId, userName, age, weight, height } = item;

    const userEntity = {
      id: id.toString(),
      ssoId: ssoId.value,
      userName: userName.value,
      age: age.value,
      weight: weight.value,
      height: height.value,
    } as UserEntity;

    return userEntity;
  }
}
