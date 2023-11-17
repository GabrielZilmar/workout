import { Controller, Post, Body } from '@nestjs/common';
import { SessionLoginDto } from '~/modules/session/dto/create-session.dto';

@Controller('session')
export class SessionController {
  @Post()
  login(@Body() sessionLoginDto: SessionLoginDto) {
    return `This action should login a user. ${sessionLoginDto}`;
  }
}
