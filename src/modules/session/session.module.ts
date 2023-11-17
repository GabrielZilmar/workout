import { Module } from '@nestjs/common';
import { SessionController } from '~/modules/session/session.controller';

@Module({
  controllers: [SessionController],
  providers: [],
})
export class SessionModule {}
