import { CreateMuscle } from '~/modules/muscle/use-cases/create-muscle';
import { DeleteMuscle } from '~/modules/muscle/use-cases/delete-muscle';
import { ListMuscle } from '~/modules/muscle/use-cases/list-muscle';
import { UpdateMuscle } from '~/modules/muscle/use-cases/update-muscle';

const useCaseProviders = [CreateMuscle, ListMuscle, UpdateMuscle, DeleteMuscle];

export default useCaseProviders;
