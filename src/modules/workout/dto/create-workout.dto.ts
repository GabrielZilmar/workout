import {
  IsBoolean,
  IsNotEmpty,
  IsOptional,
  IsString,
  IsUUID,
} from 'class-validator';

export class CreateWorkoutDto {
  @IsString()
  @IsNotEmpty()
  name: string;

  @IsString()
  @IsUUID()
  @IsNotEmpty()
  userId: string;

  @IsBoolean()
  @IsOptional()
  isPrivate?: boolean;

  @IsBoolean()
  @IsOptional()
  isRoutine?: boolean;
}
