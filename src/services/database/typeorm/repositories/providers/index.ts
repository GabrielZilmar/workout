import TokenRepository from '~/services/database/typeorm/repositories/token-repository';
import UserRepository from '~/services/database/typeorm/repositories/users-repository';
import WorkoutRepository from '~/services/database/typeorm/repositories/workout-repository';

const repositoriesProviders = [
  UserRepository,
  TokenRepository,
  WorkoutRepository,
];

export default repositoriesProviders;
