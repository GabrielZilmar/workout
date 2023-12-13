import { HttpStatus } from '@nestjs/common';
import { JwtPayload } from 'jsonwebtoken';
import { validate } from 'uuid';
import SessionDomainError from '~/modules/session/domain/errors';
import Token from '~/modules/session/domain/value-objects/token';
import TokenType from '~/modules/session/domain/value-objects/token-type';
import { TokenTypes } from '~/modules/session/entities/token.entity';
import { AggregateRoot } from '~/shared/domain/aggregate-root';
import { UniqueEntityID } from '~/shared/domain/unique-entity-id';
import { Either, left, right } from '~/shared/either';

export type SessionDomainProps = {
  userId: string;
  token: Token;
  tokenType: TokenType;
};

export type SessionDomainCreateParams = {
  userId: string;
  token: {
    value: string | JwtPayload;
    isEncrypted?: boolean;
  };
  tokenType: TokenTypes;
};

export default class SessionDomain extends AggregateRoot<SessionDomainProps> {
  get userId(): string {
    return this.props.userId;
  }

  get token(): Token {
    return this.props.token;
  }

  get tokenType(): TokenType {
    return this.props.tokenType;
  }

  private static mountValueObject(
    props: SessionDomainCreateParams,
  ): Either<SessionDomainError, SessionDomainProps> {
    const token = Token.create(props.token.value, {
      isEncrypted: props.token.isEncrypted,
    });

    if (token.isLeft()) {
      return left(token.value);
    }

    const tokenType = TokenType.create(props.tokenType);
    if (tokenType.isLeft()) {
      return left(tokenType.value);
    }

    const sessionProps: SessionDomainProps = {
      userId: props.userId,
      token: token.value,
      tokenType: tokenType.value,
    };
    return right(sessionProps);
  }

  private static isValid(props: SessionDomainCreateParams): boolean {
    const { token, tokenType, userId } = props;
    const isValidUserId = validate(userId);

    return !!token && !!tokenType && isValidUserId;
  }

  public static create(
    props: SessionDomainCreateParams,
    id?: UniqueEntityID,
  ): Either<SessionDomainError, SessionDomain> {
    const isValid = this.isValid(props);
    if (!isValid) {
      return left(
        SessionDomainError.create(
          SessionDomainError.messages.invalidSessionProps,
          HttpStatus.BAD_REQUEST,
        ),
      );
    }

    const sessionPropsMounted = this.mountValueObject(props);
    if (sessionPropsMounted.isLeft()) {
      return left(sessionPropsMounted.value);
    }

    return right(new SessionDomain(sessionPropsMounted.value, id));
  }
}
