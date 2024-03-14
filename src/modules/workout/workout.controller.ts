import {
  Body,
  Controller,
  Get,
  Param,
  Post,
  Query,
  Req,
  UseGuards,
} from '@nestjs/common';
import { AuthGuard } from '~/guards/auth.guard';
import { CreateWorkoutDto } from '~/modules/workout/dto/create-workout.dto';
import GetWorkoutDto from '~/modules/workout/dto/get-workout.dto';
import { ListPublicWorkoutsDto } from '~/modules/workout/dto/list-public-workouts.dto';
import { ListWorkoutsDto } from '~/modules/workout/dto/list-workouts.dto';
import { CreateWorkout } from '~/modules/workout/use-cases/create-workout';
import { GetWorkout } from '~/modules/workout/use-cases/get-workout';
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
    private readonly getWorkout: GetWorkout,
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

  @Get(':id')
  find(@Req() req: RequestWithUser, @Param() param: GetWorkoutDto) {
    const userId = req.user.id;
    return this.getWorkout.execute({ ...param, userId });
  }
}
