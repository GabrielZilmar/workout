import {
  ForbiddenException,
  HttpException,
  Injectable,
  InternalServerErrorException,
  NotFoundException,
} from '@nestjs/common';
import { DataSource, Repository } from 'typeorm';
import { Set } from '~/modules/set/entities/set.entity';
import SetMapper from '~/modules/set/mappers/set.mapper';
import { WorkoutExercise } from '~/modules/workout-exercise/entities/workout-exercise.entity';
import WorkoutExerciseMapper from '~/modules/workout-exercise/mappers/workout-exercise.mapper';
import WorkoutDomain from '~/modules/workout/domain/workout.domain';
import { StartRoutineBodyDTO } from '~/modules/workout/dto/start-routine.dto';
import { WorkoutDto } from '~/modules/workout/dto/workout.dto';
import { Workout } from '~/modules/workout/entities/workout.entity';
import WorkoutMapper from '~/modules/workout/mappers/workout.mapper';
import { WorkoutUseCaseError } from '~/modules/workout/use-cases/errors';
import WorkoutRepository from '~/services/database/typeorm/repositories/workout-repository';
import { UseCase } from '~/shared/core/use-case';
import { Mapper } from '~/shared/domain/mapper';

export type StartRoutineParams = StartRoutineBodyDTO & { userId: string };
export type StartRoutineResult = Promise<WorkoutDto>;

@Injectable()
export class StartRoutine
  implements UseCase<StartRoutineParams, StartRoutineResult>
{
  constructor(
    private readonly workoutRepository: WorkoutRepository,
    private readonly workoutMapper: WorkoutMapper,
    private readonly workoutExerciseMapper: WorkoutExerciseMapper,
    private readonly setMapper: SetMapper,
    private readonly dataSource: DataSource,
  ) {}

  private async saveWorkout(
    workoutRepository: Repository<Workout>,
    workout: WorkoutDomain,
  ): Promise<Workout> {
    const { id: _, ...workoutPersistence } =
      this.workoutMapper.toPersistence(workout);

    return workoutRepository.save(
      workoutRepository.create({
        ...workoutPersistence,
        isPrivate: true,
        name: `${workout.name.value}-${new Date().toISOString()}`,
      }),
    );
  }

  private async cloneWorkoutExercises(
    workoutExerciseRepository: Repository<WorkoutExercise>,
    setRepository: Repository<Set>,
    oldWorkoutId: string,
    newWorkoutId: string,
  ): Promise<void> {
    const workoutExercises = await workoutExerciseRepository.find({
      where: { workoutId: oldWorkoutId },
    });

    await Promise.all(
      workoutExercises.map(async (we) => {
        const newWorkoutExercise = await this.toDomainOrThrow(
          this.workoutExerciseMapper,
          we,
        );

        const { id: _, ...persistenceData } =
          this.workoutExerciseMapper.toPersistence(newWorkoutExercise);

        const workoutExerciseCreated = await workoutExerciseRepository.save(
          workoutExerciseRepository.create({
            ...persistenceData,
            workoutId: newWorkoutId,
          }),
        );

        await this.cloneSets(setRepository, we.id, workoutExerciseCreated.id);
      }),
    );
  }

  private async cloneSets(
    setRepository: Repository<Set>,
    oldWorkoutExerciseId: string,
    newWorkoutExerciseId: string,
  ): Promise<void> {
    const sets = await setRepository.find({
      where: { workoutExerciseId: oldWorkoutExerciseId },
    });

    await Promise.all(
      sets.map(async (set) => {
        const newSet = await this.toDomainOrThrow(this.setMapper, {
          ...set,
          workoutExerciseId: newWorkoutExerciseId,
        });

        const { id: _, ...persistenceData } =
          this.setMapper.toPersistence(newSet);

        await setRepository.save(setRepository.create(persistenceData));
      }),
    );
  }

  private async toDomainOrThrow<T, D>(
    mapper: Mapper<T, D>,
    entity: D,
  ): Promise<T> {
    const domainOrError = await mapper.toDomain(entity);
    if (domainOrError.isLeft()) {
      throw new InternalServerErrorException(domainOrError.value.message);
    }
    return domainOrError.value;
  }

  public async execute({
    workoutId,
    userId,
  }: StartRoutineParams): StartRoutineResult {
    const workout = await this.workoutRepository.findOneById(workoutId);
    if (!workout) {
      throw new NotFoundException(
        WorkoutUseCaseError.messages.workoutNotFound(workoutId),
      );
    }

    const canStartRoutine =
      workout.userId === userId || !workout.privateStatus.isPrivate;
    if (!canStartRoutine) {
      throw new ForbiddenException(
        WorkoutUseCaseError.messages.cannotStartRoutineFromThisWorkout,
      );
    }

    const workoutDomain = await this.dataSource.manager.transaction(
      async (transactionalEntityManager) => {
        const workoutRepository =
          transactionalEntityManager.getRepository(Workout);
        const workoutExerciseRepository =
          transactionalEntityManager.getRepository(WorkoutExercise);
        const setRepository = transactionalEntityManager.getRepository(Set);

        if (!workout?.id) {
          throw new InternalServerErrorException(
            WorkoutUseCaseError.messages.workoutDomainIdNotFound,
          );
        }

        try {
          const newWorkout = await this.saveWorkout(workoutRepository, workout);

          await this.cloneWorkoutExercises(
            workoutExerciseRepository,
            setRepository,
            workout.id.toValue(),
            newWorkout.id,
          );

          return this.toDomainOrThrow(this.workoutMapper, newWorkout);
        } catch (err) {
          throw new InternalServerErrorException(err.message);
        }
      },
    );

    const workoutDtoOrError = WorkoutDto.domainToDto(workoutDomain);
    if (workoutDtoOrError.isLeft()) {
      throw new HttpException(
        workoutDtoOrError.value.message,
        workoutDtoOrError.value.code,
      );
    }

    return workoutDtoOrError.value;
  }
}
