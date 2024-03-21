import { Body, Controller, Get, Post, Query, UseGuards } from '@nestjs/common';
import { AdminGuard } from '~/guards/admin-guard';
import { AuthGuard } from '~/guards/auth.guard';
import { CreateExerciseDto } from '~/modules/exercise/dto/create-exercise.dto';
import { ListExercisesDto } from '~/modules/exercise/dto/list-exercises.dto';
import { CreateExercise } from '~/modules/exercise/use-cases/create-exercise';
import { ListExercises } from '~/modules/exercise/use-cases/list-exercises';

@Controller('/api/exercises')
@UseGuards(AuthGuard)
export class ExerciseController {
  constructor(
    private readonly createExercise: CreateExercise,
    private readonly listExercises: ListExercises,
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
}
