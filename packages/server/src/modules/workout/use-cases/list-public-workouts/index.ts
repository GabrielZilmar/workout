import { HttpException, Injectable } from '@nestjs/common';
import { ILike } from 'typeorm';
import { ListPublicWorkoutsDto } from '~/modules/workout/dto/list-public-workouts.dto';
import { WorkoutDto } from '~/modules/workout/dto/workout.dto';
import WorkoutRepository from '~/services/database/typeorm/repositories/workout-repository';
import { UseCase } from '~/shared/core/use-case';

export type ListPublicWorkoutsParams = ListPublicWorkoutsDto;
export type ListPublicWorkoutsResult = {
  items: WorkoutDto[];
  count: number;
};

@Injectable()
export class ListPublicWorkouts
  implements UseCase<ListPublicWorkoutsParams, ListPublicWorkoutsResult>
{
  constructor(private readonly workoutRepository: WorkoutRepository) {}
  public async execute({
    name,
    isRoutine,
    skip,
    take,
  }: ListPublicWorkoutsParams): Promise<ListPublicWorkoutsResult> {
    const { items, count } = await this.workoutRepository.findPublicWorkouts({
      where: {
        isRoutine,
        name: name && ILike(`%${name}%`),
      },
      skip,
      take,
    });

    const workoutsDto: WorkoutDto[] = [];
    items.forEach((workout) => {
      const workoutDto = workout.toDto();

      if (workoutDto.isLeft()) {
        throw new HttpException(
          { message: workoutDto.value.message },
          workoutDto.value.code,
        );
      }

      workoutsDto.push(workoutDto.value);
    });

    return {
      items: workoutsDto,
      count,
    };
  }
}
