import { GenericCreateDomainParams } from 'test/utils/types/domain';
import { v4 as uuid } from 'uuid';
import WorkoutExerciseOrder from '~/modules/workout-exercise/domain/value-objects/order';
import WorkoutExerciseDomain, {
  WorkoutExerciseDomainCreateParams,
  WorkoutExerciseDomainProps,
} from '~/modules/workout-exercise/domain/workout-exercise.domain';
import { UniqueEntityID } from '~/shared/domain/unique-entity-id';

type MountWorkoutExerciseDomainParams =
  Partial<WorkoutExerciseDomainCreateParams> & GenericCreateDomainParams;

export class WorkoutExerciseDomainMock {
  public static readonly workoutExerciseMockCreateParams: Required<WorkoutExerciseDomainCreateParams> =
    {
      workoutId: 'workout-id',
      exerciseId: 'exercise-id',
      order: 0,
    };

  public static getWorkoutExerciseCreateParams(
    props?: Partial<WorkoutExerciseDomainCreateParams>,
  ): WorkoutExerciseDomainCreateParams {
    return {
      ...this.workoutExerciseMockCreateParams,
      ...props,
    };
  }

  public static getWorkoutExerciseDomainProps({
    workoutId,
    exerciseId,
    order,
  }: Partial<WorkoutExerciseDomainCreateParams> = {}): WorkoutExerciseDomainProps {
    const orderValueObject = WorkoutExerciseOrder.create({
      value: order ?? this.workoutExerciseMockCreateParams.order,
    }).value as WorkoutExerciseOrder;

    return {
      workoutId: workoutId ?? this.workoutExerciseMockCreateParams.workoutId,
      exerciseId: exerciseId ?? this.workoutExerciseMockCreateParams.exerciseId,
      order: orderValueObject,
    };
  }

  public static mountWorkoutExerciseDomain({
    withoutId,
    ...props
  }: MountWorkoutExerciseDomainParams = {}): WorkoutExerciseDomain {
    const workoutExerciseParams = {
      params: this.getWorkoutExerciseCreateParams(props),
      id: props.id ?? uuid(),
    };

    let id: UniqueEntityID | undefined;
    if (!withoutId) {
      id = new UniqueEntityID(workoutExerciseParams.id);
    }

    return WorkoutExerciseDomain.create(workoutExerciseParams.params, id)
      .value as WorkoutExerciseDomain;
  }
}
