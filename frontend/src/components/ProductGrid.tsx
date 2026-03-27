import { useState } from "react";
import { Link, useSearchParams } from "react-router-dom";
import BookCard from "./BookCard";
import { useBooks } from "@/hooks/useBooks";
import { useCategories } from "@/hooks/useCategories";
import { BookFiltersDto } from "@/lib/books";

const tabs = ["All Books", "New Releases", "Bestsellers"];

const ProductGrid = () => {
  const [activeTab, setActiveTab] = useState("All Books");
  const [searchParams] = useSearchParams();
  const { data: categories } = useCategories();

  const categorySlug = searchParams.get("category") || "";
  const searchQuery = searchParams.get("search") || "";

  const categoryId = categories?.find((c) => c.slug === categorySlug)?.id;

  let filters: BookFiltersDto = { page: 1, limit: 12 };

  if (categoryId) filters.categoryId = categoryId;
  if (searchQuery) filters.search = searchQuery;

  if (activeTab === "New Releases") {
    filters.sortBy = "newest";
  } else if (activeTab === "Bestsellers") {
    filters.sortBy = "title";
  }

  const { data: booksData, isLoading, error } = useBooks(filters);

  if (isLoading) {
    return (
      <section className="section-padding py-16">
        <div className="flex justify-center items-center min-h-[200px]">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
        </div>
      </section>
    );
  }

  if (error) {
    return (
      <section className="section-padding py-16">
        <div className="text-center text-destructive">
          Failed to load books. Please try again later.
        </div>
      </section>
    );
  }

  const books = booksData?.books || [];

  const activeLabel = searchQuery
    ? `Results for "${searchQuery}"`
    : categorySlug
    ? categories?.find((c) => c.slug === categorySlug)?.name || categorySlug
    : null;

  return (
    <section id="product-grid" className="section-padding py-16">
      {activeLabel && (
        <p className="text-center text-muted-foreground text-sm mb-4">
          Showing: <span className="font-medium text-foreground">{activeLabel}</span>
        </p>
      )}
      <div className="flex items-center justify-center gap-3 mb-10">
        {tabs.map((tab) => (
          <button
            key={tab}
            onClick={() => setActiveTab(tab)}
            className={`pill-btn ${activeTab === tab ? "pill-btn-active" : ""}`}
          >
            {tab}
          </button>
        ))}
      </div>

      {books.length === 0 ? (
        <div className="text-center text-muted-foreground py-8">
          No books found.
        </div>
      ) : (
        <div className="grid grid-cols-2 md:grid-cols-3 gap-6">
          {books.map((book) => (
            <Link key={book.id} to={`/books/${book.id}`}>
              <BookCard
                id={book.id}
                title={book.title}
                author={book.author}
                price={`$${book.price.toFixed(2)}`}
                image={book.imageUrl}
                stockQuantity={book.stockQuantity}
              />
            </Link>
          ))}
        </div>
      )}
    </section>
  );
};

export default ProductGrid;
