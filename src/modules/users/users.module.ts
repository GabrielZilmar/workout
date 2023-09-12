import { Module } from '@nestjs/common';
import UserMapper from '~/modules/users/domain/mappers/users.mapper';
import { UsersController } from '~/modules/users/users.controller';
import { UsersService } from '~/modules/users/users.service';
import UserRepository from '~/services/database/typeorm/repositories/users-repository';

@Module({
  controllers: [UsersController],
  providers: [UsersService, UserRepository, UserMapper],
})
export class UsersModule {}
