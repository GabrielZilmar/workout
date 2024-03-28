import { CreateWorkout } from '~/modules/workout/use-cases/create-workout';
import DeleteWorkout from '~/modules/workout/use-cases/delete-workout';
import { GetWorkout } from '~/modules/workout/use-cases/get-workout';
import { ListPublicWorkouts } from '~/modules/workout/use-cases/list-public-workouts';
import { ListWorkouts } from '~/modules/workout/use-cases/list-workouts';
import { UpdateWorkout } from '~/modules/workout/use-cases/update-workout';

const workoutUseCaseProviders = [
  CreateWorkout,
  ListWorkouts,
  ListPublicWorkouts,
  GetWorkout,
  UpdateWorkout,
  DeleteWorkout,
];

export default workoutUseCaseProviders;
