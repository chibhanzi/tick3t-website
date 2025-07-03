
import Header from "@/components/Header";
import Hero from "@/components/Hero";
import FeaturedEvents from "@/components/FeaturedEvents";
import SmartRecommendations from "@/components/SmartRecommendations";
import SocialProof from "@/components/SocialProof";
import WaitlistBanner from "@/components/WaitlistBanner";
import Features from "@/components/Features";
import Footer from "@/components/Footer";

const Index = () => {
  return (
    <div className="min-h-screen bg-white dark:bg-gray-900">
      <Header />
      <WaitlistBanner />
      <Hero />
      <SmartRecommendations />
      <FeaturedEvents />
      <SocialProof />
      
      {/* Simple Trust Section */}
      <section className="py-16 bg-gradient-to-br from-gray-50 to-white dark:from-gray-800 dark:to-gray-900">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold text-gray-900 dark:text-white mb-4">
              Why Choose Tick3rt?
            </h2>
            <p className="text-lg text-gray-600 dark:text-gray-300">
              The most trusted platform for event tickets
            </p>
          </div>
          
          <div className="grid md:grid-cols-3 gap-8">
            <div className="text-center p-8 bg-white dark:bg-gray-800 rounded-2xl shadow-lg hover:shadow-xl transition-all duration-300 group border border-gray-100 dark:border-gray-700">
              <div className="text-5xl mb-4 group-hover:scale-110 transition-transform duration-300">🔒</div>
              <h3 className="text-xl font-semibold mb-3 text-gray-900 dark:text-white">Secure & Safe</h3>
              <p className="text-gray-600 dark:text-gray-300 leading-relaxed">
                100% secure payments and fraud protection. Your tickets are guaranteed authentic.
              </p>
            </div>
            
            <div className="text-center p-8 bg-white dark:bg-gray-800 rounded-2xl shadow-lg hover:shadow-xl transition-all duration-300 group border border-gray-100 dark:border-gray-700">
              <div className="text-5xl mb-4 group-hover:scale-110 transition-transform duration-300">⚡</div>
              <h3 className="text-xl font-semibold mb-3 text-gray-900 dark:text-white">Instant Delivery</h3>
              <p className="text-gray-600 dark:text-gray-300 leading-relaxed">
                Get your tickets instantly. Mobile tickets ready to use right after purchase.
              </p>
            </div>
            
            <div className="text-center p-8 bg-white dark:bg-gray-800 rounded-2xl shadow-lg hover:shadow-xl transition-all duration-300 group border border-gray-100 dark:border-gray-700">
              <div className="text-5xl mb-4 group-hover:scale-110 transition-transform duration-300">🎯</div>
              <h3 className="text-xl font-semibold mb-3 text-gray-900 dark:text-white">Best Events</h3>
              <p className="text-gray-600 dark:text-gray-300 leading-relaxed">
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
