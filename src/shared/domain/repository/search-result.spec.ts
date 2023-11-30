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
      current_page: 1,
      per_page: 2,
    });

    expect(result.toJSON()).toStrictEqual({
      items: ['entity1', 'entity2'],
      total: 4,
      current_page: 1,
      per_page: 2,
      last_page: 2,
    });
  });

  it('should set last_page = 1 when per_page field is greater than total field', () => {
    let result = new SearchResult({
      items: [] as any,
      total: 4,
      current_page: 1,
      per_page: 15,
    });

    expect(result.last_page).toBe(1);
  });

  it('should calculate last_page when total is not a multiple of per_page', () => {
    let result = new SearchResult({
      items: [] as any,
      total: 101,
      current_page: 1,
      per_page: 20,
    });

    expect(result.last_page).toBe(6);
  });

  it('should map items to JSON when forceEntity is true', () => {
    // Arrange
    const mockEntities = [new MockEntity(), new MockEntity()];
    const result = new SearchResult({
      items: mockEntities,
      total: 2,
      current_page: 1,
      per_page: 2,
    });

    // Act
    const jsonResult = result.toJSON(true);

    // Assert
    expect(jsonResult.items).toHaveLength(2);
    expect(jsonResult.items[0]).toEqual({});
    expect(jsonResult.items[1]).toEqual({});
    expect(jsonResult.total).toBe(2);
    expect(jsonResult.current_page).toBe(1);
    expect(jsonResult.per_page).toBe(2);
    expect(jsonResult.last_page).toBe(1);
  });
});
