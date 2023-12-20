import { Uuid } from '../../shared/domain/value-objects/uuid.vo';
import { setupSequelize } from '../../shared/infra/testing/helpers';
import { CategorySequelizeRepository } from '../infra/db/sequelize/category-sequelize.repository';
import { CategoryModel } from '../infra/db/sequelize/category.model';
import { CreateCategoryUseCase } from './create-category.use-case';

describe('CreateCategoryUseCase integration tests', () => {
  let repository: CategorySequelizeRepository;
  let useCase: CreateCategoryUseCase;

  setupSequelize({ models: [CategoryModel] });

  beforeEach(() => {
    repository = new CategorySequelizeRepository(CategoryModel);
    useCase = new CreateCategoryUseCase(repository);
  });

  it('should create a category', async () => {
    let output = await useCase.execute({ name: 'Category' });
    let category = await repository.findById(new Uuid(output.id));

    expect(category).not.toBeNull();
    expect(output).toEqual({
      id: category!.categoryId.id,
      name: 'Category',
      description: null,
      isActive: true,
      createdAt: category!.createdAt,
    });

    output = await useCase.execute({
      name: 'Category 2',
      description: 'Description',
    });
    category = await repository.findById(new Uuid(output.id));

    expect(category).not.toBeNull();
    expect(output).toEqual({
      id: category!.categoryId.id,
      name: 'Category 2',
      description: 'Description',
      isActive: true,
      createdAt: category!.createdAt,
    });

    output = await useCase.execute({
      name: 'Category 3',
      isActive: false,
    });
    category = await repository.findById(new Uuid(output.id));

    expect(category).not.toBeNull();
    expect(output).toEqual({
      id: category!.categoryId.id,
      name: 'Category 3',
      description: null,
      isActive: false,
      createdAt: category!.createdAt,
    });
  });
});
