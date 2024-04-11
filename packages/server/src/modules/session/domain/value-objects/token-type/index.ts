import SessionDomainError from '~/modules/session/domain/errors';
import {
  TOKEN_TYPES_ENUM,
  TokenTypes,
} from '~/modules/session/entities/token.entity';
import { ValueObject } from '~/shared/domain/value-object';
import { Either, left, right } from '~/shared/either';

export interface TokenTypeProps {
  value: TokenTypes;
}

export default class TokenType extends ValueObject<TokenTypeProps> {
  private constructor(props: TokenTypeProps) {
    super(props);
  }

  get value(): TokenTypes {
    return this.props.value;
  }
  private static isValid(name: TokenTypes): boolean {
    return TOKEN_TYPES_ENUM.includes(name);
  }

  public static create(
    value: TokenTypes,
  ): Either<SessionDomainError, TokenType> {
    if (!this.isValid(value)) {
      return left(
        SessionDomainError.create(SessionDomainError.messages.invalidType),
      );
    }

    return right(new TokenType({ value }));
  }
}
