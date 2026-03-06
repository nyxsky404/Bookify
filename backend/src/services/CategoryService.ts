import { Category } from '../domain/Category';
import { CreateCategoryDto, UpdateCategoryDto } from '../dto/category.dto';
import { ICategoryRepository } from '../repositories/interfaces/ICategoryRepository';
import { ApiError } from '../utils/apiError';

export class CategoryService {
  constructor(private readonly categoryRepo: ICategoryRepository) {}

  async getAll(): Promise<Category[]> {
    return this.categoryRepo.findAll();
  }

  async getById(id: string): Promise<Category> {
    const category = await this.categoryRepo.findById(id);
    if (!category) throw ApiError.notFound('Category not found');
    return category;
  }

  async create(dto: CreateCategoryDto): Promise<Category> {
    const existing = await this.categoryRepo.findBySlug(dto.slug);
    if (existing) throw ApiError.conflict('Slug already in use');
    return this.categoryRepo.save({ name: dto.name, description: dto.description ?? null, slug: dto.slug });
  }

  async update(id: string, dto: UpdateCategoryDto): Promise<Category> {
    await this.getById(id);
    if (dto.slug) {
      const existing = await this.categoryRepo.findBySlug(dto.slug);
      if (existing && existing.id !== id) throw ApiError.conflict('Slug already in use');
    }
    return this.categoryRepo.update(id, dto);
  }

  async delete(id: string): Promise<void> {
    await this.getById(id);
    await this.categoryRepo.delete(id);
  }
}
