import { Entity } from '../entity';
import { ValueObject } from '../value-object';
import { SearchResult } from './search-result';

class MockEntity implements Entity {
  get entityId(): ValueObject {
    return;
  }

  toJSON() {
    return {};
  }
}

describe('Search result unit tests', () => {
  it('should initialize SearchResult with provided properties', () => {
    let result = new SearchResult({
      items: ['entity1', 'entity2'] as any,
      total: 4,
      currentPage: 1,
      perPage: 2,
    });

    expect(result.toJSON()).toStrictEqual({
      items: ['entity1', 'entity2'],
      total: 4,
      currentPage: 1,
      perPage: 2,
      lastPage: 2,
    });
  });

  it('should set lastPage = 1 when perPage field is greater than total field', () => {
    let result = new SearchResult({
      items: [] as any,
      total: 4,
      currentPage: 1,
      perPage: 15,
    });

    expect(result.lastPage).toBe(1);
  });

  it('should calculate lastPage when total is not a multiple of perPage', () => {
    let result = new SearchResult({
      items: [] as any,
      total: 101,
      currentPage: 1,
      perPage: 20,
    });

    expect(result.lastPage).toBe(6);
  });

  it('should map items to JSON when forceEntity is true', () => {
    // Arrange
    const mockEntities = [new MockEntity(), new MockEntity()];
    const result = new SearchResult({
      items: mockEntities,
      total: 2,
      currentPage: 1,
      perPage: 2,
    });

    // Act
    const jsonResult = result.toJSON(true);

    // Assert
    expect(jsonResult.items).toHaveLength(2);
    expect(jsonResult.items[0]).toEqual({});
    expect(jsonResult.items[1]).toEqual({});
    expect(jsonResult.total).toBe(2);
    expect(jsonResult.currentPage).toBe(1);
    expect(jsonResult.perPage).toBe(2);
    expect(jsonResult.lastPage).toBe(1);
  });
});
