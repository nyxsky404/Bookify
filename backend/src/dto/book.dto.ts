import { z } from 'zod';

export const CreateBookDtoSchema = z.object({
  title: z.string().min(1).max(500),
  author: z.string().min(1).max(255),
  isbn: z.string().max(20).optional(),
  description: z.string().optional(),
  price: z.number().positive(),
  stockQuantity: z.number().int().min(0),
  categoryId: z.string().uuid().optional(),
  imageUrl: z.string().url().optional(),
  publishedYear: z.number().int().min(1000).max(new Date().getFullYear()).optional(),
  publisher: z.string().max(255).optional(),
});

export const UpdateBookDtoSchema = CreateBookDtoSchema.partial();

export const BookFiltersDtoSchema = z.object({
  search: z.string().optional(),
  categoryId: z.string().uuid().optional(),
  minPrice: z.coerce.number().positive().optional(),
  maxPrice: z.coerce.number().positive().optional(),
  author: z.string().optional(),
  publishedYear: z.coerce.number().int().optional(),
  inStock: z.coerce.boolean().optional(),
  sortBy: z.enum(['price_asc', 'price_desc', 'newest', 'title']).optional(),
  page: z.coerce.number().int().min(1).default(1),
  limit: z.coerce.number().int().min(1).max(100).default(12),
});

export type CreateBookDto = z.infer<typeof CreateBookDtoSchema>;
export type UpdateBookDto = z.infer<typeof UpdateBookDtoSchema>;
export type BookFiltersDto = z.infer<typeof BookFiltersDtoSchema>;
