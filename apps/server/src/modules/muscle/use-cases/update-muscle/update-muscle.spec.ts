import {
  HttpException,
  HttpStatus,
  NotFoundException,
  Provider,
} from '@nestjs/common';
import { Test, TestingModule } from '@nestjs/testing';
import { MuscleDomainMock } from 'test/utils/domains/muscle-domain-mock';
import getMuscleRepositoryProvider from 'test/utils/providers/muscle-repository';
import { MuscleDomainError } from '~/modules/muscle/domain/errors';
import MuscleDomain from '~/modules/muscle/domain/muscle.domain';
import MuscleMapper from '~/modules/muscle/mappers/muscle.mapper';
import { MuscleUseCaseError } from '~/modules/muscle/use-cases/errors';
import { UpdateMuscle } from '~/modules/muscle/use-cases/update-muscle';
import { RepositoryError } from '~/services/database/typeorm/repositories/error';
import MuscleRepository from '~/services/database/typeorm/repositories/muscle-repository';
import { left } from '~/shared/either';

type GetModuleTestParams = {
  muscleRepositoryProvider?: Provider;
};

describe('UpdateMuscle use case', () => {
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
      providers: [muscleRepositoryProvider, MuscleMapper, UpdateMuscle],
    }).compile();
  };

  it('Should update muscle', async () => {
    const updateMuscleUseCase = module.get<UpdateMuscle>(UpdateMuscle);

    const updateMuscleParams = {
      id: muscleDomain.id?.toString() as string,
      name: 'New name',
    };

    const result = await updateMuscleUseCase.execute(updateMuscleParams);
    expect(result).toBeTruthy();
  });

  it('Should not update the muscle if it does not exist', async () => {
    module = await getModuleTest({
      muscleRepositoryProvider: getMuscleRepositoryProvider({
        muscleDomain: null,
      }),
    });
    const updateMuscleUseCase = module.get<UpdateMuscle>(UpdateMuscle);

    const updateMuscleParams = {
      id: 'non-existing-id',
      name: 'New name',
    };

    await expect(
      updateMuscleUseCase.execute(updateMuscleParams),
    ).rejects.toThrow(
      new NotFoundException(
        MuscleUseCaseError.messages.muscleNotFound(updateMuscleParams.id),
      ),
    );
  });

  it('Should not update the muscle if name is invalid', async () => {
    module = await getModuleTest({
      muscleRepositoryProvider: getMuscleRepositoryProvider({
        muscleDomain,
      }),
    });
    const updateMuscleUseCase = module.get<UpdateMuscle>(UpdateMuscle);

    const updateMuscleParams = {
      id: muscleDomain.id?.toString() as string,
      name: 'ab',
    };

    await expect(
      updateMuscleUseCase.execute(updateMuscleParams),
    ).rejects.toThrow(
      new HttpException(
        { message: MuscleDomainError.messages.invalidMuscleName },
        HttpStatus.BAD_REQUEST,
      ),
    );
  });

  it('Should not update the muscle if repository update fails', async () => {
    const errorMessage = 'Update error';
    const errorCode = 500;

    const muscleRepositoryMock = new MuscleRepository(
      new MuscleMapper(),
    ) as jest.Mocked<InstanceType<typeof MuscleRepository>>;
    muscleRepositoryMock.findOneById = jest
      .fn()
      .mockResolvedValue(muscleDomain);
    muscleRepositoryMock.update = jest
      .fn()
      .mockResolvedValue(left(RepositoryError.create(errorMessage, errorCode)));

    module = await getModuleTest({
      muscleRepositoryProvider: getMuscleRepositoryProvider({
        muscleRepository: muscleRepositoryMock,
        muscleDomain,
      }),
    });
    const updateMuscleUseCase = module.get<UpdateMuscle>(UpdateMuscle);

    const updateMuscleParams = {
      id: muscleDomain.id?.toString() as string,
      name: 'New name',
    };

    await expect(
      updateMuscleUseCase.execute(updateMuscleParams),
    ).rejects.toThrow(new HttpException({ message: errorMessage }, errorCode));
  });
});
