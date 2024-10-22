import { HttpStatus } from '@nestjs/common';
import {
  DeepPartial,
  EntityTarget,
  FindManyOptions,
  FindOneOptions,
  FindOptionsWhere,
  Repository,
} from 'typeorm';
import { QueryDeepPartialEntity } from 'typeorm/query-builder/QueryPartialEntity';
import { AppDataSource } from '~/services/database/typeorm/config/data-source';
import { RepositoryError } from '~/services/database/typeorm/repositories/error';
import {
  IRead,
  IWrite,
} from '~/services/database/typeorm/repositories/interfaces/interfaces';
import { Mapper } from '~/shared/domain/mapper';
import { Either, left, right } from '~/shared/either';

export abstract class BaseRepository<T extends { id: string }, D>
  implements IWrite<T, D>, IRead<T, D>
{
  public readonly repository: Repository<T>;
  public readonly mapper: Mapper<D, T | Partial<T>>;

  constructor(entity: EntityTarget<T>, mapper: Mapper<D, T | Partial<T>>) {
    this.repository = AppDataSource.getRepository(entity);
    this.mapper = mapper;
  }

  private async preventInexistentItem(
    id: string,
  ): Promise<Either<RepositoryError, boolean>> {
    const itemExist = await this.findOneById(id);

    if (!itemExist) {
      return left(
        RepositoryError.create(
          RepositoryError.messages.itemNotFound,
          { id },
          HttpStatus.BAD_REQUEST,
        ),
      );
    }

    return right(true);
  }

  private async preventDuplicateItem(
    id: string,
  ): Promise<Either<RepositoryError, boolean>> {
    const itemExist = await this.findOneById(id);

    if (itemExist) {
      return left(
        RepositoryError.create(
          RepositoryError.messages.itemAlreadyExists,
          { id },
          HttpStatus.BAD_REQUEST,
        ),
      );
    }

    return right(true);
  }

  async create(item: DeepPartial<T>): Promise<Either<RepositoryError, D>> {
    if (item.id) {
      const preventInexistent = await this.preventDuplicateItem(item.id);
      if (preventInexistent.isLeft()) {
        return left(preventInexistent.value);
      }
    }

    const newItem = await this.save(item);

    if (newItem.isLeft()) {
      return left(
        RepositoryError.create(
          RepositoryError.messages.createError,
          newItem.value.payload,
        ),
      );
    }

    return right(newItem.value);
  }

  async update(
    id: string,
    item: QueryDeepPartialEntity<T>,
  ): Promise<Either<RepositoryError, boolean>> {
    const preventInexistent = await this.preventInexistentItem(id);
    if (preventInexistent.isLeft()) {
      return left(preventInexistent.value);
    }

    try {
      const newItem = await this.repository.update(id, item);
      if (!newItem) {
        return left(
          RepositoryError.create(RepositoryError.messages.updateError),
        );
      }

      return right(true);
    } catch (err) {
      return left(RepositoryError.create((err as Error).message));
    }
  }

  async delete(id: string): Promise<Either<RepositoryError, boolean>> {
    const preventInexistent = await this.preventInexistentItem(id);
    if (preventInexistent.isLeft()) {
      return left(preventInexistent.value);
    }

    await this.repository.delete(id);

    return right(true);
  }

  async save(item: T | DeepPartial<T>): Promise<Either<RepositoryError, D>> {
    try {
      const savedItem = await this.repository.save(item);

      const itemDomain = await this.mapper.toDomain(savedItem);
      if (itemDomain.isLeft()) {
        return left(RepositoryError.create(RepositoryError.messages.saveError));
      }

      return right(itemDomain.value);
    } catch (err) {
      return left(RepositoryError.create((err as Error).message));
    }
  }

  async findAll(skip = 0, take = 10): Promise<{ items: D[]; count: number }> {
    const [items, count] = await this.repository.findAndCount({
      skip,
      take,
    });

    const itemsToDomain: D[] = [];
    for await (const item of items) {
      const itemToDomain = await this.mapper.toDomain(item);

      if (itemToDomain.isRight()) {
        itemsToDomain.push(itemToDomain.value);
      }
    }

    return { items: itemsToDomain, count };
  }

  async findOne(options: FindOneOptions<T>): Promise<D | null> {
    const item = await this.repository.findOne(options);
    if (!item) {
      return null;
    }

    const itemToDomain = await this.mapper.toDomain(item);
    return itemToDomain.isRight() ? itemToDomain.value : null;
  }

  async find(
    options?: FindManyOptions<T>,
  ): Promise<{ items: D[]; count: number }> {
    const [items, count] = await this.repository.findAndCount({
      ...options,
      skip: options?.skip,
      take: options?.take,
    });

    const itemsToDomain: D[] = [];
    for await (const item of items) {
      const itemToDomain = await this.mapper.toDomain(item);

      if (itemToDomain.isRight()) {
        itemsToDomain.push(itemToDomain.value);
      }
    }

    return { items: itemsToDomain, count };
  }

  async findOneByCriteria(
    criteria: FindOptionsWhere<T> | FindOptionsWhere<T>[],
  ): Promise<D | null> {
    const item = await this.repository.findOneBy(criteria);
    if (!item) {
      return null;
    }

    const itemToDomain = await this.mapper.toDomain(item);
    return itemToDomain.isRight() ? itemToDomain.value : null;
  }

  async findOneById(id: string): Promise<D | null> {
    const criteria = { id } as FindOptionsWhere<T>;

    const item = await this.repository.findOneBy(criteria);
    if (!item) {
      return null;
    }

    const itemToDomain = await this.mapper.toDomain(item);
    return itemToDomain.isRight() ? itemToDomain.value : null;
  }
}
