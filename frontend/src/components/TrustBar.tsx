const publishers = [
  "Penguin", "HarperCollins", "Random House", "Simon & Schuster",
  "Macmillan", "Hachette", "Scholastic", "Oxford"
];

const TrustBar = () => {
  return (
    <section className="section-padding py-12">
      <h3 className="text-center text-sm font-body font-medium tracking-widest uppercase text-muted-foreground mb-8">
        Supported By
      </h3>
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 max-w-3xl mx-auto">
        {publishers.map((pub) => (
          <div
            key={pub}
            className="bento-card flex items-center justify-center py-5"
          >
            <span className="font-display font-semibold text-foreground text-base tracking-tight">
              {pub}
            </span>
          </div>
        ))}
      </div>
    </section>
  );
};

export default TrustBar;
