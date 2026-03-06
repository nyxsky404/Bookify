import { Book } from '../domain/Book';
import { IBookRepository } from '../repositories/interfaces/IBookRepository';
import { ApiError } from '../utils/apiError';

export interface StockItem {
  bookId: string;
  quantity: number;
}

export class InventoryService {
  constructor(private readonly bookRepo: IBookRepository) {}

  async validateStock(items: StockItem[]): Promise<void> {
    for (const item of items) {
      const book = await this.bookRepo.findById(item.bookId);
      if (!book) throw ApiError.badRequest(`Book ${item.bookId} not found`);
      if (book.stockQuantity < item.quantity) {
        throw ApiError.badRequest(`Insufficient stock for "${book.title}". Available: ${book.stockQuantity}`);
      }
    }
  }

  async reserveStock(items: StockItem[]): Promise<void> {
    for (const item of items) {
      const book = await this.bookRepo.findById(item.bookId);
      if (!book) throw ApiError.badRequest(`Book ${item.bookId} not found`);
      book.reduceStock(item.quantity);
      await this.bookRepo.update(item.bookId, { stockQuantity: book.stockQuantity });
    }
  }

  async releaseStock(items: StockItem[]): Promise<void> {
    for (const item of items) {
      const book = await this.bookRepo.findById(item.bookId);
      if (!book) continue;
      book.increaseStock(item.quantity);
      await this.bookRepo.update(item.bookId, { stockQuantity: book.stockQuantity });
    }
  }

  async updateStock(bookId: string, quantity: number): Promise<Book> {
    const book = await this.bookRepo.findById(bookId);
    if (!book) throw ApiError.notFound('Book not found');
    return this.bookRepo.update(bookId, { stockQuantity: quantity });
  }

  async getLowStockBooks(threshold: number): Promise<Book[]> {
    return this.bookRepo.findLowStock(threshold);
  }
}
