import { HttpException, Injectable } from '@nestjs/common';
import { ILike } from 'typeorm';
import { ExerciseDto } from '~/modules/exercise/dto/exercise.dto';
import { ListExercisesDto } from '~/modules/exercise/dto/list-exercises.dto';
import ExerciseRepository from '~/services/database/typeorm/repositories/exercise-repository';
import { UseCase } from '~/shared/core/use-case';

type ListExercisesParams = ListExercisesDto;
type ListExercisesResult = {
  items: ExerciseDto[];
  count: number;
};

@Injectable()
export class ListExercises
  implements UseCase<ListExercisesParams, ListExercisesResult>
{
  constructor(private readonly exerciseRepository: ExerciseRepository) {}

  public async execute({
    name,
    muscleId,
    skip,
    take,
  }: ListExercisesDto): Promise<ListExercisesResult> {
    const { items, count } = await this.exerciseRepository.find({
      where: { name: name && ILike(`%${name}%`), muscleId },
      skip,
      take,
      relations: ['muscle'],
      order: { muscleId: 'ASC', id: 'ASC' },
    });

    const exercisesDto: ExerciseDto[] = [];
    items.forEach((exercise) => {
      const exerciseDto = exercise.toDto();

      if (exerciseDto.isLeft()) {
        throw new HttpException(
          { message: exerciseDto.value.message },
          exerciseDto.value.code,
        );
      }

      exercisesDto.push(exerciseDto.value);
    });

    return {
      items: exercisesDto,
      count,
    };
  }
}
