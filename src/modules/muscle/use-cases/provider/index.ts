import { CreateMuscle } from '~/modules/muscle/use-cases/create-muscle';
import { ListMuscle } from '~/modules/muscle/use-cases/list-muscle';
import { UpdateMuscle } from '~/modules/muscle/use-cases/update-muscle';

const useCaseProviders = [CreateMuscle, ListMuscle, UpdateMuscle];

export default useCaseProviders;
