import { IsBoolean, IsOptional } from 'class-validator';

export class ListWorkoutsDto {
  @IsBoolean()
  @IsOptional()
  isRoutine?: boolean;
}
