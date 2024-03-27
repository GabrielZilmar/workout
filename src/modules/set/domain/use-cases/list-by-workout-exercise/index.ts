import { HttpException, Injectable } from '@nestjs/common';
import { ListByWorkoutExerciseIdDto } from '~/modules/set/dto/list-by-workout-exercise-id.dto';
import { SetDto } from '~/modules/set/dto/set.dto';
import SetRepository from '~/services/database/typeorm/repositories/set-repository';
import { UseCase } from '~/shared/core/use-case';
import { PaginatedDto } from '~/shared/dto/paginated';

type ListByWorkoutExerciseIdParams = ListByWorkoutExerciseIdDto &
  PaginatedDto & { userId: string };
type ListByWorkoutExerciseIdResult = Promise<{
  items: SetDto[];
  count: number;
}>;

@Injectable()
export class ListByWorkoutExerciseId
  implements
    UseCase<ListByWorkoutExerciseIdParams, ListByWorkoutExerciseIdResult>
{
  constructor(private readonly setRepository: SetRepository) {}

  async execute({
    userId,
    workoutExerciseId,
    skip,
    take,
  }: ListByWorkoutExerciseIdParams): ListByWorkoutExerciseIdResult {
    const { items, count } = await this.setRepository.findByWorkoutExerciseId({
      where: { userId, workoutExerciseId },
      skip,
      take,
    });

    const setsDto: SetDto[] = [];
    items.forEach((set) => {
      const setDto = set.toDto();

      if (setDto.isLeft()) {
        throw new HttpException(
          { message: setDto.value.message },
          setDto.value.code,
        );
      }

      setsDto.push(setDto.value);
    });

    return {
      items: setsDto,
      count,
    };
  }
}
