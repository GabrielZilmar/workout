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
import { CreateSet } from '~/modules/set/domain/use-cases/create-set';
import { DeleteSet } from '~/modules/set/domain/use-cases/delete-set';
import { ListSetByWorkoutExerciseId } from '~/modules/set/domain/use-cases/list-set-by-workout-exercise';
import { UpdateSet } from '~/modules/set/domain/use-cases/update-set';
import { CreateSetDto } from '~/modules/set/dto/create-set.dto';
import { DeleteSetParamsDto } from '~/modules/set/dto/delete-set.dto';
import { ListSetByWorkoutExerciseIdDto } from '~/modules/set/dto/list-set-by-workout-exercise-id.dto';
import {
  UpdateSetBodyDto,
  UpdateSetParamsDto,
} from '~/modules/set/dto/update-set.dto';
import { PaginatedDto } from '~/shared/dto/paginated';
import { RequestWithUser } from '~/shared/types/request';

@Controller('/api/sets')
@UseGuards(AuthGuard)
export class SetController {
  constructor(
    private readonly createSet: CreateSet,
    private readonly listSetByWorkoutExerciseId: ListSetByWorkoutExerciseId,
    private readonly updateSet: UpdateSet,
    private readonly deleteSet: DeleteSet,
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
    @Param() { workoutExerciseId }: ListSetByWorkoutExerciseIdDto,
  ) {
    const userId = req.user.id;
    return this.listSetByWorkoutExerciseId.execute({
      ...query,
      userId,
      workoutExerciseId,
    });
  }

  @Patch('/:id')
  update(
    @Req() req: RequestWithUser,
    @Param() { id }: UpdateSetParamsDto,
    @Body() body: UpdateSetBodyDto,
  ) {
    const userId = req.user.id;
    return this.updateSet.execute({ id, userId, ...body });
  }

  @Delete('/:id')
  delete(@Req() req: RequestWithUser, @Param() { id }: DeleteSetParamsDto) {
    const userId = req.user.id;
    return this.deleteSet.execute({ id, userId });
  }
}
