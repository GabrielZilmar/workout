import { Module } from '@nestjs/common';
import { ExerciseController } from '~/modules/exercise/exercise.controller';
import useCaseProviders from '~/modules/exercise/use-cases/providers';

@Module({
  controllers: [ExerciseController],
  providers: [...useCaseProviders],
})
export class ExerciseModule {}
