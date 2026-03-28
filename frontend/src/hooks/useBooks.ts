import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { bookService, Book, BooksResponse, BookFiltersDto, CreateBookDto, UpdateBookDto } from "@/lib/books";
import { toast } from "sonner";

export function useBooks(filters?: BookFiltersDto) {
  return useQuery({
    queryKey: ["books", filters],
    queryFn: () => bookService.getBooks(filters),
  });
}

export function useBook(id: string) {
  return useQuery({
    queryKey: ["book", id],
    queryFn: () => bookService.getBookById(id),
    enabled: !!id,
  });
}

export function useSearchBooks() {
  return useMutation({
    mutationFn: ({ query, filters }: { query: string; filters?: Omit<BookFiltersDto, "search"> }) =>
      bookService.searchBooks(query, filters),
    onError: (error: Error) => {
      toast.error(error.message || "Search failed");
    },
  });
}

export function useCreateBook() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (bookData: CreateBookDto) => bookService.createBook(bookData),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["books"] });
      toast.success("Book created successfully");
    },
    onError: (error: Error) => {
      toast.error(error.message || "Failed to create book");
    },
  });
}

export function useUpdateBook() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ id, bookData }: { id: string; bookData: UpdateBookDto }) =>
      bookService.updateBook(id, bookData),
    onSuccess: (_, { id }) => {
      queryClient.invalidateQueries({ queryKey: ["books"] });
      queryClient.invalidateQueries({ queryKey: ["book", id] });
      toast.success("Book updated successfully");
    },
    onError: (error: Error) => {
      toast.error(error.message || "Failed to update book");
    },
  });
}

export function useDeleteBook() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (id: string) => bookService.deleteBook(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["books"] });
      toast.success("Book deleted successfully");
    },
    onError: (error: Error) => {
      toast.error(error.message || "Failed to delete book");
    },
  });
}
