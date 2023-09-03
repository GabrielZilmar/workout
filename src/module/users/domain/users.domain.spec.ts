import { UserDomainError } from '~/module/users/domain/errors';
import {
  UserDomain,
  UserDomainProps,
} from '~/module/users/domain/users.domain';
import Age from '~/module/users/domain/value-objects/age';
import Height from '~/module/users/domain/value-objects/height';
import SSOId from '~/module/users/domain/value-objects/sso-id';
import Username from '~/module/users/domain/value-objects/username';
import Weight from '~/module/users/domain/value-objects/weight';

describe('UserDomain', () => {
  afterEach(() => {
    jest.restoreAllMocks();
  });

  type UserDomainPublic = UserDomain & {
    isValid(): boolean;
  };

  type SSOIdPublicClass = SSOId & {
    isValid(ssoId: string): Promise<boolean>;
  };

  it('should create an User domain', async () => {
    jest
      .spyOn(SSOId as unknown as SSOIdPublicClass, 'isValid')
      .mockImplementation(() => Promise.resolve(true));

    const ssoId = await SSOId.create({ value: 'valid_sso_id' });
    const userName = Username.create({ value: 'valid_username' });
    const age = Age.create({ value: 20 });
    const weight = Weight.create({ value: 80 });
    const height = Height.create({ value: 180 });

    const userProps: UserDomainProps = {
      ssoId: ssoId.value as SSOId,
      userName: userName.value as Username,
      age: age.value as Age,
      weight: weight.value as Weight,
      height: height.value as Height,
    };
    const user = UserDomain.create(userProps);

    expect(user.isRight).toBeTruthy();
    expect(user.value).toBeInstanceOf(UserDomain);
    expect((user.value as UserDomain).props).toEqual(userProps);
  });

  it('should not create an User domain with an invalid props', async () => {
    jest
      .spyOn(SSOId as unknown as SSOIdPublicClass, 'isValid')
      .mockImplementation(() => Promise.resolve(true));

    const ssoId = await SSOId.create({ value: 'valid_sso_id' });
    const userName = Username.create({ value: 'valid_username' });
    const age = Age.create({ value: 20 });
    const weight = Weight.create({ value: 80 });
    const height = Height.create({ value: 180 });

    const userProps: UserDomainProps = {
      ssoId: ssoId.value as SSOId,
      userName: userName.value as Username,
      age: age.value as Age,
      weight: weight.value as Weight,
      height: height.value as Height,
    };

    const user = UserDomain.create({
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
