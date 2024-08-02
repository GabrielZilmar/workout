import { IsEmail, IsNotEmpty } from 'class-validator';

export class IsEmailAvailableQueryDTO {
  @IsEmail()
  @IsNotEmpty()
  email: string;
}
