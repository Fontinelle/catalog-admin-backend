import { Uuid } from '../../../../shared/domain/value-objects/uuid.vo';
import { Category } from '../../../domain/category.entity';
import {
  CategoryRepositoryInterface,
  CategorySearchParam,
  CategorySearchResult,
} from '../../../domain/category.repository';
import { CategoryModel } from './category.model';
import { NotFoundError } from '../../../../shared/domain/errors/not-found.error';
import { Op } from 'sequelize';
import { CategoryModelMapper } from './category-model.mapper';

export class CategorySequelizeRepository
  implements CategoryRepositoryInterface
{
  sortableFields: string[] = ['name', 'createdAt'];

  constructor(private categoryModel: typeof CategoryModel) {}

  async insert(entity: Category): Promise<void> {
    const category = CategoryModelMapper.toModel(entity);
    await this.categoryModel.create(category.toJSON());
  }

  async bulkInsert(entities: Category[]): Promise<void> {
    const categories = entities.map(entity => {
      const category = CategoryModelMapper.toModel(entity);
      return category.toJSON();
    });
    await this.categoryModel.bulkCreate(categories);
  }

  async update(entity: Category): Promise<void> {
    const id = entity.categoryId.id;
    const category = await this._findId(id);

    if (!category) {
      throw new NotFoundError(id, this.getEntity());
    }

    const categoryModel = CategoryModelMapper.toModel(entity);

    await this.categoryModel.update(categoryModel.toJSON(), {
      where: { categoryId: id },
    });
  }

  async delete(uuid: Uuid): Promise<void> {
    const id = uuid.id;
    const category = await this._findId(id);

    if (!category) {
      throw new NotFoundError(id, this.getEntity());
    }

    await this.categoryModel.destroy({ where: { categoryId: id } });
  }

  async findById(uuid: Uuid): Promise<Category | null> {
    const id = uuid.id;
    const category = await this._findId(id);

    return category ? CategoryModelMapper.toEntity(category) : null;
  }

  private async _findId(id: string) {
    return await this.categoryModel.findByPk(id);
  }

  async findAll(): Promise<Category[]> {
    const categories = await this.categoryModel.findAll();

    return categories.map(category => {
      return CategoryModelMapper.toEntity(category);
    });
  }

  async search(
    searchInput: CategorySearchParam,
  ): Promise<CategorySearchResult> {
    const offset = (searchInput.page - 1) * searchInput.perPage;
    const limit = searchInput.perPage;

    const { rows: models, count } = await this.categoryModel.findAndCountAll({
      ...(searchInput.filter && {
        where: {
          name: { [Op.like]: `%${searchInput.filter}%` },
        },
      }),
      ...(searchInput.sort && this.sortableFields.includes(searchInput.sort)
        ? { order: [[searchInput.sort, searchInput.sortDir]] }
        : { order: [['createdAt', 'desc']] }),
      offset,
      limit,
    });

    return new CategorySearchResult({
      items: models.map(model => {
        return CategoryModelMapper.toEntity(model);
      }),
      currentPage: searchInput.page,
      perPage: searchInput.perPage,
      total: count,
    });
  }

  getEntity(): new (...args: any[]) => Category {
    return Category;
  }
}
