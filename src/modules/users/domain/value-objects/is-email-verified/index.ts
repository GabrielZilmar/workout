import { ValueObject } from '~/shared/domain/value-object';

export type IsEmailVerifiedProps = {
  value: boolean;
};

export default class IsEmailVerified extends ValueObject<IsEmailVerifiedProps> {
  private constructor(props: IsEmailVerifiedProps) {
    super(props);
  }

  get value(): boolean {
    return this.props.value;
  }

  public verifyEmail(): this {
    this.props.value = true;
    return this;
  }

  public unVerifyEmail(): this {
    this.props.value = false;
    return this;
  }

  public static create(props?: IsEmailVerifiedProps): IsEmailVerified {
    const value = props?.value ?? false;
    return new IsEmailVerified({ value });
  }
}
