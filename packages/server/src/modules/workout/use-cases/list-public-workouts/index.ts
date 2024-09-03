import { HttpException, Injectable } from '@nestjs/common';
import {
  ListPublicWorkoutsDto,
  PublicWorkoutDTO,
} from '~/modules/workout/dto/list-public-workouts.dto';
import WorkoutRepository from '~/services/database/typeorm/repositories/workout-repository';
import { UseCase } from '~/shared/core/use-case';

export type ListPublicWorkoutsParams = ListPublicWorkoutsDto;
export type ListPublicWorkoutsResult = {
  items: PublicWorkoutDTO[];
  count: number;
};

@Injectable()
export class ListPublicWorkouts
  implements UseCase<ListPublicWorkoutsParams, ListPublicWorkoutsResult>
{
  constructor(private readonly workoutRepository: WorkoutRepository) {}
  public async execute({
    searchTerm,
    skip,
    take,
  }: ListPublicWorkoutsParams): Promise<ListPublicWorkoutsResult> {
    const { items, count } = await this.workoutRepository.findPublicWorkouts({
      searchTerm,
      skip,
      take,
    });

    const workoutsDto: PublicWorkoutDTO[] = [];
    items.forEach((workout) => {
      const workoutDto = PublicWorkoutDTO.domainToDto(workout);

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
