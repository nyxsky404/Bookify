import { Order } from '../../domain/Order';
import { OrderItem } from '../../domain/OrderItem';

export interface CreateOrderItemData {
  bookId: string;
  quantity: number;
  priceAtPurchase: number;
}
import { OrderStatus } from '../../domain/enums';
import { OrderFiltersDto } from '../../dto/order.dto';
import { PaginatedResult } from './IBookRepository';

export interface OrderWithItems {
  order: Order;
  items: OrderItem[];
}

export interface OrderStats {
  totalRevenue: number;
  totalOrders: number;
  totalBooksSold: number;
  pendingOrders: number;
}

export interface IOrderRepository {
  findById(id: string): Promise<OrderWithItems | null>;
  findByUserId(userId: string): Promise<OrderWithItems[]>;
  findAll(filters: OrderFiltersDto): Promise<PaginatedResult<OrderWithItems>>;
  save(order: Omit<Order, 'id' | 'createdAt' | 'updatedAt' | 'canTransitionTo' | 'updateStatus' | 'cancel' | 'canBeCancelled'>, items: CreateOrderItemData[]): Promise<OrderWithItems>;
  updateStatus(id: string, status: OrderStatus): Promise<Order>;
  getStats(): Promise<OrderStats>;
  getRevenueByPeriod(startDate: Date, endDate: Date): Promise<number>;
}
