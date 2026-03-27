import { useState, useEffect } from "react";
import { Link, useSearchParams } from "react-router-dom";
import { Search, SlidersHorizontal, X } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import BookCard from "@/components/BookCard";
import StickyHeader from "@/components/StickyHeader";
import Footer from "@/components/Footer";
import { useBooks } from "@/hooks/useBooks";
import { useCategories } from "@/hooks/useCategories";
import { BookFiltersDto } from "@/lib/books";

const SORT_OPTIONS = [
  { value: "newest", label: "Newest" },
  { value: "price_asc", label: "Price: Low to High" },
  { value: "price_desc", label: "Price: High to Low" },
  { value: "title", label: "A – Z" },
];

const LIMIT = 12;

const Shop = () => {
  const [searchParams, setSearchParams] = useSearchParams();
  const [localSearch, setLocalSearch] = useState(searchParams.get("search") || "");

  const categorySlug = searchParams.get("category") || "";
  const searchQuery = searchParams.get("search") || "";
  const sortBy = (searchParams.get("sort") || "newest") as BookFiltersDto["sortBy"];
  const page = parseInt(searchParams.get("page") || "1", 10);

  const { data: categories } = useCategories();
  const categoryId = categories?.find((c) => c.slug === categorySlug)?.id;

  const filters: BookFiltersDto = { page, limit: LIMIT, sortBy };
  if (categoryId) filters.categoryId = categoryId;
  if (searchQuery) filters.search = searchQuery;

  const { data: booksData, isLoading } = useBooks(filters);

  const books = booksData?.books || [];
  const pagination = booksData?.pagination;

  useEffect(() => {
    setLocalSearch(searchParams.get("search") || "");
  }, [searchParams]);

  const updateParam = (key: string, value: string | null) => {
    const next = new URLSearchParams(searchParams);
    if (value) {
      next.set(key, value);
    } else {
      next.delete(key);
    }
    next.delete("page");
    setSearchParams(next);
  };

  const handleSearchSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    updateParam("search", localSearch.trim() || null);
  };

  const handleCategoryClick = (slug: string) => {
    updateParam("category", slug === categorySlug ? null : slug);
  };

  const handleSort = (value: string) => {
    const next = new URLSearchParams(searchParams);
    next.set("sort", value);
    next.delete("page");
    setSearchParams(next);
  };

  const handlePage = (newPage: number) => {
    const next = new URLSearchParams(searchParams);
    next.set("page", String(newPage));
    setSearchParams(next);
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  const activeCategoryName = categories?.find((c) => c.slug === categorySlug)?.name;
  const hasActiveFilters = !!categorySlug || !!searchQuery;

  return (
    <div className="min-h-screen bg-background">
      <StickyHeader />

      <main className="section-padding py-10">
        {/* Page heading */}
        <div className="mb-8">
          <h1 className="font-display text-3xl font-bold tracking-tight mb-1">
            {activeCategoryName || (searchQuery ? `Results for "${searchQuery}"` : "All Books")}
          </h1>
          {pagination && (
            <p className="text-sm text-muted-foreground">
              {pagination.total} book{pagination.total !== 1 ? "s" : ""} found
            </p>
          )}
        </div>

        {/* Filters bar */}
        <div className="flex flex-col gap-4 mb-8">
          {/* Search + Sort row */}
          <div className="flex items-center gap-3">
            <form onSubmit={handleSearchSubmit} className="flex items-center gap-2 flex-1 max-w-sm">
              <div className="relative flex-1">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground pointer-events-none" />
                <Input
                  value={localSearch}
                  onChange={(e) => setLocalSearch(e.target.value)}
                  placeholder="Search books, authors..."
                  className="pl-9"
                />
              </div>
              <Button type="submit" size="sm" variant="outline">
                Search
              </Button>
            </form>

            <div className="flex items-center gap-2 ml-auto">
              <SlidersHorizontal className="w-4 h-4 text-muted-foreground" />
              <Select value={sortBy || "newest"} onValueChange={handleSort}>
                <SelectTrigger className="w-44">
                  <SelectValue placeholder="Sort by" />
                </SelectTrigger>
                <SelectContent>
                  {SORT_OPTIONS.map((opt) => (
                    <SelectItem key={opt.value} value={opt.value}>
                      {opt.label}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </div>

          {/* Category pills */}
          <div className="flex flex-wrap gap-2">
            <button
              onClick={() => updateParam("category", null)}
              className={`pill-btn ${!categorySlug ? "pill-btn-active" : ""}`}
            >
              All
            </button>
            {categories?.map((cat) => (
              <button
                key={cat.id}
                onClick={() => handleCategoryClick(cat.slug)}
                className={`pill-btn ${categorySlug === cat.slug ? "pill-btn-active" : ""}`}
              >
                {cat.name}
              </button>
            ))}
          </div>

          {/* Active filter chips */}
          {hasActiveFilters && (
            <div className="flex flex-wrap items-center gap-2">
              <span className="text-xs text-muted-foreground">Active filters:</span>
              {activeCategoryName && (
                <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-xs bg-foreground text-background">
                  {activeCategoryName}
                  <button onClick={() => updateParam("category", null)}>
                    <X className="w-3 h-3" />
                  </button>
                </span>
              )}
              {searchQuery && (
                <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-xs bg-foreground text-background">
                  "{searchQuery}"
                  <button onClick={() => { setLocalSearch(""); updateParam("search", null); }}>
                    <X className="w-3 h-3" />
                  </button>
                </span>
              )}
              <button
                onClick={() => { setLocalSearch(""); setSearchParams({}); }}
                className="text-xs text-muted-foreground hover:text-foreground underline"
              >
                Clear all
              </button>
            </div>
          )}
        </div>

        {/* Book grid */}
        {isLoading ? (
          <div className="flex justify-center items-center min-h-[300px]">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary" />
          </div>
        ) : books.length === 0 ? (
          <div className="text-center py-20">
            <p className="text-muted-foreground text-lg mb-4">No books found.</p>
            <Button variant="outline" onClick={() => { setLocalSearch(""); setSearchParams({}); }}>
              Clear filters
            </Button>
          </div>
        ) : (
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 gap-5">
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

        {/* Pagination */}
        {pagination && pagination.totalPages > 1 && (
          <div className="flex justify-center items-center gap-2 mt-12">
            <Button
              variant="outline"
              size="sm"
              disabled={page <= 1}
              onClick={() => handlePage(page - 1)}
            >
              Previous
            </Button>
            <div className="flex items-center gap-1">
              {Array.from({ length: pagination.totalPages }, (_, i) => i + 1)
                .filter((p) => p === 1 || p === pagination.totalPages || Math.abs(p - page) <= 1)
                .reduce<(number | "…")[]>((acc, p, idx, arr) => {
                  if (idx > 0 && typeof arr[idx - 1] === "number" && (p as number) - (arr[idx - 1] as number) > 1) acc.push("…");
                  acc.push(p);
                  return acc;
                }, [])
                .map((p, idx) =>
                  p === "…" ? (
                    <span key={`ellipsis-${idx}`} className="px-1 text-muted-foreground text-sm">…</span>
                  ) : (
                    <Button
                      key={p}
                      variant={p === page ? "default" : "outline"}
                      size="sm"
                      className="w-9"
                      onClick={() => handlePage(p as number)}
                    >
                      {p}
                    </Button>
                  )
                )}
            </div>
            <Button
              variant="outline"
              size="sm"
              disabled={page >= pagination.totalPages}
              onClick={() => handlePage(page + 1)}
            >
              Next
            </Button>
          </div>
        )}
      </main>
      <Footer />
    </div>
  );
};

export default Shop;
