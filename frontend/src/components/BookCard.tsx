import { useState } from "react";
import { Heart, ShoppingBag, Check } from "lucide-react";
import { useAddToCart } from "@/hooks/useCart";
import { useAuth } from "@/hooks/useAuth";
import { useWishlist } from "@/hooks/useWishlist";
import { toast } from "sonner";

interface BookCardProps {
  id: string;
  image?: string;
  title: string;
  author: string;
  price: string;
  priceRaw?: number;
  stockQuantity: number;
}

const BookCard = ({ id, image, title, author, price, priceRaw, stockQuantity }: BookCardProps) => {
  const { isAuthenticated } = useAuth();
  const { mutate: addToCart } = useAddToCart();
  const { items, toggle } = useWishlist();
  const [isAdded, setIsAdded] = useState(false);

  const isWishlisted = items.some((b) => b.id === id);

  const handleAddToCart = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();

    if (!isAuthenticated) {
      toast.error("Please sign in to add items to cart");
      return;
    }
    if (stockQuantity === 0) {
      toast.error("This book is out of stock");
      return;
    }

    addToCart(
      { bookId: id, quantity: 1 },
      {
        onSuccess: () => {
          setIsAdded(true);
          setTimeout(() => setIsAdded(false), 1500);
        },
      }
    );
  };

  const handleToggleWishlist = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();

    const numPrice = priceRaw ?? parseFloat(price.replace(/[^0-9.]/g, ""));
    const wasWishlisted = isWishlisted;

    toggle({ id, title, author, price: numPrice, imageUrl: image });

    if (wasWishlisted) {
      toast("Removed from wishlist");
    } else {
      toast.success("Added to wishlist!", { icon: "❤️" });
    }
  };

  return (
    <div className="group">
      <div className="relative bg-secondary rounded-2xl overflow-hidden aspect-[3/4] mb-3">
        {image ? (
          <img
            src={image}
            alt={title}
            loading="lazy"
            width={544}
            height={768}
            className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
          />
        ) : (
          <div className="w-full h-full flex items-center justify-center bg-muted">
            <div className="text-center text-muted-foreground">
              <div className="text-4xl mb-2">📖</div>
              <div className="text-sm">No image</div>
            </div>
          </div>
        )}

        <button
          onClick={handleToggleWishlist}
          className={`absolute top-3 right-3 w-9 h-9 rounded-full backdrop-blur-sm flex items-center justify-center transition-all duration-200 hover:scale-110 ${
            isWishlisted ? "bg-red-50/90" : "bg-background/80 hover:bg-background"
          }`}
        >
          <Heart
            className={`w-4 h-4 transition-all duration-200 ${
              isWishlisted ? "fill-red-500 text-red-500" : "text-foreground"
            }`}
          />
        </button>

        <button
          onClick={handleAddToCart}
          disabled={stockQuantity === 0}
          className={`absolute top-3 left-3 w-9 h-9 rounded-full backdrop-blur-sm flex items-center justify-center transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed ${
            isAdded
              ? "bg-green-500 scale-110"
              : "bg-background/80 hover:bg-background hover:scale-110"
          }`}
        >
          {isAdded ? (
            <Check className="w-4 h-4 text-white animate-in zoom-in-50 duration-150" />
          ) : (
            <ShoppingBag className="w-4 h-4 text-foreground" />
          )}
        </button>

        {stockQuantity === 0 && (
          <div className="absolute bottom-3 left-3 right-3 bg-destructive text-destructive-foreground text-xs py-1 px-2 rounded text-center">
            Out of Stock
          </div>
        )}
      </div>
      <div className="space-y-1">
        <p className="text-xs font-body font-medium tracking-widest uppercase text-muted-foreground line-clamp-1">{author}</p>
        <h4 className="font-display font-semibold text-foreground text-base line-clamp-2 leading-snug">{title}</h4>
        <p className="font-body font-medium text-foreground text-sm">{price}</p>
      </div>
    </div>
  );
};

export default BookCard;
