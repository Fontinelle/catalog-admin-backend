import { CategoryInMemoryRepository } from '../infra/db/in-memory/category-in-memory.repository';
import { CreateCategoryUseCase } from './create-category.use-case';

describe('CreateCategoryUseCase unit tests', () => {
  let repository: CategoryInMemoryRepository;
  let useCase: CreateCategoryUseCase;

  beforeEach(() => {
    repository = new CategoryInMemoryRepository();
    useCase = new CreateCategoryUseCase(repository);
  });

  it('should create a new category', async () => {
    const spyInsert = jest.spyOn(repository, 'insert');
    let output = await useCase.execute({
      name: 'Category',
    });

    expect(spyInsert).toHaveBeenCalledTimes(1);
    expect(output).toEqual({
      id: repository.items[0].categoryId.id,
      name: 'Category',
      description: null,
      isActive: true,
      createdAt: repository.items[0].createdAt,
    });

    output = await useCase.execute({
      name: 'Category 2',
      description: 'Description',
      isActive: false,
    });

    expect(spyInsert).toHaveBeenCalledTimes(2);
    expect(output).toEqual({
      id: repository.items[1].categoryId.id,
      name: 'Category 2',
      description: 'Description',
      isActive: false,
      createdAt: repository.items[1].createdAt,
    });
  });
});
