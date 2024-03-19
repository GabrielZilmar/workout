import { Body, Controller, Post, UseGuards } from '@nestjs/common';
import { AdminGuard } from '~/guards/admin-guard';
import { AuthGuard } from '~/guards/auth.guard';
import { CreateMuscleDto } from '~/modules/muscle/dto/create-muscle.dto';
import { CreateMuscle } from '~/modules/muscle/use-cases/create-muscle';

@Controller('/api/muscles')
@UseGuards(AuthGuard, AdminGuard)
export class MuscleController {
  constructor(private readonly createMuscle: CreateMuscle) {}

  @Post()
  create(@Body() createMuscleDto: CreateMuscleDto) {
    return this.createMuscle.execute(createMuscleDto);
  }
}
