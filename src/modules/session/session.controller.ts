import { Controller, Post, Body, Req, Query, Get } from '@nestjs/common';
import { Request } from 'express';
import { Login } from '~/modules/session/domain/use-cases/login';
import { SendVerifyEmail } from '~/modules/session/domain/use-cases/send-verify-email';
import { VerifyEmail } from '~/modules/session/domain/use-cases/verify-email';
import { SessionLoginDto } from '~/modules/session/dto/login.dto';
import { SendVerifyEmailDto } from '~/modules/session/dto/send-verify-email.dto';
import { VerifyEmailDto } from '~/modules/session/dto/verify-email.dto';

@Controller('/api/session')
export class SessionController {
  constructor(
    private readonly loginUseCase: Login,
    private readonly sendVerifyEmailUseCase: SendVerifyEmail,
    private readonly verifyEmailUseCase: VerifyEmail,
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

  @Get('/verify-email')
  verifyEmail(@Req() req: Request, @Query() verifyEmailDto: VerifyEmailDto) {
    return this.verifyEmailUseCase.execute(verifyEmailDto);
  }
}
