import { Entity } from '../../../domain/entity';
import { SearchParams } from '../../../domain/repository/search-params';
import { SearchResult } from '../../../domain/repository/search-result';
import { Uuid } from '../../../domain/value-objects/uuid.vo';
import { InMemorySearchableRepository } from './in-memory-searchable.repository';

type StubEntityProps = {
  entityId?: Uuid;
  name: string;
  price: number;
};

class StubEntity extends Entity {
  entityId: Uuid;
  name: string;
  price: number;

  constructor(props: StubEntityProps) {
    super();
    this.entityId = props.entityId ?? new Uuid();
    this.name = props.name;
    this.price = +props.price;
  }

  toJSON(): { id: string } & StubEntityProps {
    return {
      id: this.entityId.id,
      name: this.name,
      price: this.price,
    };
  }
}

class StubInMemorySearchableRepository extends InMemorySearchableRepository<
  StubEntity,
  Uuid
> {
  sortableFields: string[] = ['name'];

  getEntity(): new (...args: any[]) => StubEntity {
    return StubEntity;
  }

  protected async applyFilter(
    items: StubEntity[],
    filter: string | null,
  ): Promise<StubEntity[]> {
    if (!filter) {
      return items;
    }
    return items.filter(
      item =>
        item.name.toLowerCase().includes(filter.toLowerCase()) ||
        item.price.toString() === filter,
    );
  }
}

describe('InMemorySearchableRepository unit tests', () => {
  let repository: StubInMemorySearchableRepository;

  beforeEach(() => {
    repository = new StubInMemorySearchableRepository();
  });

  describe('applyFilter method', () => {
    it('should no filter items when filter param is null', async () => {
      const items = [new StubEntity({ name: 'Foo', price: 10 })];

      const spyFilterMethod = jest.spyOn(items, 'filter');

      const filteredItems = await repository['applyFilter'](items, null);

      expect(filteredItems).toStrictEqual(items);
      expect(spyFilterMethod).not.toHaveBeenCalled();
    });

    it('should filter using a filter param', async () => {
      const items = [
        new StubEntity({ name: 'foo', price: 0 }),
        new StubEntity({ name: 'FOO', price: 10 }),
        new StubEntity({ name: 'Baz', price: 10 }),
      ];

      const spyFilterMethod = jest.spyOn(items, 'filter');
      let filteredItems = await repository['applyFilter'](items, 'FOO');

      expect(filteredItems).toStrictEqual([items[0], items[1]]);
      expect(spyFilterMethod).toHaveBeenCalledTimes(1);

      filteredItems = await repository['applyFilter'](items, '10');
      expect(filteredItems).toStrictEqual([items[1], items[2]]);
      expect(spyFilterMethod).toHaveBeenCalledTimes(2);

      filteredItems = await repository['applyFilter'](items, 'no-filter');
      expect(filteredItems).toStrictEqual([]);
      expect(filteredItems).toHaveLength(0);
      expect(spyFilterMethod).toHaveBeenCalledTimes(3);
    });
  });

  describe('applySort method', () => {
    it('should no sort items', async () => {
      const items = [
        new StubEntity({ name: 'b', price: 5 }),
        new StubEntity({ name: 'a', price: 5 }),
      ];

      let itemsSorted = await repository['applySort'](items, null, null);
      expect(itemsSorted).toStrictEqual(items);

      itemsSorted = await repository['applySort'](items, 'price', 'asc');
      expect(itemsSorted).toStrictEqual(items);
    });

    it('should sort items', async () => {
      const items = [
        new StubEntity({ name: 'b', price: 5 }),
        new StubEntity({ name: 'a', price: 5 }),
        new StubEntity({ name: 'c', price: 5 }),
      ];

      let itemsSorted = await repository['applySort'](items, 'name', 'asc');
      expect(itemsSorted).toStrictEqual([items[1], items[0], items[2]]);

      itemsSorted = await repository['applySort'](items, 'name', 'desc');
      expect(itemsSorted).toStrictEqual([items[2], items[0], items[1]]);
    });

    it('should return 0 when values are equal and customGetter is not provided', async () => {
      const items = [
        new StubEntity({ name: 'a', price: 5 }),
        new StubEntity({ name: 'b', price: 5 }),
      ];

      const itemsSorted = await repository['applySort'](items, 'name', 'asc');
      expect(itemsSorted).toEqual(items);
    });

    it('should return 0 when values are equal and customGetter is provided', async () => {
      const items = [
        new StubEntity({ name: 'a', price: 5 }),
        new StubEntity({ name: 'b', price: 5 }),
      ];

      const customGetter: (sort: string, item: StubEntity) => any = (
        sort,
        item,
      ) => {
        return item.name.length;
      };

      const itemsSorted = await repository['applySort'](
        items,
        'name',
        'asc',
        customGetter,
      );
      expect(itemsSorted).toEqual(items);
    });
  });

  describe('applyPaginate method', () => {
    it('should paginate items', async () => {
      const items = [
        new StubEntity({ name: 'a', price: 5 }),
        new StubEntity({ name: 'b', price: 5 }),
        new StubEntity({ name: 'c', price: 5 }),
        new StubEntity({ name: 'd', price: 5 }),
        new StubEntity({ name: 'e', price: 5 }),
      ];

      let itemsPaginated = await repository['applyPagination'](items, 1, 2);
      expect(itemsPaginated).toStrictEqual([items[0], items[1]]);

      itemsPaginated = await repository['applyPagination'](items, 2, 2);
      expect(itemsPaginated).toStrictEqual([items[2], items[3]]);

      itemsPaginated = await repository['applyPagination'](items, 3, 2);
      expect(itemsPaginated).toStrictEqual([items[4]]);

      itemsPaginated = await repository['applyPagination'](items, 4, 2);
      expect(itemsPaginated).toStrictEqual([]);
    });
  });

  describe('search method', () => {
    it('should apply only paginate when other params are null', async () => {
      const entity = new StubEntity({ name: 'a', price: 5 });
      const items = Array(16).fill(entity);
      repository.items = items;

      const result = await repository.search(new SearchParams());
      expect(result).toStrictEqual(
        new SearchResult({
          items: Array(15).fill(entity),
          total: 16,
          currentPage: 1,
          perPage: 15,
        }),
      );
    });

    it('should apply paginate and filter', async () => {
      const items = [
        new StubEntity({ name: 'test', price: 5 }),
        new StubEntity({ name: 'a', price: 5 }),
        new StubEntity({ name: 'TEST', price: 5 }),
        new StubEntity({ name: 'TeSt', price: 5 }),
      ];
      repository.items = items;

      let result = await repository.search(
        new SearchParams({ page: 1, perPage: 2, filter: 'TEST' }),
      );
      expect(result).toStrictEqual(
        new SearchResult({
          items: [items[0], items[2]],
          total: 3,
          currentPage: 1,
          perPage: 2,
        }),
      );

      result = await repository.search(
        new SearchParams({ page: 2, perPage: 2, filter: 'TEST' }),
      );
      expect(result).toStrictEqual(
        new SearchResult({
          items: [items[3]],
          total: 3,
          currentPage: 2,
          perPage: 2,
        }),
      );
    });

    describe('should apply paginate and sort', () => {
      const items = [
        new StubEntity({ name: 'b', price: 5 }),
        new StubEntity({ name: 'a', price: 5 }),
        new StubEntity({ name: 'd', price: 5 }),
        new StubEntity({ name: 'e', price: 5 }),
        new StubEntity({ name: 'c', price: 5 }),
      ];
      const arrange = [
        {
          search_params: new SearchParams({
            page: 1,
            perPage: 2,
            sort: 'name',
          }),
          search_result: new SearchResult({
            items: [items[1], items[0]],
            total: 5,
            currentPage: 1,
            perPage: 2,
          }),
        },
        {
          search_params: new SearchParams({
            page: 2,
            perPage: 2,
            sort: 'name',
          }),
          search_result: new SearchResult({
            items: [items[4], items[2]],
            total: 5,
            currentPage: 2,
            perPage: 2,
          }),
        },
        {
          search_params: new SearchParams({
            page: 1,
            perPage: 2,
            sort: 'name',
            sortDir: 'desc',
          }),
          search_result: new SearchResult({
            items: [items[3], items[2]],
            total: 5,
            currentPage: 1,
            perPage: 2,
          }),
        },
        {
          search_params: new SearchParams({
            page: 2,
            perPage: 2,
            sort: 'name',
            sortDir: 'desc',
          }),
          search_result: new SearchResult({
            items: [items[4], items[0]],
            total: 5,
            currentPage: 2,
            perPage: 2,
          }),
        },
      ];

      beforeEach(() => {
        repository.items = items;
      });

      test.each(arrange)(
        'when value is %j',
        async ({ search_params, search_result }) => {
          const result = await repository.search(search_params);
          expect(result).toStrictEqual(search_result);
        },
      );
    });

    it('should search using filter, sort and paginate', async () => {
      const items = [
        new StubEntity({ name: 'test', price: 5 }),
        new StubEntity({ name: 'a', price: 5 }),
        new StubEntity({ name: 'TEST', price: 5 }),
        new StubEntity({ name: 'e', price: 5 }),
        new StubEntity({ name: 'TeSt', price: 5 }),
      ];
      repository.items = items;

      const arrange = [
        {
          params: new SearchParams({
            page: 1,
            perPage: 2,
            sort: 'name',
            filter: 'TEST',
          }),
          result: new SearchResult({
            items: [items[2], items[4]],
            total: 3,
            currentPage: 1,
            perPage: 2,
          }),
        },
        {
          params: new SearchParams({
            page: 2,
            perPage: 2,
            sort: 'name',
            filter: 'TEST',
          }),
          result: new SearchResult({
            items: [items[0]],
            total: 3,
            currentPage: 2,
            perPage: 2,
          }),
        },
      ];

      for (const i of arrange) {
        const result = await repository.search(i.params);
        expect(result).toStrictEqual(i.result);
      }
    });
  });

  describe('applySort method with customGetter', () => {
    const items = [
      new StubEntity({ name: 'b', price: 5 }),
      new StubEntity({ name: 'a', price: 5 }),
      new StubEntity({ name: 'd', price: 5 }),
      new StubEntity({ name: 'e', price: 5 }),
      new StubEntity({ name: 'c', price: 5 }),
    ];

    beforeEach(() => {
      repository.items = items;
    });

    it('should sort items using customGetter', async () => {
      const customGetter: (sort: string, item: StubEntity) => any = (
        sort,
        item,
      ) => {
        if (sort === 'name') {
          return item.name.toLowerCase();
        }
        return item[sort as keyof StubEntity];
      };

      let itemsSorted = await repository['applySort'](
        items,
        'name',
        'asc',
        customGetter,
      );
      expect(itemsSorted).toStrictEqual([
        items[1],
        items[0],
        items[4],
        items[2],
        items[3],
      ]);

      itemsSorted = await repository['applySort'](
        items,
        'name',
        'desc',
        customGetter,
      );
      expect(itemsSorted).toStrictEqual([
        items[3],
        items[2],
        items[4],
        items[0],
        items[1],
      ]);
    });

    it('should not sort items when customGetter does not match the sort field', async () => {
      const customGetter: (sort: string, item: StubEntity) => any = (
        sort,
        item,
      ) => {
        return item.name.length;
      };

      let itemsSorted = await repository['applySort'](
        items,
        'price',
        'asc',
        customGetter,
      );
      expect(itemsSorted).toStrictEqual(items);

      itemsSorted = await repository['applySort'](
        items,
        'price',
        'desc',
        customGetter,
      );
      expect(itemsSorted).toStrictEqual(items);
    });
  });
});
