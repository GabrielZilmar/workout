import { IsString, IsUUID } from 'class-validator';

export class DeleteUserParamsDto {
  @IsString()
  @IsUUID()
  id: string;
}
