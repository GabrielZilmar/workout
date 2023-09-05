import { Injectable } from '@nestjs/common';
import { IsNotEmpty, IsUUID } from 'class-validator';

@Injectable()
export class CreateUserDto {
  @IsUUID()
  @IsNotEmpty()
  ssoId: string;
}
