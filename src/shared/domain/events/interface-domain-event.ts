import { AggregateRoot } from 'src/shared/domain/aggregate-root';

export interface IDomainEvent<T> {
  dateTimeOccurred: Date;
  domain: AggregateRoot<T>;
  payload: unknown;
}
