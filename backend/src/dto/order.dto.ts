import { z } from 'zod';
import { OrderStatus } from '../domain/enums';

export const CreateOrderDtoSchema = z.object({
  shippingStreet: z.string().min(1).max(500),
  shippingCity: z.string().min(1).max(100),
  shippingState: z.string().min(1).max(100),
  shippingZipCode: z.string().min(1).max(20),
  shippingCountry: z.string().min(1).max(100),
  paymentMethod: z.string().default('SIMULATED'),
});

export const UpdateOrderStatusDtoSchema = z.object({
  status: z.nativeEnum(OrderStatus),
});

export const OrderFiltersDtoSchema = z.object({
  status: z.nativeEnum(OrderStatus).optional(),
  userId: z.string().uuid().optional(),
  search: z.string().optional(),
  startDate: z.coerce.date().optional(),
  endDate: z.coerce.date().optional(),
  page: z.coerce.number().int().min(1).default(1),
  limit: z.coerce.number().int().min(1).max(100).default(20),
});

export type CreateOrderDto = z.infer<typeof CreateOrderDtoSchema>;
export type UpdateOrderStatusDto = z.infer<typeof UpdateOrderStatusDtoSchema>;
export type OrderFiltersDto = z.infer<typeof OrderFiltersDtoSchema>;
