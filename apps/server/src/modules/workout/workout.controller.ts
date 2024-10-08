import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Post,
  Patch,
  Query,
  Req,
  UseGuards,
} from '@nestjs/common';
import { AuthGuard } from '~/guards/auth.guard';
import { CreateWorkoutDto } from '~/modules/workout/dto/create-workout.dto';
import DeleteWorkoutDto from '~/modules/workout/dto/delete-workout.dto';
import GetWorkoutDto from '~/modules/workout/dto/get-workout.dto';
import { ListPublicWorkoutsDto } from '~/modules/workout/dto/list-public-workouts.dto';
import { ListWorkoutsDto } from '~/modules/workout/dto/list-workouts.dto';
import { StartRoutineBodyDTO } from '~/modules/workout/dto/start-routine.dto';
import {
  UpdateWorkoutBodyDto,
  UpdateWorkoutParamsDto,
} from '~/modules/workout/dto/update-workout.dto';
import { CreateWorkout } from '~/modules/workout/use-cases/create-workout';
import DeleteWorkout from '~/modules/workout/use-cases/delete-workout';
import { GetWorkout } from '~/modules/workout/use-cases/get-workout';
import { ListPublicWorkouts } from '~/modules/workout/use-cases/list-public-workouts';
import { ListWorkouts } from '~/modules/workout/use-cases/list-workouts';
import { StartRoutine } from '~/modules/workout/use-cases/start-routine';
import { UpdateWorkout } from '~/modules/workout/use-cases/update-workout';
import { RequestWithUser } from '~/shared/types/request';

@Controller('/api/workouts')
@UseGuards(AuthGuard)
export class WorkoutsController {
  constructor(
    private readonly createWorkout: CreateWorkout,
    private readonly listWorkouts: ListWorkouts,
    private readonly listPublicWorkouts: ListPublicWorkouts,
    private readonly getWorkout: GetWorkout,
    private readonly updateWorkout: UpdateWorkout,
    private readonly deleteWorkout: DeleteWorkout,
    private readonly startRoutineUseCase: StartRoutine,
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

  @Patch(':id')
  update(
    @Req() req: RequestWithUser,
    @Param() param: UpdateWorkoutParamsDto,
    @Body() body: UpdateWorkoutBodyDto,
  ) {
    const userId = req.user.id;
    return this.updateWorkout.execute({ ...param, ...body, userId });
  }

  @Delete(':id')
  delete(@Req() req: RequestWithUser, @Param() param: DeleteWorkoutDto) {
    const userId = req.user.id;
    return this.deleteWorkout.execute({ ...param, userId: userId });
  }

  @Post('/start-routine')
  startRoutine(@Req() req: RequestWithUser, @Body() body: StartRoutineBodyDTO) {
    const userId = req.user.id;
    return this.startRoutineUseCase.execute({ ...body, userId });
  }
}
