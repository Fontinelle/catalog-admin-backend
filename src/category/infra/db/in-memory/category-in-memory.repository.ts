import { SortDirection } from '../../../../shared/domain/repository/search-params';
import { Uuid } from '../../../../shared/domain/value-objects/uuid.vo';
import { InMemorySearchableRepository } from '../../../../shared/infra/db/in-memory/in-memory-searchable.repository';
import { Category } from '../../../domain/category.entity';
import {
  CategoryFilter,
  CategoryRepositoryInterface,
} from '../../../domain/category.repository';

export class CategoryInMemoryRepository
  extends InMemorySearchableRepository<Category, Uuid>
  implements CategoryRepositoryInterface
{
  sortableFields: string[] = ['createdAt', 'name'];

  protected async applyFilter(
    items: Category[],
    filter: CategoryFilter,
  ): Promise<Category[]> {
    if (!filter) return items;

    return items.filter(item =>
      item.name.toLowerCase().includes(filter.toLowerCase()),
    );
  }

  getEntity(): new (...args: any[]) => Category {
    return Category;
  }

  protected applySort(
    items: Category[],
    sort: string | null,
    sortDir: SortDirection | null,
  ) {
    return sort
      ? super.applySort(items, sort, sortDir)
      : super.applySort(items, 'createdAt', 'desc');
  }
}
