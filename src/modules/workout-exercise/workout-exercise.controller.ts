import {
  Body,
  Controller,
  Get,
  Param,
  Post,
  Put,
  Query,
  Req,
  UseGuards,
} from '@nestjs/common';
import { AuthGuard } from '~/guards/auth.guard';
import { CreateWorkoutExerciseDto } from '~/modules/workout-exercise/dto/create-workout-exercise.dto';
import { FindByWorkoutIdDto } from '~/modules/workout-exercise/dto/find-by-workout-id.dto';
import {
  UpdateWorkoutExerciseDto,
  UpdateWorkoutExerciseParamsDto,
} from '~/modules/workout-exercise/dto/update-workout-exercise.dto';
import { CreateWorkoutExercise } from '~/modules/workout-exercise/use-cases/create-workout-exercise';
import { FindByWorkoutId } from '~/modules/workout-exercise/use-cases/find-by-workout-id';
import { UpdateWorkoutExercise } from '~/modules/workout-exercise/use-cases/update-workout-exercise';
import { PaginatedDto } from '~/shared/dto/paginated';
import { RequestWithUser } from '~/shared/types/request';

@Controller('/api/workout-exercises')
@UseGuards(AuthGuard)
export class WorkoutExerciseController {
  constructor(
    private readonly createWorkoutExercise: CreateWorkoutExercise,
    private readonly findByWorkoutIdUseCase: FindByWorkoutId,
    private readonly updateWorkoutExercise: UpdateWorkoutExercise,
  ) {}

  @Post()
  create(@Req() req: RequestWithUser, @Body() body: CreateWorkoutExerciseDto) {
    const userId = req.user.id;
    return this.createWorkoutExercise.execute({ ...body, userId });
  }

  @Get('/:workoutId')
  findByWorkoutId(
    @Req() req: RequestWithUser,
    @Param() { workoutId }: FindByWorkoutIdDto,
    @Query() { skip, take }: PaginatedDto,
  ) {
    const userId = req.user.id;
    return this.findByWorkoutIdUseCase.execute({
      userId,
      workoutId,
      skip,
      take,
    });
  }

  @Put('/:id')
  update(
    @Req() req: RequestWithUser,
    @Param() { id }: UpdateWorkoutExerciseParamsDto,
    @Body() body: UpdateWorkoutExerciseDto,
  ) {
    const userId = req.user.id;
    return this.updateWorkoutExercise.execute({ id, userId, ...body });
  }
}
