import { HttpException, NotFoundException, Provider } from '@nestjs/common';
import { Test, TestingModule } from '@nestjs/testing';
import { ExerciseDomainMock } from 'test/utils/domains/exercise-domain-mock';
import getExerciseRepositoryProvider from 'test/utils/providers/exercise-repository-mock';
import ExerciseDomain from '~/modules/exercise/domain/exercise.domain';
import ExerciseMapper from '~/modules/exercise/mappers/exercise.mapper';
import { DeleteExercise } from '~/modules/exercise/use-cases/delete-exercise';
import { ExerciseUseCaseError } from '~/modules/exercise/use-cases/errors';
import { RepositoryError } from '~/services/database/typeorm/repositories/error';
import { left } from '~/shared/either';

type GetModuleTestParams = {
  exerciseRepositoryProvider?: Provider;
};

describe('DeleteExercise use case', () => {
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
      providers: [exerciseRepositoryProvider, ExerciseMapper, DeleteExercise],
    }).compile();
  };

  it('Should delete exercise', async () => {
    const deleteExerciseUseCase = module.get<DeleteExercise>(DeleteExercise);

    const deleteExerciseParams = {
      id: exerciseDomain.id?.toString() as string,
    };

    const result = await deleteExerciseUseCase.execute(deleteExerciseParams);
    expect(result).toBeTruthy();
  });

  it('Should not delete the exercise if it does not exist', async () => {
    const deleteExerciseUseCase = module.get<DeleteExercise>(DeleteExercise);
    jest
      .spyOn(deleteExerciseUseCase['exerciseRepository'], 'findOneById')
      .mockResolvedValue(null);
    const deleteSpyOn = jest.spyOn(
      deleteExerciseUseCase['exerciseRepository'],
      'delete',
    );

    await expect(
      deleteExerciseUseCase.execute({
        id: exerciseDomain.id?.toString() as string,
      }),
    ).rejects.toThrowError(
      new NotFoundException(
        ExerciseUseCaseError.messages.exerciseNotFound(
          exerciseDomain.id?.toString() as string,
        ),
      ),
    );
    expect(deleteSpyOn).not.toHaveBeenCalled();
  });

  it('Should not delete the exercise if it fails', async () => {
    const errorMock = RepositoryError.create('Error mock');

    const deleteExerciseUseCase = module.get<DeleteExercise>(DeleteExercise);
    jest
      .spyOn(deleteExerciseUseCase['exerciseRepository'], 'delete')
      .mockResolvedValue(left(errorMock));

    await expect(
      deleteExerciseUseCase.execute({
        id: exerciseDomain.id?.toString() as string,
      }),
    ).rejects.toThrowError(
      new HttpException(errorMock.message, errorMock.code),
    );
  });
});
