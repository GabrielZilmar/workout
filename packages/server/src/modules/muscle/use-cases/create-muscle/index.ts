import { HttpException, Injectable } from '@nestjs/common';
import MuscleDomain from '~/modules/muscle/domain/muscle.domain';
import { CreateMuscleDto } from '~/modules/muscle/dto/create-muscle.dto';
import { MuscleDto } from '~/modules/muscle/dto/muscle.dto';
import MuscleMapper from '~/modules/muscle/mappers/muscle.mapper';
import MuscleRepository from '~/services/database/typeorm/repositories/muscle-repository';
import { UseCase } from '~/shared/core/use-case';

export type CreateMuscleParams = CreateMuscleDto;
export type CreateMuscleResult = MuscleDto;

@Injectable()
export class CreateMuscle
  implements UseCase<CreateMuscleParams, CreateMuscleResult>
{
  constructor(
    private muscleRepository: MuscleRepository,
    private readonly muscleMapper: MuscleMapper,
  ) {}

  async execute({ name }: CreateMuscleParams): Promise<CreateMuscleResult> {
    const muscle = MuscleDomain.create({ name });
    if (muscle.isLeft()) {
      throw new HttpException(
        { message: muscle.value.message },
        muscle.value.code,
      );
    }

    const muscleCreatedOrError = await this.muscleRepository.create(
      this.muscleMapper.toPersistence(muscle.value),
    );

    if (muscleCreatedOrError.isLeft()) {
      throw new HttpException(
        { message: muscleCreatedOrError.value.message },
        muscleCreatedOrError.value.code,
      );
    }

    const muscleDto = muscleCreatedOrError.value.toDto();
    if (muscleDto.isLeft()) {
      throw new HttpException(
        { message: muscleDto.value.message },
        muscleDto.value.code,
      );
    }

    return muscleDto.value;
  }
}
