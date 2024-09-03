import {
  ForbiddenException,
  HttpException,
  Injectable,
  InternalServerErrorException,
  NotFoundException,
} from '@nestjs/common';
import { DataSource } from 'typeorm';
import { Set } from '~/modules/set/entities/set.entity';
import SetMapper from '~/modules/set/mappers/set.mapper';
import { WorkoutExercise } from '~/modules/workout-exercise/entities/workout-exercise.entity';
import WorkoutExerciseMapper from '~/modules/workout-exercise/mappers/workout-exercise.mapper';
import { StartRoutineBodyDTO } from '~/modules/workout/dto/start-routine.dto';
import { WorkoutDto } from '~/modules/workout/dto/workout.dto';
import { Workout } from '~/modules/workout/entities/workout.entity';
import WorkoutMapper from '~/modules/workout/mappers/workout.mapper';
import { WorkoutUseCaseError } from '~/modules/workout/use-cases/errors';
import WorkoutRepository from '~/services/database/typeorm/repositories/workout-repository';
import { UseCase } from '~/shared/core/use-case';

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

        const { id: workoutId, ...workoutPersistence } =
          this.workoutMapper.toPersistence(workout);
        let newWorkout: Workout;
        try {
          newWorkout = await workoutRepository.save(
            workoutRepository.create({
              ...workoutPersistence,
              name: `${workout.name.value}-${new Date().toISOString()}`,
            }),
          );
        } catch (err) {
          throw new InternalServerErrorException((err as Error).message);
        }

        const workoutExercises = await workoutExerciseRepository.find({
          where: { workoutId },
        });
        await Promise.all(
          workoutExercises.map(async (we) => {
            const newWorkoutExerciseDomainOrError =
              await this.workoutExerciseMapper.toDomain(we);
            if (newWorkoutExerciseDomainOrError.isLeft()) {
              throw new HttpException(
                newWorkoutExerciseDomainOrError.value.message,
                newWorkoutExerciseDomainOrError.value.code,
              );
            }

            let workoutExerciseCreated: WorkoutExercise;
            try {
              const { id: _, ...persistenceData } =
                this.workoutExerciseMapper.toPersistence(
                  newWorkoutExerciseDomainOrError.value,
                );

              workoutExerciseCreated = await workoutExerciseRepository.save(
                workoutExerciseRepository.create({
                  ...persistenceData,
                  workoutId: newWorkout.id,
                }),
              );
            } catch (err) {
              throw new InternalServerErrorException((err as Error).message);
            }

            const sets = await setRepository.find({
              where: { workoutExerciseId: we.id },
            });
            await Promise.all(
              sets.map(async (set) => {
                const setDomainOrError = this.setMapper.toDomain({
                  ...set,
                  workoutExerciseId: workoutExerciseCreated.id,
                });
                if (setDomainOrError.isLeft()) {
                  throw new HttpException(
                    setDomainOrError.value.message,
                    setDomainOrError.value.code,
                  );
                }

                try {
                  const { id: _, ...persistenceData } =
                    this.setMapper.toPersistence(setDomainOrError.value);
                  await setRepository.save(
                    setRepository.create(persistenceData),
                  );
                } catch (err) {
                  throw new InternalServerErrorException(
                    (err as Error).message,
                  );
                }
              }),
            );
          }),
        );

        const workoutDomainOrError = await this.workoutMapper.toDomain(
          newWorkout,
        );

        if (workoutDomainOrError.isLeft()) {
          throw new HttpException(
            workoutDomainOrError.value.message,
            workoutDomainOrError.value.code,
          );
        }

        return workoutDomainOrError.value;
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
