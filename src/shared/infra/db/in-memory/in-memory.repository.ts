import { Entity } from '../../../domain/entity';
import { NotFoundError } from '../../../domain/errors/not-found.error';
import { RepositoryInterface } from '../../../domain/repository/repository.interface';
import { ValueObject } from '../../../domain/value-object';

export abstract class InMemoryRepository<
  E extends Entity,
  I extends ValueObject,
> implements RepositoryInterface<E, I>
{
  items: E[] = [];

  async insert(entity: E): Promise<void> {
    this.items.push(entity);
  }

  async bulkInsert(entities: E[]): Promise<void> {
    this.items.push(...entities);
  }

  async update(entity: E): Promise<void> {
    const index = this.findIndexById(entity.entityId);
    this.items[index] = entity;
  }

  async delete(id: I): Promise<void> {
    const index = this.findIndexById(id);
    this.items.splice(index, 1);
  }

  async findById(id: I): Promise<E | null> {
    const item = this.items.find(item => item.entityId.equals(id));
    return typeof item === 'undefined' ? null : item;
  }

  async findAll(): Promise<E[]> {
    return this.items;
  }

  protected findIndexById(id: ValueObject): number {
    const index = this.items.findIndex(item => item.entityId.equals(id));
    if (index === -1) {
      throw new NotFoundError(id, this.getEntity());
    }
    return index;
  }

  abstract getEntity(): new (...args: any[]) => E;
}
