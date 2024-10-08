import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Post,
  Patch,
  Query,
  UseGuards,
} from '@nestjs/common';
import { AdminGuard } from '~/guards/admin-guard';
import { AuthGuard } from '~/guards/auth.guard';
import { CreateMuscleDto } from '~/modules/muscle/dto/create-muscle.dto';
import { DeleteMuscleParamsDto } from '~/modules/muscle/dto/delete-muscle.dto';
import { ListMusclesDto } from '~/modules/muscle/dto/list-muscles.dto';
import {
  UpdateMuscleBodyDto,
  UpdateMuscleParamsDto,
} from '~/modules/muscle/dto/update-muscle.dto';
import { CreateMuscle } from '~/modules/muscle/use-cases/create-muscle';
import { DeleteMuscle } from '~/modules/muscle/use-cases/delete-muscle';
import { ListMuscle } from '~/modules/muscle/use-cases/list-muscle';
import { UpdateMuscle } from '~/modules/muscle/use-cases/update-muscle';

@Controller('/api/muscles')
@UseGuards(AuthGuard)
export class MuscleController {
  constructor(
    private readonly createMuscle: CreateMuscle,
    private readonly listMuscle: ListMuscle,
    private readonly updateMuscle: UpdateMuscle,
    private readonly deleteMuscle: DeleteMuscle,
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

  @Patch(':id')
  @UseGuards(AdminGuard)
  update(
    @Body() body: UpdateMuscleBodyDto,
    @Param() { id }: UpdateMuscleParamsDto,
  ) {
    return this.updateMuscle.execute({ id, ...body });
  }

  @Delete(':id')
  @UseGuards(AdminGuard)
  delete(@Param() { id }: DeleteMuscleParamsDto) {
    return this.deleteMuscle.execute({ id });
  }
}
