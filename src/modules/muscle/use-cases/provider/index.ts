import { CreateMuscle } from '~/modules/muscle/use-cases/create-muscle';
import { ListMuscle } from '~/modules/muscle/use-cases/list-muscle';

const useCaseProviders = [CreateMuscle, ListMuscle];

export default useCaseProviders;
