import { HttpException, Injectable } from '@nestjs/common';
import { ILike } from 'typeorm';
import { ListMusclesDto } from '~/modules/muscle/dto/list-muscles.dto';
import { MuscleDto } from '~/modules/muscle/dto/muscle.dto';
import MuscleRepository from '~/services/database/typeorm/repositories/muscle-repository';
import { UseCase } from '~/shared/core/use-case';

export type ListMuscleParams = ListMusclesDto;
export type ListMuscleResult = {
  items: MuscleDto[];
  count: number;
};

@Injectable()
export class ListMuscle implements UseCase<ListMuscleParams, ListMuscleResult> {
  constructor(private readonly muscleRepository: MuscleRepository) {}

  public async execute({
    name,
    skip,
    take,
  }: ListMuscleParams): Promise<ListMuscleResult> {
    const { items, count } = await this.muscleRepository.find({
      where: { name: name && ILike(`%${name}%`) },
      skip,
      take,
    });

    const musclesDto: MuscleDto[] = [];
    items.forEach((muscle) => {
      const muscleDto = muscle.toDto();

      if (muscleDto.isLeft()) {
        throw new HttpException(
          { message: muscleDto.value.message },
          muscleDto.value.code,
        );
      }

      musclesDto.push(muscleDto.value);
    });

    return {
      items: musclesDto,
      count,
    };
  }
}
