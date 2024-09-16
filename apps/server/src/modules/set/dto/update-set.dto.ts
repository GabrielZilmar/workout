import { IsInt, IsOptional, IsUUID, Min } from 'class-validator';

export class UpdateSetParamsDto {
  @IsUUID()
  id: string;
}

export class UpdateSetBodyDto {
  @IsInt()
  @Min(0)
  @IsOptional()
  numReps?: number;

  @IsInt()
  @Min(0)
  @IsOptional()
  setWeight?: number;

  @IsInt()
  @Min(0)
  @IsOptional()
  numDrops?: number;
}
