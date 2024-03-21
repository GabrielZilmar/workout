import { CreateExercise } from '~/modules/exercise/use-cases/create-exercise';
import { GetExercise } from '~/modules/exercise/use-cases/get-exercise';
import { ListExercises } from '~/modules/exercise/use-cases/list-exercises';

const useCaseProviders = [CreateExercise, ListExercises, GetExercise];

export default useCaseProviders;
