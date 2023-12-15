import { RepositoryInterface } from '../../shared/domain/repository/repository.interface';
import { SearchParams } from '../../shared/domain/repository/search-params';
import { SearchResult } from '../../shared/domain/repository/search-result';
import { SearchableRepositoryInterface } from '../../shared/domain/repository/searchable-repository.interface';
import { Uuid } from '../../shared/domain/value-objects/uuid.vo';
import { Category } from './category.entity';

export type CategoryFilter = string;

export class CategorySearchParam extends SearchParams<CategoryFilter> {}

export class CategorySearchResult extends SearchResult<Category> {}

export interface CategoryRepositoryInterface
  extends SearchableRepositoryInterface<
    Category,
    Uuid,
    CategoryFilter,
    CategorySearchParam,
    CategorySearchResult
  > {}
