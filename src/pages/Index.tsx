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
      
      {/* Enhanced Trust Section */}
      <section className="relative py-20 overflow-hidden bg-gradient-to-br from-slate-900 via-purple-900 to-indigo-900 dark:from-slate-950 dark:via-purple-950 dark:to-indigo-950">
        {/* Animated Background Elements */}
        <div className="absolute inset-0">
          <div className="absolute inset-0 bg-[radial-gradient(circle_at_30%_40%,rgba(120,119,198,0.3),transparent_50%)] animate-pulse animation-delay-1000"></div>
          <div className="absolute inset-0 bg-[radial-gradient(circle_at_70%_80%,rgba(255,119,198,0.2),transparent_50%)] animate-pulse animation-delay-2000"></div>
          <div className="absolute inset-0 bg-[radial-gradient(circle_at_40%_20%,rgba(119,198,255,0.2),transparent_50%)] animate-pulse animation-delay-500"></div>
        </div>

        {/* Floating Elements */}
        <div className="absolute top-20 left-10 w-20 h-20 bg-gradient-to-r from-blue-400 to-cyan-400 rounded-full opacity-10 animate-bounce animation-delay-1000"></div>
        <div className="absolute bottom-20 right-20 w-16 h-16 bg-gradient-to-r from-purple-400 to-pink-400 rounded-full opacity-10 animate-bounce animation-delay-2000"></div>
        <div className="absolute top-40 right-10 w-12 h-12 bg-gradient-to-r from-green-400 to-emerald-400 rounded-full opacity-10 animate-bounce animation-delay-3000"></div>

        <div className="container relative mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-4xl md:text-5xl font-bold text-white mb-6 animate-fade-in">
              Why Choose{" "}
              <span className="bg-gradient-to-r from-cyan-400 via-purple-400 to-pink-400 bg-clip-text text-transparent">
                Tick3rt?
              </span>
            </h2>
            <p className="text-xl md:text-2xl text-gray-300 max-w-3xl mx-auto leading-relaxed animate-fade-in animation-delay-200">
              The most trusted platform for event tickets, powered by blockchain technology
            </p>
          </div>
          
          <div className="grid md:grid-cols-3 gap-8 lg:gap-12">
            <div className="group animate-fade-in animation-delay-400">
              <div className="relative h-full p-8 lg:p-10 bg-white/5 backdrop-blur-lg rounded-3xl border border-white/10 hover:border-white/20 transition-all duration-500 hover:scale-105 hover:bg-white/10">
                {/* Gradient Border Effect */}
                <div className="absolute inset-0 bg-gradient-to-r from-blue-500/20 via-purple-500/20 to-cyan-500/20 rounded-3xl opacity-0 group-hover:opacity-100 transition-opacity duration-500 blur-xl"></div>
                
                <div className="relative">
                  <div className="text-6xl mb-6 group-hover:scale-110 transition-transform duration-500 text-center">
                    🔒
                  </div>
                  <div className="absolute top-0 left-1/2 transform -translate-x-1/2 w-20 h-20 bg-gradient-to-r from-blue-400 to-cyan-400 rounded-full opacity-20 group-hover:opacity-40 transition-opacity duration-500 blur-lg"></div>
                  
                  <h3 className="text-2xl font-bold mb-4 text-white text-center group-hover:text-cyan-300 transition-colors duration-300">
                    Secure & Safe
                  </h3>
                  <p className="text-gray-300 leading-relaxed text-center group-hover:text-gray-200 transition-colors duration-300">
                    Blockchain-powered security with 100% fraud protection. Your tickets are cryptographically verified and guaranteed authentic.
                  </p>
                  
                  <div className="mt-6 flex justify-center space-x-2">
                    <div className="px-3 py-1 bg-green-500/20 text-green-300 text-sm rounded-full border border-green-500/30">
                      ✓ Encrypted
                    </div>
                    <div className="px-3 py-1 bg-blue-500/20 text-blue-300 text-sm rounded-full border border-blue-500/30">
                      ✓ Verified
                    </div>
                  </div>
                </div>
              </div>
            </div>
            
            <div className="group animate-fade-in animation-delay-600">
              <div className="relative h-full p-8 lg:p-10 bg-white/5 backdrop-blur-lg rounded-3xl border border-white/10 hover:border-white/20 transition-all duration-500 hover:scale-105 hover:bg-white/10">
                {/* Gradient Border Effect */}
                <div className="absolute inset-0 bg-gradient-to-r from-purple-500/20 via-pink-500/20 to-red-500/20 rounded-3xl opacity-0 group-hover:opacity-100 transition-opacity duration-500 blur-xl"></div>
                
                <div className="relative">
                  <div className="text-6xl mb-6 group-hover:scale-110 transition-transform duration-500 text-center">
                    ⚡
                  </div>
                  <div className="absolute top-0 left-1/2 transform -translate-x-1/2 w-20 h-20 bg-gradient-to-r from-purple-400 to-pink-400 rounded-full opacity-20 group-hover:opacity-40 transition-opacity duration-500 blur-lg"></div>
                  
                  <h3 className="text-2xl font-bold mb-4 text-white text-center group-hover:text-pink-300 transition-colors duration-300">
                    Instant Delivery
                  </h3>
                  <p className="text-gray-300 leading-relaxed text-center group-hover:text-gray-200 transition-colors duration-300">
                    Get your tickets instantly via email with QR codes. No crypto knowledge needed - works just like traditional tickets but better.
                  </p>
                  
                  <div className="mt-6 flex justify-center space-x-2">
                    <div className="px-3 py-1 bg-purple-500/20 text-purple-300 text-sm rounded-full border border-purple-500/30">
                      ✓ Instant
                    </div>
                    <div className="px-3 py-1 bg-pink-500/20 text-pink-300 text-sm rounded-full border border-pink-500/30">
                      ✓ Mobile Ready
                    </div>
                  </div>
                </div>
              </div>
            </div>
            
            <div className="group animate-fade-in animation-delay-800">
              <div className="relative h-full p-8 lg:p-10 bg-white/5 backdrop-blur-lg rounded-3xl border border-white/10 hover:border-white/20 transition-all duration-500 hover:scale-105 hover:bg-white/10">
                {/* Gradient Border Effect */}
                <div className="absolute inset-0 bg-gradient-to-r from-green-500/20 via-emerald-500/20 to-teal-500/20 rounded-3xl opacity-0 group-hover:opacity-100 transition-opacity duration-500 blur-xl"></div>
                
                <div className="relative">
                  <div className="text-6xl mb-6 group-hover:scale-110 transition-transform duration-500 text-center">
                    🎯
                  </div>
                  <div className="absolute top-0 left-1/2 transform -translate-x-1/2 w-20 h-20 bg-gradient-to-r from-green-400 to-emerald-400 rounded-full opacity-20 group-hover:opacity-40 transition-opacity duration-500 blur-lg"></div>
                  
                  <h3 className="text-2xl font-bold mb-4 text-white text-center group-hover:text-emerald-300 transition-colors duration-300">
                    Best Events
                  </h3>
                  <p className="text-gray-300 leading-relaxed text-center group-hover:text-gray-200 transition-colors duration-300">
                    AI-powered recommendations find the perfect events for you. From concerts to conferences, discover experiences you'll love.
                  </p>
                  
                  <div className="mt-6 flex justify-center space-x-2">
                    <div className="px-3 py-1 bg-emerald-500/20 text-emerald-300 text-sm rounded-full border border-emerald-500/30">
                      ✓ AI Powered
                    </div>
                    <div className="px-3 py-1 bg-green-500/20 text-green-300 text-sm rounded-full border border-green-500/30">
                      ✓ Curated
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Enhanced Stats Section */}
          <div className="mt-20 text-center animate-fade-in animation-delay-1000">
            <div className="grid grid-cols-2 md:grid-cols-4 gap-8 max-w-4xl mx-auto">
              <div className="group">
                <div className="text-4xl md:text-5xl font-bold bg-gradient-to-r from-cyan-400 to-blue-400 bg-clip-text text-transparent group-hover:scale-110 transition-transform duration-300">
                  99.9%
                </div>
                <div className="text-gray-400 mt-2 group-hover:text-gray-300 transition-colors">Security Rate</div>
              </div>
              <div className="group">
                <div className="text-4xl md:text-5xl font-bold bg-gradient-to-r from-purple-400 to-pink-400 bg-clip-text text-transparent group-hover:scale-110 transition-transform duration-300">
                  2.5M+
                </div>
                <div className="text-gray-400 mt-2 group-hover:text-gray-300 transition-colors">Happy Users</div>
              </div>
              <div className="group">
                <div className="text-4xl md:text-5xl font-bold bg-gradient-to-r from-green-400 to-emerald-400 bg-clip-text text-transparent group-hover:scale-110 transition-transform duration-300">
                  &lt;1s
                </div>
                <div className="text-gray-400 mt-2 group-hover:text-gray-300 transition-colors">Ticket Delivery</div>
              </div>
              <div className="group">
                <div className="text-4xl md:text-5xl font-bold bg-gradient-to-r from-yellow-400 to-orange-400 bg-clip-text text-transparent group-hover:scale-110 transition-transform duration-300">
                  24/7
                </div>
                <div className="text-gray-400 mt-2 group-hover:text-gray-300 transition-colors">Support</div>
              </div>
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
