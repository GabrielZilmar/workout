import ExerciseRepository from '~/services/database/typeorm/repositories/exercise-repository';
import MuscleRepository from '~/services/database/typeorm/repositories/muscle-repository';
import SetRepository from '~/services/database/typeorm/repositories/set-repository';
import TokenRepository from '~/services/database/typeorm/repositories/token-repository';
import UserRepository from '~/services/database/typeorm/repositories/users-repository';
import WorkoutExerciseRepository from '~/services/database/typeorm/repositories/workout-exercise-repository';
import WorkoutRepository from '~/services/database/typeorm/repositories/workout-repository';

const repositoriesProviders = [
  UserRepository,
  TokenRepository,
  WorkoutRepository,
  MuscleRepository,
  ExerciseRepository,
  WorkoutExerciseRepository,
  SetRepository,
];

export default repositoriesProviders;
