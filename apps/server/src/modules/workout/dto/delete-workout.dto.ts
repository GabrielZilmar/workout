import { IsString, IsUUID } from 'class-validator';

export default class DeleteWorkoutDto {
  @IsString()
  @IsUUID()
  id: string;
}
