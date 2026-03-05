import { Book } from '../../domain/Book';
import { ISearchStrategy } from './ISearchStrategy';

export class TitleSearchStrategy implements ISearchStrategy {
  search(query: string, books: Book[]): Book[] {
    const q = query.toLowerCase();
    return books.filter(b => b.title.toLowerCase().includes(q));
  }
}

export class AuthorSearchStrategy implements ISearchStrategy {
  search(query: string, books: Book[]): Book[] {
    const q = query.toLowerCase();
    return books.filter(b => b.author.toLowerCase().includes(q));
  }
}

export class FullTextSearchStrategy implements ISearchStrategy {
  search(query: string, books: Book[]): Book[] {
    const q = query.toLowerCase();
    return books.filter(b =>
      b.title.toLowerCase().includes(q) ||
      b.author.toLowerCase().includes(q) ||
      (b.isbn ?? '').toLowerCase().includes(q) ||
      (b.description ?? '').toLowerCase().includes(q),
    );
  }
}
