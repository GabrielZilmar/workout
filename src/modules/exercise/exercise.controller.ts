import { Body, Controller, Post, UseGuards } from '@nestjs/common';
import { AdminGuard } from '~/guards/admin-guard';
import { AuthGuard } from '~/guards/auth.guard';
import { CreateExerciseDto } from '~/modules/exercise/dto/create-exercise.dto';
import { CreateExercise } from '~/modules/exercise/use-cases/create-exercise';

@Controller('/api/exercises')
@UseGuards(AuthGuard)
export class ExerciseController {
  constructor(private readonly createExercise: CreateExercise) {}

  @Post()
  @UseGuards(AdminGuard)
  create(@Body() body: CreateExerciseDto) {
    return this.createExercise.execute({ ...body });
  }
}
