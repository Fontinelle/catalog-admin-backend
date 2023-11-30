import { SearchParams } from './search-params';

describe('Search params unit tests', () => {
  it('should set page property to 1 by default and handle various inputs', () => {
    const searchParams = new SearchParams();
    expect(searchParams.page).toBe(1);

    const arrange = [
      { page: null, expected: 1 },
      { page: undefined, expected: 1 },
      { page: 0, expected: 1 },
      { page: 1, expected: 1 },
      { page: 2, expected: 2 },
      { page: 2.5, expected: 1 },
      { page: '', expected: 1 },
      { page: '2', expected: 2 },
      { page: '2.5', expected: 1 },
      { page: 'abc', expected: 1 },
      { page: true, expected: 1 },
      { page: false, expected: 1 },
      { page: {}, expected: 1 },
    ];

    arrange.forEach(({ page, expected }) => {
      const searchParams = new SearchParams({ page: page as any });
      expect(searchParams.page).toBe(expected);
    });
  });

  it('should set perPage property to 10 by default and handle various inputs', () => {
    const searchParams = new SearchParams();
    expect(searchParams.perPage).toBe(15);

    const arrange = [
      { perPage: null, expected: 15 },
      { perPage: undefined, expected: 15 },
      { perPage: 0, expected: 15 },
      { perPage: 1, expected: 1 },
      { perPage: 2, expected: 2 },
      { perPage: 2.5, expected: 15 },
      { perPage: '', expected: 15 },
      { perPage: '2', expected: 2 },
      { perPage: '2.5', expected: 15 },
      { perPage: 'abc', expected: 15 },
      { perPage: true, expected: 15 },
      { perPage: false, expected: 15 },
      { perPage: {}, expected: 15 },
    ];

    arrange.forEach(({ perPage, expected }) => {
      const searchParams = new SearchParams({ per_page: perPage as any });
      expect(searchParams.perPage).toBe(expected);
    });
  });

  it('should set sort property to null by default and handle various inputs', () => {
    const searchParams = new SearchParams();
    expect(searchParams.sort).toBeNull();

    const arrange = [
      { sort: null, expected: null },
      { sort: undefined, expected: null },
      { sort: '', expected: null },
      { sort: 'abc', expected: 'abc' },
      { sort: 0, expected: '0' },
      { sort: -1, expected: '-1' },
      { sort: 5.5, expected: '5.5' },
      { sort: 123, expected: '123' },
      { sort: true, expected: 'true' },
      { sort: false, expected: 'false' },
      { sort: {}, expected: '[object Object]' },
    ];

    arrange.forEach(({ sort, expected }) => {
      const searchParams = new SearchParams({ sort: sort as any });
      expect(searchParams.sort).toBe(expected);
    });
  });

  it('should set sortDir property to null by default and handle various inputs', () => {
    let searchParams = new SearchParams();
    expect(searchParams.sortDir).toBeNull();

    searchParams = new SearchParams({ sort: null });
    expect(searchParams.sortDir).toBeNull();

    searchParams = new SearchParams({ sort: undefined });
    expect(searchParams.sortDir).toBeNull();

    searchParams = new SearchParams({ sort: '' });
    expect(searchParams.sortDir).toBeNull();

    searchParams = new SearchParams({ sort: 'abc' });
    expect(searchParams.sortDir).toBe('asc');

    const arrange = [
      { sortDir: null, expected: 'asc' },
      { sortDir: undefined, expected: 'asc' },
      { sortDir: '', expected: 'asc' },
      { sortDir: 0, expected: 'asc' },
      { sortDir: 'abc', expected: 'asc' },
      { sortDir: -1, expected: 'asc' },
      { sortDir: 5.5, expected: 'asc' },
      { sortDir: 123, expected: 'asc' },
      { sortDir: true, expected: 'asc' },
      { sortDir: false, expected: 'asc' },
      { sortDir: {}, expected: 'asc' },
      { sortDir: 'asc', expected: 'asc' },
      { sortDir: 'desc', expected: 'desc' },
      { sortDir: 'ASC', expected: 'asc' },
      { sortDir: 'DESC', expected: 'desc' },
    ];

    arrange.forEach(({ sortDir, expected }) => {
      const searchParams = new SearchParams({
        sort: 'field',
        sort_dir: sortDir as any,
      });
      expect(searchParams.sortDir).toBe(expected);
    });
  });

  it('should set filter property to null by default and handle various inputs', () => {
    const searchParams = new SearchParams();
    expect(searchParams.filter).toBeNull();

    const arrange = [
      { filter: null, expected: null },
      { filter: undefined, expected: null },
      { filter: '', expected: null },
      { filter: 'abc', expected: 'abc' },
      { filter: 0, expected: '0' },
      { filter: -1, expected: '-1' },
      { filter: 5.5, expected: '5.5' },
      { filter: 123, expected: '123' },
      { filter: true, expected: 'true' },
      { filter: false, expected: 'false' },
      { filter: {}, expected: '[object Object]' },
    ];

    arrange.forEach(({ filter, expected }) => {
      const searchParams = new SearchParams({ filter: filter as any });
      expect(searchParams.filter).toBe(expected);
    });
  });
});
