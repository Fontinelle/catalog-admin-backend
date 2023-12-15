import { Sequelize } from 'sequelize-typescript';
import { CategorySequelizeRepository } from './category-sequelize.repository';
import { CategoryModel } from './category.model';
import { Category } from '../../../domain/category.entity';
import { NotFoundError } from '../../../../shared/domain/errors/not-found.error';

describe('CategorySequelizeRepository integration tests', () => {
  let sequelize: Sequelize;
  let repository: CategorySequelizeRepository;

  beforeEach(async () => {
    sequelize = new Sequelize({
      dialect: 'sqlite',
      storage: ':memory:',
      models: [CategoryModel],
      logging: false,
    });

    await sequelize.sync({ force: true });
    repository = new CategorySequelizeRepository(CategoryModel);
  });

  it('should insert a new category', async () => {
    // Arrange
    const category = Category.fake().aCategory().build();

    // Act
    await repository.insert(category);

    const categoryInserted = await CategoryModel.findByPk(
      category.categoryId.id,
    );

    // Assert
    expect(categoryInserted.toJSON()).toMatchObject(category.toJSON());
  });

  it('should bulk insert categories', async () => {
    // Arrange
    const categories = Category.fake().theCategories(3).build();

    // Act
    await repository.bulkInsert(categories);

    const categoriesInserted = await CategoryModel.findAll();

    // Assert
    expect(categoriesInserted).toHaveLength(3);
    expect(categoriesInserted).toMatchObject(categories.map(c => c.toJSON()));
  });

  it('should throw error on update when a category not found', async () => {
    // Arrange
    const category = Category.fake().aCategory().build();

    // Act
    const update = repository.update(category);

    // Assert
    await expect(update).rejects.toThrow(
      new NotFoundError(category.categoryId.id, Category),
    );
  });

  it('should update a category', async () => {
    // Arrange
    const category = Category.fake().aCategory().build();
    await repository.insert(category);

    // Act
    category.changeName('new name');
    await repository.update(category);

    const categoryUpdated = await CategoryModel.findByPk(
      category.categoryId.id,
    );

    // Assert
    expect(categoryUpdated.toJSON()).toMatchObject(categoryUpdated.toJSON());
  });

  it('should throw error on delete when a category not found', async () => {
    // Arrange
    const category = Category.fake().aCategory().build();

    // Act
    const del = repository.delete(category.categoryId);

    // Assert
    await expect(del).rejects.toThrow(
      new NotFoundError(category.categoryId.id, Category),
    );
  });

  it('should delete a category', async () => {
    // Arrange
    const category = Category.fake().aCategory().build();
    await repository.insert(category);

    // Act
    await repository.delete(category.categoryId);

    const categoryDeleted = await CategoryModel.findByPk(
      category.categoryId.id,
    );

    // Assert
    expect(categoryDeleted).toBeNull();
  });

  it('should return null when a category not found', async () => {
    // Arrange
    const category = Category.fake().aCategory().build();

    // Act
    const categoryFound = await repository.findById(category.categoryId);

    // Assert
    expect(categoryFound).toBeNull();
  });

  it('should find a category by id', async () => {
    // Arrange
    const category = Category.fake().aCategory().build();

    await repository.insert(category);

    // Act
    const categoryFound = await repository.findById(category.categoryId);

    // Assert
    expect(categoryFound.toJSON()).toMatchObject(category.toJSON());
  });

  it('should find all categories', async () => {
    // Arrange
    const categories = Category.fake().theCategories(3).build();

    await repository.bulkInsert(categories);

    // Act
    const categoriesFound = await repository.findAll();

    // Assert
    expect(categoriesFound).toHaveLength(3);
    expect(JSON.stringify(categoriesFound)).toBe(JSON.stringify(categories));
  });
});
