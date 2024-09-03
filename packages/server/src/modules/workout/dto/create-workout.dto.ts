import { IsBoolean, IsNotEmpty, IsOptional, IsString } from 'class-validator';

export class CreateWorkoutDto {
  @IsString()
  @IsNotEmpty()
  name: string;

  @IsBoolean()
  @IsOptional()
  isPrivate?: boolean;

  @IsBoolean()
  @IsOptional()
  isRoutine?: boolean;
}
