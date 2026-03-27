import { ArrowRight } from "lucide-react";
import heroBooks from "@/assets/hero-books.png";

const HeroSection = () => {
  const handleStartReading = () => {
    document.getElementById("product-grid")?.scrollIntoView({ behavior: "smooth" });
  };

  return (
    <section className="section-padding py-12 md:py-20">
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 items-center">
        <div className="space-y-6">
          <p className="text-sm font-body font-medium tracking-widest uppercase text-muted-foreground">
            2024 — Present
          </p>
          <h1 className="text-5xl md:text-6xl lg:text-7xl font-display font-bold leading-[1.05] tracking-tight text-foreground">
            The Finest<br />
            Literary<br />
            Collection<br />
            For You
          </h1>
          <p className="text-muted-foreground font-body font-light text-lg max-w-md leading-relaxed">
            Discover a curated selection of the world's most compelling stories, timeless classics, and bold new voices.
          </p>
          <button onClick={handleStartReading} className="inline-flex items-center gap-3 bg-primary text-primary-foreground px-8 py-4 rounded-full font-body font-medium text-sm tracking-wide hover:opacity-90 transition-opacity">
            Start Reading
            <ArrowRight className="w-4 h-4" />
          </button>
        </div>

        <div className="flex justify-center lg:justify-end">
          <div className="relative">
            <div className="absolute inset-0 bg-secondary rounded-3xl -rotate-3 scale-95" />
            <img
              src={heroBooks}
              alt="Premium book collection"
              width={500}
              height={500}
              className="relative z-10 max-w-[400px] md:max-w-[500px] w-full h-auto"
            />
          </div>
        </div>
      </div>
    </section>
  );
};

export default HeroSection;
