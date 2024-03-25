import { Injectable } from '@nestjs/common';
import WorkoutExerciseDomain from '~/modules/workout-exercise/domain/workout-exercise.domain';
import { WorkoutExercise } from '~/modules/workout-exercise/entities/workout-exercise.entity';
import WorkoutExerciseMapper from '~/modules/workout-exercise/mappers/workout-exercise.mapper';
import { BaseRepository } from '~/services/database/typeorm/repositories/base/base-repository';

@Injectable()
export default class WorkoutExerciseRepository extends BaseRepository<
  WorkoutExercise,
  WorkoutExerciseDomain
> {
  mapper: WorkoutExerciseMapper;

  constructor(workoutExerciseMapper: WorkoutExerciseMapper) {
    super(WorkoutExercise, workoutExerciseMapper);
  }
}
