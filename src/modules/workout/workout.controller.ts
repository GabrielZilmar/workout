import { Body, Controller, Post } from '@nestjs/common';
import { CreateWorkoutDto } from '~/modules/workout/dto/create-workout.dto';
import { CreateWorkout } from '~/modules/workout/use-cases/create-workout';

@Controller('/api/workouts')
export class WorkoutsController {
  constructor(private readonly createWorkout: CreateWorkout) {}

  @Post()
  // TODO: userId comes from the token
  create(@Body() createWorkoutDto: CreateWorkoutDto) {
    return this.createWorkout.execute(createWorkoutDto);
  }
}
