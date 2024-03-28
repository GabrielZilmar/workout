import RoutineStatus from '~/modules/workout/domain/value-objects/routine-status';

describe('RoutineStatus Value Objects', () => {
  it('Should create a routine-status value object', () => {
    let routineStatus = RoutineStatus.create({ value: true });

    expect(routineStatus.value).toBe(true);

    routineStatus = RoutineStatus.create({ value: false });

    expect(routineStatus.value).toBe(false);
  });

  it('Should set routine', () => {
    const routineStatus = RoutineStatus.create();
    expect(routineStatus.value).toBe(false);

    routineStatus.setRoutine();
    expect(routineStatus.value).toBe(true);
  });

  it('Should unset routine', () => {
    const routineStatus = RoutineStatus.create({ value: true });
    expect(routineStatus.value).toBe(true);

    routineStatus.unsetRoutine();
    expect(routineStatus.value).toBe(false);
  });

  it('Should check if is routine', () => {
    const routineStatus = RoutineStatus.create({ value: true });
    expect(routineStatus.isRoutine()).toBe(true);
  });
});
