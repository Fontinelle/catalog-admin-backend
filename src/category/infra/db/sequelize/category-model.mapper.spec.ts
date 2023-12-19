import { Sequelize } from 'sequelize-typescript';
import { Category } from '../../../domain/category.entity';
import { CategoryModel } from './category.model';
import { CategoryModelMapper } from './category-model.mapper';
import { EntityValidationError } from '../../../../shared/domain/validators/validation.error';
import { Uuid } from '../../../../shared/domain/value-objects/uuid.vo';

describe('CategoryModelMapper integration tests', () => {
  let sequelize: Sequelize;

  beforeEach(async () => {
    sequelize = new Sequelize({
      dialect: 'sqlite',
      storage: ':memory:',
      models: [CategoryModel],
      logging: false,
    });

    await sequelize.sync({ force: true });
  });

  it('should throw error when category is invalid', async () => {
    // Arrange
    const category = CategoryModel.build({
      categoryId: '9e1d5b9e-9f9a-4e6e-8e5a-5d9f9a4e6e8e',
    });

    try {
      // Act
      CategoryModelMapper.toEntity(category);
    } catch (error) {
      // Assert
      const e = error as EntityValidationError;
      expect(e.error).toMatchObject({
        name: [
          'name should not be empty',
          'name must be a string',
          'name must be shorter than or equal to 255 characters',
        ],
      });
    }
  });

  it('should convert a category model to category entity', async () => {
    // Arrange
    const createdAt = new Date();
    const category = CategoryModel.build({
      categoryId: '9e1d5b9e-9f9a-4e6e-8e5a-5d9f9a4e6e8e',
      name: 'Category 1',
      description: 'Description 1',
      isActive: true,
      createdAt,
    });

    // Act
    const entity = CategoryModelMapper.toEntity(category);

    // Assert
    expect(entity).toMatchObject({
      categoryId: { id: '9e1d5b9e-9f9a-4e6e-8e5a-5d9f9a4e6e8e' },
      name: 'Category 1',
      description: 'Description 1',
      isActive: true,
      createdAt,
    });
  });

  it('should convert a category entity to category model', async () => {
    // Arrange
    const createdAt = new Date();
    const entity = new Category({
      categoryId: new Uuid('9e1d5b9e-9f9a-4e6e-8e5a-5d9f9a4e6e8e'),
      name: 'Category 1',
      description: 'Description 1',
      isActive: true,
      createdAt,
    });

    // Act
    const model = CategoryModelMapper.toModel(entity);

    // Assert
    expect(model).toMatchObject({
      categoryId: '9e1d5b9e-9f9a-4e6e-8e5a-5d9f9a4e6e8e',
      name: 'Category 1',
      description: 'Description 1',
      isActive: true,
      createdAt,
    });
  });
});
