import { EntityValidationError } from '../../shared/domain/validators/validation.error';
import { Uuid } from '../../shared/domain/value-objects/uuid.vo';
import { Category } from './category.entity';

describe('Category Unit Tests', () => {
  let validateSpy: any;

  beforeEach(() => {
    validateSpy = jest.spyOn(Category, 'validate');
  });

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
      expect(validateSpy).toHaveBeenCalledTimes(1);
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
      expect(validateSpy).toHaveBeenCalledTimes(1);
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
      expect(validateSpy).toHaveBeenCalledTimes(1);
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
      expect(validateSpy).toHaveBeenCalledTimes(2);
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
      expect(validateSpy).toHaveBeenCalledTimes(2);
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

describe('Category Validator Unit Tests', () => {
  describe('Create', () => {
    it('should an invalid category with empty name', () => {
      expect(() => Category.create({ name: null })).containsErrorMessages({
        name: [
          'name should not be empty',
          'name must be a string',
          'name must be shorter than or equal to 255 characters',
        ],
      });

      expect(() => Category.create({ name: '' })).containsErrorMessages({
        name: ['name should not be empty'],
      });

      expect(() => Category.create({ name: 5 as any })).containsErrorMessages({
        name: [
          'name must be a string',
          'name must be shorter than or equal to 255 characters',
        ],
      });

      expect(() =>
        Category.create({ name: 't'.repeat(256) }),
      ).containsErrorMessages({
        name: ['name must be shorter than or equal to 255 characters'],
      });
    });

    it('should a invalid category using description property', () => {
      expect(() =>
        Category.create({ description: 5 } as any),
      ).containsErrorMessages({
        description: ['description must be a string'],
      });
    });

    it('should a invalid category using is_active property', () => {
      expect(() =>
        Category.create({ name: 'Category', is_active: 5 } as any),
      ).containsErrorMessages({
        is_active: ['is_active must be a boolean value'],
      });
    });
  });

  describe('changeName method', () => {
    it('should a invalid category using name property', () => {
      const category = Category.create({ name: 'Movie' });
      expect(() => category.changeName(null)).containsErrorMessages({
        name: [
          'name should not be empty',
          'name must be a string',
          'name must be shorter than or equal to 255 characters',
        ],
      });

      expect(() => category.changeName('')).containsErrorMessages({
        name: ['name should not be empty'],
      });

      expect(() => category.changeName(5 as any)).containsErrorMessages({
        name: [
          'name must be a string',
          'name must be shorter than or equal to 255 characters',
        ],
      });

      expect(() => category.changeName('t'.repeat(256))).containsErrorMessages({
        name: ['name must be shorter than or equal to 255 characters'],
      });
    });
  });

  describe('changeDescription method', () => {
    it('should a invalid category using description property', () => {
      const category = Category.create({ name: 'Movie' });
      expect(() => category.changeDescription(5 as any)).containsErrorMessages({
        description: ['description must be a string'],
      });
    });
  });
});
