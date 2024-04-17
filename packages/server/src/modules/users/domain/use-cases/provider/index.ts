import { CreateUser } from '~/modules/users/domain/use-cases/create-user';
import { DeleteUser } from '~/modules/users/domain/use-cases/delete-user';
import { GetMe } from '~/modules/users/domain/use-cases/get-me';
import { GetUser } from '~/modules/users/domain/use-cases/get-user';
import { ListUsers } from '~/modules/users/domain/use-cases/list-users';
import { UpdateUser } from '~/modules/users/domain/use-cases/update-user';

const UseCaseProviders = [
  CreateUser,
  ListUsers,
  GetUser,
  UpdateUser,
  DeleteUser,
  GetMe,
];

export default UseCaseProviders;
