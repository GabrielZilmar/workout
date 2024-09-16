import { Module } from '@nestjs/common';
import setUseCaseProviders from '~/modules/set/domain/use-cases/provider';
import { SetController } from '~/modules/set/set.controller';

@Module({
  controllers: [SetController],
  providers: [...setUseCaseProviders],
})
export class SetModule {}
