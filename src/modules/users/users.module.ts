import { Module } from '@nestjs/common';
import UseCaseProviders from '~/modules/users/domain/use-cases/provider';
import { UsersController } from '~/modules/users/users.controller';

@Module({
  controllers: [UsersController],
  providers: [...UseCaseProviders],
})
export class UsersModule {}
