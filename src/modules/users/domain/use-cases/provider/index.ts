import { CreateUser } from '~/modules/users/domain/use-cases/create-user';
import { GetUser } from '~/modules/users/domain/use-cases/get-user';
import { ListUsers } from '~/modules/users/domain/use-cases/list-users';

const UseCaseProviders = [CreateUser, ListUsers, GetUser];

export default UseCaseProviders;
