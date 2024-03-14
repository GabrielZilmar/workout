import { HttpException, Injectable } from '@nestjs/common';
import { ILike } from 'typeorm';
import { ListWorkoutsDto } from '~/modules/workout/dto/list-workouts.dto';
import { WorkoutDto } from '~/modules/workout/dto/workout.dto';
import WorkoutRepository from '~/services/database/typeorm/repositories/workout-repository';
import { UseCase } from '~/shared/core/use-case';

export type ListWorkoutsParams = ListWorkoutsDto & { userId: string };
export type ListWorkoutsResult = {
  items: WorkoutDto[];
  count: number;
};

@Injectable()
export class ListWorkouts
  implements UseCase<ListWorkoutsParams, ListWorkoutsResult>
{
  constructor(private readonly workoutRepository: WorkoutRepository) {}

  public async execute({
    userId,
    name,
    isRoutine,
    skip,
    take,
  }: ListWorkoutsParams): Promise<ListWorkoutsResult> {
    const { items, count } = await this.workoutRepository.find({
      where: { userId, isRoutine, name: name && ILike(`%${name}%`) },
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
