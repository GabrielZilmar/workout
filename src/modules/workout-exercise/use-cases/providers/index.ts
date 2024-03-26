import { CreateWorkoutExercise } from '~/modules/workout-exercise/use-cases/create-workout-exercise';
import { FindByWorkoutId } from '~/modules/workout-exercise/use-cases/find-by-workout-id';

const useCaseProviders = [CreateWorkoutExercise, FindByWorkoutId];

export default useCaseProviders;
