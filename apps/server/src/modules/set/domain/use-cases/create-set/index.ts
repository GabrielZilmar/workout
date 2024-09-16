import {
  ForbiddenException,
  HttpException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import SetDomain from '~/modules/set/domain/set.domain';
import { SetUseCaseError } from '~/modules/set/domain/use-cases/errors';
import { CreateSetDto } from '~/modules/set/dto/create-set.dto';
import { SetDto } from '~/modules/set/dto/set.dto';
import SetMapper from '~/modules/set/mappers/set.mapper';
import SetRepository from '~/services/database/typeorm/repositories/set-repository';
import WorkoutExerciseRepository from '~/services/database/typeorm/repositories/workout-exercise-repository';
import { UseCase } from '~/shared/core/use-case';

type CreateSetParams = CreateSetDto & { userId: string };
type CreateSetResponse = Promise<SetDto>;

@Injectable()
export class CreateSet implements UseCase<CreateSetParams, CreateSetResponse> {
  constructor(
    private readonly setRepository: SetRepository,
    private readonly workoutExerciseRepository: WorkoutExerciseRepository,
    private readonly setMapper: SetMapper,
  ) {}

  async execute({
    userId,
    workoutExerciseId,
    numReps,
    setWeight,
    numDrops,
  }: CreateSetParams): CreateSetResponse {
    const workoutExercise =
      await this.workoutExerciseRepository.findOneByIdWithRelations({
        id: workoutExerciseId,
        relations: ['workout'],
      });
    if (!workoutExercise) {
      throw new NotFoundException({
        message:
          SetUseCaseError.messages.workoutExerciseNotFound(workoutExerciseId),
      });
    }

    if (workoutExercise.workoutDomain?.userId !== userId) {
      throw new ForbiddenException({
        message: SetUseCaseError.messages.workoutNotBelongToUser(
          workoutExercise.workoutId,
        ),
      });
    }

    const setDomainOrError = SetDomain.create({
      workoutExerciseId,
      numReps,
      setWeight,
      numDrops,
    });
    if (setDomainOrError.isLeft()) {
      throw new HttpException(
        setDomainOrError.value.message,
        setDomainOrError.value.code,
      );
    }

    const setDomainCreatedOrError = await this.setRepository.create(
      this.setMapper.toPersistence(setDomainOrError.value),
    );
    if (setDomainCreatedOrError.isLeft()) {
      throw new HttpException(
        setDomainCreatedOrError.value.message,
        setDomainCreatedOrError.value.code,
      );
    }

    const setDtoOrError = setDomainCreatedOrError.value.toDto();
    if (setDtoOrError.isLeft()) {
      throw new HttpException(
        setDtoOrError.value.message,
        setDtoOrError.value.code,
      );
    }

    return setDtoOrError.value;
  }
}
