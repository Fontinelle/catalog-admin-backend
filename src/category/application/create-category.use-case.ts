import { UseCaseInterface } from '../../shared/application/use-case.interface';
import { Category } from '../domain/category.entity';
import { CategoryRepositoryInterface } from '../domain/category.repository';

export type CreateCategoryInput = {
  name: string;
  description?: string | null;
  isActive?: boolean;
};

export type CreateCategoryOutput = {
  id: string;
  name: string;
  description?: string | null;
  isActive?: boolean;
  createdAt: Date;
};

export class CreateCategoryUseCase
  implements UseCaseInterface<CreateCategoryInput, CreateCategoryOutput>
{
  constructor(
    private readonly categoryRepository: CategoryRepositoryInterface,
  ) {}

  async execute(input: CreateCategoryInput): Promise<CreateCategoryOutput> {
    const category = Category.create(input);
    await this.categoryRepository.insert(category);

    return {
      id: category.categoryId.id,
      name: category.name,
      description: category.description,
      isActive: category.isActive,
      createdAt: category.createdAt,
    };
  }
}
