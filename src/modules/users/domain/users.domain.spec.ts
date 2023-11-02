import { UserDomainError } from '~/modules/users/domain/errors';
import {
  UserDomain,
  UserDomainCreateParams,
  UserDomainProps,
} from '~/modules/users/domain/users.domain';
import Age from '~/modules/users/domain/value-objects/age';
import DeletedAt from '~/modules/users/domain/value-objects/deleted-at';
import Email from '~/modules/users/domain/value-objects/email';
import Height from '~/modules/users/domain/value-objects/height';
import IsAdmin from '~/modules/users/domain/value-objects/is-admin';
import IsEmailVerified from '~/modules/users/domain/value-objects/is-email-verified';
import Password from '~/modules/users/domain/value-objects/password';
import Username from '~/modules/users/domain/value-objects/username';
import Weight from '~/modules/users/domain/value-objects/weight';

describe('UserDomain', () => {
  afterEach(() => {
    jest.restoreAllMocks();
  });

  const getUserDomainParams = () => {
    const userParams: UserDomainCreateParams = {
      username: 'valid_username',
      email: 'valid@email.com',
      password: {
        value: 'valid_password',
      },
      age: 20,
      weight: 80,
      height: 180,
    };

    return userParams;
  };

  const getUserDomainProps = async () => {
    const username = Username.create({ value: 'valid_username' });
    const email = Email.create({ value: 'valid@email.com' });
    const password = await Password.create({ value: 'valid_password' });
    const age = Age.create({ value: 20 });
    const weight = Weight.create({ value: 80 });
    const height = Height.create({ value: 180 });
    const isEmailVerified = IsEmailVerified.create();
    const isAdmin = IsAdmin.create();
    const deletedAt = DeletedAt.create();

    const userProps: UserDomainProps = {
      username: username.value as Username,
      email: email.value as Email,
      password: password.value as Password,
      age: age.value as Age,
      weight: weight.value as Weight,
      height: height.value as Height,
      isEmailVerified,
      isAdmin,
      deletedAt,
    };

    return userProps;
  };

  it('should create an User domain', async () => {
    const userParams = getUserDomainParams();
    const user = await UserDomain.create(userParams);

    expect(user.isRight).toBeTruthy();
    expect(user.value).toBeInstanceOf(UserDomain);

    const userProps = await getUserDomainProps();
    expect(
      (user.value as UserDomain).password.comparePassword(
        userParams.password.value,
      ),
    ).toBeTruthy();
    expect({ ...(user.value as UserDomain).props, password: '' }).toEqual({
      ...userProps,
      password: '',
    });
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
