import { Module } from '@nestjs/common';
import SessionUseCaseProviders from '~/modules/session/domain/use-cases/providers';
import { SessionController } from '~/modules/session/session.controller';
import UserMapper from '~/modules/users/domain/mappers/users.mapper';
import UserRepository from '~/services/database/typeorm/repositories/users-repository';

@Module({
  imports: [],
  controllers: [SessionController],
  providers: [UserRepository, UserMapper, ...SessionUseCaseProviders],
})
export class SessionModule {}
