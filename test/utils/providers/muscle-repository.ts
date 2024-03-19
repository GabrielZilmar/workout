import { Provider } from '@nestjs/common';
import { MuscleDomainMock } from 'test/utils/domains/muscle-domain-mock';
import MuscleDomain from '~/modules/muscle/domain/muscle.domain';
import MuscleMapper from '~/modules/muscle/mappers/muscle.mapper';
import MuscleRepository from '~/services/database/typeorm/repositories/muscle-repository';
import { right } from '~/shared/either';

type GetMuscleRepositoryProviderParams = {
  muscleRepository?: MuscleRepository;
  muscleDomain?: MuscleDomain;
};

const getMuscleRepositoryProvider = ({
  muscleRepository,
  muscleDomain,
}: GetMuscleRepositoryProviderParams = {}) => {
  if (!muscleDomain) {
    muscleDomain = MuscleDomainMock.mountMuscleDomain();
  }

  return {
    provide: MuscleRepository,
    useFactory: () => {
      if (!muscleRepository) {
        muscleRepository = new MuscleRepository(
          new MuscleMapper(),
        ) as jest.Mocked<InstanceType<typeof MuscleRepository>>;
        muscleRepository.create = jest
          .fn()
          .mockResolvedValue(right(muscleDomain));

        muscleRepository.find = jest
          .fn()
          .mockResolvedValue({ items: [muscleDomain], count: 1 });
      }

      return muscleRepository;
    },
    inject: [],
  } as Provider;
};

export default getMuscleRepositoryProvider;
