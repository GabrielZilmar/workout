import { Provider } from '@nestjs/common';
import { WorkoutDomainMock } from 'test/utils/domains/workout-domain-mock';
import UserMapper from '~/modules/users/domain/mappers/users.mapper';
import WorkoutDomain from '~/modules/workout/domain/workout.domain';
import WorkoutMapper from '~/modules/workout/mappers/workout.mapper';
import WorkoutRepository from '~/services/database/typeorm/repositories/workout-repository';
import { right } from '~/shared/either';

type GetWorkoutRepositoryProviderParams = {
  workoutRepositoryMock?: WorkoutRepository;
  workoutDomain?: WorkoutDomain;
};

const getWorkoutRepositoryProvider = ({
  workoutRepositoryMock,
  workoutDomain,
}: GetWorkoutRepositoryProviderParams = {}) => {
  if (!workoutDomain) {
    workoutDomain = WorkoutDomainMock.mountWorkoutDomain();
  }

  return {
    provide: WorkoutRepository,
    useFactory: () => {
      if (!workoutRepositoryMock) {
        const createMock = jest.fn().mockResolvedValue(right(workoutDomain));
        workoutRepositoryMock = new WorkoutRepository(
          new WorkoutMapper(new UserMapper()),
        ) as jest.Mocked<InstanceType<typeof WorkoutRepository>>;
        workoutRepositoryMock.create = createMock;

        const findMock = jest.fn().mockResolvedValue({
          items: [workoutDomain],
          count: 1,
        });
        workoutRepositoryMock.find = findMock;

        const publicWorkouts = workoutDomain?.privateStatus.isPrivate()
          ? []
          : [workoutDomain];
        const findPublicWorkoutsMock = jest.fn().mockResolvedValue({
          items: publicWorkouts,
          count: publicWorkouts.length ? 1 : 0,
        });
        workoutRepositoryMock.findPublicWorkouts = findPublicWorkoutsMock;

        const findOneByIdMock = jest.fn().mockResolvedValue(workoutDomain);
        workoutRepositoryMock.findOneById = findOneByIdMock;

        const updateMock = jest.fn().mockResolvedValue(right(true));
        workoutRepositoryMock.update = updateMock;

        const deleteMock = jest.fn().mockResolvedValue(right(true));
        workoutRepositoryMock.delete = deleteMock;
      }

      return workoutRepositoryMock;
    },
    inject: [WorkoutMapper],
  } as Provider;
};

export default getWorkoutRepositoryProvider;
