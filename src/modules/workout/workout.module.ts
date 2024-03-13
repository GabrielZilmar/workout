import { Module } from '@nestjs/common';
import workoutUseCaseProviders from '~/modules/workout/use-cases/provider';
import { WorkoutsController } from '~/modules/workout/workout.controller';

@Module({
  controllers: [WorkoutsController],
  providers: [...workoutUseCaseProviders],
})
export class WorkoutModule {}
