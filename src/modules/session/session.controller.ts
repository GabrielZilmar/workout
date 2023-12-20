import { Controller, Post, Body } from '@nestjs/common';
import { Login } from '~/modules/session/domain/use-cases/login';
import { SessionLoginDto } from '~/modules/session/dto/login.dto';

@Controller('/api/session')
export class SessionController {
  constructor(private readonly loginUseCase: Login) {}

  @Post('/login')
  login(@Body() sessionLoginDto: SessionLoginDto) {
    return this.loginUseCase.execute(sessionLoginDto);
  }
}
