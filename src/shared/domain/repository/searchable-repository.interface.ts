import { Entity } from '../entity';
import { ValueObject } from '../value-object';
import { RepositoryInterface } from './repository.interface';
import { SearchParams } from './search-params';
import { SearchResult } from './search-result';

export interface SearchableRepositoryInterface<
  E extends Entity,
  I extends ValueObject,
  Filter = string,
  SearchInput = SearchParams<Filter>,
  SearchOutput = SearchResult,
> extends RepositoryInterface<E, I> {
  sortableFields: string[];
  search(searchInput: SearchInput): Promise<SearchOutput>;
}
