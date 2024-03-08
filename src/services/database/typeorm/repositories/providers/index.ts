import TokenRepository from '~/services/database/typeorm/repositories/token-repository';
import UserRepository from '~/services/database/typeorm/repositories/users-repository';

const repositoriesProviders = [UserRepository, TokenRepository];

export default repositoriesProviders;
