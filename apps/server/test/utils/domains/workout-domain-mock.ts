import { GenericCreateDomainParams } from 'test/utils/types/domain';
import { v4 as uuid } from 'uuid';
import WorkoutName from '~/modules/workout/domain/value-objects/name';
import PrivateStatus from '~/modules/workout/domain/value-objects/private-status';
import RoutineStatus from '~/modules/workout/domain/value-objects/routine-status';
import WorkoutDomain, {
  WorkoutDomainCreateParams,
} from '~/modules/workout/domain/workout.domain';
import { UniqueEntityID } from '~/shared/domain/unique-entity-id';

type MountWorkoutDomainParams = Partial<WorkoutDomainCreateParams> &
  GenericCreateDomainParams;

export class WorkoutDomainMock {
  public static readonly workoutMockCreateParams: WorkoutDomainCreateParams = {
    name: 'Workout Test 1',
    userId: uuid(),
    isPrivate: false,
    isRoutine: false,
  };

  public static getWorkoutDomainProps({
    name,
    userId,
    isPrivate = false,
    isRoutine = false,
  }: Partial<WorkoutDomainCreateParams> = {}) {
    const workoutName = WorkoutName.create({
      value: name ?? this.workoutMockCreateParams.name,
    });
    const privateStatus = PrivateStatus.create({
      value: isPrivate,
    });
    const routineStatus = RoutineStatus.create({
      value: isRoutine,
    });

    return {
      name: workoutName.value,
      userId: userId ?? this.workoutMockCreateParams.userId,
      privateStatus,
      routineStatus,
    };
  }

  public static getWorkoutCreateParams(
    props?: Partial<WorkoutDomainCreateParams>,
  ) {
    return {
      ...this.workoutMockCreateParams,
      ...props,
    };
  }

  public static mountWorkoutDomain({
    withoutId,
    ...props
  }: MountWorkoutDomainParams = {}) {
    const createParams = this.getWorkoutCreateParams(props);

    const workoutParams = {
      params: createParams,
      id: props.id ?? uuid(),
    };

    let id: UniqueEntityID | undefined;
    if (!withoutId) {
      id = new UniqueEntityID(workoutParams.id);
    }

    const workoutDomain = WorkoutDomain.create(workoutParams.params, id);
    return workoutDomain.value as WorkoutDomain;
  }
}
