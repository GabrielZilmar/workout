import { Global, Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { DatabaseModule } from '~/modules/database/database.module';
import { ExerciseModule } from '~/modules/exercise/exercise.module';
import ExerciseMapper from '~/modules/exercise/mappers/exercise.mapper';
import MuscleMapper from '~/modules/muscle/mappers/muscle.mapper';
import { MuscleModule } from '~/modules/muscle/muscle.module';
import SessionMapper from '~/modules/session/domain/mappers/session.mapper';
import { SessionModule } from '~/modules/session/session.module';
import SetMapper from '~/modules/set/mappers/set.mapper';
import { SetModule } from '~/modules/set/set.module';
import UserMapper from '~/modules/users/domain/mappers/users.mapper';
import { UsersModule } from '~/modules/users/users.module';
import WorkoutExerciseMapper from '~/modules/workout-exercise/mappers/workout-exercise.mapper';
import { WorkoutExerciseModule } from '~/modules/workout-exercise/workout-exercise.module';
import WorkoutMapper from '~/modules/workout/mappers/workout.mapper';
import { WorkoutModule } from '~/modules/workout/workout.module';
import repositoriesProviders from '~/services/database/typeorm/repositories/providers';
import JwtService from '~/services/jwt/jsonwebtoken';

const mappersProviders = [
  UserMapper,
  SessionMapper,
  WorkoutMapper,
  MuscleMapper,
  ExerciseMapper,
  WorkoutExerciseMapper,
  SetMapper,
];
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
    MuscleModule,
    ExerciseModule,
    WorkoutExerciseModule,
    SetModule,
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
