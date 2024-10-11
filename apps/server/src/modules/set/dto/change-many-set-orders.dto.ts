import { Type } from 'class-transformer';
import { IsArray, IsInt, IsUUID, ValidateNested } from 'class-validator';

class Item {
  @IsUUID()
  id: string;

  @IsInt()
  order: number;
}

export class ChangeManySetOrdersBodyDTO {
  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => Item)
  items: Item[];
}
