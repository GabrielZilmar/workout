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
import { CreateSet } from '~/modules/set/domain/use-cases/create-set';
import { ListByWorkoutExerciseId } from '~/modules/set/domain/use-cases/list-by-workout-exercise';
import { CreateSetDto } from '~/modules/set/dto/create-set.dto';
import { ListByWorkoutExerciseIdDto } from '~/modules/set/dto/list-by-workout-exercise-id.dto';
import { PaginatedDto } from '~/shared/dto/paginated';
import { RequestWithUser } from '~/shared/types/request';

@Controller('/api/sets')
@UseGuards(AuthGuard)
export class SetController {
  constructor(
    private readonly createSet: CreateSet,
    private readonly listByWorkoutExerciseId: ListByWorkoutExerciseId,
  ) {}

  @Post()
  create(@Req() req: RequestWithUser, @Body() body: CreateSetDto) {
    const userId = req.user.id;
    return this.createSet.execute({ ...body, userId });
  }

  @Get('/workout-exercise/:workoutExerciseId')
  get(
    @Req() req: RequestWithUser,
    @Query() query: PaginatedDto,
    @Param() { workoutExerciseId }: ListByWorkoutExerciseIdDto,
  ) {
    const userId = req.user.id;
    return this.listByWorkoutExerciseId.execute({
      ...query,
      userId,
      workoutExerciseId,
    });
  }
}
