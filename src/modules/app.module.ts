import { Global, Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { DatabaseModule } from '~/modules/database/database.module';
import SessionMapper from '~/modules/session/domain/mappers/session.mapper';
import { SessionModule } from '~/modules/session/session.module';
import UserMapper from '~/modules/users/domain/mappers/users.mapper';
import { UsersModule } from '~/modules/users/users.module';
import WorkoutMapper from '~/modules/workout/mappers/workout.mapper';
import { WorkoutModule } from '~/modules/workout/workout.module';
import repositoriesProviders from '~/services/database/typeorm/repositories/providers';
import JwtService from '~/services/jwt/jsonwebtoken';

const mappersProviders = [UserMapper, SessionMapper, WorkoutMapper];
const servicesProviders = [JwtService];

const allProviders = [
  ...mappersProviders,
  ...repositoriesProviders,
  ...servicesProviders,
];

@Global()
@Module({
  imports: [
    UsersModule,
    SessionModule,
    WorkoutModule,
    DatabaseModule,
    ConfigModule.forRoot({
      isGlobal: true,
    }),
  ],
  controllers: [],
  exports: [...allProviders],
  providers: [...allProviders],
})
export class AppModule {}
