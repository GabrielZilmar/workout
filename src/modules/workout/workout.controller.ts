import { Body, Controller, Post, Req, UseGuards } from '@nestjs/common';
import { AuthGuard } from '~/guards/auth.guard';
import { CreateWorkoutDto } from '~/modules/workout/dto/create-workout.dto';
import { CreateWorkout } from '~/modules/workout/use-cases/create-workout';
import { RequestWithUser } from '~/shared/types/request';

@Controller('/api/workouts')
export class WorkoutsController {
  constructor(private readonly createWorkout: CreateWorkout) {}

  @Post()
  @UseGuards(AuthGuard)
  create(
    @Req() req: RequestWithUser,
    @Body() createWorkoutDto: CreateWorkoutDto,
  ) {
    const userId = req.user.id;
    return this.createWorkout.execute({ ...createWorkoutDto, userId });
  }
}
