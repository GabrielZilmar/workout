import { HttpException, Injectable } from '@nestjs/common';
import { ListSetByWorkoutExerciseIdDto } from '~/modules/set/dto/list-set-by-workout-exercise-id.dto';
import { SetDto } from '~/modules/set/dto/set.dto';
import SetRepository from '~/services/database/typeorm/repositories/set-repository';
import { UseCase } from '~/shared/core/use-case';
import { PaginatedDto } from '~/shared/dto/paginated';

type ListSetByWorkoutExerciseIdParams = ListSetByWorkoutExerciseIdDto &
  PaginatedDto & { userId: string };
type ListSetByWorkoutExerciseIdResult = Promise<{
  items: SetDto[];
  count: number;
}>;

@Injectable()
export class ListSetByWorkoutExerciseId
  implements
    UseCase<ListSetByWorkoutExerciseIdParams, ListSetByWorkoutExerciseIdResult>
{
  constructor(private readonly setRepository: SetRepository) {}

  async execute({
    userId,
    workoutExerciseId,
    skip,
    take,
  }: ListSetByWorkoutExerciseIdParams): ListSetByWorkoutExerciseIdResult {
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
