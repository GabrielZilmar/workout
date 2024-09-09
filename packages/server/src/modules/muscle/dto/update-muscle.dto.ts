import { IsNotEmpty, IsString, IsUUID, MaxLength } from 'class-validator';
import { MAX_VARCHAR_LENGTH } from '~/shared/constants/values';

export class UpdateMuscleParamsDto {
  @IsUUID()
  @IsNotEmpty()
  id: string;
}

export class UpdateMuscleBodyDto {
  @IsString()
  @MaxLength(MAX_VARCHAR_LENGTH)
  @IsNotEmpty()
  name: string;
}
