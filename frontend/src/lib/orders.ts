import { apiClient, CreateOrderDto, OrderStatus, UpdateOrderStatusDto } from "./api";

export interface OrderItem {
  id: string;
  orderId: string;
  bookId: string;
  quantity: number;
  price: number;
  book: {
    id: string;
    title: string;
    author: string;
    imageUrl?: string;
  };
}

export interface Order {
  id: string;
  userId: string;
  status: OrderStatus;
  totalAmount: number;
  shippingStreet: string;
  shippingCity: string;
  shippingState: string;
  shippingZipCode: string;
  shippingCountry: string;
  paymentMethod: string;
  createdAt: string;
  updatedAt: string;
  items: OrderItem[];
}

export interface OrdersResponse {
  orders: Order[];
  pagination: {
    page: number;
    limit: number;
    total: number;
    totalPages: number;
  };
}

export class OrderService {
  async createOrder(orderData: CreateOrderDto): Promise<Order> {
    return apiClient.post<Order>("/orders", orderData);
  }

  async getMyOrders(page: number = 1, limit: number = 20): Promise<OrdersResponse> {
    return apiClient.get<OrdersResponse>("/orders/my", { page, limit });
  }

  async getOrderById(id: string): Promise<Order> {
    return apiClient.get<Order>(`/orders/${id}`);
  }

  async cancelOrder(id: string): Promise<Order> {
    return apiClient.post<Order>(`/orders/${id}/cancel`);
  }

  async getAllOrders(filters?: {
    status?: OrderStatus;
    userId?: string;
    search?: string;
    startDate?: Date;
    endDate?: Date;
    page?: number;
    limit?: number;
  }): Promise<OrdersResponse> {
    return apiClient.get<OrdersResponse>("/orders", filters);
  }

  async updateOrderStatus(id: string, status: OrderStatus): Promise<Order> {
    return apiClient.patch<Order>(`/orders/${id}/status`, { status });
  }
}

export type { CreateOrderDto, OrderStatus };
export const orderService = new OrderService();
