import { IsString, IsUUID } from 'class-validator';

export default class GetWorkoutDto {
  @IsString()
  @IsUUID()
  id: string;
}
