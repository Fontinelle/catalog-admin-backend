import { Entity } from '../entity';
import { ValueObject } from '../value-object';

export interface RepositoryInterface<E extends Entity, I extends ValueObject> {
  insert(entity: E): Promise<void>;
  bulkInsert(entities: E[]): Promise<void>;
  update(entity: E): Promise<void>;
  delete(id: I): Promise<void>;

  findById(id: I): Promise<E | null>;
  findAll(): Promise<E[]>;

  getEntity(): new (...args: any[]) => E;
}
