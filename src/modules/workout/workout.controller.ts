import {
  Body,
  Controller,
  Get,
  Post,
  Query,
  Req,
  UseGuards,
} from '@nestjs/common';
import { AuthGuard } from '~/guards/auth.guard';
import { CreateWorkoutDto } from '~/modules/workout/dto/create-workout.dto';
import { ListPublicWorkoutsDto } from '~/modules/workout/dto/list-public-workouts.dto';
import { ListWorkoutsDto } from '~/modules/workout/dto/list-workouts.dto';
import { CreateWorkout } from '~/modules/workout/use-cases/create-workout';
import { ListPublicWorkouts } from '~/modules/workout/use-cases/list-public-workouts';
import { ListWorkouts } from '~/modules/workout/use-cases/list-workouts';
import { RequestWithUser } from '~/shared/types/request';

@Controller('/api/workouts')
@UseGuards(AuthGuard)
export class WorkoutsController {
  constructor(
    private readonly createWorkout: CreateWorkout,
    private readonly listWorkouts: ListWorkouts,
    private readonly listPublicWorkouts: ListPublicWorkouts,
  ) {}

  @Post()
  create(
    @Req() req: RequestWithUser,
    @Body() createWorkoutDto: CreateWorkoutDto,
  ) {
    const userId = req.user.id;
    return this.createWorkout.execute({ ...createWorkoutDto, userId });
  }

  @Get()
  findAll(@Req() req: RequestWithUser, @Query() query: ListWorkoutsDto) {
    const userId = req.user.id;
    return this.listWorkouts.execute({ ...query, userId });
  }

  @Get('/publics')
  findAllPublics(@Query() query: ListPublicWorkoutsDto) {
    return this.listPublicWorkouts.execute({ ...query });
  }
}
