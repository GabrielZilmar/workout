import { v4 as uuid } from 'uuid';
import { UpdateUserParams } from '~/modules/users/domain/use-cases/update-user';

export class UpdateUserMock {
  public static readonly id = uuid();

  public static readonly updateUserParams: UpdateUserParams = {
    id: this.id,
    username: 'valid_username',
    age: 20,
    weight: 80,
    height: 180,
  };

  public static readonly userParams = {
    username: 'valid_username',
    email: 'valid@email.com',
    password: {
      value: 'valid_password',
    },
    age: 20,
    weight: 80,
    height: 180,
  };
}
