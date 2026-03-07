import { NextFunction, Request, Response } from 'express';
import { AnalyticsService } from '../services/AnalyticsService';
import { InventoryService } from '../services/InventoryService';

export class AnalyticsController {
  constructor(
    private readonly analyticsService: AnalyticsService,
    private readonly inventoryService: InventoryService,
  ) {}

  getDashboard = async (_req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
      const stats = await this.analyticsService.getDashboardStats();
      res.json({ success: true, data: stats });
    } catch (err) { next(err); }
  };

  getSalesReport = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
      const startDate = new Date(String(req.query.startDate));
      const endDate = new Date(String(req.query.endDate));
      const report = await this.analyticsService.generateSalesReport(startDate, endDate);
      res.json({ success: true, data: report });
    } catch (err) { next(err); }
  };

  getTopSellingBooks = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
      const limit = Number(req.query.limit ?? 10);
      const books = await this.analyticsService.getTopSellingBooks(limit);
      res.json({ success: true, data: books });
    } catch (err) { next(err); }
  };

  getLowStockBooks = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
      const threshold = Number(req.query.threshold ?? process.env.LOW_STOCK_THRESHOLD ?? 5);
      const books = await this.inventoryService.getLowStockBooks(threshold);
      res.json({ success: true, data: books });
    } catch (err) { next(err); }
  };

  updateStock = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
      const book = await this.inventoryService.updateStock(req.params.bookId, Number(req.body.quantity));
      res.json({ success: true, data: book });
    } catch (err) { next(err); }
  };
}
