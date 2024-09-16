import { Controller, Post, Body } from '@nestjs/common';
import { Login } from '~/modules/session/domain/use-cases/login';
import { RecoverPassword } from '~/modules/session/domain/use-cases/recover-password';
import { SendRecoverPassword } from '~/modules/session/domain/use-cases/send-recover-password';
import { SendVerifyEmail } from '~/modules/session/domain/use-cases/send-verify-email';
import { VerifyEmail } from '~/modules/session/domain/use-cases/verify-email';
import { SessionLoginDto } from '~/modules/session/dto/login.dto';
import { RecoverPasswordBodyDto } from '~/modules/session/dto/recover-password.dto';
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
    private readonly recoverPasswordUseCase: RecoverPassword,
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

  @Post('/recover-password')
  recoverPassword(@Body() body: RecoverPasswordBodyDto) {
    return this.recoverPasswordUseCase.execute({
      ...body,
    });
  }
}
