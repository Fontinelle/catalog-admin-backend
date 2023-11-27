import { Uuid } from '../../shared/domain/value-objects/uuid.vo';
import { Category } from './category.entity';

describe('Category Unit Tests', () => {
  describe('Constructor', () => {
    it('should create a category with all values', () => {
      // Arrange
      const props = {
        categoryId: new Uuid(),
        name: 'Category 1',
        description: 'Category 1 description',
        isActive: false,
        createdAt: new Date(),
      };
      // Act
      const category = new Category(props);
      // Assert
      expect(category.categoryId).toBe(props.categoryId);
      expect(category.name).toBe(props.name);
      expect(category.description).toBe(props.description);
      expect(category.isActive).toBe(props.isActive);
      expect(category.createdAt).toBe(props.createdAt);
    });

    it('should create a category with name', () => {
      // Arrange
      const props = {
        name: 'Category 1',
      };
      // Act
      const category = new Category(props);
      // Assert
      expect(category.categoryId).toBeDefined();
      expect(category.name).toBe(props.name);
      expect(category.description).toBeNull();
      expect(category.isActive).toBe(true);
      expect(category.createdAt).toBeDefined();
    });

    it('should create a category with name and description', () => {
      // Arrange
      const props = {
        name: 'Category 1',
        description: 'Category 1 description',
      };
      // Act
      const category = new Category(props);
      // Assert
      expect(category.categoryId).toBeDefined();
      expect(category.name).toBe(props.name);
      expect(category.description).toBe(props.description);
      expect(category.isActive).toBe(true);
      expect(category.createdAt).toBeDefined();
    });
  });

  describe('Create', () => {
    it('should create a category with name', () => {
      // Arrange
      const props = {
        name: 'Category 1',
      };
      // Act
      const category = Category.create(props);
      // Assert
      expect(category.categoryId).toBeDefined();
      expect(category.name).toBe(props.name);
      expect(category.description).toBeNull();
      expect(category.isActive).toBe(true);
      expect(category.createdAt).toBeDefined();
    });

    it('should create a category with name and description', () => {
      // Arrange
      const props = {
        name: 'Category 1',
        description: 'Category 1 description',
      };
      // Act
      const category = Category.create(props);
      // Assert
      expect(category.categoryId).toBeDefined();
      expect(category.name).toBe(props.name);
      expect(category.description).toBe(props.description);
      expect(category.isActive).toBe(true);
      expect(category.createdAt).toBeDefined();
    });

    it('should create a category with name, description and isActive', () => {
      // Arrange
      const props = {
        name: 'Category 1',
        description: 'Category 1 description',
        isActive: false,
      };
      // Act
      const category = Category.create(props);
      // Assert
      expect(category.categoryId).toBeDefined();
      expect(category.name).toBe(props.name);
      expect(category.description).toBe(props.description);
      expect(category.isActive).toBe(false);
      expect(category.createdAt).toBeDefined();
    });
  });

  describe('category id field', () => {
    const arrange = [
      { categoryId: null },
      { categoryId: undefined },
      { categoryId: new Uuid() },
    ];

    it.each(arrange)(
      'should create a category with categoryId: %j',
      ({ categoryId }) => {
        // Act
        const category = new Category({
          name: 'Category 1',
          categoryId: categoryId as any,
        });
        // Assert
        expect(category.categoryId).toBeInstanceOf(Uuid);
      },
    );
  });

  describe('Change name', () => {
    it('should change name', () => {
      // Arrange
      const props = {
        name: 'Category 1',
      };
      const category = Category.create(props);
      // Act
      category.changeName('Category 2');
      // Assert
      expect(category.name).toBe('Category 2');
    });
  });

  describe('Change description', () => {
    it('should change description', () => {
      // Arrange
      const props = {
        name: 'Category 1',
        description: 'Category 1 description',
      };
      const category = Category.create(props);
      // Act
      category.changeDescription('Category 2 description');
      // Assert
      expect(category.description).toBe('Category 2 description');
    });
  });

  describe('Activate', () => {
    it('should activate category', () => {
      // Arrange
      const props = {
        name: 'Category 1',
        isActive: false,
      };
      const category = Category.create(props);
      // Act
      category.activate();
      // Assert
      expect(category.isActive).toBe(true);
    });
  });

  describe('Deactivate', () => {
    it('should deactivate category', () => {
      // Arrange
      const props = {
        name: 'Category 1',
        isActive: true,
      };
      const category = Category.create(props);
      // Act
      category.deactivate();
      // Assert
      expect(category.isActive).toBe(false);
    });
  });

  describe('To JSON', () => {
    it('should return a JSON', () => {
      // Arrange
      const props = {
        categoryId: new Uuid(),
        name: 'Category 1',
        description: 'Category 1 description',
        isActive: true,
        createdAt: new Date(),
      };
      const category = new Category(props);
      // Act
      const json = category.toJSON();
      // Assert
      expect(json.categoryId).toBe(props.categoryId.id);
      expect(json.name).toBe(props.name);
      expect(json.description).toBe(props.description);
      expect(json.isActive).toBe(props.isActive);
      expect(json.createdAt).toBe(props.createdAt);
    });
  });
});
