import { WorkoutDomainMock } from 'test/utils/domains/workout-domain-mock';
import WorkoutDomain from '~/modules/workout/domain/workout.domain';

describe('WorkoutDomain', () => {
  afterEach(() => {
    jest.restoreAllMocks();
  });

  it('Should create a Workout domain', async () => {
    const workoutParams = WorkoutDomainMock.getWorkoutCreateParams();
    const workout = WorkoutDomain.create(workoutParams);

    expect(workout.isRight).toBeTruthy();
    expect(workout.value).toBeInstanceOf(WorkoutDomain);

    const workoutProps = WorkoutDomainMock.getWorkoutDomainProps();
    expect({ ...(workout.value as WorkoutDomain).props }).toEqual(workoutProps);
  });
});
