import { CreateExercise } from '~/modules/exercise/use-cases/create-exercise';
import { ListExercises } from '~/modules/exercise/use-cases/list-exercises';

const useCaseProviders = [CreateExercise, ListExercises];

export default useCaseProviders;
