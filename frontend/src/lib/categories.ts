import { apiClient, CreateCategoryDto, UpdateCategoryDto } from "./api";

export interface Category {
  id: string;
  name: string;
  description?: string;
  slug: string;
  createdAt: string;
  updatedAt: string;
}

export class CategoryService {
  async getCategories(): Promise<Category[]> {
    return apiClient.get<Category[]>("/categories");
  }

  async getCategoryById(id: string): Promise<Category> {
    return apiClient.get<Category>(`/categories/${id}`);
  }

  async createCategory(categoryData: CreateCategoryDto): Promise<Category> {
    return apiClient.post<Category>("/categories", categoryData);
  }

  async updateCategory(id: string, categoryData: UpdateCategoryDto): Promise<Category> {
    return apiClient.patch<Category>(`/categories/${id}`, categoryData);
  }

  async deleteCategory(id: string): Promise<void> {
    return apiClient.delete(`/categories/${id}`);
  }
}

export type { CreateCategoryDto, UpdateCategoryDto };
export const categoryService = new CategoryService();
