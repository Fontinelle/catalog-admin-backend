import { DataType } from 'sequelize-typescript';
import { CategoryModel } from './category.model';
import { Category } from '../../../domain/category.entity';
import { setupSequelize } from '../../../../shared/infra/testing/helpers';

describe('CategoryModel integration tests', () => {
  setupSequelize({ models: [CategoryModel] });

  it('mapping props', () => {
    const attributesMap = CategoryModel.getAttributes();
    const attributes = Object.keys(CategoryModel.getAttributes());

    expect(attributes).toStrictEqual([
      'categoryId',
      'name',
      'description',
      'isActive',
      'createdAt',
    ]);

    expect(attributesMap.categoryId).toMatchObject({
      type: DataType.UUID(),
      allowNull: false,
      primaryKey: true,
      field: 'category_id',
      fieldName: 'categoryId',
    });

    expect(attributesMap.name).toMatchObject({
      type: DataType.STRING(255),
      allowNull: false,
      field: 'name',
      fieldName: 'name',
    });

    expect(attributesMap.description).toMatchObject({
      type: DataType.TEXT(),
      allowNull: true,
      field: 'description',
      fieldName: 'description',
    });

    expect(attributesMap.isActive).toMatchObject({
      type: DataType.BOOLEAN(),
      allowNull: false,
      field: 'is_active',
      fieldName: 'isActive',
    });

    expect(attributesMap.createdAt).toMatchObject({
      type: DataType.DATE(3),
      allowNull: false,
      field: 'created_at',
      fieldName: 'createdAt',
    });
  });

  it('should create a category', async () => {
    // Arrange
    const category = Category.fake().aCategory().build();

    // Act
    const categoryCreated = await CategoryModel.create({
      categoryId: category.categoryId.id,
      name: category.name,
      description: category.description,
      isActive: category.isActive,
      createdAt: category.createdAt,
    });

    // Assert
    expect(categoryCreated).not.toBeNull();
    expect(categoryCreated).toBeInstanceOf(CategoryModel);
    expect(categoryCreated.categoryId).toBe(category.categoryId.id);
    expect(categoryCreated.name).toBe(category.name);
    expect(categoryCreated.description).toBe(category.description);
    expect(categoryCreated.isActive).toBe(category.isActive);
    expect(categoryCreated.createdAt).toStrictEqual(category.createdAt);
    expect(categoryCreated.createdAt).toBeInstanceOf(Date);
  });
});
