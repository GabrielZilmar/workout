import { ValueObject } from '~/shared/domain/value-object';

export type PrivateStatusProps = {
  value: boolean;
};

export default class PrivateStatus extends ValueObject<PrivateStatusProps> {
  private constructor(props: PrivateStatusProps) {
    super(props);
  }

  get value(): boolean {
    return this.props.value;
  }

  public setPrivate(): this {
    this.props.value = true;
    return this;
  }

  public unsetPrivate(): this {
    this.props.value = false;
    return this;
  }

  public isPrivate(): boolean {
    return this.props.value;
  }

  public static create(props?: PrivateStatusProps): PrivateStatus {
    const value = props?.value ?? false;
    return new PrivateStatus({ value });
  }
}
