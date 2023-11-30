import { RepositoryInterface } from '../../shared/domain/repository/repository.interface';
import { Uuid } from '../../shared/domain/value-objects/uuid.vo';
import { Category } from './category.entity';

export interface CategoryRepositoryInterface
  extends RepositoryInterface<Category, Uuid> {}
