import { HttpException, Injectable, NotFoundException } from '@nestjs/common';
import { DeleteMuscleParamsDto } from '~/modules/muscle/dto/delete-muscle.dto';
import { MuscleUseCaseError } from '~/modules/muscle/use-cases/errors';
import MuscleRepository from '~/services/database/typeorm/repositories/muscle-repository';
import { UseCase } from '~/shared/core/use-case';

type DeleteMuscleParams = DeleteMuscleParamsDto;
type DeleteMuscleResult = Promise<boolean>;

@Injectable()
export class DeleteMuscle
  implements UseCase<DeleteMuscleParams, DeleteMuscleResult>
{
  constructor(private readonly muscleRepository: MuscleRepository) {}

  public async execute({ id }: DeleteMuscleParamsDto): DeleteMuscleResult {
    const muscle = await this.muscleRepository.findOneById(id);
    if (!muscle) {
      throw new NotFoundException(
        MuscleUseCaseError.messages.muscleNotFound(id),
      );
    }

    const deleteMuscleOrError = await this.muscleRepository.delete(id);
    if (deleteMuscleOrError.isLeft()) {
      throw new HttpException(
        {
          message: deleteMuscleOrError.value.message,
        },
        deleteMuscleOrError.value.code,
      );
    }

    return true;
  }
}
