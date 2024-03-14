import { CreateWorkout } from '~/modules/workout/use-cases/create-workout';
import { ListPublicWorkouts } from '~/modules/workout/use-cases/list-public-workouts';
import { ListWorkouts } from '~/modules/workout/use-cases/list-workouts';

const workoutUseCaseProviders = [
  CreateWorkout,
  ListWorkouts,
  ListPublicWorkouts,
];

export default workoutUseCaseProviders;
