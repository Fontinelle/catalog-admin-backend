import { CategoryInMemoryRepository } from './category-in-memory.repository';
import { Category } from '../../../domain/category.entity';

describe('CategoryInMemoryRepository', () => {
  let repository: CategoryInMemoryRepository;

  beforeEach(() => {
    repository = new CategoryInMemoryRepository();
  });

  it('should return the Category class when calling getEntity()', async () => {
    const getEntity = await repository.getEntity();

    expect(getEntity).toEqual(Category);
  });

  it('should filter items when filter object is null', async () => {
    const items = [
      Category.fake().aCategory().withName('test').build(),
      Category.fake().aCategory().withName('TEST').build(),
      Category.fake().aCategory().withName('fake').build(),
    ];

    const filterSpy = jest.spyOn(items, 'filter');

    const itemsFiltered = await repository['applyFilter'](items, null);
    expect(filterSpy).not.toHaveBeenCalled();
    expect(itemsFiltered).toStrictEqual(items);
  });

  it('should filter items using filter parameter', async () => {
    const items = [
      Category.fake().aCategory().withName('test').build(),
      Category.fake().aCategory().withName('TEST').build(),
      Category.fake().aCategory().withName('fake').build(),
    ];

    const filterSpy = jest.spyOn(items, 'filter');

    const itemsFiltered = await repository['applyFilter'](items, 'TEST');
    expect(filterSpy).toHaveBeenCalledTimes(1);
    expect(itemsFiltered).toStrictEqual([items[0], items[1]]);
  });

  it('should sort items by createdAt desc when sort is null', async () => {
    const createdAt = new Date();

    const items = [
      Category.fake()
        .aCategory()
        .withName('test')
        .withCreatedAt(createdAt)
        .build(),
      Category.fake()
        .aCategory()
        .withName('TEST')
        .withCreatedAt(new Date(createdAt.getTime() + 100))
        .build(),
      Category.fake()
        .aCategory()
        .withName('fake')
        .withCreatedAt(new Date(createdAt.getTime() + 200))
        .build(),
    ];

    const itemsSorted = await repository['applySort'](items, null, null);

    expect(itemsSorted).toStrictEqual(items.reverse());
  });

  it('should sort items by name', async () => {
    const items = [
      Category.fake().aCategory().withName('a').build(),
      Category.fake().aCategory().withName('b').build(),
      Category.fake().aCategory().withName('c').build(),
    ];

    let itemsSorted = await repository['applySort'](items, 'name', 'asc');

    expect(itemsSorted).toStrictEqual(items);

    itemsSorted = await repository['applySort'](items, 'name', 'desc');

    expect(itemsSorted).toStrictEqual(items.reverse());
  });
});
