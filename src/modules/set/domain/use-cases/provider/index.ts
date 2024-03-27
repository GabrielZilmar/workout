import { CreateSet } from '~/modules/set/domain/use-cases/create-set';
import { ListSetByWorkoutExerciseId } from '~/modules/set/domain/use-cases/list-set-by-workout-exercise';

const setUseCaseProviders = [CreateSet, ListSetByWorkoutExerciseId];

export default setUseCaseProviders;
