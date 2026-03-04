import { Book } from '../../domain/Book';
import { BookFiltersDto } from '../../dto/book.dto';

export interface CreateBookData {
  title: string;
  author: string;
  isbn: string | null;
  description: string | null;
  price: number;
  stockQuantity: number;
  categoryId: string | null;
  imageUrl: string | null;
  publishedYear: number | null;
  publisher: string | null;
}

export interface PaginatedResult<T> {
  data: T[];
  total: number;
  page: number;
  limit: number;
  totalPages: number;
}

export interface IBookRepository {
  findById(id: string): Promise<Book | null>;
  findAll(filters: BookFiltersDto): Promise<PaginatedResult<Book>>;
  findByCategory(categoryId: string): Promise<Book[]>;
  search(query: string): Promise<Book[]>;
  save(data: CreateBookData): Promise<Book>;
  update(id: string, data: Partial<Omit<Book, 'id' | 'createdAt'>>): Promise<Book>;
  delete(id: string): Promise<void>;
  findLowStock(threshold: number): Promise<Book[]>;
  findTopSelling(limit: number): Promise<Array<Book & { totalSold: number }>>;
}
