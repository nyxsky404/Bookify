import { Category } from '../../domain/Category';

export interface ICategoryRepository {
  findById(id: string): Promise<Category | null>;
  findBySlug(slug: string): Promise<Category | null>;
  findAll(): Promise<Category[]>;
  save(data: Omit<Category, 'id' | 'createdAt'>): Promise<Category>;
  update(id: string, data: Partial<Omit<Category, 'id' | 'createdAt'>>): Promise<Category>;
  delete(id: string): Promise<void>;
}
