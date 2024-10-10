import { ChangeManySetOrders } from '~/modules/set/domain/use-cases/change-many-set-orders';
import { CreateSet } from '~/modules/set/domain/use-cases/create-set';
import { DeleteSet } from '~/modules/set/domain/use-cases/delete-set';
import { ListSetByWorkoutExerciseId } from '~/modules/set/domain/use-cases/list-set-by-workout-exercise';
import { UpdateSet } from '~/modules/set/domain/use-cases/update-set';

const setUseCaseProviders = [
  CreateSet,
  ListSetByWorkoutExerciseId,
  UpdateSet,
  DeleteSet,
  ChangeManySetOrders,
];

export default setUseCaseProviders;
