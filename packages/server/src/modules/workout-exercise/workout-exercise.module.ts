import { Module } from '@nestjs/common';
import useCaseProviders from '~/modules/workout-exercise/use-cases/providers';
import { WorkoutExerciseController } from '~/modules/workout-exercise/workout-exercise.controller';

@Module({
  controllers: [WorkoutExerciseController],
  providers: [...useCaseProviders],
})
export class WorkoutExerciseModule {}
