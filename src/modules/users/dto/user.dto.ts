import { IsNumber, IsString, IsUUID } from 'class-validator';

export class UserDto {
  @IsUUID()
  ssoId: string;

  @IsString()
  userName: string;

  @IsNumber()
  age: number;

  @IsNumber()
  weight: number; // In kg

  @IsNumber()
  height: number; // In cm
}
