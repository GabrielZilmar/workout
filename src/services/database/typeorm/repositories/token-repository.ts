import { Injectable } from '@nestjs/common';
import SessionMapper from '~/modules/session/domain/mappers/session.mapper';
import SessionDomain from '~/modules/session/domain/session.domain';
import { Token } from '~/modules/session/entities/token.entity';
import { BaseRepository } from '~/services/database/typeorm/repositories/base/base-repository';

@Injectable()
export default class TokenRepository extends BaseRepository<
  Token,
  SessionDomain
> {
  constructor(sessionMapper: SessionMapper) {
    super(Token, sessionMapper);
  }
}
