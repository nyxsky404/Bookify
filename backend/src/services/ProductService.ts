import { Book } from '../domain/Book';
import { CreateBookDto, BookFiltersDto, UpdateBookDto } from '../dto/book.dto';
import { FullTextSearchStrategy } from '../patterns/strategy/SearchStrategies';
import { ISearchStrategy } from '../patterns/strategy/ISearchStrategy';
import { IBookRepository, PaginatedResult } from '../repositories/interfaces/IBookRepository';
import { ICategoryRepository } from '../repositories/interfaces/ICategoryRepository';
import { ApiError } from '../utils/apiError';

export class ProductService {
  private searchStrategy: ISearchStrategy = new FullTextSearchStrategy();

  constructor(
    private readonly bookRepo: IBookRepository,
    private readonly categoryRepo: ICategoryRepository,
  ) {}

  setSearchStrategy(strategy: ISearchStrategy): void {
    this.searchStrategy = strategy;
  }

  async getAllBooks(filters: BookFiltersDto): Promise<PaginatedResult<Book>> {
    return this.bookRepo.findAll(filters);
  }

  async getBookById(id: string): Promise<Book> {
    const book = await this.bookRepo.findById(id);
    if (!book) throw ApiError.notFound('Book not found');
    return book;
  }

  async searchBooks(query: string): Promise<Book[]> {
    return this.bookRepo.search(query);
  }

  async getBooksByCategory(categoryId: string): Promise<Book[]> {
    return this.bookRepo.findByCategory(categoryId);
  }

  async createBook(dto: CreateBookDto): Promise<Book> {
    if (dto.categoryId) {
      const cat = await this.categoryRepo.findById(dto.categoryId);
      if (!cat) throw ApiError.badRequest('Category not found');
    }
    return this.bookRepo.save({
      title: dto.title,
      author: dto.author,
      isbn: dto.isbn ?? null,
      description: dto.description ?? null,
      price: dto.price,
      stockQuantity: dto.stockQuantity,
      categoryId: dto.categoryId ?? null,
      imageUrl: dto.imageUrl ?? null,
      publishedYear: dto.publishedYear ?? null,
      publisher: dto.publisher ?? null,
    });
  }

  async updateBook(id: string, dto: UpdateBookDto): Promise<Book> {
    await this.getBookById(id);
    if (dto.categoryId) {
      const cat = await this.categoryRepo.findById(dto.categoryId);
      if (!cat) throw ApiError.badRequest('Category not found');
    }
    return this.bookRepo.update(id, dto);
  }

  async deleteBook(id: string): Promise<void> {
    await this.getBookById(id);
    await this.bookRepo.delete(id);
  }
}
