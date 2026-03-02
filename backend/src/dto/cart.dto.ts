import { z } from 'zod';

export const AddToCartDtoSchema = z.object({
  bookId: z.string().uuid(),
  quantity: z.number().int().min(1).max(99),
});

export const UpdateCartItemDtoSchema = z.object({
  quantity: z.number().int().min(1).max(99),
});

export type AddToCartDto = z.infer<typeof AddToCartDtoSchema>;
export type UpdateCartItemDto = z.infer<typeof UpdateCartItemDtoSchema>;
