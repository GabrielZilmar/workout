import { CreateWorkout } from '~/modules/workout/use-cases/create-workout';
import { ListWorkouts } from '~/modules/workout/use-cases/list-workouts';

const workoutUseCaseProviders = [CreateWorkout, ListWorkouts];

export default workoutUseCaseProviders;
