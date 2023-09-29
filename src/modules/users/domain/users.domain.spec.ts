import { UserDomainError } from '~/modules/users/domain/errors';
import {
  UserDomain,
  UserDomainProps,
} from '~/modules/users/domain/users.domain';
import Age from '~/modules/users/domain/value-objects/age';
import Height from '~/modules/users/domain/value-objects/height';
import SSOId from '~/modules/users/domain/value-objects/sso-id';
import Username from '~/modules/users/domain/value-objects/username';
import Weight from '~/modules/users/domain/value-objects/weight';
import { Either, right } from '~/shared/either';

describe('UserDomain', () => {
  afterEach(() => {
    jest.restoreAllMocks();
  });

  type SSOIdPublicClass = SSOId & {
    isValid(ssoId: string): Promise<Either<UserDomainError, true>>;
  };

  const getUserDomainProps = async () => {
    jest
      .spyOn(SSOId as unknown as SSOIdPublicClass, 'isValid')
      .mockImplementation(() => Promise.resolve(right(true)));

    const ssoId = await SSOId.create({ value: 'valid_sso_id' });
    const username = Username.create({ value: 'valid_username' });
    const age = Age.create({ value: 20 });
    const weight = Weight.create({ value: 80 });
    const height = Height.create({ value: 180 });

    const userProps: UserDomainProps = {
      ssoId: ssoId.value as SSOId,
      username: username.value as Username,
      age: age.value as Age,
      weight: weight.value as Weight,
      height: height.value as Height,
    };

    return userProps;
  };

  it('should create an User domain', async () => {
    const userProps = await getUserDomainProps();
    const user = await UserDomain.create(userProps);

    expect(user.isRight).toBeTruthy();
    expect(user.value).toBeInstanceOf(UserDomain);
    expect((user.value as UserDomain).props).toEqual(userProps);
  });

  it('should not create an User domain with an invalid props', async () => {
    const userProps = await getUserDomainProps();
    const user = await UserDomain.create({
      ...userProps,
      ssoId: null,
    });

    expect(user.isLeft).toBeTruthy();
    expect(user.value).toBeInstanceOf(UserDomainError);
    expect((user.value as UserDomainError).message).toBe(
      UserDomainError.messages.missingProps,
    );
  });
});
