import { Module } from '@nestjs/common';
import { MuscleController } from '~/modules/muscle/muscle.controller';
import useCaseProviders from '~/modules/muscle/use-cases/provider';

@Module({
  controllers: [MuscleController],
  providers: [...useCaseProviders],
})
export class MuscleModule {}
