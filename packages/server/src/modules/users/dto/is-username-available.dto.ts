import { Transform } from 'class-transformer';
import { IsNotEmpty, IsString } from 'class-validator';

export class IsUsernameAvailableQueryDTO {
  @IsString()
  @IsNotEmpty()
  @Transform(({ value }) => value.toLowerCase())
  username: string;
}
