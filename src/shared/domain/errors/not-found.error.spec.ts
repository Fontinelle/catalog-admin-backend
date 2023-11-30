import { Entity } from '../entity';
import { ValueObject } from '../value-object';
import { NotFoundError } from './not-found.error';

class MockEntity implements Entity {
  get entityId(): ValueObject {
    return;
  }
  toJSON() {}
}

class MockValueObject extends ValueObject {}

describe('NotFoundError Unit Tests', () => {
  it('should create NotFoundError for a single ID', () => {
    const entityClass = MockEntity;
    const id = new MockValueObject();
    const error = new NotFoundError(id, entityClass);

    expect(error.message).toBe(
      `${entityClass.name} with id(s) ${id.toString()} not found`,
    );
    expect(error.name).toBe('NotFoundError');
  });

  it('should create NotFoundError for an array of IDs', () => {
    const entityClass = MockEntity;
    const ids = [new MockValueObject(), new MockValueObject()];
    const error = new NotFoundError(ids, entityClass);

    const expectedMessage = `${entityClass.name} with id(s) ${ids
      .map(id => id.toString())
      .join(', ')} not found`;

    expect(error.message).toBe(expectedMessage);
    expect(error.name).toBe('NotFoundError');
  });
});
