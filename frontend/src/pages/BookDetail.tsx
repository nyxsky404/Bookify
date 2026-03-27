import { useParams } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { useBook } from "@/hooks/useBooks";
import { useAddToCart } from "@/hooks/useCart";
import { useAuth } from "@/hooks/useAuth";
import { toast } from "sonner";
import { ArrowLeft, ShoppingCart, Heart } from "lucide-react";
import { Link } from "react-router-dom";
import StickyHeader from "@/components/StickyHeader";
import Footer from "@/components/Footer";

const BookDetail = () => {
  const { id } = useParams<{ id: string }>();
  const { data: book, isLoading, error } = useBook(id!);
  const { isAuthenticated } = useAuth();
  const { mutate: addToCart } = useAddToCart();

  const handleAddToCart = () => {
    if (!isAuthenticated) {
      toast.error("Please sign in to add items to cart");
      return;
    }

    if (!book || book.stockQuantity === 0) {
      toast.error("This book is out of stock");
      return;
    }

    addToCart({ bookId: book.id, quantity: 1 });
  };

  const handleAddToWishlist = () => {
    toast.info("Wishlist feature coming soon!");
  };

  if (isLoading) {
    return (
      <div className="min-h-screen flex flex-col bg-background">
        <StickyHeader />
        <div className="flex-1 flex items-center justify-center">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
        </div>
        <Footer />
      </div>
    );
  }

  if (error || !book) {
    return (
      <div className="min-h-screen flex flex-col bg-background">
        <StickyHeader />
        <div className="flex-1 section-padding py-10">
          <div className="max-w-4xl mx-auto text-center py-16">
            <h1 className="text-2xl font-semibold mb-2">Book not found</h1>
            <p className="text-muted-foreground mb-6">The book you're looking for doesn't exist.</p>
            <Button asChild>
              <Link to="/shop">
                <ArrowLeft className="w-4 h-4 mr-2" />
                Back to Shop
              </Link>
            </Button>
          </div>
        </div>
        <Footer />
      </div>
    );
  }

  return (
    <div className="min-h-screen flex flex-col bg-background">
      <StickyHeader />
      <div className="flex-1 section-padding py-10">
        <div className="max-w-4xl mx-auto">
          <Button variant="ghost" asChild className="mb-6">
            <Link to="/shop">
              <ArrowLeft className="w-4 h-4 mr-2" />
              Back to Shop
            </Link>
          </Button>

        <div className="grid gap-8 lg:grid-cols-2">
          <div>
            <Card>
              <CardContent className="p-8">
                <div className="aspect-[3/4] bg-secondary rounded-lg overflow-hidden">
                  {book.imageUrl ? (
                    <img
                      src={book.imageUrl}
                      alt={book.title}
                      className="w-full h-full object-cover"
                    />
                  ) : (
                    <div className="w-full h-full flex items-center justify-center text-muted-foreground">
                      <div className="text-center">
                        <div className="text-6xl mb-4">Book</div>
                        <div>No image available</div>
                      </div>
                    </div>
                  )}
                </div>
              </CardContent>
            </Card>
          </div>

          <div className="space-y-6">
            <div>
              {book.category && (
                <Badge variant="secondary" className="mb-2">
                  {book.category.name}
                </Badge>
              )}
              <h1 className="text-3xl font-bold mb-2">{book.title}</h1>
              <p className="text-xl text-muted-foreground mb-4">by {book.author}</p>
              
              <div className="flex items-center gap-4 mb-4">
                <span className="text-3xl font-bold">${book.price.toFixed(2)}</span>
                {book.stockQuantity > 0 ? (
                  <Badge variant="default">In Stock ({book.stockQuantity} available)</Badge>
                ) : (
                  <Badge variant="destructive">Out of Stock</Badge>
                )}
              </div>

              {book.publishedYear && (
                <p className="text-sm text-muted-foreground">
                  Published: {book.publishedYear}
                  {book.publisher && ` by ${book.publisher}`}
                </p>
              )}
              {book.isbn && (
                <p className="text-sm text-muted-foreground">ISBN: {book.isbn}</p>
              )}
            </div>

            <Separator />

            <div>
              <h3 className="text-lg font-semibold mb-2">Description</h3>
              <p className="text-muted-foreground leading-relaxed">
                {book.description || "No description available for this book."}
              </p>
            </div>

            <Separator />

            <div className="flex gap-3">
              <Button 
                size="lg" 
                onClick={handleAddToCart}
                disabled={book.stockQuantity === 0}
                className="flex-1"
              >
                <ShoppingCart className="w-4 h-4 mr-2" />
                Add to Cart
              </Button>
              
              <Button 
                variant="outline" 
                size="lg"
                onClick={handleAddToWishlist}
              >
                <Heart className="w-4 h-4" />
              </Button>
            </div>

            {book.stockQuantity <= 5 && book.stockQuantity > 0 && (
              <div className="text-sm text-amber-600 bg-amber-50 p-3 rounded-lg">
                Only {book.stockQuantity} left in stock - order soon!
              </div>
            )}
          </div>
        </div>
        </div>
      </div>
      <Footer />
    </div>
  );
};

export default BookDetail;
