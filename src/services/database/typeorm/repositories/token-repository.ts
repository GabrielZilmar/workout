import { Injectable } from '@nestjs/common';
import { IsNull, MoreThanOrEqual } from 'typeorm';
import SessionMapper from '~/modules/session/domain/mappers/session.mapper';
import SessionDomain from '~/modules/session/domain/session.domain';
import { Token, TokenTypes } from '~/modules/session/entities/token.entity';
import { BaseRepository } from '~/services/database/typeorm/repositories/base/base-repository';

@Injectable()
export default class TokenRepository extends BaseRepository<
  Token,
  SessionDomain
> {
  constructor(sessionMapper: SessionMapper) {
    super(Token, sessionMapper);
  }

  async findLastByUserIdAndType(userId: string, type: TokenTypes) {
    const token = await this.findOne({
      where: {
        userId,
        type,
        usedAt: IsNull(),
        expiry: MoreThanOrEqual(new Date()),
      },
    });

    return token;
  }
}
