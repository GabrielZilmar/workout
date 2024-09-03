import { IsString } from 'class-validator';

export class GetExerciseDto {
  @IsString()
  idOrUsername: string;
}
