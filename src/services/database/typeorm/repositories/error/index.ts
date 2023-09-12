export class RepositoryError extends Error {
  public readonly payload?: unknown;
  public static messages = {
    createError: 'Could not create the item.',
    updateError: 'Could not update the item.',
    itemNotFound: 'Item not found.',
    itemDuplicated: 'Item is duplicated.',
    deleteError: 'Could not delete the item.',
    saveError: 'Could not save the items.',
    itemAlreadyExists: 'Item Already exists.',
  };

  constructor(message: string, payload?: unknown) {
    super(message);
    this.payload = payload || null;
    this.name = 'repository-base';
  }

  public static create(message: string, payload?: unknown) {
    return new RepositoryError(message, payload);
  }
}
