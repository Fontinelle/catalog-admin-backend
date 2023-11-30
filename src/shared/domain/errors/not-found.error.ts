import { Entity } from '../entity';
import { ValueObject } from '../value-object';

export class NotFoundError extends Error {
  constructor(
    id: ValueObject[] | ValueObject,
    entityClass: new (...args: any[]) => Entity,
  ) {
    const ids = Array.isArray(id) ? id.map(i => i.toString()) : [id.toString()];
    super(`${entityClass.name} with id(s) ${ids.join(', ')} not found`);
    this.name = 'NotFoundError';
  }
}
