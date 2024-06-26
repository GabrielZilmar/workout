import { UniqueEntityID } from '~/shared/domain/unique-entity-id';

export abstract class Entity<T> {
  protected readonly _id: UniqueEntityID | null;
  public readonly props: T;

  constructor(props: T, id?: UniqueEntityID | null) {
    this._id = id || null;
    this.props = props;
  }

  private isEntity = (v: any): v is Entity<any> => {
    return v instanceof Entity;
  };

  public equals(object?: Entity<T>): boolean {
    if (!object) {
      return false;
    }

    if (this === object) {
      return true;
    }

    if (!this.isEntity(object)) {
      return false;
    }

    return this._id?.equals(object._id) || false;
  }
}
