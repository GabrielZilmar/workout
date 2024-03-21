import {
  HttpException,
  HttpStatus,
  InternalServerErrorException,
  NotFoundException,
  Provider,
} from '@nestjs/common';
import { Test, TestingModule } from '@nestjs/testing';
import { ExerciseDomainMock } from 'test/utils/domains/exercise-domain-mock';
import getExerciseRepositoryProvider from 'test/utils/providers/exercise-repository-mock';
import ExerciseDomain from '~/modules/exercise/domain/exercise.domain';
import { ExerciseDtoError } from '~/modules/exercise/dto/errors';
import ExerciseMapper from '~/modules/exercise/mappers/exercise.mapper';
import { ExerciseUseCaseError } from '~/modules/exercise/use-cases/errors';
import { GetExercise } from '~/modules/exercise/use-cases/get-exercise';

type GetModuleTestParams = {
  exerciseRepositoryProvider?: Provider;
};

describe('GetExercise use case', () => {
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
      exerciseRepositoryProvider = getExerciseRepositoryProvider({
        exerciseDomain,
      });
    }

    return Test.createTestingModule({
      imports: [],
      providers: [exerciseRepositoryProvider, ExerciseMapper, GetExercise],
    }).compile();
  };

  it('Should get exercise by id', async () => {
    const getExerciseUseCase = module.get<GetExercise>(GetExercise);
    const exerciseParams = {
      idOrUsername: exerciseDomain.id?.toString() as string,
    };
    const findOneByIdSpy = jest.spyOn(
      getExerciseUseCase['exerciseRepository'],
      'findOneById',
    );
    const findOneIdSpy = jest.spyOn(
      getExerciseUseCase['exerciseRepository'],
      'findOne',
    );

    const exercise = await getExerciseUseCase.execute(exerciseParams);
    expect(exercise).toEqual(exerciseDomain.toDto().value);
    expect(findOneByIdSpy).toBeCalledTimes(1);
    expect(findOneIdSpy).not.toBeCalled();
  });

  it('Should get exercise by name', async () => {
    const getExerciseUseCase = module.get<GetExercise>(GetExercise);
    const exerciseParams = {
      idOrUsername: exerciseDomain.name.value,
    };
    const findOneByIdSpy = jest.spyOn(
      getExerciseUseCase['exerciseRepository'],
      'findOneById',
    );
    const findOneIdSpy = jest.spyOn(
      getExerciseUseCase['exerciseRepository'],
      'findOne',
    );

    const exercise = await getExerciseUseCase.execute(exerciseParams);
    expect(exercise).toEqual(exerciseDomain.toDto().value);
    expect(findOneByIdSpy).not.toBeCalled();
    expect(findOneIdSpy).toBeCalledTimes(1);
  });

  it('Should not get exercise if repository query fails', async () => {
    const errorMessage = 'error message';
    const errorMock = new Error(errorMessage);

    const getExerciseUseCase = module.get<GetExercise>(GetExercise);
    jest
      .spyOn(getExerciseUseCase['exerciseRepository'], 'findOneById')
      .mockRejectedValue(errorMock);

    await expect(
      getExerciseUseCase.execute({
        idOrUsername: exerciseDomain.id?.toString() as string,
      }),
    ).rejects.toThrowError(
      new InternalServerErrorException({ message: errorMessage }),
    );
  });

  it('Should not get exercise if it is not found by id', async () => {
    const getExerciseUseCase = module.get<GetExercise>(GetExercise);
    jest
      .spyOn(getExerciseUseCase['exerciseRepository'], 'findOneById')
      .mockResolvedValueOnce(null);

    await expect(
      getExerciseUseCase.execute({
        idOrUsername: exerciseDomain.id?.toString() as string,
      }),
    ).rejects.toThrowError(
      new NotFoundException(
        ExerciseUseCaseError.messages.exerciseNotFound(
          exerciseDomain.id?.toString() as string,
        ),
      ),
    );
  });

  it('Should not get exercise if it is not found by name', async () => {
    const getExerciseUseCase = module.get<GetExercise>(GetExercise);
    jest
      .spyOn(getExerciseUseCase['exerciseRepository'], 'findOne')
      .mockResolvedValueOnce(null);

    await expect(
      getExerciseUseCase.execute({
        idOrUsername: exerciseDomain.name.value,
      }),
    ).rejects.toThrowError(
      new NotFoundException(
        ExerciseUseCaseError.messages.exerciseByNameNotFound(
          exerciseDomain.name.value,
        ),
      ),
    );
  });

  it('Should not get exercise if to dto fails', async () => {
    const exerciseWithoutId = ExerciseDomainMock.mountExerciseDomain({
      withoutId: true,
    });

    const getExerciseUseCase = module.get<GetExercise>(GetExercise);
    jest
      .spyOn(getExerciseUseCase['exerciseRepository'], 'findOne')
      .mockResolvedValueOnce(exerciseWithoutId);

    await expect(
      getExerciseUseCase.execute({
        idOrUsername: exerciseDomain.name.value,
      }),
    ).rejects.toThrowError(
      new HttpException(
        ExerciseDtoError.messages.missingId,
        HttpStatus.INTERNAL_SERVER_ERROR,
      ),
    );
  });
});
