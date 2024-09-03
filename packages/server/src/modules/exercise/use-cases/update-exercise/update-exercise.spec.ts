import {
  BadRequestException,
  HttpException,
  NotFoundException,
  Provider,
} from '@nestjs/common';
import { Test, TestingModule } from '@nestjs/testing';
import { ExerciseDomainMock } from 'test/utils/domains/exercise-domain-mock';
import getExerciseRepositoryProvider from 'test/utils/providers/exercise-repository-mock';
import ExerciseDomain from '~/modules/exercise/domain/exercise.domain';
import ExerciseMapper from '~/modules/exercise/mappers/exercise.mapper';
import { ExerciseUseCaseError } from '~/modules/exercise/use-cases/errors';
import { UpdateExercise } from '~/modules/exercise/use-cases/update-exercise';
import MuscleMapper from '~/modules/muscle/mappers/muscle.mapper';
import { RepositoryError } from '~/services/database/typeorm/repositories/error';
import { left } from '~/shared/either';

type GetModuleTestParams = {
  exerciseRepositoryProvider?: Provider;
};

describe('UpdateExercise use case', () => {
  let exerciseDomain: ExerciseDomain;
  let module: TestingModule;

  beforeEach(async () => {
    exerciseDomain = ExerciseDomainMock.mountExerciseDomain();
    module = await getModuleTest();
  });

  afterEach(() => {
    jest.restoreAllMocks();
    jest.clearAllMocks();
  });

  const getModuleTest = async ({
    exerciseRepositoryProvider,
  }: GetModuleTestParams = {}) => {
    if (!exerciseRepositoryProvider) {
      exerciseRepositoryProvider = getExerciseRepositoryProvider();
    }

    return Test.createTestingModule({
      imports: [],
      providers: [
        exerciseRepositoryProvider,
        ExerciseMapper,
        MuscleMapper,
        UpdateExercise,
      ],
    }).compile();
  };

  it('Should update an exercise', async () => {
    const updateExerciseUseCase = module.get<UpdateExercise>(UpdateExercise);
    const updateExerciseParams = {
      id: exerciseDomain.id?.toString() as string,
      name: 'New name',
    };

    const result = await updateExerciseUseCase.execute(updateExerciseParams);
    expect(result).toBeTruthy();
  });

  it('Should not update the exercise if it does not exist', async () => {
    module = await getModuleTest({
      exerciseRepositoryProvider: getExerciseRepositoryProvider({
        exerciseDomain: null,
      }),
    });

    const updateExerciseUseCase = module.get<UpdateExercise>(UpdateExercise);
    const updateExerciseParams = {
      id: exerciseDomain.id?.toString() as string,
      name: 'New name',
    };

    await expect(
      updateExerciseUseCase.execute(updateExerciseParams),
    ).rejects.toThrowError(
      new NotFoundException(
        ExerciseUseCaseError.messages.exerciseNotFound(updateExerciseParams.id),
      ),
    );
  });

  it('Should not update the exercise if the update domain fails', async () => {
    const updateExerciseUseCase = module.get<UpdateExercise>(UpdateExercise);
    const updateExerciseParams = {
      id: exerciseDomain.id?.toString() as string,
      name: 'a',
    };

    await expect(
      updateExerciseUseCase.execute(updateExerciseParams),
    ).rejects.toThrowError(HttpException);
  });

  it('Should not update the exercise if the repository update fails', async () => {
    const errorMock = RepositoryError.create('Error mock');

    const updateExerciseUseCase = module.get<UpdateExercise>(UpdateExercise);
    jest
      .spyOn(updateExerciseUseCase['exerciseRepository'], 'update')
      .mockResolvedValueOnce(left(errorMock));

    const updateExerciseParams = {
      id: exerciseDomain.id?.toString() as string,
      name: 'New name',
    };

    await expect(
      updateExerciseUseCase.execute(updateExerciseParams),
    ).rejects.toThrowError(
      new HttpException({ message: errorMock.message }, errorMock.code),
    );
  });
});
