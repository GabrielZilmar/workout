import { ChangeWorkoutExercisesOrders } from '~/modules/workout-exercise/use-cases/change-workout-exercises-orders';
import { CreateWorkoutExercise } from '~/modules/workout-exercise/use-cases/create-workout-exercise';
import DeleteWorkoutExercise from '~/modules/workout-exercise/use-cases/delete-workout-exercise';
import { FindByWorkoutId } from '~/modules/workout-exercise/use-cases/find-by-workout-id';
import { GetWorkoutExerciseDetails } from '~/modules/workout-exercise/use-cases/get-workout-details';
import { UpdateWorkoutExercise } from '~/modules/workout-exercise/use-cases/update-workout-exercise';

const useCaseProviders = [
  CreateWorkoutExercise,
  FindByWorkoutId,
  UpdateWorkoutExercise,
  DeleteWorkoutExercise,
  GetWorkoutExerciseDetails,
  ChangeWorkoutExercisesOrders,
];
export default useCaseProviders;
