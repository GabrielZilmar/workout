import { Either } from 'src/shared/either';

export interface Mapper<T, D> {
  toDomain(raw: D): Promise<Either<Error, T>> | Either<Error, T>;
  toPersistence(item: T): D | Promise<D>;
}
