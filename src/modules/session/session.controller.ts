import { Controller, Post, Body, Req } from '@nestjs/common';
import { Request } from 'express';
import { Login } from '~/modules/session/domain/use-cases/login';
import { SendVerifyEmail } from '~/modules/session/domain/use-cases/send-verify-email';
import { SessionLoginDto } from '~/modules/session/dto/login.dto';
import { SendVerifyEmailDto } from '~/modules/session/dto/send-verify-email.dto';

@Controller('/api/session')
export class SessionController {
  constructor(
    private readonly loginUseCase: Login,
    private readonly sendVerifyEmailUseCase: SendVerifyEmail,
  ) {}

  @Post('/login')
  login(@Body() sessionLoginDto: SessionLoginDto) {
    return this.loginUseCase.execute(sessionLoginDto);
  }

  @Post('/send-verify-email')
  sendVerifyEmail(
    @Req() req: Request,
    @Body() sendVerifyEmailDto: SendVerifyEmailDto,
  ) {
    const baseUrl = `${req.protocol}://${req.get('host')}`;
    return this.sendVerifyEmailUseCase.execute({
      ...sendVerifyEmailDto,
      baseUrl,
    });
  }
}
