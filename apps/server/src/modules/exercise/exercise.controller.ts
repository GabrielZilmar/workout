import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Patch,
  Post,
  Query,
  UseGuards,
} from '@nestjs/common';
import { AdminGuard } from '~/guards/admin-guard';
import { AuthGuard } from '~/guards/auth.guard';
import { CreateExerciseDto } from '~/modules/exercise/dto/create-exercise.dto';
import { DeleteExerciseParamsDto } from '~/modules/exercise/dto/delete-exercise.dto';
import { ListExercisesDto } from '~/modules/exercise/dto/list-exercises.dto';
import {
  UpdateExerciseBodyDto,
  UpdateExerciseParamsDto,
} from '~/modules/exercise/dto/update-exercise.dto';
import { CreateExercise } from '~/modules/exercise/use-cases/create-exercise';
import { DeleteExercise } from '~/modules/exercise/use-cases/delete-exercise';
import { GetExercise } from '~/modules/exercise/use-cases/get-exercise';
import { ListExercises } from '~/modules/exercise/use-cases/list-exercises';
import { UpdateExercise } from '~/modules/exercise/use-cases/update-exercise';

@Controller('/api/exercises')
@UseGuards(AuthGuard)
export class ExerciseController {
  constructor(
    private readonly createExercise: CreateExercise,
    private readonly listExercises: ListExercises,
    private readonly getExercise: GetExercise,
    private readonly updateExercise: UpdateExercise,
    private readonly deleteExercise: DeleteExercise,
  ) {}

  @Post()
  @UseGuards(AdminGuard)
  create(@Body() body: CreateExerciseDto) {
    return this.createExercise.execute({ ...body });
  }

  @Get()
  findAll(@Query() query: ListExercisesDto) {
    return this.listExercises.execute({ ...query });
  }

  @Get(':idOrUsername')
  findOne(@Param('idOrUsername') idOrUsername: string) {
    return this.getExercise.execute({ idOrUsername });
  }

  @Patch(':id')
  @UseGuards(AdminGuard)
  update(
    @Param() { id }: UpdateExerciseParamsDto,
    @Body() body: UpdateExerciseBodyDto,
  ) {
    return this.updateExercise.execute({ id, ...body });
  }

  @Delete(':id')
  @UseGuards(AdminGuard)
  delete(@Param() { id }: DeleteExerciseParamsDto) {
    return this.deleteExercise.execute({ id });
  }
}
