import { Module } from '@nestjs/common';
import UserMapper from '~/modules/users/domain/mappers/users.mapper';
import UseCaseProviders from '~/modules/users/domain/use-cases/provider';
import { UsersController } from '~/modules/users/users.controller';
import UserRepository from '~/services/database/typeorm/repositories/users-repository';

@Module({
  controllers: [UsersController],
  providers: [UserRepository, UserMapper, ...UseCaseProviders],
})
export class UsersModule {}
