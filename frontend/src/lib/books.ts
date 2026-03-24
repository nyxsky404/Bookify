import { apiClient, BookFiltersDto, CreateBookDto, UpdateBookDto } from "./api";

export interface Book {
  id: string;
  title: string;
  author: string;
  isbn?: string;
  description?: string;
  price: number;
  stockQuantity: number;
  categoryId?: string;
  imageUrl?: string;
  publishedYear?: number;
  publisher?: string;
  createdAt: string;
  updatedAt: string;
  category?: {
    id: string;
    name: string;
    slug: string;
  };
}

export interface BooksResponse {
  books: Book[];
  pagination: {
    page: number;
    limit: number;
    total: number;
    totalPages: number;
  };
}

export class BookService {
  async getBooks(filters?: BookFiltersDto): Promise<BooksResponse> {
    return apiClient.get<BooksResponse>("/books", filters);
  }

  async getBookById(id: string): Promise<Book> {
    return apiClient.get<Book>(`/books/${id}`);
  }

  async searchBooks(query: string, filters?: Omit<BookFiltersDto, "search">): Promise<BooksResponse> {
    return apiClient.get<BooksResponse>("/books/search", { q: query, ...filters });
  }

  async createBook(bookData: CreateBookDto): Promise<Book> {
    return apiClient.post<Book>("/books", bookData);
  }

  async updateBook(id: string, bookData: UpdateBookDto): Promise<Book> {
    return apiClient.patch<Book>(`/books/${id}`, bookData);
  }

  async deleteBook(id: string): Promise<void> {
    return apiClient.delete(`/books/${id}`);
  }
}

export type { BookFiltersDto, CreateBookDto, UpdateBookDto };
export const bookService = new BookService();
