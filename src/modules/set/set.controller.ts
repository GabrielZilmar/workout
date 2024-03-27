import { Body, Controller, Post, Req, UseGuards } from '@nestjs/common';
import { AuthGuard } from '~/guards/auth.guard';
import { CreateSet } from '~/modules/set/domain/use-cases/create-set';
import { CreateSetDto } from '~/modules/set/dto/create-set.dto';
import { RequestWithUser } from '~/shared/types/request';

@Controller('/api/sets')
@UseGuards(AuthGuard)
export class SetController {
  constructor(private readonly createSet: CreateSet) {}

  @Post()
  create(@Req() req: RequestWithUser, @Body() body: CreateSetDto) {
    const userId = req.user.id;
    return this.createSet.execute({ ...body, userId });
  }
}
