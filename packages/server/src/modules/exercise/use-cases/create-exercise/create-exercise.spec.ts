import {
  HttpException,
  HttpStatus,
  NotFoundException,
  Provider,
} from '@nestjs/common';
import { Test, TestingModule } from '@nestjs/testing';
import { ExerciseDomainMock } from 'test/utils/domains/exercise-domain-mock';
import { MuscleDomainMock } from 'test/utils/domains/muscle-domain-mock';
import getExerciseRepositoryProvider from 'test/utils/providers/exercise-repository-mock';
import getMuscleRepositoryProvider from 'test/utils/providers/muscle-repository';
import { ExerciseDomainError } from '~/modules/exercise/domain/errors';
import ExerciseDomain from '~/modules/exercise/domain/exercise.domain';
import { ExerciseDtoError } from '~/modules/exercise/dto/errors';
import ExerciseMapper from '~/modules/exercise/mappers/exercise.mapper';
import { CreateExercise } from '~/modules/exercise/use-cases/create-exercise';
import { ExerciseUseCaseError } from '~/modules/exercise/use-cases/errors';
import MuscleDomain from '~/modules/muscle/domain/muscle.domain';
import MuscleMapper from '~/modules/muscle/mappers/muscle.mapper';
import { left } from '~/shared/either';

type GetModuleTestParams = {
  exerciseRepositoryProvider?: Provider;
  muscleRepositoryProvider?: Provider;
};

describe('CreateExercise use case', () => {
  let exerciseDomain: ExerciseDomain;
  let muscleDomain: MuscleDomain;
  let module: TestingModule;

  beforeEach(async () => {
    exerciseDomain = ExerciseDomainMock.mountExerciseDomain();
    muscleDomain = MuscleDomainMock.mountMuscleDomain();
    module = await getModuleTest();
  });

  afterEach(() => {
    jest.restoreAllMocks();
    jest.clearAllMocks();
  });

  const getModuleTest = async ({
    exerciseRepositoryProvider,
    muscleRepositoryProvider,
  }: GetModuleTestParams = {}) => {
    if (!exerciseRepositoryProvider) {
      exerciseRepositoryProvider = getExerciseRepositoryProvider({
        exerciseDomain,
      });
    }

    if (!muscleRepositoryProvider) {
      muscleRepositoryProvider = getMuscleRepositoryProvider({
        muscleDomain,
      });
    }

    return Test.createTestingModule({
      imports: [],
      providers: [
        exerciseRepositoryProvider,
        muscleRepositoryProvider,
        ExerciseMapper,
        MuscleMapper,
        CreateExercise,
      ],
    }).compile();
  };

  it('Should create an exercise', async () => {
    const createExerciseUseCase = module.get<CreateExercise>(CreateExercise);
    const createExerciseParams = ExerciseDomainMock.getExerciseCreateParams();

    const exerciseCreated = await createExerciseUseCase.execute(
      createExerciseParams,
    );

    expect(exerciseCreated).toEqual(exerciseDomain.toDto().value);
  });

  it('Should not create an exercise with invalid params', async () => {
    const createExerciseUseCase = module.get<CreateExercise>(CreateExercise);
    const createByIdSpy = jest.spyOn(
      createExerciseUseCase['exerciseRepository'],
      'create',
    );

    const createExerciseParams = ExerciseDomainMock.getExerciseCreateParams({
      name: '',
    });

    await expect(
      createExerciseUseCase.execute(createExerciseParams),
    ).rejects.toThrowError(
      new HttpException(
        { message: ExerciseDomainError.messages.missingProps },
        HttpStatus.BAD_REQUEST,
      ),
    );
    expect(createByIdSpy).not.toHaveBeenCalled();
  });

  it('Should not create an exercise if muscle does not exist', async () => {
    const createExerciseUseCase = module.get<CreateExercise>(CreateExercise);
    const findMuscleByIdSpy = jest.spyOn(
      createExerciseUseCase['muscleRepository'],
      'findOneById',
    );
    const createByIdSpy = jest.spyOn(
      createExerciseUseCase['exerciseRepository'],
      'create',
    );

    const createExerciseParams = ExerciseDomainMock.getExerciseCreateParams();

    findMuscleByIdSpy.mockResolvedValueOnce(null);

    await expect(
      createExerciseUseCase.execute(createExerciseParams),
    ).rejects.toThrowError(
      new NotFoundException(
        ExerciseUseCaseError.messages.muscleNotFound(
          createExerciseParams.muscleId,
        ),
      ),
    );
    expect(findMuscleByIdSpy).toHaveBeenCalledWith(
      createExerciseParams.muscleId,
    );
    expect(createByIdSpy).not.toHaveBeenCalled();
  });

  it('Should not create an exercise if exercise repository fails', async () => {
    const exerciseMapper = module.get<ExerciseMapper>(ExerciseMapper);
    const createExerciseUseCase = module.get<CreateExercise>(CreateExercise);
    const createByIdSpy = jest.spyOn(
      createExerciseUseCase['exerciseRepository'],
      'create',
    );

    const createExerciseParams = ExerciseDomainMock.getExerciseCreateParams();

    const mockErrorMessage = 'Error';
    const mockErrorCode = 500;
    createByIdSpy.mockResolvedValueOnce(
      left(ExerciseDomainError.create(mockErrorMessage, mockErrorCode)),
    );

    await expect(
      createExerciseUseCase.execute(createExerciseParams),
    ).rejects.toThrowError(
      new HttpException({ message: mockErrorMessage }, mockErrorCode),
    );
    expect(createByIdSpy).toHaveBeenCalledWith(
      exerciseMapper.toPersistence(
        ExerciseDomain.create(createExerciseParams).value as ExerciseDomain,
      ),
    );
  });

  it('Should not create an exercise if exercise dto fails', async () => {
    const exerciseDomainWithoutId = ExerciseDomainMock.mountExerciseDomain({
      withoutId: true,
    });

    const module = await getModuleTest({
      exerciseRepositoryProvider: getExerciseRepositoryProvider({
        exerciseDomain: exerciseDomainWithoutId,
      }),
    });

    const createExerciseUseCase = module.get<CreateExercise>(CreateExercise);
    const createExerciseParams = ExerciseDomainMock.getExerciseCreateParams();

    await expect(
      createExerciseUseCase.execute(createExerciseParams),
    ).rejects.toThrowError(
      new HttpException(
        { message: ExerciseDtoError.messages.missingId },
        HttpStatus.INTERNAL_SERVER_ERROR,
      ),
    );
  });
});
