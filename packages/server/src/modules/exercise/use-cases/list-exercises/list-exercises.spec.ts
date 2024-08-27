import { HttpException, HttpStatus } from '@nestjs/common';
import { Test, TestingModule } from '@nestjs/testing';
import { ExerciseDomainMock } from 'test/utils/domains/exercise-domain-mock';
import getExerciseRepositoryProvider from 'test/utils/providers/exercise-repository-mock';
import ExerciseDomain from '~/modules/exercise/domain/exercise.domain';
import { ExerciseDtoError } from '~/modules/exercise/dto/errors';
import ExerciseMapper from '~/modules/exercise/mappers/exercise.mapper';
import { ListExercises } from '~/modules/exercise/use-cases/list-exercises';
import MuscleMapper from '~/modules/muscle/mappers/muscle.mapper';

describe('List exercises use case', () => {
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

  const getModuleTest = async (
    muscleRepositoryProvider = getExerciseRepositoryProvider({
      exerciseDomain,
    }),
  ) =>
    Test.createTestingModule({
      imports: [],
      providers: [
        muscleRepositoryProvider,
        ExerciseMapper,
        MuscleMapper,
        ListExercises,
      ],
    }).compile();

  it('Should list exercises', async () => {
    const listExercises = module.get<ListExercises>(ListExercises);

    const exercises = await listExercises.execute({
      skip: 0,
      take: 10,
    });

    expect(exercises).toEqual({
      items: [exerciseDomain.toDto().value],
      count: 1,
    });
  });

  it('Should not list exercises if to dto fails', async () => {
    const exerciseWithoutId = ExerciseDomainMock.mountExerciseDomain({
      withoutId: true,
    });

    const listExercises = module.get<ListExercises>(ListExercises);
    jest
      .spyOn(listExercises['exerciseRepository'], 'find')
      .mockResolvedValueOnce({ items: [exerciseWithoutId], count: 1 });

    await expect(
      listExercises.execute({
        skip: 0,
        take: 10,
      }),
    ).rejects.toThrowError(
      new HttpException(
        { message: ExerciseDtoError.messages.missingId },
        HttpStatus.INTERNAL_SERVER_ERROR,
      ),
    );
  });
});
