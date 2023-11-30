import { CategoryInMemoryRepository } from './category-in-memory.repository';
import { Uuid } from '../../../shared/domain/value-objects/uuid.vo';
import { Category } from '../../domain/category.entity';

describe('CategoryInMemoryRepository', () => {
  it('should return the Category class when calling getEntity()', async () => {
    const repository = new CategoryInMemoryRepository();

    const getEntity = await repository.getEntity();

    expect(getEntity).toEqual(Category);
  });
});
