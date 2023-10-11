import { Identifier } from '~/shared/domain/identifier';
import { v4 } from 'uuid';

export class UniqueEntityID extends Identifier<string> {
  constructor(id?: string | null) {
    super(id || v4());
  }
}
