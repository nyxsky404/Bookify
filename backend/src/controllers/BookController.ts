import { NextFunction, Request, Response } from 'express';
import { ProductService } from '../services/ProductService';
import { BookFiltersDtoSchema } from '../dto/book.dto';

export class BookController {
  constructor(private readonly productService: ProductService) {}

  getAll = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
      const filters = BookFiltersDtoSchema.parse(req.query);
      const result = await this.productService.getAllBooks(filters);
      res.json({ success: true, data: { books: result.data, pagination: { page: result.page, limit: result.limit, total: result.total, totalPages: result.totalPages } } });
    } catch (err) { next(err); }
  };

  getById = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
      const book = await this.productService.getBookById(req.params.id);
      res.json({ success: true, data: book });
    } catch (err) { next(err); }
  };

  search = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
      const query = String(req.query.q ?? '');
      const books = await this.productService.searchBooks(query);
      res.json({ success: true, data: { books, pagination: { page: 1, limit: books.length, total: books.length, totalPages: 1 } } });
    } catch (err) { next(err); }
  };

  create = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
      const book = await this.productService.createBook(req.body);
      res.status(201).json({ success: true, data: book });
    } catch (err) { next(err); }
  };

  update = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
      const book = await this.productService.updateBook(req.params.id, req.body);
      res.json({ success: true, data: book });
    } catch (err) { next(err); }
  };

  delete = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
      await this.productService.deleteBook(req.params.id);
      res.json({ success: true, message: 'Book deleted' });
    } catch (err) { next(err); }
  };
}
