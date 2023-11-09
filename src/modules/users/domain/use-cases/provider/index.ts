import { CreateUser } from '~/modules/users/domain/use-cases/create-user';
import { ListUsers } from '~/modules/users/domain/use-cases/list-users';

const UseCaseProviders = [CreateUser, ListUsers];

export default UseCaseProviders;
