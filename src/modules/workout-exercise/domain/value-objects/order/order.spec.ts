import { HttpStatus } from '@nestjs/common';
import { WorkoutExerciseDomainError } from '~/modules/workout-exercise/domain/errors';
import WorkoutExerciseOrder from '~/modules/workout-exercise/domain/value-objects/order';

type WorkoutExerciseOrderPublicClass = WorkoutExerciseOrder & {
  isValid: () => boolean;
};

describe('WorkoutExerciseOrder value object', () => {
  afterEach(() => {
    jest.restoreAllMocks();
  });

  it('Should create a workout exercise order value object', () => {
    const isValidSpy = jest.spyOn(
      WorkoutExerciseOrder as unknown as WorkoutExerciseOrderPublicClass,
      'isValid',
    );

    const orderValue = 3;
    const order = WorkoutExerciseOrder.create({ value: orderValue });

    expect(order.value).toBeInstanceOf(WorkoutExerciseOrder);
    expect((order.value as WorkoutExerciseOrder).value).toBe(orderValue);
    expect(order.isRight()).toBeTruthy();
    expect(isValidSpy).toHaveBeenCalledWith(orderValue);
  });

  it('Should create a workout exercise order value object with null value', () => {
    const isValidSpy = jest.spyOn(
      WorkoutExerciseOrder as unknown as WorkoutExerciseOrderPublicClass,
      'isValid',
    );

    const orderValue = null;
    const order = WorkoutExerciseOrder.create({ value: orderValue });

    expect(order.value).toBeInstanceOf(WorkoutExerciseOrder);
    expect((order.value as WorkoutExerciseOrder).value).toBe(orderValue);
    expect(order.isRight()).toBeTruthy();
    expect(isValidSpy).toHaveBeenCalledWith(orderValue);
  });

  it('Should not create a workout exercise order value object with an invalid value', () => {
    const isValidSpy = jest.spyOn(
      WorkoutExerciseOrder as unknown as WorkoutExerciseOrderPublicClass,
      'isValid',
    );

    const orderValue = -1;
    const order = WorkoutExerciseOrder.create({ value: orderValue });

    expect(order.isLeft()).toBeTruthy();
    expect(order.value).toEqual(
      WorkoutExerciseDomainError.create(
        WorkoutExerciseDomainError.messages.invalidOrder,
        HttpStatus.BAD_REQUEST,
      ),
    );
    expect(isValidSpy).toHaveBeenCalled();
  });
});
