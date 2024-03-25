import { Body, Controller, Post, Req, UseGuards } from '@nestjs/common';
import { AuthGuard } from '~/guards/auth.guard';
import { CreateWorkoutExerciseDto } from '~/modules/workout-exercise/dto/create-workout-exercise.dto';
import { CreateWorkoutExercise } from '~/modules/workout-exercise/use-cases/create-workout-exercise';
import { RequestWithUser } from '~/shared/types/request';

@Controller('/api/workout-exercises')
@UseGuards(AuthGuard)
export class WorkoutExerciseController {
  constructor(private readonly createWorkoutExercise: CreateWorkoutExercise) {}

  @Post()
  create(@Req() req: RequestWithUser, @Body() body: CreateWorkoutExerciseDto) {
    const userId = req.user.id;
    return this.createWorkoutExercise.execute({ ...body, userId });
  }
}
