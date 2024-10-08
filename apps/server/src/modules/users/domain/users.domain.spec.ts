import { UserDomainMock } from 'test/utils/domains/user-domain-mock';
import { v4 as uuid } from 'uuid';
import { UserDomainError } from '~/modules/users/domain/errors';
import {
  UserDomain,
  UserDomainUpdateParams,
} from '~/modules/users/domain/users.domain';
import { UserDto } from '~/modules/users/dto/user.dto';
import { UniqueEntityID } from '~/shared/domain/unique-entity-id';

describe('UserDomain', () => {
  afterEach(() => {
    jest.restoreAllMocks();
  });

  it('should create a User domain', async () => {
    let userParams = UserDomainMock.getUserDomainCreateParams();
    let user = await UserDomain.create(userParams);

    expect(user.isRight).toBeTruthy();
    expect(user.value).toBeInstanceOf(UserDomain);

    let userProps = await UserDomainMock.getUserDomainProps();
    expect(
      (user.value as UserDomain).password.comparePassword(
        userParams.password.value,
      ),
    ).toBeTruthy();
    expect({ ...(user.value as UserDomain).props, password: '' }).toEqual({
      ...userProps,
      password: '',
    });

    const additionalUserProps = {
      isEmailVerified: true,
      isAdmin: true,
      deletedAt: new Date(),
    };
    userParams = UserDomainMock.getUserDomainCreateParams({
      ...additionalUserProps,
    });
    user = await UserDomain.create(userParams);

    expect(user.isRight).toBeTruthy();
    expect(user.value).toBeInstanceOf(UserDomain);

    userProps = await UserDomainMock.getUserDomainProps({
      ...additionalUserProps,
    });
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
    const userParams = UserDomainMock.getUserDomainCreateParams();
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
    const userParams = UserDomainMock.getUserDomainCreateParams();
    const userProps = await UserDomainMock.getUserDomainProps();

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
    const updateUserProps = await UserDomainMock.getUserDomainProps(
      updateParams,
    );

    const newUser = await (user.value as UserDomain).update(updateParams);
    expect({ ...(newUser.value as UserDomain).props, password: '' }).toEqual({
      ...updateUserProps,
      password: '',
    });
  });

  it('Should convert the user domain to user dto', async () => {
    const userParams = UserDomainMock.getUserDomainCreateParams();
    const id = new UniqueEntityID(uuid());
    const user = await UserDomain.create(userParams, id);

    const userDto = (user.value as UserDomain).toDto();
    expect(userDto.isRight()).toBeTruthy();
    expect(userDto.value).toBeInstanceOf(UserDto);
  });

  it('Should not convert the user domain to user dto if the id is missing', async () => {
    const userParams = UserDomainMock.getUserDomainCreateParams();
    const user = await UserDomain.create(userParams);

    const userDto = (user.value as UserDomain).toDto();
    expect(userDto.isLeft()).toBeTruthy();
    expect(userDto.value).toBeInstanceOf(Error);
  });

  it('Should delete a user domain', async () => {
    const userParams = UserDomainMock.getUserDomainCreateParams();

    const user = await UserDomain.create(userParams);
    expect((user.value as UserDomain).props.deletedAt.value).toBeFalsy();

    const userDeleted = (user.value as UserDomain).delete();
    expect(userDeleted.props.deletedAt.value).toBeTruthy();
  });

  it('Should update the user password', async () => {
    const password = 'ValidAndStrongPassword!!007';
    const userDomain = await UserDomainMock.mountUserDomain({
      password: { value: password },
    });

    const newPassword = 'New-ValidAndStrongPassword!!007';
    const userDomainUpdate = await userDomain.changePassword({
      value: newPassword,
    });

    expect(userDomainUpdate.value).toBeInstanceOf(UserDomain);
    expect(
      await (userDomainUpdate.value as UserDomain).password.comparePassword(
        newPassword,
      ),
    ).toBeTruthy();
  });
});
