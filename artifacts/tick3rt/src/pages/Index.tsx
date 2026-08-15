
import Header from "@/components/Header";
import Hero from "@/components/Hero";
import CategoryBrowser from "@/components/CategoryBrowser";
import FeaturedEvents from "@/components/FeaturedEvents";
import Footer from "@/components/Footer";
import DraftEventBanner from "@/components/DraftEventBanner";
import { useAuth } from "@/contexts/AuthContext";

const Index = () => {
  const { isOrganizer } = useAuth();

  return (
    <div className="min-h-screen bg-background">
      <Header />
      {isOrganizer && (
        <div className="container mx-auto px-4 sm:px-6 lg:px-8 pt-4">
          <DraftEventBanner />
        </div>
      )}
      <Hero />
      <CategoryBrowser />
      <FeaturedEvents />
      <Footer />
    </div>
  );
};

export default Index;
