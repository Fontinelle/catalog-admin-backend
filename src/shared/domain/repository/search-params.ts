import { ValueObject } from '../value-object';

export type SortDirection = 'asc' | 'desc';

export type SearchParamsProps<Filter = string> = {
  page?: number;
  per_page?: number;
  sort?: string | null;
  sort_dir?: SortDirection | null;
  filter?: Filter | null;
};

export class SearchParams<Filter = string> extends ValueObject {
  protected _page: number;
  protected _perPage: number = 15;
  protected _sort: string | null;
  protected _sortDir: SortDirection | null;
  protected _filter: Filter | null;

  constructor(props: SearchParamsProps<Filter> = {}) {
    super();
    this.page = props.page;
    this.perPage = props.per_page;
    this.sort = props.sort;
    this.sortDir = props.sort_dir;
    this.filter = props.filter;
  }

  get page(): number {
    return this._page;
  }

  private set page(page: number) {
    let _page = +page;

    if (Number.isNaN(_page) || _page <= 0 || parseInt(_page as any) !== _page) {
      _page = 1;
    }

    this._page = _page;
  }

  get perPage(): number {
    return this._perPage;
  }

  private set perPage(perPage: number) {
    let _perPage = perPage === (true as any) ? this._perPage : +perPage;

    if (
      Number.isNaN(_perPage) ||
      _perPage <= 0 ||
      parseInt(_perPage.toString()) !== _perPage
    ) {
      _perPage = this._perPage;
    }

    this._perPage = _perPage;
  }

  get sort(): string | null {
    return this._sort;
  }

  private set sort(sort: string | null) {
    this._sort =
      sort === null || sort === undefined || sort === ''
        ? null
        : sort.toString();
  }

  get sortDir(): SortDirection | null {
    return this._sortDir;
  }

  private set sortDir(sortDir: SortDirection | null) {
    if (!this.sort) {
      this._sortDir = null;
      return;
    }
    const dir = `${sortDir}`.toLowerCase();
    this._sortDir = dir !== 'asc' && dir !== 'desc' ? 'asc' : dir;
  }

  get filter(): Filter | null {
    return this._filter;
  }

  private set filter(filter: Filter | null) {
    this._filter =
      filter === null || filter === undefined || (filter as unknown) === ''
        ? null
        : (`${filter}` as Filter);
  }
}
