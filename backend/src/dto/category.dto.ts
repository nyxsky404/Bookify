import { z } from 'zod';

export const CreateCategoryDtoSchema = z.object({
  name: z.string().min(1).max(100),
  description: z.string().optional(),
  slug: z.string().min(1).max(100).regex(/^[a-z0-9-]+$/),
});

export const UpdateCategoryDtoSchema = CreateCategoryDtoSchema.partial();

export type CreateCategoryDto = z.infer<typeof CreateCategoryDtoSchema>;
export type UpdateCategoryDto = z.infer<typeof UpdateCategoryDtoSchema>;
