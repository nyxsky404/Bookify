import { NextFunction, Response } from 'express';
import { CartService } from '../services/CartService';
import { AuthRequest } from '../middlewares/authenticate';

export class CartController {
  constructor(private readonly cartService: CartService) {}

  getCart = async (req: AuthRequest, res: Response, next: NextFunction): Promise<void> => {
    try {
      const cart = await this.cartService.getSerializedCart(req.user!.userId);
      res.json({ success: true, data: cart });
    } catch (err) { next(err); }
  };

  addItem = async (req: AuthRequest, res: Response, next: NextFunction): Promise<void> => {
    try {
      const { bookId, quantity } = req.body;
      await this.cartService.addToCart(req.user!.userId, bookId, quantity);
      const cart = await this.cartService.getSerializedCart(req.user!.userId);
      res.status(201).json({ success: true, data: cart });
    } catch (err) { next(err); }
  };

  updateItem = async (req: AuthRequest, res: Response, next: NextFunction): Promise<void> => {
    try {
      await this.cartService.updateCartItem(req.user!.userId, req.params.itemId, req.body.quantity);
      const cart = await this.cartService.getSerializedCart(req.user!.userId);
      res.json({ success: true, data: cart });
    } catch (err) { next(err); }
  };

  removeItem = async (req: AuthRequest, res: Response, next: NextFunction): Promise<void> => {
    try {
      await this.cartService.removeCartItem(req.user!.userId, req.params.itemId);
      const cart = await this.cartService.getSerializedCart(req.user!.userId);
      res.json({ success: true, data: cart });
    } catch (err) { next(err); }
  };

  clearCart = async (req: AuthRequest, res: Response, next: NextFunction): Promise<void> => {
    try {
      await this.cartService.clearCart(req.user!.userId);
      res.json({ success: true, message: 'Cart cleared' });
    } catch (err) { next(err); }
  };
}
