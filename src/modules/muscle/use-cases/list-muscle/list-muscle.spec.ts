import { HttpException, HttpStatus } from '@nestjs/common';
import { Test, TestingModule } from '@nestjs/testing';
import { MuscleDomainMock } from 'test/utils/domains/muscle-domain-mock';
import getMuscleRepositoryProvider from 'test/utils/providers/muscle-repository';
import MuscleDomain from '~/modules/muscle/domain/muscle.domain';
import { MuscleDtoError } from '~/modules/muscle/dto/errors';
import MuscleMapper from '~/modules/muscle/mappers/muscle.mapper';
import { ListMuscle } from '~/modules/muscle/use-cases/list-muscle';

describe('ListMuscle use case', () => {
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

  const getModuleTest = async (
    muscleRepositoryProvider = getMuscleRepositoryProvider({ muscleDomain }),
  ) =>
    Test.createTestingModule({
      imports: [],
      providers: [muscleRepositoryProvider, MuscleMapper, ListMuscle],
    }).compile();

  it('Should list muscles', async () => {
    const listMuscle = module.get<ListMuscle>(ListMuscle);

    const muscles = await listMuscle.execute({
      skip: 0,
      take: 10,
    });

    expect(muscles).toEqual({ items: [muscleDomain.toDto().value], count: 1 });
  });

  it('Should not list muscles if muscle dto fails', async () => {
    const muscleDomainWithoutId = MuscleDomainMock.mountMuscleDomain({
      withoutId: true,
    });

    module = await getModuleTest(
      getMuscleRepositoryProvider({
        muscleDomain: muscleDomainWithoutId,
      }),
    );
    const listMuscle = module.get<ListMuscle>(ListMuscle);

    await expect(
      listMuscle.execute({
        skip: 0,
        take: 10,
      }),
    ).rejects.toThrow(
      new HttpException(
        {
          message: MuscleDtoError.messages.missingId,
        },
        HttpStatus.INTERNAL_SERVER_ERROR,
      ),
    );
  });
});
