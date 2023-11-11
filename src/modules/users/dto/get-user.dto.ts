import { IsString } from 'class-validator';

export class GetUserDto {
  @IsString()
  idOrUsername: string;
}
