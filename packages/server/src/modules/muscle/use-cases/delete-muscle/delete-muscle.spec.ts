import { HttpException, NotFoundException, Provider } from '@nestjs/common';
import { Test, TestingModule } from '@nestjs/testing';
import { MuscleDomainMock } from 'test/utils/domains/muscle-domain-mock';
import getMuscleRepositoryProvider from 'test/utils/providers/muscle-repository';
import MuscleDomain from '~/modules/muscle/domain/muscle.domain';
import MuscleMapper from '~/modules/muscle/mappers/muscle.mapper';
import { DeleteMuscle } from '~/modules/muscle/use-cases/delete-muscle';
import { MuscleUseCaseError } from '~/modules/muscle/use-cases/errors';
import { RepositoryError } from '~/services/database/typeorm/repositories/error';
import MuscleRepository from '~/services/database/typeorm/repositories/muscle-repository';
import { left } from '~/shared/either';

type GetModuleTestParams = {
  muscleRepositoryProvider?: Provider;
};

describe('DeleteMuscle use case', () => {
  let muscleDomain: MuscleDomain;
  let module: TestingModule;

  beforeEach(async () => {
    muscleDomain = MuscleDomainMock.mountMuscleDomain();
    module = await getModuleTest();
  });

  afterEach(() => {
    jest.restoreAllMocks();
    jest.clearAllMocks();
  });

  const getModuleTest = async ({
    muscleRepositoryProvider,
  }: GetModuleTestParams = {}) => {
    if (!muscleRepositoryProvider) {
      muscleRepositoryProvider = getMuscleRepositoryProvider();
    }

    return Test.createTestingModule({
      imports: [],
      providers: [muscleRepositoryProvider, MuscleMapper, DeleteMuscle],
    }).compile();
  };

  it('Should delete muscle', async () => {
    const deleteMuscleUseCase = module.get<DeleteMuscle>(DeleteMuscle);

    const deleteMuscleParams = {
      id: muscleDomain.id?.toString() as string,
    };

    const result = await deleteMuscleUseCase.execute(deleteMuscleParams);
    expect(result).toBeTruthy();
  });

  it('Should not delete the muscle if it does not exist', async () => {
    module = await getModuleTest({
      muscleRepositoryProvider: getMuscleRepositoryProvider({
        muscleDomain: null,
      }),
    });
    const deleteMuscleUseCase = module.get<DeleteMuscle>(DeleteMuscle);

    const deleteMuscleParams = {
      id: 'non-existing-id',
    };

    await expect(
      deleteMuscleUseCase.execute(deleteMuscleParams),
    ).rejects.toThrow(
      new NotFoundException(
        MuscleUseCaseError.messages.muscleNotFound(deleteMuscleParams.id),
      ),
    );
  });

  it('Should not delete the muscle if it fails', async () => {
    const errorMessage = 'Update error';
    const errorCode = 500;

    const muscleRepositoryMock = new MuscleRepository(
      new MuscleMapper(),
    ) as jest.Mocked<InstanceType<typeof MuscleRepository>>;
    muscleRepositoryMock.findOneById = jest
      .fn()
      .mockResolvedValue(muscleDomain);
    muscleRepositoryMock.delete = jest
      .fn()
      .mockResolvedValue(left(RepositoryError.create(errorMessage, errorCode)));

    module = await getModuleTest({
      muscleRepositoryProvider: getMuscleRepositoryProvider({
        muscleRepository: muscleRepositoryMock,
        muscleDomain,
      }),
    });
    const deleteMuscleUseCase = module.get<DeleteMuscle>(DeleteMuscle);

    const deleteMuscleParams = {
      id: muscleDomain.id?.toString() as string,
    };

    await expect(
      deleteMuscleUseCase.execute(deleteMuscleParams),
    ).rejects.toThrow(new HttpException({ message: errorMessage }, errorCode));
  });
});
