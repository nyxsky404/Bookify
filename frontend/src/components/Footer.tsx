import { Link } from "react-router-dom";
import { BookOpen, Instagram, Twitter, Facebook } from "lucide-react";

const shopLinks = [
  { label: "New Releases", to: "/shop?sort=newest" },
  { label: "Bestsellers",  to: "/shop?sort=price_desc" },
  { label: "Fiction",      to: "/shop?category=fiction" },
  { label: "Non-Fiction",  to: "/shop?category=non-fiction" },
  { label: "Classics",     to: "/shop" },
];

const supportLinks = [
  { label: "Help Center",  to: "/shop" },
  { label: "Shipping",     to: "/shop" },
  { label: "Returns",      to: "/shop" },
  { label: "Track Order",  to: "/orders" },
  { label: "Contact",      to: "/shop" },
];

const companyLinks = [
  { label: "About Us",  to: "/" },
  { label: "Careers",   to: "/" },
  { label: "Press",     to: "/" },
  { label: "Blog",      to: "/" },
  { label: "Partners",  to: "/" },
];

const linkClass =
  "font-body font-light text-muted-foreground text-sm hover:text-foreground transition-colors";

const Footer = () => {
  return (
    <footer className="section-padding py-16 border-t border-border mt-auto">
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 mb-12">
        <div className="space-y-4">
          <h3 className="font-display text-2xl font-bold text-foreground">
            Subscribe to Our Newsletter
          </h3>
          <p className="font-body font-light text-muted-foreground text-sm max-w-md leading-relaxed">
            Get the latest releases, editor's picks, and exclusive deals delivered to your inbox every week.
          </p>
          <div className="flex gap-2 max-w-md">
            <input
              type="email"
              placeholder="Your email address"
              className="flex-1 px-5 py-3 rounded-full border border-border bg-background font-body text-sm text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-1 focus:ring-ring"
            />
            <button className="px-6 py-3 rounded-full bg-primary text-primary-foreground font-body text-sm font-medium hover:opacity-90 transition-opacity">
              Subscribe
            </button>
          </div>
        </div>

        <div className="grid grid-cols-3 gap-8">
          <div className="space-y-3">
            <h5 className="font-body font-semibold text-foreground text-sm">Shop</h5>
            {shopLinks.map(({ label, to }) => (
              <Link key={label} to={to} className={`block ${linkClass}`}>{label}</Link>
            ))}
          </div>
          <div className="space-y-3">
            <h5 className="font-body font-semibold text-foreground text-sm">Support</h5>
            {supportLinks.map(({ label, to }) => (
              <Link key={label} to={to} className={`block ${linkClass}`}>{label}</Link>
            ))}
          </div>
          <div className="space-y-3">
            <h5 className="font-body font-semibold text-foreground text-sm">Company</h5>
            {companyLinks.map(({ label, to }) => (
              <Link key={label} to={to} className={`block ${linkClass}`}>{label}</Link>
            ))}
          </div>
        </div>
      </div>

      <div className="flex flex-col md:flex-row items-center justify-between pt-8 border-t border-border gap-4">
        <Link to="/" className="flex items-center gap-2">
          <BookOpen className="w-5 h-5 text-foreground" />
          <span className="font-display text-lg font-semibold text-foreground">Bookify</span>
        </Link>
        <p className="font-body font-light text-muted-foreground text-xs">
          © {new Date().getFullYear()} Bookify. All rights reserved.
        </p>
        <div className="flex items-center gap-4">
          <a href="https://instagram.com" target="_blank" rel="noopener noreferrer" aria-label="Instagram">
            <Instagram className="w-4 h-4 text-muted-foreground hover:text-foreground transition-colors" />
          </a>
          <a href="https://twitter.com" target="_blank" rel="noopener noreferrer" aria-label="Twitter">
            <Twitter className="w-4 h-4 text-muted-foreground hover:text-foreground transition-colors" />
          </a>
          <a href="https://facebook.com" target="_blank" rel="noopener noreferrer" aria-label="Facebook">
            <Facebook className="w-4 h-4 text-muted-foreground hover:text-foreground transition-colors" />
          </a>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
