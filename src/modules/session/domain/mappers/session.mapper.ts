import { Injectable } from '@nestjs/common';
import SessionDomain from '~/modules/session/domain/session.domain';
import { Token as TokenEntity } from '~/modules/session/entities/token.entity';
import { Mapper } from '~/shared/domain/mapper';
import { UniqueEntityID } from '~/shared/domain/unique-entity-id';
import { Either, left, right } from '~/shared/either';

@Injectable()
export default class SessionMapper
  implements Mapper<SessionDomain, Partial<TokenEntity>>
{
  public async toDomain(
    raw: TokenEntity,
  ): Promise<Either<Error, SessionDomain>> {
    const { id, userId, token, type } = raw;

    const entityId = new UniqueEntityID(id);
    const sessionOrError = SessionDomain.create(
      {
        userId,
        token: {
          value: token,
          isEncrypted: true,
        },
        tokenType: type,
      },
      entityId,
    );

    if (sessionOrError.isLeft()) {
      return left(sessionOrError.value);
    }

    return right(sessionOrError.value);
  }

  public toPersistence(item: SessionDomain): Partial<TokenEntity> {
    const { id, userId, token, tokenType } = item;

    if (!token.isEncrypted) {
      token.getEncryptValue();
    }
    const tokenEntity: Partial<TokenEntity> = {
      id: id?.toString(),
      userId,
      token: token.value,
      expiry: token.props.expiry,
      type: tokenType.value,
    };

    return tokenEntity;
  }
}
