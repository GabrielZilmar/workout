import { CreateUser } from '~/modules/users/domain/use-cases/create-user';
import { GetUser } from '~/modules/users/domain/use-cases/get-user';
import { ListUsers } from '~/modules/users/domain/use-cases/list-users';
import { UpdateUser } from '~/modules/users/domain/use-cases/update-user';

const UseCaseProviders = [CreateUser, ListUsers, GetUser, UpdateUser];

export default UseCaseProviders;
