import { Entity } from '../../../domain/entity';
import {
  SearchParams,
  SortDirection,
} from '../../../domain/repository/search-params';
import { SearchResult } from '../../../domain/repository/search-result';
import { SearchableRepositoryInterface } from '../../../domain/repository/searchable-repository.interface';
import { ValueObject } from '../../../domain/value-object';
import { InMemoryRepository } from './in-memory.repository';

export abstract class InMemorySearchableRepository<
    E extends Entity,
    I extends ValueObject,
    Filter = string,
  >
  extends InMemoryRepository<E, I>
  implements SearchableRepositoryInterface<E, I, Filter>
{
  sortableFields: string[] = [];

  async search(searchInput: SearchParams<Filter>): Promise<SearchResult<E>> {
    const itemsFiltered = await this.applyFilter(
      this.items,
      searchInput.filter,
    );
    const itemsSorted = this.applySort(
      itemsFiltered,
      searchInput.sort,
      searchInput.sortDir,
    );
    const itemsPaginated = this.applyPagination(
      itemsSorted,
      searchInput.page,
      searchInput.perPage,
    );

    return new SearchResult({
      items: itemsPaginated,
      total: itemsFiltered.length,
      currentPage: searchInput.page,
      perPage: searchInput.perPage,
    });
  }

  protected abstract applyFilter(
    items: E[],
    filter: Filter | null,
  ): Promise<E[]>;

  protected applyPagination(
    items: E[],
    page: SearchParams['page'],
    perPage: SearchParams['perPage'],
  ) {
    const start = (page - 1) * perPage;
    const limit = start + perPage;
    return items.slice(start, limit);
  }

  protected applySort(
    items: E[],
    sort: string | null,
    sortDir: SortDirection | null,
    customGetter?: (sort: string, item: E) => any,
  ) {
    if (!sort || !this.sortableFields.includes(sort)) {
      return items;
    }

    return [...items].sort((a, b) => {
      const aValue = customGetter ? customGetter(sort, a) : a[sort as keyof E];
      const bValue = customGetter ? customGetter(sort, b) : b[sort as keyof E];

      if (aValue < bValue) {
        return sortDir === 'asc' ? -1 : 1;
      }

      if (aValue > bValue) {
        return sortDir === 'asc' ? 1 : -1;
      }

      return 0;
    });
  }
}
