import { Body, Controller, Post, UseGuards } from '@nestjs/common';
import { AdminGuard } from '~/guards/admin-guard';
import { AuthGuard } from '~/guards/auth.guard';
import { CreateMuscleDto } from '~/modules/muscle/dto/create-muscle.dto';
import { CreateMuscleUseCase } from '~/modules/muscle/use-cases/create-muscle';

@Controller('/api/muscles')
@UseGuards(AuthGuard, AdminGuard)
export class MuscleController {
  constructor(private readonly createMuscleUseCase: CreateMuscleUseCase) {}

  @Post()
  create(@Body() createMuscleDto: CreateMuscleDto) {
    return this.createMuscleUseCase.execute(createMuscleDto);
  }
}
