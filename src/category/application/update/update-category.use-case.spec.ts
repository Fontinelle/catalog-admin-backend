import { NotFoundError } from '../../../shared/domain/errors/not-found.error';
import {
  InvalidUuidError,
  Uuid,
} from '../../../shared/domain/value-objects/uuid.vo';
import { Category } from '../../domain/category.entity';
import { CategoryInMemoryRepository } from '../../infra/db/in-memory/category-in-memory.repository';
import { UpdateCategoryUseCase } from './update-category.use-case';

describe('UpdateCategoryUseCase unit tests', () => {
  let repository: CategoryInMemoryRepository;
  let useCase: UpdateCategoryUseCase;

  beforeEach(() => {
    repository = new CategoryInMemoryRepository();
    useCase = new UpdateCategoryUseCase(repository);
  });

  it('should throw error when category does not exist', async () => {
    await expect(() =>
      useCase.execute({ id: 'fake id', name: 'fake' }),
    ).rejects.toThrow(new InvalidUuidError());

    const uuid = new Uuid();

    await expect(() =>
      useCase.execute({ id: uuid.id, name: 'fake' }),
    ).rejects.toThrow(new NotFoundError(uuid.id, Category));
  });

  it('should update a category', async () => {
    const spyUpdate = jest.spyOn(repository, 'update');
    const category = new Category({ name: 'Category' });
    repository.items = [category];

    let output = await useCase.execute({
      id: category.categoryId.id,
      name: 'Category',
    });

    expect(spyUpdate).toHaveBeenCalledTimes(1);
    expect(output).toEqual({
      id: category.categoryId.id,
      name: 'Category',
      description: null,
      isActive: true,
      createdAt: category.createdAt,
    });

    type Arrange = {
      input: {
        id: string;
        name: string;
        description?: null| string;
        isActive?: boolean;
      };
      output: {
        id: string;
        name: string;
        description: null| string;
        isActive: boolean;
        createdAt: Date;
      };
    }

    const arranges: Arrange[] = [
      {
        input: {
          id: category.categoryId.id,
          name: 'Category',
          description: 'Description',
        },
        output: {
          id: category.categoryId.id,
          name: 'Category',
          description: 'Description',
          isActive: true,
          createdAt: category.createdAt,
        },
      },
      {
        input: {
          id: category.categoryId.id,
          name: 'Category',
          description: 'Description',
          isActive: false,
        },
        output: {
          id: category.categoryId.id,
          name: 'Category',
          description: 'Description',
          isActive: false,
          createdAt: category.createdAt,
        },
      },
      {
        input: {
          id: category.categoryId.id,
          name: 'Category',
        },
        output: {
          id: category.categoryId.id,
          name: 'Category',
          description: 'Description',
          isActive: false,
          createdAt: category.createdAt,
        },
      },
      {
        input: {
          id: category.categoryId.id,
          name: 'Category',
          isActive: true,
        },
        output: {
          id: category.categoryId.id,
          name: 'Category',
          description: 'Description',
          isActive: true,
          createdAt: category.createdAt,
        },
      },
    ];

    for (const arrange of arranges) {
      output = await useCase.execute({
        id: arrange.input.id,
        ...('name' in arrange.input && { name: arrange.input.name }),
        ...('description' in arrange.input && { description: arrange.input.description }),
        ...('isActive' in arrange.input && { isActive: arrange.input.isActive }),
      });

      expect(output).toStrictEqual({
        id: category.categoryId.id,
        name: arrange.output.name,
        description: arrange.output.description,
        isActive: arrange.output.isActive,
        createdAt: arrange.output.createdAt,
      });
    }
  });
});
