import { IsBoolean, IsOptional, IsString, IsUUID } from 'class-validator';

export class UpdateWorkoutParamsDto {
  @IsString()
  @IsUUID()
  id: string;
}

export class UpdateWorkoutBodyDto {
  @IsString()
  @IsOptional()
  name?: string;

  @IsBoolean()
  @IsOptional()
  isPrivate?: boolean;

  @IsBoolean()
  @IsOptional()
  isRoutine?: boolean;
}
