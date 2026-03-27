import { Search, Bell, ShoppingBag, Heart, User, BookOpen, LogOut, X } from "lucide-react";
import { useState } from "react";
import { Link, useNavigate, useSearchParams } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { useAuth } from "@/hooks/useAuth";
import { useCart } from "@/hooks/useCart";
import { useCategories } from "@/hooks/useCategories";
import { useNotifications, useMarkAllNotificationsRead } from "@/hooks/useNotifications";
import { useWishlist } from "@/hooks/useWishlist";

const StickyHeader = () => {
  const [searchOpen, setSearchOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const navigate = useNavigate();
  const [searchParams, setSearchParams] = useSearchParams();
  const { user, isAuthenticated, logout } = useAuth();
  const { data: cart } = useCart();
  const { data: categories } = useCategories();
  const { data: notifications } = useNotifications();
  const markAllRead = useMarkAllNotificationsRead();

  const activeCategory = searchParams.get("category") || "";
  const cartItemCount = cart?.items?.reduce((sum, item) => sum + item.quantity, 0) || 0;
  const unreadCount = notifications?.filter((n) => !n.isRead).length || 0;
  const { count: wishlistCount } = useWishlist();

  const handleLogout = () => {
    logout();
    navigate("/");
  };

  const handleCategoryClick = (slug: string) => {
    if (activeCategory === slug) {
      navigate("/shop");
    } else {
      navigate(`/shop?category=${encodeURIComponent(slug)}`);
    }
  };

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      navigate(`/shop?search=${encodeURIComponent(searchQuery.trim())}`);
      setSearchOpen(false);
      setSearchQuery("");
    }
  };

  return (
    <header className="sticky top-0 z-50 bg-background/80 backdrop-blur-md border-b border-border">
      <div className="section-padding flex items-center justify-between h-16">
        <Link to="/" className="flex items-center gap-2 shrink-0">
          <BookOpen className="w-6 h-6 text-foreground" />
          <span className="font-display text-xl font-semibold tracking-tight text-foreground">Bookify</span>
        </Link>

        {searchOpen ? (
          <form onSubmit={handleSearch} className="flex-1 mx-4 flex items-center gap-2">
            <Input
              autoFocus
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search books, authors..."
              className="flex-1"
            />
            <Button type="submit" size="sm">Search</Button>
            <button type="button" onClick={() => setSearchOpen(false)} className="text-muted-foreground hover:text-foreground">
              <X className="w-5 h-5" />
            </button>
          </form>
        ) : (
          <nav className="hidden lg:flex items-center gap-2 overflow-x-auto">
            <Link to="/shop" className={`pill-btn shrink-0 ${activeCategory === "" ? "pill-btn-active" : ""}`}>
              All
            </Link>
            {categories?.map((cat) => (
              <button
                key={cat.id}
                onClick={() => handleCategoryClick(cat.slug)}
                className={`pill-btn shrink-0 ${activeCategory === cat.slug ? "pill-btn-active" : ""}`}
              >
                {cat.name}
              </button>
            ))}
          </nav>
        )}

        <div className="flex items-center gap-3 shrink-0">
          <button
            onClick={() => setSearchOpen((v) => !v)}
            className="text-foreground hover:text-muted-foreground transition-colors"
          >
            <Search className="w-5 h-5" />
          </button>

          {isAuthenticated && (
            <>
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <button className="text-foreground hover:text-muted-foreground transition-colors relative">
                    <Bell className="w-5 h-5" />
                    {unreadCount > 0 && (
                      <span className="absolute -top-1 -right-1 w-4 h-4 rounded-full bg-destructive text-white text-[10px] flex items-center justify-center font-medium">
                        {unreadCount > 9 ? "9+" : unreadCount}
                      </span>
                    )}
                  </button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end" className="w-80">
                  <div className="flex items-center justify-between px-3 py-2">
                    <span className="font-medium text-sm">Notifications</span>
                    {unreadCount > 0 && (
                      <button
                        onClick={() => markAllRead.mutate()}
                        className="text-xs text-muted-foreground hover:text-foreground"
                      >
                        Mark all read
                      </button>
                    )}
                  </div>
                  <DropdownMenuSeparator />
                  {!notifications || notifications.length === 0 ? (
                    <div className="px-3 py-4 text-sm text-muted-foreground text-center">No notifications</div>
                  ) : (
                    notifications.slice(0, 8).map((n) => (
                      <DropdownMenuItem key={n.id} className={`flex flex-col items-start gap-0.5 py-2 ${!n.isRead ? "bg-muted/50" : ""}` }>
                        <span className="text-sm font-medium">{n.title}</span>
                        <span className="text-xs text-muted-foreground">{n.message}</span>
                      </DropdownMenuItem>
                    ))
                  )}
                </DropdownMenuContent>
              </DropdownMenu>

              <Link to="/wishlist" className="text-foreground hover:text-muted-foreground transition-colors relative">
                <Heart className={`w-5 h-5 ${wishlistCount > 0 ? "fill-red-500 text-red-500" : ""}`} />
                {wishlistCount > 0 && (
                  <span className="absolute -top-1 -right-1 w-4 h-4 rounded-full bg-red-500 text-white text-[10px] flex items-center justify-center font-medium">
                    {wishlistCount > 9 ? "9+" : wishlistCount}
                  </span>
                )}
              </Link>

              <Link to="/cart" className="text-foreground hover:text-muted-foreground transition-colors relative">
                <ShoppingBag className="w-5 h-5" />
                {cartItemCount > 0 && (
                  <span className="absolute -top-1 -right-1 w-4 h-4 rounded-full bg-foreground text-background text-[10px] flex items-center justify-center font-medium">
                    {cartItemCount}
                  </span>
                )}
              </Link>
            </>
          )}

          {isAuthenticated ? (
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="ghost" size="icon" className="text-foreground hover:text-muted-foreground">
                  <User className="w-5 h-5" />
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end">
                <div className="px-2 py-1.5 text-sm font-medium">
                  {user?.name}
                </div>
                <DropdownMenuSeparator />
                <DropdownMenuItem asChild>
                  <Link to="/profile">Profile</Link>
                </DropdownMenuItem>
                <DropdownMenuItem asChild>
                  <Link to="/orders">My Orders</Link>
                </DropdownMenuItem>
                {user?.role === "ADMIN" && (
                  <>
                    <DropdownMenuSeparator />
                    <DropdownMenuItem asChild>
                      <Link to="/admin">Admin Dashboard</Link>
                    </DropdownMenuItem>
                  </>
                )}
                <DropdownMenuSeparator />
                <DropdownMenuItem onClick={handleLogout}>
                  <LogOut className="mr-2 h-4 w-4" />
                  Log out
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          ) : (
            <div className="flex items-center gap-2">
              <Button variant="ghost" asChild>
                <Link to="/login">Sign in</Link>
              </Button>
              <Button asChild>
                <Link to="/register">Sign up</Link>
              </Button>
            </div>
          )}
        </div>
      </div>
    </header>
  );
};

export default StickyHeader;
