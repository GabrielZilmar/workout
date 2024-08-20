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
import { CreateWorkoutExerciseDto } from '~/modules/workout-exercise/dto/create-workout-exercise.dto';
import { DeleteWorkoutExerciseDto } from '~/modules/workout-exercise/dto/delete-workout-exercise.dto';
import { FindByWorkoutIdDto } from '~/modules/workout-exercise/dto/find-by-workout-id.dto';
import { GetWorkoutExerciseDetailsParamsDto } from '~/modules/workout-exercise/dto/get-workout-exercise-details.dto';
import {
  UpdateWorkoutExerciseDto,
  UpdateWorkoutExerciseParamsDto,
} from '~/modules/workout-exercise/dto/update-workout-exercise.dto';
import { CreateWorkoutExercise } from '~/modules/workout-exercise/use-cases/create-workout-exercise';
import DeleteWorkoutExercise from '~/modules/workout-exercise/use-cases/delete-workout-exercise';
import { FindByWorkoutId } from '~/modules/workout-exercise/use-cases/find-by-workout-id';
import { GetWorkoutExerciseDetails } from '~/modules/workout-exercise/use-cases/get-workout-details';
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
    private readonly deleteWorkoutExercise: DeleteWorkoutExercise,
    private readonly getWorkoutExerciseDetails: GetWorkoutExerciseDetails,
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

  @Get('/details/:id')
  findDetails(
    @Req() req: RequestWithUser,
    @Param() { id }: GetWorkoutExerciseDetailsParamsDto,
  ) {
    const userId = req.user.id;
    return this.getWorkoutExerciseDetails.execute({
      userId,
      id,
    });
  }

  @Patch('/:id')
  update(
    @Req() req: RequestWithUser,
    @Param() { id }: UpdateWorkoutExerciseParamsDto,
    @Body() body: UpdateWorkoutExerciseDto,
  ) {
    const userId = req.user.id;
    return this.updateWorkoutExercise.execute({ id, userId, ...body });
  }

  @Delete('/:id')
  delete(
    @Req() req: RequestWithUser,
    @Param() { id }: DeleteWorkoutExerciseDto,
  ) {
    const userId = req.user.id;
    return this.deleteWorkoutExercise.execute({ id, userId });
  }
}
