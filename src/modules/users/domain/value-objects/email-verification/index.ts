import { ValueObject } from '~/shared/domain/value-object';

export type EmailVerificationProps = {
  value: boolean;
};

export default class EmailVerification extends ValueObject<EmailVerificationProps> {
  private constructor(props: EmailVerificationProps) {
    super(props);
  }

  get value(): boolean {
    return this.props.value;
  }

  get isVerified(): boolean {
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

  public static create(props?: EmailVerificationProps): EmailVerification {
    const value = props?.value ?? false;
    return new EmailVerification({ value });
  }
}
