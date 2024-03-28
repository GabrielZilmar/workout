import { UniqueEntityID } from '~/shared/domain/unique-entity-id';

export default class UserId extends UniqueEntityID {
  constructor(id?: string | null) {
    super(id);
  }

  create(id?: string | null): UserId {
    return new UserId(id);
  }
}
