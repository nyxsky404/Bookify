import { ArrowRight } from "lucide-react";
import { Link } from "react-router-dom";
import lifestyleReading from "@/assets/lifestyle-reading.jpg";
import lifestyleCozy from "@/assets/lifestyle-cozy.jpg";

const EditorsChoice = () => {
  return (
    <section className="section-padding py-16">
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
        <Link to="/shop?category=fiction" className="relative rounded-3xl overflow-hidden aspect-[4/3] block group cursor-pointer">
          <img
            src={lifestyleReading}
            alt="Person reading in sunlit room"
            loading="lazy"
            width={1200}
            height={600}
            className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-foreground/70 to-transparent" />
          <div className="absolute bottom-6 left-6 right-6">
            <p className="text-xs font-body font-medium tracking-widest uppercase text-background/70 mb-2">Editor's Choice</p>
            <h3 className="font-display text-2xl md:text-3xl font-bold text-background mb-3">
              Modern Classics & Literary Fiction
            </h3>
            <p className="font-body font-light text-background/80 text-sm mb-4 max-w-md">
              We curate stunning stories & award-winning fiction. Thoughtfully compiled for the discerning reader.
            </p>
            <span className="inline-flex items-center gap-2 text-background font-body text-sm font-medium group-hover:underline">
              View Collection <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
            </span>
          </div>
        </Link>

        <Link to="/shop?category=non-fiction" className="relative rounded-3xl overflow-hidden aspect-[4/3] block group cursor-pointer">
          <img
            src={lifestyleCozy}
            alt="Cozy reading nook with books"
            loading="lazy"
            width={600}
            height={700}
            className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-foreground/70 to-transparent" />
          <div className="absolute bottom-6 left-6 right-6">
            <p className="text-xs font-body font-medium tracking-widest uppercase text-background/70 mb-2">Staff Picks</p>
            <h3 className="font-display text-2xl md:text-3xl font-bold text-background mb-3">
              Cozy Reads for Quiet Evenings
            </h3>
            <span className="inline-flex items-center gap-2 bg-background text-foreground px-5 py-2.5 rounded-full font-body text-sm font-medium group-hover:opacity-90 transition-opacity">
              View Collection <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
            </span>
          </div>
        </Link>
      </div>
    </section>
  );
};

export default EditorsChoice;
