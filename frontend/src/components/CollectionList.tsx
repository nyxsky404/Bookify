import { ArrowRight } from "lucide-react";
import { Link } from "react-router-dom";
import book1 from "@/assets/book-1.png";
import book3 from "@/assets/book-3.png";
import book5 from "@/assets/book-5.png";

const collections = [
  { image: book1, title: "Summer Reads",  count: "24 Books", to: "/shop?sort=newest" },
  { image: book3, title: "Award Winners", count: "18 Books", to: "/shop?sort=price_desc" },
  { image: book5, title: "Debut Novels",  count: "12 Books", to: "/shop" },
];

const CollectionList = () => {
  return (
    <section className="section-padding py-16">
      <div className="flex items-center justify-between mb-8">
        <h2 className="font-display text-3xl md:text-4xl font-bold text-foreground">Collection List</h2>
        <Link
          to="/shop"
          className="inline-flex items-center gap-2 text-muted-foreground font-body text-sm font-medium hover:text-foreground transition-colors group"
        >
          View All <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
        </Link>
      </div>
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        {collections.map((col) => (
          <Link
            key={col.title}
            to={col.to}
            className="relative rounded-3xl overflow-hidden aspect-[3/4] block group cursor-pointer"
          >
            <img
              src={col.image}
              alt={col.title}
              loading="lazy"
              width={544}
              height={768}
              className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-foreground/70 to-transparent" />
            <div className="absolute bottom-5 left-5 right-5 flex items-end justify-between">
              <div>
                <p className="text-xs font-body font-medium tracking-widest uppercase text-background/70 mb-1">{col.count}</p>
                <h4 className="font-display text-xl font-bold text-background">{col.title}</h4>
              </div>
              <ArrowRight className="w-5 h-5 text-background/80 group-hover:translate-x-1 transition-transform shrink-0" />
            </div>
          </Link>
        ))}
      </div>
    </section>
  );
};

export default CollectionList;
