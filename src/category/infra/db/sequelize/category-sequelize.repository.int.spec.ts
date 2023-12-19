import { CategorySequelizeRepository } from './category-sequelize.repository';
import { CategoryModel } from './category.model';
import { Category } from '../../../domain/category.entity';
import { NotFoundError } from '../../../../shared/domain/errors/not-found.error';
import {
  CategorySearchParam,
  CategorySearchResult,
} from '../../../domain/category.repository';
import { CategoryModelMapper } from './category-model.mapper';
import { setupSequelize } from '../../../../shared/infra/testing/helpers';

describe('CategorySequelizeRepository integration tests', () => {
  setupSequelize({ models: [CategoryModel] });
  let repository: CategorySequelizeRepository;

  beforeEach(async () => {
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

  describe('search method tests', () => {
    it('should only apply paginate when other params are null', async () => {
      // Arrange
      const createdAt = new Date();
      const categories = Category.fake()
        .theCategories(16)
        .withName('Movie')
        .withDescription(null)
        .withCreatedAt(createdAt)
        .build();

      await repository.bulkInsert(categories);
      const spyToEntity = jest.spyOn(CategoryModelMapper, 'toEntity');

      // Act
      const result = await repository.search(new CategorySearchParam());

      // Assert
      expect(result).toBeInstanceOf(CategorySearchResult);
      expect(spyToEntity).toHaveBeenCalledTimes(15);
      expect(result.toJSON()).toMatchObject({
        total: 16,
        currentPage: 1,
        lastPage: 2,
        perPage: 15,
      });
      result.items.forEach(item => {
        expect(item).toBeInstanceOf(Category);
        expect(item.categoryId).toBeDefined();
      });

      const items = result.items.map(item => item.toJSON());
      expect(items).toMatchObject(
        new Array(15).fill({
          name: 'Movie',
          description: null,
          isActive: true,
          createdAt,
        }),
      );
    });

    it('should order by createdAt DESC when search params are null', async () => {
      // Arrange
      const createdAt = new Date();
      const categories = Category.fake()
        .theCategories(16)
        .withName(index => `Movie ${index}`)
        .withDescription(null)
        .withCreatedAt(index => new Date(createdAt.getTime() + index))
        .build();

      // Act
      const result = await repository.search(new CategorySearchParam());
      const items = result.items;

      // Assert
      [...items].reverse().forEach((item, index) => {
        expect(`Movie ${index}`).toBe(`${categories[index + 1].name}`);
      });
    });

    it('should apply paginate and filter', async () => {
      const categories = [
        Category.fake()
          .aCategory()
          .withName('test')
          .withCreatedAt(new Date(new Date().getTime() + 5000))
          .build(),
        Category.fake()
          .aCategory()
          .withName('a')
          .withCreatedAt(new Date(new Date().getTime() + 4000))
          .build(),
        Category.fake()
          .aCategory()
          .withName('TEST')
          .withCreatedAt(new Date(new Date().getTime() + 3000))
          .build(),
        Category.fake()
          .aCategory()
          .withName('TeSt')
          .withCreatedAt(new Date(new Date().getTime() + 1000))
          .build(),
      ];

      await repository.bulkInsert(categories);

      let searchOutput = await repository.search(
        new CategorySearchParam({
          page: 1,
          perPage: 2,
          filter: 'TEST',
        }),
      );
      expect(searchOutput.toJSON(true)).toMatchObject(
        new CategorySearchResult({
          items: [categories[0], categories[2]],
          total: 3,
          currentPage: 1,
          perPage: 2,
        }).toJSON(true),
      );

      searchOutput = await repository.search(
        new CategorySearchParam({
          page: 2,
          perPage: 2,
          filter: 'TEST',
        }),
      );
      expect(searchOutput.toJSON(true)).toMatchObject(
        new CategorySearchResult({
          items: [categories[3]],
          total: 3,
          currentPage: 2,
          perPage: 2,
        }).toJSON(true),
      );
    });

    it('should apply paginate and sort', async () => {
      expect(repository.sortableFields).toStrictEqual(['name', 'createdAt']);

      const categories = [
        Category.fake().aCategory().withName('b').build(),
        Category.fake().aCategory().withName('a').build(),
        Category.fake().aCategory().withName('d').build(),
        Category.fake().aCategory().withName('e').build(),
        Category.fake().aCategory().withName('c').build(),
      ];
      await repository.bulkInsert(categories);

      const arrange = [
        {
          params: new CategorySearchParam({
            page: 1,
            perPage: 2,
            sort: 'name',
          }),
          result: new CategorySearchResult({
            items: [categories[1], categories[0]],
            total: 5,
            currentPage: 1,
            perPage: 2,
          }),
        },
        {
          params: new CategorySearchParam({
            page: 2,
            perPage: 2,
            sort: 'name',
          }),
          result: new CategorySearchResult({
            items: [categories[4], categories[2]],
            total: 5,
            currentPage: 2,
            perPage: 2,
          }),
        },
        {
          params: new CategorySearchParam({
            page: 1,
            perPage: 2,
            sort: 'name',
            sortDir: 'desc',
          }),
          result: new CategorySearchResult({
            items: [categories[3], categories[2]],
            total: 5,
            currentPage: 1,
            perPage: 2,
          }),
        },
        {
          params: new CategorySearchParam({
            page: 2,
            perPage: 2,
            sort: 'name',
            sortDir: 'desc',
          }),
          result: new CategorySearchResult({
            items: [categories[4], categories[0]],
            total: 5,
            currentPage: 2,
            perPage: 2,
          }),
        },
      ];

      for (const i of arrange) {
        const result = await repository.search(i.params);
        expect(result.toJSON(true)).toMatchObject(i.result.toJSON(true));
      }
    });

    describe('should search using filter, sort and paginate', () => {
      const categories = [
        Category.fake().aCategory().withName('category').build(),
        Category.fake().aCategory().withName('a').build(),
        Category.fake().aCategory().withName('CATEGORY').build(),
        Category.fake().aCategory().withName('e').build(),
        Category.fake().aCategory().withName('CaTeGoRy').build(),
      ];

      const arrange = [
        {
          searchParams: new CategorySearchParam({
            page: 1,
            perPage: 2,
            sort: 'name',
            filter: 'CATEGORY',
          }),
          searchResult: new CategorySearchResult({
            items: [categories[2], categories[4]],
            total: 3,
            currentPage: 1,
            perPage: 2,
          }),
        },
        {
          searchParams: new CategorySearchParam({
            page: 2,
            perPage: 2,
            sort: 'name',
            filter: 'CATEGORY',
          }),
          searchResult: new CategorySearchResult({
            items: [categories[0]],
            total: 3,
            currentPage: 2,
            perPage: 2,
          }),
        },
      ];

      beforeEach(async () => {
        await repository.bulkInsert(categories);
      });

      it.each(arrange)(
        'should search using filter, sort and paginate',
        async ({ searchParams, searchResult }) => {
          // Act
          const result = await repository.search(searchParams);

          // Assert
          expect(result.toJSON()).toMatchObject(searchResult.toJSON());
        },
      );
    });
  });
});
