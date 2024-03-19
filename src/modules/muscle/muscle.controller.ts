import { Body, Controller, Get, Post, Query, UseGuards } from '@nestjs/common';
import { AdminGuard } from '~/guards/admin-guard';
import { AuthGuard } from '~/guards/auth.guard';
import { CreateMuscleDto } from '~/modules/muscle/dto/create-muscle.dto';
import { ListMusclesDto } from '~/modules/muscle/dto/list-muscles.dto';
import { CreateMuscle } from '~/modules/muscle/use-cases/create-muscle';
import { ListMuscle } from '~/modules/muscle/use-cases/list-muscle';

@Controller('/api/muscles')
@UseGuards(AuthGuard)
export class MuscleController {
  constructor(
    private readonly createMuscle: CreateMuscle,
    private readonly listMuscle: ListMuscle,
  ) {}

  @Post()
  @UseGuards(AdminGuard)
  create(@Body() createMuscleDto: CreateMuscleDto) {
    return this.createMuscle.execute(createMuscleDto);
  }

  @Get()
  findAll(@Query() query: ListMusclesDto) {
    return this.listMuscle.execute({ ...query });
  }
}
