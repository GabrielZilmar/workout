import { Provider } from '@nestjs/common';
import { SetDomainMock } from 'test/utils/domains/set-domain-mock';
import SetDomain from '~/modules/set/domain/set.domain';
import SetMapper from '~/modules/set/mappers/set.mapper';
import SetRepository from '~/services/database/typeorm/repositories/set-repository';
import { right } from '~/shared/either';

type GetSetRepositoryProviderParams = {
  setRepository?: SetRepository;
  setDomain?: SetDomain | null;
};

const getSetRepositoryProvider = ({
  setRepository,
  setDomain,
}: GetSetRepositoryProviderParams) => {
  if (setDomain === undefined) {
    setDomain = SetDomainMock.mountSetDomain();
  }

  return {
    provide: SetRepository,
    useFactory: () => {
      if (!setRepository) {
        setRepository = new SetRepository(new SetMapper()) as jest.Mocked<
          InstanceType<typeof SetRepository>
        >;

        setRepository.create = jest.fn().mockResolvedValue(right(setDomain));
        setRepository.findOneById = jest.fn().mockResolvedValue(setDomain);
        setRepository.findByWorkoutExerciseId = jest.fn().mockResolvedValue({
          items: [setDomain],
          count: 1,
        });
        setRepository.update = jest.fn().mockResolvedValue(right(true));
        setRepository.delete = jest.fn().mockResolvedValue(right(true));
      }

      return setRepository;
    },
  } as Provider;
};

export default getSetRepositoryProvider;
