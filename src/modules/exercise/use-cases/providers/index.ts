import { CreateExercise } from '~/modules/exercise/use-cases/create-exercise';
import { GetExercise } from '~/modules/exercise/use-cases/get-exercise';
import { ListExercises } from '~/modules/exercise/use-cases/list-exercises';
import { UpdateExercise } from '~/modules/exercise/use-cases/update-exercise';

const useCaseProviders = [
  CreateExercise,
  ListExercises,
  GetExercise,
  UpdateExercise,
];

export default useCaseProviders;
