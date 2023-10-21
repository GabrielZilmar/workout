import { ValueObject } from '~/shared/domain/value-object';

export type DeletedAtProps = {
  value: Date | null;
};

export default class DeletedAt extends ValueObject<DeletedAtProps> {
  private constructor(props: DeletedAtProps) {
    super(props);
  }

  get value(): Date | null {
    return this.props.value;
  }

  public delete(): this {
    if (this.value) {
      return this;
    }

    this.props.value = new Date();
    return this;
  }

  public static create(value: Date | null = null): DeletedAt {
    return new DeletedAt({ value });
  }
}
