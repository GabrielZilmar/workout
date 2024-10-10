import { Injectable } from '@nestjs/common';
import ExerciseDomain from '~/modules/exercise/domain/exercise.domain';
import ExerciseMapper from '~/modules/exercise/mappers/exercise.mapper';
import { SetDto } from '~/modules/set/dto/set.dto';
import SetMapper from '~/modules/set/mappers/set.mapper';
import { WorkoutExerciseDomainError } from '~/modules/workout-exercise/domain/errors';
import WorkoutExerciseDomain from '~/modules/workout-exercise/domain/workout-exercise.domain';
import { WorkoutExercise as WorkoutExerciseEntity } from '~/modules/workout-exercise/entities/workout-exercise.entity';
import WorkoutDomain from '~/modules/workout/domain/workout.domain';
import { Workout } from '~/modules/workout/entities/workout.entity';
import WorkoutMapper from '~/modules/workout/mappers/workout.mapper';
import { Mapper } from '~/shared/domain/mapper';
import { UniqueEntityID } from '~/shared/domain/unique-entity-id';
import { Either, left } from '~/shared/either';

@Injectable()
export default class WorkoutExerciseMapper
  implements Mapper<WorkoutExerciseDomain, Partial<WorkoutExerciseEntity>>
{
  constructor(
    private readonly workoutMapper: WorkoutMapper,
    private readonly exerciseMapper: ExerciseMapper,
    private readonly setMapper: SetMapper,
  ) {}

  public async toDomain(
    raw: WorkoutExerciseEntity,
  ): Promise<Either<WorkoutExerciseDomainError, WorkoutExerciseDomain>> {
    const { id, workoutId, exerciseId, order, workout, exercise, sets } = raw;

    let workoutDomain: WorkoutDomain | undefined;
    if (workout) {
      const workoutOrError = await this.workoutMapper.toDomain(workout);
      if (workoutOrError.isLeft()) {
        return left(workoutOrError.value);
      }

      workoutDomain = workoutOrError.value;
    }

    let exerciseDomain: ExerciseDomain | undefined;
    if (exercise) {
      const exerciseOrError = this.exerciseMapper.toDomain(exercise);
      if (exerciseOrError.isLeft()) {
        return left(exerciseOrError.value);
      }

      exerciseDomain = exerciseOrError.value;
    }

    const setDtos: SetDto[] = [];
    if (sets?.length) {
      for (const set of sets) {
        const setDomain = this.setMapper.toDomain(set);
        if (setDomain.isLeft()) {
          return left(setDomain.value);
        }

        const setDto = setDomain.value.toDto();
        if (setDto.isLeft()) {
          return left(setDto.value);
        }

        setDtos.push(setDto.value);
      }
    }

    const entityId = new UniqueEntityID(id);
    const workoutExerciseDomainOrError = WorkoutExerciseDomain.create(
      {
        workoutId,
        exerciseId,
        order,
        workoutDomain,
        exerciseDomain,
        setDtos,
      },
      entityId,
    );

    return workoutExerciseDomainOrError;
  }

  public toPersistence(
    item: WorkoutExerciseDomain,
  ): Partial<WorkoutExerciseEntity> {
    const { id, workoutDomain, workoutId, exerciseId, order } = item;

    const workoutExerciseEntity: Partial<WorkoutExerciseEntity> = {
      id: id?.toString(),
      workoutId,
      exerciseId,
      order: order.value,
    };
    if (workoutDomain) {
      workoutExerciseEntity.workout = this.workoutMapper.toPersistence(
        workoutDomain,
      ) as Workout;
    }

    return workoutExerciseEntity;
  }
}
