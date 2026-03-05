import { and, desc, eq, gte, ilike, lte, or, sql } from 'drizzle-orm';
import { getDb } from '../../config/database';
import { orderItemsTable, ordersTable } from '../../db/schema';
import { Address } from '../../domain/Address';
import { Order } from '../../domain/Order';
import { OrderItem } from '../../domain/OrderItem';
import { OrderStatus } from '../../domain/enums';
import { OrderFiltersDto } from '../../dto/order.dto';
import { PaginatedResult } from '../interfaces/IBookRepository';
import { IOrderRepository, OrderStats, OrderWithItems } from '../interfaces/IOrderRepository';

function rowToOrder(row: typeof ordersTable.$inferSelect): Order {
  return new Order(
    row.id, row.userId, row.orderNumber,
    parseFloat(row.totalAmount),
    row.status as OrderStatus,
    new Address(row.shippingStreet, row.shippingCity, row.shippingState, row.shippingZipCode, row.shippingCountry),
    row.paymentMethod,
    row.createdAt, row.updatedAt, row.deliveredAt ?? null,
  );
}

function rowToOrderItem(row: typeof orderItemsTable.$inferSelect): OrderItem {
  return new OrderItem(row.id, row.orderId, row.bookId, row.quantity, parseFloat(row.priceAtPurchase));
}

export class DrizzleOrderRepository implements IOrderRepository {
  private get db() { return getDb(); }

  async findById(id: string): Promise<OrderWithItems | null> {
    const orders = await this.db.select().from(ordersTable).where(eq(ordersTable.id, id)).limit(1);
    if (!orders[0]) return null;
    const items = await this.db.select().from(orderItemsTable).where(eq(orderItemsTable.orderId, id));
    return { order: rowToOrder(orders[0]), items: items.map(rowToOrderItem) };
  }

  async findByUserId(userId: string): Promise<OrderWithItems[]> {
    const orders = await this.db.select().from(ordersTable)
      .where(eq(ordersTable.userId, userId)).orderBy(desc(ordersTable.createdAt));
    return Promise.all(orders.map(async (o: typeof ordersTable.$inferSelect) => {
      const items = await this.db.select().from(orderItemsTable).where(eq(orderItemsTable.orderId, o.id));
      return { order: rowToOrder(o), items: items.map(rowToOrderItem) };
    }));
  }

  async findAll(filters: OrderFiltersDto): Promise<PaginatedResult<OrderWithItems>> {
    const conditions = [];
    if (filters.status) conditions.push(eq(ordersTable.status, filters.status));
    if (filters.userId) conditions.push(eq(ordersTable.userId, filters.userId));
    if (filters.startDate) conditions.push(gte(ordersTable.createdAt, filters.startDate));
    if (filters.endDate) conditions.push(lte(ordersTable.createdAt, filters.endDate));
    if (filters.search) conditions.push(or(ilike(ordersTable.orderNumber, `%${filters.search}%`)));
    const where = conditions.length ? and(...conditions) : undefined;
    const page = filters.page ?? 1;
    const limit = filters.limit ?? 20;
    const offset = (page - 1) * limit;
    const [rows, countResult] = await Promise.all([
      this.db.select().from(ordersTable).where(where).orderBy(desc(ordersTable.createdAt)).limit(limit).offset(offset),
      this.db.select({ count: sql<number>`count(*)::int` }).from(ordersTable).where(where),
    ]);
    const total = countResult[0]?.count ?? 0;
    const data = await Promise.all(rows.map(async (o: typeof ordersTable.$inferSelect) => {
      const items = await this.db.select().from(orderItemsTable).where(eq(orderItemsTable.orderId, o.id));
      return { order: rowToOrder(o), items: items.map(rowToOrderItem) };
    }));
    return { data, total, page, limit, totalPages: Math.ceil(total / limit) };
  }

  async save(order: Omit<Order, 'id' | 'createdAt' | 'updatedAt'>, items: Array<Omit<OrderItem, 'id' | 'orderId'>>): Promise<OrderWithItems> {
    const orderRows = await this.db.insert(ordersTable).values({
      userId: order.userId,
      orderNumber: order.orderNumber,
      totalAmount: String(order.totalAmount),
      status: order.status,
      shippingStreet: order.shippingAddress.street,
      shippingCity: order.shippingAddress.city,
      shippingState: order.shippingAddress.state,
      shippingZipCode: order.shippingAddress.zipCode,
      shippingCountry: order.shippingAddress.country,
      paymentMethod: order.paymentMethod,
    }).returning();
    const savedOrder = orderRows[0];
    const itemRows = await this.db.insert(orderItemsTable).values(
      items.map(i => ({ orderId: savedOrder.id, bookId: i.bookId, quantity: i.quantity, priceAtPurchase: String(i.priceAtPurchase) }))
    ).returning();
    return { order: rowToOrder(savedOrder), items: itemRows.map(rowToOrderItem) };
  }

  async updateStatus(id: string, status: OrderStatus): Promise<Order> {
    const updateData: Partial<typeof ordersTable.$inferInsert> = { status, updatedAt: new Date() };
    if (status === OrderStatus.DELIVERED) updateData.deliveredAt = new Date();
    const rows = await this.db.update(ordersTable).set(updateData).where(eq(ordersTable.id, id)).returning();
    if (!rows[0]) throw new Error('Order not found');
    return rowToOrder(rows[0]);
  }

  async getStats(): Promise<OrderStats> {
    const result = await this.db.select({
      totalRevenue: sql<number>`coalesce(sum(${ordersTable.totalAmount}::numeric),0)::float`,
      totalOrders: sql<number>`count(*)::int`,
      pendingOrders: sql<number>`count(*) filter (where ${ordersTable.status} = 'PENDING')::int`,
    }).from(ordersTable);
    const soldResult = await this.db.select({ totalBooksSold: sql<number>`coalesce(sum(${orderItemsTable.quantity}),0)::int` }).from(orderItemsTable);
    return {
      totalRevenue: result[0]?.totalRevenue ?? 0,
      totalOrders: result[0]?.totalOrders ?? 0,
      totalBooksSold: soldResult[0]?.totalBooksSold ?? 0,
      pendingOrders: result[0]?.pendingOrders ?? 0,
    };
  }

  async getRevenueByPeriod(startDate: Date, endDate: Date): Promise<number> {
    const result = await this.db.select({
      revenue: sql<number>`coalesce(sum(${ordersTable.totalAmount}::numeric),0)::float`,
    }).from(ordersTable).where(and(gte(ordersTable.createdAt, startDate), lte(ordersTable.createdAt, endDate)));
    return result[0]?.revenue ?? 0;
  }
}
