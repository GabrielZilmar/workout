import { v4 as uuid } from 'uuid';
import { UserDomainError } from '~/modules/users/domain/errors';
import {
  UserDomain,
  UserDomainCreateParams,
  UserDomainProps,
  UserDomainUpdateParams,
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
import { UserDto } from '~/modules/users/dto/user.dto';
import { UniqueEntityID } from '~/shared/domain/unique-entity-id';

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

  const getUserDomainProps = async ({
    username,
    email,
    password,
    age,
    weight,
    height,
  }: Partial<UserDomainCreateParams> = {}) => {
    const usernameVO = Username.create({ value: username ?? 'valid_username' });
    const emailVO = Email.create({ value: email ?? 'valid@email.com' });
    const passwordVO = await Password.create({
      value: password?.value ?? 'valid_password',
    });
    const ageVO = Age.create({ value: age ?? 20 });
    const weightVO = Weight.create({ value: weight ?? 80 });
    const heightVO = Height.create({ value: height ?? 180 });
    const isEmailVerified = IsEmailVerified.create();
    const isAdmin = IsAdmin.create();
    const deletedAt = DeletedAt.create();

    const userProps: UserDomainProps = {
      username: usernameVO.value as Username,
      email: emailVO.value as Email,
      password: passwordVO.value as Password,
      age: ageVO.value as Age,
      weight: weightVO.value as Weight,
      height: heightVO.value as Height,
      isEmailVerified,
      isAdmin,
      deletedAt,
    };

    return userProps;
  };

  it('should create a User domain', async () => {
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

  it('Should not create an User domain with an invalid props', async () => {
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

  it('Should update a User Domain', async () => {
    const userParams = getUserDomainParams();
    const userProps = await getUserDomainProps();

    const user = await UserDomain.create(userParams);

    expect({ ...(user.value as UserDomain).props, password: '' }).toEqual({
      ...userProps,
      password: '',
    });

    const updateParams: UserDomainUpdateParams = {
      username: 'update_username',
      age: 30,
      weight: 90,
      height: 190,
    };
    const updateUserProps = await getUserDomainProps(updateParams);

    const newUser = await (user.value as UserDomain).update(updateParams);
    expect({ ...(newUser.value as UserDomain).props, password: '' }).toEqual({
      ...updateUserProps,
      password: '',
    });
  });

  it('Should convert the user domain to user dto', async () => {
    const userParams = getUserDomainParams();
    const id = new UniqueEntityID(uuid());
    const user = await UserDomain.create(userParams, id);

    const userDto = (user.value as UserDomain).toDto();
    expect(userDto.isRight()).toBeTruthy();
    expect(userDto.value).toBeInstanceOf(UserDto);
  });

  it('Should not convert the user domain to user dto if the id is missing', async () => {
    const userParams = getUserDomainParams();
    const user = await UserDomain.create(userParams);

    const userDto = (user.value as UserDomain).toDto();
    expect(userDto.isLeft()).toBeTruthy();
    expect(userDto.value).toBeInstanceOf(Error);
  });
});
