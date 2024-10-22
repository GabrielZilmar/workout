import { IsDateString, IsOptional, IsUUID, Matches } from 'class-validator';

export class ProgressHistoryParamsDTO {
  @IsUUID()
  exerciseId: string;
}

export class ProgressHistoryQueryDTO {
  @IsDateString()
  @Matches(/^\d{4}-\d{2}-\d{2}$/, {
    message: 'Date must be in the format YYYY-MM-DD',
  })
  @IsOptional()
  startDate?: string;

  @IsDateString()
  @Matches(/^\d{4}-\d{2}-\d{2}$/, {
    message: 'Date must be in the format YYYY-MM-DD',
  })
  @IsOptional()
  endDate?: string;
}

type Sales = {
  [date: string]: number;
};
export class ProgressHistoryDTO {
  sales: Sales[];
}
