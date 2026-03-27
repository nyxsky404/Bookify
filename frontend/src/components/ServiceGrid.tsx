import { Truck, Shield, RotateCcw } from "lucide-react";

const services = [
  {
    icon: Truck,
    title: "Express Delivery",
    description: "Free shipping on all orders over $50. Delivered within 2-3 business days.",
  },
  {
    icon: Shield,
    title: "Secure Payment",
    description: "Your transactions are protected with bank-level encryption.",
  },
  {
    icon: RotateCcw,
    title: "Easy Returns",
    description: "Not satisfied? Return any book within 30 days for a full refund.",
  },
];

const ServiceGrid = () => {
  return (
    <section className="section-padding py-16">
      <h3 className="text-center text-sm font-body font-medium tracking-widest uppercase text-muted-foreground mb-10">
        Why Choose Us
      </h3>
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        {services.map((service) => (
          <div key={service.title} className="bento-card text-center space-y-4">
            <div className="w-12 h-12 rounded-2xl bg-secondary flex items-center justify-center mx-auto">
              <service.icon className="w-5 h-5 text-foreground" />
            </div>
            <h4 className="font-display font-semibold text-foreground text-lg">{service.title}</h4>
            <p className="font-body font-light text-muted-foreground text-sm leading-relaxed">{service.description}</p>
          </div>
        ))}
      </div>
    </section>
  );
};

export default ServiceGrid;
