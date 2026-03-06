import { Book } from '../domain/Book';
import { IBookRepository } from '../repositories/interfaces/IBookRepository';
import { IOrderRepository, OrderStats } from '../repositories/interfaces/IOrderRepository';

export interface SalesReport {
  startDate: Date;
  endDate: Date;
  totalRevenue: number;
  totalOrders: number;
  topSellingBooks: Array<Book & { totalSold: number }>;
  generatedAt: Date;
}

export class AnalyticsService {
  constructor(
    private readonly orderRepo: IOrderRepository,
    private readonly bookRepo: IBookRepository,
  ) {}

  async getDashboardStats(): Promise<OrderStats> {
    return this.orderRepo.getStats();
  }

  async generateSalesReport(startDate: Date, endDate: Date): Promise<SalesReport> {
    const [revenue, topBooks] = await Promise.all([
      this.orderRepo.getRevenueByPeriod(startDate, endDate),
      this.bookRepo.findTopSelling(10),
    ]);
    const stats = await this.orderRepo.getStats();
    return {
      startDate,
      endDate,
      totalRevenue: revenue,
      totalOrders: stats.totalOrders,
      topSellingBooks: topBooks,
      generatedAt: new Date(),
    };
  }

  async getTopSellingBooks(limit: number): Promise<Array<Book & { totalSold: number }>> {
    return this.bookRepo.findTopSelling(limit);
  }

  async getRevenueByPeriod(startDate: Date, endDate: Date): Promise<number> {
    return this.orderRepo.getRevenueByPeriod(startDate, endDate);
  }
}
