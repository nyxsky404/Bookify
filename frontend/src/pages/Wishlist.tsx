import { Link } from "react-router-dom";
import { Heart, Trash2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import StickyHeader from "@/components/StickyHeader";
import Footer from "@/components/Footer";
import BookCard from "@/components/BookCard";
import { useWishlist } from "@/hooks/useWishlist";

const Wishlist = () => {
  const { items, remove } = useWishlist();

  return (
    <div className="min-h-screen flex flex-col bg-background">
      <StickyHeader />
      <div className="flex-1 section-padding py-10">
        <div className="max-w-6xl mx-auto">
          <div className="flex items-end justify-between mb-8">
            <div>
              <h1 className="font-display text-3xl font-bold tracking-tight mb-1">My Wishlist</h1>
              <p className="text-sm text-muted-foreground">
                {items.length} saved item{items.length !== 1 ? "s" : ""}
              </p>
            </div>
            {items.length > 0 && (
              <Button
                variant="outline"
                size="sm"
                onClick={() => items.forEach((b) => remove(b.id))}
                className="gap-2"
              >
                <Trash2 className="w-4 h-4" />
                Clear all
              </Button>
            )}
          </div>

          {items.length === 0 ? (
            <div className="text-center py-24">
              <Heart className="w-16 h-16 mx-auto text-muted-foreground mb-4" />
              <h2 className="text-xl font-semibold mb-2">Your wishlist is empty</h2>
              <p className="text-muted-foreground mb-6">
                Tap the heart on any book to save it for later.
              </p>
              <Button asChild>
                <Link to="/shop">Browse Books</Link>
              </Button>
            </div>
          ) : (
            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 gap-5">
              {items.map((book) => (
                <Link key={book.id} to={`/books/${book.id}`}>
                  <BookCard
                    id={book.id}
                    title={book.title}
                    author={book.author}
                    price={`$${book.price.toFixed(2)}`}
                    priceRaw={book.price}
                    image={book.imageUrl}
                    stockQuantity={99}
                  />
                </Link>
              ))}
            </div>
          )}
        </div>
      </div>
      <Footer />
    </div>
  );
};

export default Wishlist;
