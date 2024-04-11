import { ValueObject } from '~/shared/domain/value-object';

export type RoutineStatusProps = {
  value: boolean;
};

export default class RoutineStatus extends ValueObject<RoutineStatusProps> {
  private constructor(props: RoutineStatusProps) {
    super(props);
  }

  get value(): boolean {
    return this.props.value;
  }

  public setRoutine(): this {
    this.props.value = true;
    return this;
  }

  public unsetRoutine(): this {
    this.props.value = false;
    return this;
  }

  public isRoutine(): boolean {
    return this.props.value;
  }

  public static create(props?: RoutineStatusProps): RoutineStatus {
    const value = props?.value ?? false;
    return new RoutineStatus({ value });
  }
}
