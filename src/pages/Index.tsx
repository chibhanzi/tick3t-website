
import Header from "@/components/Header";
import Hero from "@/components/Hero";
import FeaturedEvents from "@/components/FeaturedEvents";
import Features from "@/components/Features";
import Footer from "@/components/Footer";

const Index = () => {
  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-50 via-pink-50 to-yellow-50 dark:from-slate-900 dark:via-slate-800 dark:to-slate-900">
      <Header />
      <Hero />
      
      {/* Crypto Benefits Section */}
      <section className="py-16 bg-gradient-to-r from-blue-50 to-indigo-50 dark:from-slate-800 dark:to-slate-700">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-3xl md:text-4xl font-bold mb-4 bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
              🔒 Powered by Blockchain Technology
            </h2>
            <p className="text-lg text-muted-foreground max-w-3xl mx-auto">
              Experience the future of ticketing with crypto-secured, fraud-proof tickets that you truly own
            </p>
          </div>
          
          <div className="grid md:grid-cols-3 gap-8">
            <div className="text-center p-6 bg-white dark:bg-slate-800 rounded-lg shadow-sm">
              <div className="text-4xl mb-4">🛡️</div>
              <h3 className="text-xl font-semibold mb-2">100% Fraud-Proof</h3>
              <p className="text-muted-foreground">
                Every ticket is secured on the blockchain. No fake tickets, no counterfeits, guaranteed authenticity.
              </p>
            </div>
            
            <div className="text-center p-6 bg-white dark:bg-slate-800 rounded-lg shadow-sm">
              <div className="text-4xl mb-4">💎</div>
              <h3 className="text-xl font-semibold mb-2">True Ownership</h3>
              <p className="text-muted-foreground">
                Your tickets are NFTs you actually own. Transfer, trade, or keep as collectible memories forever.
              </p>
            </div>
            
            <div className="text-center p-6 bg-white dark:bg-slate-800 rounded-lg shadow-sm">
              <div className="text-4xl mb-4">🚀</div>
              <h3 className="text-xl font-semibold mb-2">Easy Payments</h3>
              <p className="text-muted-foreground">
                Pay with credit cards, PayPal, or crypto (ETH, USDC). Choose what works best for you.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* How It Works Section */}
      <section className="py-16 bg-white dark:bg-slate-900">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-3xl md:text-4xl font-bold mb-4">
              🎯 How Tick3rt Works
            </h2>
            <p className="text-lg text-muted-foreground">
              Simple for users, powerful with blockchain security
            </p>
          </div>
          
          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
            <div className="text-center">
              <div className="w-16 h-16 bg-gradient-to-r from-purple-500 to-pink-500 rounded-full flex items-center justify-center text-white text-2xl font-bold mx-auto mb-4">
                1
              </div>
              <h3 className="text-lg font-semibold mb-2">Browse Events</h3>
              <p className="text-sm text-muted-foreground">
                Find amazing events on our platform
              </p>
            </div>
            
            <div className="text-center">
              <div className="w-16 h-16 bg-gradient-to-r from-blue-500 to-indigo-500 rounded-full flex items-center justify-center text-white text-2xl font-bold mx-auto mb-4">
                2
              </div>
              <h3 className="text-lg font-semibold mb-2">Easy Payment</h3>
              <p className="text-sm text-muted-foreground">
                Pay with card, PayPal, or crypto - your choice
              </p>
            </div>
            
            <div className="text-center">
              <div className="w-16 h-16 bg-gradient-to-r from-green-500 to-emerald-500 rounded-full flex items-center justify-center text-white text-2xl font-bold mx-auto mb-4">
                3
              </div>
              <h3 className="text-lg font-semibold mb-2">Get NFT Ticket</h3>
              <p className="text-sm text-muted-foreground">
                Receive a blockchain-secured ticket NFT
              </p>
            </div>
            
            <div className="text-center">
              <div className="w-16 h-16 bg-gradient-to-r from-yellow-500 to-orange-500 rounded-full flex items-center justify-center text-white text-2xl font-bold mx-auto mb-4">
                4
              </div>
              <h3 className="text-lg font-semibold mb-2">Attend & Collect</h3>
              <p className="text-sm text-muted-foreground">
                Show QR code to enter, keep ticket as memorabilia
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Why Choose Tick3rt */}
      <section className="py-16 bg-gradient-to-r from-green-50 to-emerald-50 dark:from-slate-800 dark:to-slate-700">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-3xl md:text-4xl font-bold mb-4">
              🌟 Why Choose Tick3rt?
            </h2>
          </div>
          
          <div className="grid md:grid-cols-2 gap-12 items-center">
            <div className="space-y-6">
              <div className="flex items-start space-x-4">
                <div className="text-2xl">🔐</div>
                <div>
                  <h3 className="text-lg font-semibold mb-2">Crypto-Powered Security</h3>
                  <p className="text-muted-foreground">
                    Blockchain technology ensures every ticket is authentic and cannot be duplicated or counterfeited.
                  </p>
                </div>
              </div>
              
              <div className="flex items-start space-x-4">
                <div className="text-2xl">🎨</div>
                <div>
                  <h3 className="text-lg font-semibold mb-2">Collectible Memories</h3>
                  <p className="text-muted-foreground">
                    Beautiful NFT tickets that serve as permanent mementos of your favorite events and experiences.
                  </p>
                </div>
              </div>
              
              <div className="flex items-start space-x-4">
                <div className="text-2xl">💰</div>
                <div>
                  <h3 className="text-lg font-semibold mb-2">Fair Marketplace</h3>
                  <p className="text-muted-foreground">
                    Trade tickets safely on our blockchain-powered marketplace with transparent pricing and verified sellers.
                  </p>
                </div>
              </div>
            </div>
            
            <div className="bg-white dark:bg-slate-800 p-8 rounded-lg shadow-lg">
              <h3 className="text-xl font-bold mb-4 text-center">🚀 Join the Future</h3>
              <div className="space-y-4 text-center">
                <div className="text-sm text-muted-foreground">
                  <strong>50,000+</strong> NFT tickets minted
                </div>
                <div className="text-sm text-muted-foreground">
                  <strong>1,200+</strong> events powered by blockchain
                </div>
                <div className="text-sm text-muted-foreground">
                  <strong>99.9%</strong> fraud prevention rate
                </div>
                <div className="pt-4">
                  <button className="bg-gradient-to-r from-purple-500 to-pink-500 hover:from-purple-600 hover:to-pink-600 text-white px-6 py-3 rounded-lg font-semibold transition-all duration-300 hover:scale-105">
                    🎫 Start Your Crypto Journey
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      <FeaturedEvents />
      <Features />
      <Footer />
    </div>
  );
};

export default Index;
