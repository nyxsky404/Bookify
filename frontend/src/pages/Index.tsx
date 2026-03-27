import StickyHeader from "@/components/StickyHeader";
import HeroSection from "@/components/HeroSection";
import TrustBar from "@/components/TrustBar";
import ProductGrid from "@/components/ProductGrid";
import PromoMarquee from "@/components/PromoMarquee";
import ServiceGrid from "@/components/ServiceGrid";
import EditorsChoice from "@/components/EditorsChoice";
import CollectionList from "@/components/CollectionList";
import Footer from "@/components/Footer";

const Index = () => {
  return (
    <div className="min-h-screen bg-background">
      <StickyHeader />
      <HeroSection />
      <TrustBar />
      <ProductGrid />
      <ServiceGrid />
      <PromoMarquee />
      <EditorsChoice />
      <CollectionList />
      <Footer />
    </div>
  );
};

export default Index;
