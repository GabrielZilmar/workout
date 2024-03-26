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
import { CreateWorkoutExerciseDto } from '~/modules/workout-exercise/dto/create-workout-exercise.dto';
import { FindByWorkoutIdDto } from '~/modules/workout-exercise/dto/find-by-workout-id.dto';
import { CreateWorkoutExercise } from '~/modules/workout-exercise/use-cases/create-workout-exercise';
import { FindByWorkoutId } from '~/modules/workout-exercise/use-cases/find-by-workout-id';
import { PaginatedDto } from '~/shared/dto/paginated';
import { RequestWithUser } from '~/shared/types/request';

@Controller('/api/workout-exercises')
@UseGuards(AuthGuard)
export class WorkoutExerciseController {
  constructor(
    private readonly createWorkoutExercise: CreateWorkoutExercise,
    private readonly findByWorkoutIdUseCase: FindByWorkoutId,
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
}
