const PromoMarquee = () => {
  const text = "GET 20% OFF YOUR FIRST ORDER — CODE: READ20   📚   ";
  const repeated = Array(8).fill(text).join("");

  return (
    <div className="bg-foreground text-background py-3 overflow-hidden">
      <div className="animate-marquee whitespace-nowrap flex">
        <span className="font-body text-sm font-medium tracking-wider">{repeated}</span>
        <span className="font-body text-sm font-medium tracking-wider">{repeated}</span>
      </div>
    </div>
  );
};

export default PromoMarquee;
