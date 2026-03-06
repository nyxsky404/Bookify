import { Address } from '../domain/Address';
import { Order } from '../domain/Order';
import { OrderItem } from '../domain/OrderItem';
import { OrderStatus } from '../domain/enums';
import { CreateOrderDto, OrderFiltersDto } from '../dto/order.dto';
import { buildOrderValidationChain } from '../patterns/chain/OrderValidator';
import { IBookRepository } from '../repositories/interfaces/IBookRepository';
import { PaginatedResult } from '../repositories/interfaces/IBookRepository';
import { ICartRepository } from '../repositories/interfaces/ICartRepository';
import { IOrderRepository, OrderWithItems } from '../repositories/interfaces/IOrderRepository';
import { ApiError } from '../utils/apiError';
import { generateOrderNumber } from '../utils/orderNumber';
import { InventoryService } from './InventoryService';
import { NotificationService } from './NotificationService';

export class OrderService {
  private readonly validationChain = buildOrderValidationChain();

  constructor(
    private readonly orderRepo: IOrderRepository,
    private readonly cartRepo: ICartRepository,
    private readonly bookRepo: IBookRepository,
    private readonly inventoryService: InventoryService,
    private readonly notificationService: NotificationService,
  ) {}

  async createOrder(userId: string, dto: CreateOrderDto): Promise<OrderWithItems> {
    const cart = await this.cartRepo.findByUserId(userId);
    if (!cart || cart.items.length === 0) throw ApiError.badRequest('Cart is empty');

    const stockItems = await Promise.all(
      cart.items.map(async (item) => {
        const book = await this.bookRepo.findById(item.bookId);
        return { bookId: item.bookId, quantity: item.quantity, availableStock: book?.stockQuantity ?? 0 };
      }),
    );

    const validationResult = this.validationChain.validate({
      userId,
      items: stockItems,
      shippingStreet: dto.shippingStreet,
      shippingCity: dto.shippingCity,
      shippingState: dto.shippingState,
      shippingZipCode: dto.shippingZipCode,
      shippingCountry: dto.shippingCountry,
    });
    if (!validationResult.valid) throw ApiError.badRequest(validationResult.error!);

    await this.inventoryService.reserveStock(cart.items.map(i => ({ bookId: i.bookId, quantity: i.quantity })));

    const orderItems = await Promise.all(
      cart.items.map(async (item) => {
        const book = await this.bookRepo.findById(item.bookId);
        return { bookId: item.bookId, quantity: item.quantity, priceAtPurchase: book!.price };
      }),
    );
    const totalAmount = orderItems.reduce((sum, i) => sum + i.priceAtPurchase * i.quantity, 0);

    const orderData = new Order(
      '', userId, generateOrderNumber(), totalAmount, OrderStatus.PENDING,
      new Address(dto.shippingStreet, dto.shippingCity, dto.shippingState, dto.shippingZipCode, dto.shippingCountry),
      dto.paymentMethod, new Date(), new Date(), null,
    );

    const saved = await this.orderRepo.save(orderData, orderItems);
    await this.cartRepo.clearCart(cart.id);
    await this.notificationService.sendOrderPlaced(userId, saved.order.orderNumber);
    return saved;
  }

  async getOrderById(id: string, userId: string, isAdmin: boolean): Promise<OrderWithItems> {
    const order = await this.orderRepo.findById(id);
    if (!order) throw ApiError.notFound('Order not found');
    if (!isAdmin && order.order.userId !== userId) throw ApiError.forbidden();
    return order;
  }

  async getCustomerOrders(userId: string): Promise<OrderWithItems[]> {
    return this.orderRepo.findByUserId(userId);
  }

  async getAllOrders(filters: OrderFiltersDto): Promise<PaginatedResult<OrderWithItems>> {
    return this.orderRepo.findAll(filters);
  }

  async updateOrderStatus(orderId: string, status: OrderStatus): Promise<Order> {
    const existing = await this.orderRepo.findById(orderId);
    if (!existing) throw ApiError.notFound('Order not found');

    existing.order.updateStatus(status);
    const updated = await this.orderRepo.updateStatus(orderId, status);

    await this.notificationService.sendOrderStatusUpdate(existing.order.userId, existing.order.orderNumber, status);

    if (status === OrderStatus.CANCELLED) {
      await this.inventoryService.releaseStock(
        existing.items.map(i => ({ bookId: i.bookId, quantity: i.quantity })),
      );
    }
    return updated;
  }

  async cancelOrder(orderId: string, userId: string, isAdmin: boolean): Promise<Order> {
    const existing = await this.orderRepo.findById(orderId);
    if (!existing) throw ApiError.notFound('Order not found');
    if (!isAdmin && existing.order.userId !== userId) throw ApiError.forbidden();
    if (!existing.order.canBeCancelled()) throw ApiError.badRequest(`Order cannot be cancelled in status: ${existing.order.status}`);
    return this.updateOrderStatus(orderId, OrderStatus.CANCELLED);
  }

  private async enrichOrderItems(items: OrderItem[]): Promise<any[]> {
    return Promise.all(
      items.map(async (item) => {
        const book = await this.bookRepo.findById(item.bookId);
        return {
          id: item.id,
          orderId: item.orderId,
          bookId: item.bookId,
          quantity: item.quantity,
          price: item.priceAtPurchase,
          book: book
            ? { id: book.id, title: book.title, author: book.author, imageUrl: book.imageUrl ?? undefined }
            : null,
        };
      }),
    );
  }

  private serializeOrder(orderWithItems: OrderWithItems, enrichedItems: any[]): any {
    const { order } = orderWithItems;
    return {
      id: order.id,
      userId: order.userId,
      orderNumber: order.orderNumber,
      status: order.status,
      totalAmount: order.totalAmount,
      shippingStreet: order.shippingAddress.street,
      shippingCity: order.shippingAddress.city,
      shippingState: order.shippingAddress.state,
      shippingZipCode: order.shippingAddress.zipCode,
      shippingCountry: order.shippingAddress.country,
      paymentMethod: order.paymentMethod,
      createdAt: order.createdAt,
      updatedAt: order.updatedAt,
      deliveredAt: order.deliveredAt,
      items: enrichedItems,
    };
  }

  async getSerializedCustomerOrders(userId: string): Promise<{ orders: any[]; pagination: { page: number; limit: number; total: number; totalPages: number } }> {
    const raw = await this.orderRepo.findByUserId(userId);
    const orders = await Promise.all(
      raw.map(async (owi) => this.serializeOrder(owi, await this.enrichOrderItems(owi.items))),
    );
    return { orders, pagination: { page: 1, limit: orders.length, total: orders.length, totalPages: 1 } };
  }

  async getSerializedAllOrders(filters: OrderFiltersDto): Promise<{ orders: any[]; pagination: { page: number; limit: number; total: number; totalPages: number } }> {
    const result = await this.orderRepo.findAll(filters);
    const orders = await Promise.all(
      result.data.map(async (owi) => this.serializeOrder(owi, await this.enrichOrderItems(owi.items))),
    );
    return { orders, pagination: { page: result.page, limit: result.limit, total: result.total, totalPages: result.totalPages } };
  }

  async getSerializedOrderById(id: string, userId: string, isAdmin: boolean): Promise<any> {
    const owi = await this.getOrderById(id, userId, isAdmin);
    return this.serializeOrder(owi, await this.enrichOrderItems(owi.items));
  }
}
