import { Entity } from '../entity';
import { ValueObject } from '../value-object';

export class NotFoundError extends Error {
  constructor(id: any[] | any, entityClass: new (...args: any[]) => Entity) {
    const ids = Array.isArray(id) ? id.join(', ') : id;
    super(`${entityClass.name} with id(s) ${ids} not found`);
    this.name = 'NotFoundError';
  }
}
