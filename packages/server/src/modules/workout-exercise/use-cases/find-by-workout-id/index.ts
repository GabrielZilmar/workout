import { HttpException, Injectable } from '@nestjs/common';
import { FindByWorkoutIdDto } from '~/modules/workout-exercise/dto/find-by-workout-id.dto';
import { WorkoutExerciseDto } from '~/modules/workout-exercise/dto/workout-exercise.dto';
import WorkoutExerciseRepository from '~/services/database/typeorm/repositories/workout-exercise-repository';
import { UseCase } from '~/shared/core/use-case';
import { PaginatedDto } from '~/shared/dto/paginated';

type FindByWorkoutIdParams = FindByWorkoutIdDto &
  PaginatedDto & { userId: string };
type FindByWorkoutIdResponse = Promise<{
  items: WorkoutExerciseDto[];
  count: number;
}>;

@Injectable()
export class FindByWorkoutId
  implements UseCase<FindByWorkoutIdParams, FindByWorkoutIdResponse>
{
  constructor(
    private readonly workoutExerciseRepository: WorkoutExerciseRepository,
  ) {}

  async execute({
    userId,
    workoutId,
    skip,
    take,
  }: FindByWorkoutIdParams): FindByWorkoutIdResponse {
    const { items, count } =
      await this.workoutExerciseRepository.findUsersWorkoutExercises({
        where: { userId, workoutId },
        relations: ['exercise'],
        skip,
        take,
      });

    const workoutsExercisesDto: WorkoutExerciseDto[] = [];
    items.forEach((workout) => {
      const workoutsExerciseDto = workout.toDto();

      if (workoutsExerciseDto.isLeft()) {
        throw new HttpException(
          { message: workoutsExerciseDto.value.message },
          workoutsExerciseDto.value.code,
        );
      }

      workoutsExercisesDto.push(workoutsExerciseDto.value);
    });

    return {
      items: workoutsExercisesDto,
      count,
    };
  }
}
