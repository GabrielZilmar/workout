import { IsUUID } from 'class-validator';

export class DeleteSetParamsDto {
  @IsUUID()
  id: string;
}
