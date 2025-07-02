
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
      
      {/* Simple Trust Section */}
      <section className="py-16 bg-white">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold text-gray-900 mb-4">
              Why Choose Tick3rt?
            </h2>
            <p className="text-lg text-gray-600">
              The most trusted platform for event tickets
            </p>
          </div>
          
          <div className="grid md:grid-cols-3 gap-8">
            <div className="text-center p-6">
              <div className="text-4xl mb-4">🔒</div>
              <h3 className="text-xl font-semibold mb-2">Secure & Safe</h3>
              <p className="text-gray-600">
                100% secure payments and fraud protection. Your tickets are guaranteed authentic.
              </p>
            </div>
            
            <div className="text-center p-6">
              <div className="text-4xl mb-4">⚡</div>
              <h3 className="text-xl font-semibold mb-2">Instant Delivery</h3>
              <p className="text-gray-600">
                Get your tickets instantly. Mobile tickets ready to use right after purchase.
              </p>
            </div>
            
            <div className="text-center p-6">
              <div className="text-4xl mb-4">🎯</div>
              <h3 className="text-xl font-semibold mb-2">Best Events</h3>
              <p className="text-gray-600">
                Discover the hottest events in your city. From concerts to conferences.
              </p>
            </div>
          </div>
        </div>
      </section>

      <Features />
      <Footer />
    </div>
  );
};

export default Index;
