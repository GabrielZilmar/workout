import { HttpException, HttpStatus, Provider } from '@nestjs/common';
import { Test, TestingModule } from '@nestjs/testing';
import { MuscleDomainMock } from 'test/utils/domains/muscle-domain-mock';
import getMuscleRepositoryProvider from 'test/utils/providers/muscle-repository';
import { MuscleDomainError } from '~/modules/muscle/domain/errors';
import MuscleDomain from '~/modules/muscle/domain/muscle.domain';
import { MuscleDtoError } from '~/modules/muscle/dto/errors';
import MuscleMapper from '~/modules/muscle/mappers/muscle.mapper';
import { CreateMuscleUseCase } from '~/modules/muscle/use-cases/create-muscle';
import MuscleRepository from '~/services/database/typeorm/repositories/muscle-repository';
import { left, right } from '~/shared/either';

type GetModuleTestParams = {
  muscleRepositoryProvider?: Provider;
};

describe('CreateMuscle', () => {
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
      muscleRepositoryProvider = getMuscleRepositoryProvider({
        muscleDomain,
      });
    }

    return Test.createTestingModule({
      imports: [],
      providers: [muscleRepositoryProvider, MuscleMapper, CreateMuscleUseCase],
    }).compile();
  };

  it('Should create a muscle', async () => {
    const createMuscleUseCase =
      module.get<CreateMuscleUseCase>(CreateMuscleUseCase);
    const createMuscleParams = MuscleDomainMock.getMuscleCreateParams();

    const muscleCreated = await createMuscleUseCase.execute(createMuscleParams);

    expect(muscleCreated).toEqual(muscleDomain.toDto().value);
  });

  it('Should not create a muscle with invalid params', async () => {
    const createMuscleUseCase =
      module.get<CreateMuscleUseCase>(CreateMuscleUseCase);
    const createMuscleParams = MuscleDomainMock.getMuscleCreateParams({
      name: '',
    });

    await expect(
      createMuscleUseCase.execute(createMuscleParams),
    ).rejects.toThrowError(
      new HttpException(
        { message: MuscleDomainError.messages.missingProps },
        HttpStatus.BAD_REQUEST,
      ),
    );
  });

  it('Should not create a muscle if muscle repository fails', async () => {
    const mockErrorMessage = 'Error';
    const mockErrorCode = 500;

    const createMuscleUseCase =
      module.get<CreateMuscleUseCase>(CreateMuscleUseCase);
    const createMuscleParams = MuscleDomainMock.getMuscleCreateParams();

    jest
      .spyOn(createMuscleUseCase['muscleRepository'], 'create')
      .mockResolvedValueOnce(
        left(MuscleDomainError.create(mockErrorMessage, mockErrorCode)),
      );

    await expect(
      createMuscleUseCase.execute(createMuscleParams),
    ).rejects.toThrowError(
      new HttpException({ message: mockErrorMessage }, mockErrorCode),
    );
  });

  it('Should not create a muscle if user muscle dto fails', async () => {
    const muscleDomainWithoutId = MuscleDomainMock.mountMuscleDomain({
      withoutId: true,
    });

    const muscleRepositoryMock = new MuscleRepository(
      new MuscleMapper(),
    ) as jest.Mocked<InstanceType<typeof MuscleRepository>>;
    muscleRepositoryMock.create = jest
      .fn()
      .mockResolvedValue(right(muscleDomainWithoutId));

    module = await getModuleTest({
      muscleRepositoryProvider: getMuscleRepositoryProvider({
        muscleRepository: muscleRepositoryMock,
        muscleDomain: muscleDomainWithoutId,
      }),
    });
    const createMuscleUseCase =
      module.get<CreateMuscleUseCase>(CreateMuscleUseCase);

    const createMuscleParams = MuscleDomainMock.getMuscleCreateParams();
    await expect(
      createMuscleUseCase.execute(createMuscleParams),
    ).rejects.toThrowError(
      new HttpException(
        { message: MuscleDtoError.messages.missingId },
        HttpStatus.INTERNAL_SERVER_ERROR,
      ),
    );
  });
});
