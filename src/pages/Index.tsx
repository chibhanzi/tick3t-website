
import Header from "@/components/Header";
import Hero from "@/components/Hero";
import FeaturedEvents from "@/components/FeaturedEvents";
import Features from "@/components/Features";
import Footer from "@/components/Footer";

const Index = () => {
  return (
    <div className="min-h-screen bg-white">
      <Header />
      <Hero />
      <FeaturedEvents />
      <Features />
      <Footer />
    </div>
  );
};

export default Index;
