import { Controller, Post, Body } from '@nestjs/common';
import { Login } from '~/modules/session/domain/use-cases/login';
import { SendRecoverPassword } from '~/modules/session/domain/use-cases/send-recover-password';
import { SendVerifyEmail } from '~/modules/session/domain/use-cases/send-verify-email';
import { VerifyEmail } from '~/modules/session/domain/use-cases/verify-email';
import { SessionLoginDto } from '~/modules/session/dto/login.dto';
import { SendRecoverPasswordEmailBodyDTO } from '~/modules/session/dto/send-recover-password-email';
import { SendVerifyEmailDto } from '~/modules/session/dto/send-verify-email.dto';
import { VerifyEmailBodyDto } from '~/modules/session/dto/verify-email.dto';

@Controller('/api/session')
export class SessionController {
  constructor(
    private readonly loginUseCase: Login,
    private readonly sendVerifyEmailUseCase: SendVerifyEmail,
    private readonly verifyEmailUseCase: VerifyEmail,
    private readonly sendRecoverPassword: SendRecoverPassword,
  ) {}

  @Post('/login')
  login(@Body() sessionLoginDto: SessionLoginDto) {
    return this.loginUseCase.execute(sessionLoginDto);
  }

  @Post('/send-verify-email')
  sendVerifyEmail(@Body() sendVerifyEmailDto: SendVerifyEmailDto) {
    return this.sendVerifyEmailUseCase.execute({
      ...sendVerifyEmailDto,
    });
  }

  @Post('/verify-email')
  verifyEmail(@Body() verifyEmailDto: VerifyEmailBodyDto) {
    return this.verifyEmailUseCase.execute(verifyEmailDto);
  }

  @Post('/send-recover-password-email')
  sendRecoverPasswordEmail(@Body() body: SendRecoverPasswordEmailBodyDTO) {
    return this.sendRecoverPassword.execute({
      ...body,
    });
  }
}
