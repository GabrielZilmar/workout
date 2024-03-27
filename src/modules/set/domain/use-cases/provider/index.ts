import { CreateSet } from '~/modules/set/domain/use-cases/create-set';
import { ListByWorkoutExerciseId } from '~/modules/set/domain/use-cases/list-by-workout-exercise';

const setUseCaseProviders = [CreateSet, ListByWorkoutExerciseId];

export default setUseCaseProviders;
