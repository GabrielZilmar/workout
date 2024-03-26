import { CreateWorkoutExercise } from '~/modules/workout-exercise/use-cases/create-workout-exercise';
import { FindByWorkoutId } from '~/modules/workout-exercise/use-cases/find-by-workout-id';
import { UpdateWorkoutExercise } from '~/modules/workout-exercise/use-cases/update-workout-exercise';

const useCaseProviders = [
  CreateWorkoutExercise,
  FindByWorkoutId,
  UpdateWorkoutExercise,
];
export default useCaseProviders;
