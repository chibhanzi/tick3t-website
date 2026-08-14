
import Header from "@/components/Header";
import Hero from "@/components/Hero";
import CategoryBrowser from "@/components/CategoryBrowser";
import FeaturedEvents from "@/components/FeaturedEvents";
import Footer from "@/components/Footer";

const Index = () => {
  return (
    <div className="min-h-screen bg-background">
      <Header />
      <Hero />
      <CategoryBrowser />
      <FeaturedEvents />
      <Footer />
    </div>
  );
};

export default Index;
