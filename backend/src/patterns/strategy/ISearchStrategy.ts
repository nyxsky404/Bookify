import { Book } from '../../domain/Book';

export interface ISearchStrategy {
  search(query: string, books: Book[]): Book[];
}
