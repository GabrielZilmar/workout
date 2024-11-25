import { CreateExercise } from '~/modules/exercise/use-cases/create-exercise';
import { DeleteExercise } from '~/modules/exercise/use-cases/delete-exercise';
import { GetExercise } from '~/modules/exercise/use-cases/get-exercise';
import { ListExercises } from '~/modules/exercise/use-cases/list-exercises';
import { ExerciseProgress } from '~/modules/exercise/use-cases/progress-history';
import { UpdateExercise } from '~/modules/exercise/use-cases/update-exercise';

const useCaseProviders = [
  CreateExercise,
  ListExercises,
  GetExercise,
  UpdateExercise,
  DeleteExercise,
  ExerciseProgress,
];

export default useCaseProviders;
