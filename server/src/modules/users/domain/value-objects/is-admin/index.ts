import { ValueObject } from '~/shared/domain/value-object';

export type IsAdminProps = {
  value: boolean;
};

export default class IsAdmin extends ValueObject<IsAdminProps> {
  private constructor(props: IsAdminProps) {
    super(props);
  }

  get value(): boolean {
    return this.props.value;
  }

  public setAdmin(): this {
    this.props.value = true;
    return this;
  }

  public unsetAdmin(): this {
    this.props.value = false;
    return this;
  }

  public static create(props?: IsAdminProps): IsAdmin {
    const value = props?.value ?? false;
    return new IsAdmin({ value });
  }
}
