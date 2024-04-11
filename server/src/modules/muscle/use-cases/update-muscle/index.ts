import { HttpException, Injectable, NotFoundException } from '@nestjs/common';
import {
  UpdateMuscleParamsDto,
  UpdateMuscleBodyDto,
} from '~/modules/muscle/dto/update-muscle.dto';
import MuscleMapper from '~/modules/muscle/mappers/muscle.mapper';
import { MuscleUseCaseError } from '~/modules/muscle/use-cases/errors';
import MuscleRepository from '~/services/database/typeorm/repositories/muscle-repository';
import { UseCase } from '~/shared/core/use-case';

type UpdateMuscleParams = UpdateMuscleParamsDto & UpdateMuscleBodyDto;
type UpdateMuscleResult = Promise<boolean>;

@Injectable()
export class UpdateMuscle
  implements UseCase<UpdateMuscleParams, UpdateMuscleResult>
{
  constructor(
    private readonly muscleRepository: MuscleRepository,
    private readonly muscleMapper: MuscleMapper,
  ) {}

  public async execute({ id, name }: UpdateMuscleParams): UpdateMuscleResult {
    const muscle = await this.muscleRepository.findOneById(id);
    if (!muscle) {
      throw new NotFoundException(
        MuscleUseCaseError.messages.muscleNotFound(id),
      );
    }

    const muscleDomainUpdateOrError = muscle.update({ name });
    if (muscleDomainUpdateOrError.isLeft()) {
      throw new HttpException(
        { message: muscleDomainUpdateOrError.value.message },
        muscleDomainUpdateOrError.value.code,
      );
    }

    const muscleData = this.muscleMapper.toPersistence(
      muscleDomainUpdateOrError.value,
    );
    const updateMuscleOrError = await this.muscleRepository.update(
      id,
      muscleData,
    );
    if (updateMuscleOrError.isLeft()) {
      throw new HttpException(
        { message: updateMuscleOrError.value.message },
        updateMuscleOrError.value.code,
      );
    }

    return true;
  }
}
