import { NextFunction, Request, Response } from 'express';
import { OrderStatus } from '../domain/enums';
import { AuthRequest } from '../middlewares/authenticate';
import { OrderService } from '../services/OrderService';
import { OrderFiltersDtoSchema } from '../dto/order.dto';

export class OrderController {
  constructor(private readonly orderService: OrderService) {}

  createOrder = async (req: AuthRequest, res: Response, next: NextFunction): Promise<void> => {
    try {
      await this.orderService.createOrder(req.user!.userId, req.body);
      const result = await this.orderService.getSerializedCustomerOrders(req.user!.userId);
      const latest = result.orders[0];
      res.status(201).json({ success: true, data: latest });
    } catch (err) { next(err); }
  };

  getMyOrders = async (req: AuthRequest, res: Response, next: NextFunction): Promise<void> => {
    try {
      const result = await this.orderService.getSerializedCustomerOrders(req.user!.userId);
      res.json({ success: true, data: result });
    } catch (err) { next(err); }
  };

  getOrderById = async (req: AuthRequest, res: Response, next: NextFunction): Promise<void> => {
    try {
      const isAdmin = req.user!.role === 'ADMIN';
      const order = await this.orderService.getSerializedOrderById(req.params.id, req.user!.userId, isAdmin);
      res.json({ success: true, data: order });
    } catch (err) { next(err); }
  };

  getAllOrders = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
      const filters = OrderFiltersDtoSchema.parse(req.query);
      const result = await this.orderService.getSerializedAllOrders(filters);
      res.json({ success: true, data: result });
    } catch (err) { next(err); }
  };

  updateStatus = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
      const order = await this.orderService.updateOrderStatus(req.params.id, req.body.status as OrderStatus);
      res.json({ success: true, data: order });
    } catch (err) { next(err); }
  };

  cancelOrder = async (req: AuthRequest, res: Response, next: NextFunction): Promise<void> => {
    try {
      const isAdmin = req.user!.role === 'ADMIN';
      const order = await this.orderService.cancelOrder(req.params.id, req.user!.userId, isAdmin);
      res.json({ success: true, data: order });
    } catch (err) { next(err); }
  };
}
