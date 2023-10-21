import { UserDomainError } from '~/modules/users/domain/errors';
import {
  UserDomain,
  UserDomainCreateParams,
  UserDomainProps,
} from '~/modules/users/domain/users.domain';
import Age from '~/modules/users/domain/value-objects/age';
import Height from '~/modules/users/domain/value-objects/height';
import Username from '~/modules/users/domain/value-objects/username';
import Weight from '~/modules/users/domain/value-objects/weight';
import { Either } from '~/shared/either';

describe('UserDomain', () => {
  afterEach(() => {
    jest.restoreAllMocks();
  });

  const getUserDomainParams = () => {
    const userParams: UserDomainCreateParams = {
      username: 'valid_username',
      age: 20,
      weight: 80,
      height: 180,
    };

    return userParams;
  };

  const getUserDomainProps = async () => {
    const username = Username.create({ value: 'valid_username' });
    const age = Age.create({ value: 20 });
    const weight = Weight.create({ value: 80 });
    const height = Height.create({ value: 180 });

    const userProps: UserDomainProps = {
      username: username.value as Username,
      age: age.value as Age,
      weight: weight.value as Weight,
      height: height.value as Height,
    };

    return userProps;
  };

  it('should create an User domain', async () => {
    const userParams = getUserDomainParams();
    const user = await UserDomain.create(userParams);

    expect(user.isRight).toBeTruthy();
    expect(user.value).toBeInstanceOf(UserDomain);

    const userProps = await getUserDomainProps();
    expect((user.value as UserDomain).props).toEqual(userProps);
  });

  it('should not create an User domain with an invalid props', async () => {
    const userParams = getUserDomainParams();
    const user = await UserDomain.create({
      ...userParams,
      username: '',
    });

    expect(user.isLeft).toBeTruthy();
    expect(user.value).toBeInstanceOf(UserDomainError);
    expect((user.value as UserDomainError).message).toBe(
      UserDomainError.messages.missingProps,
    );
  });
});
