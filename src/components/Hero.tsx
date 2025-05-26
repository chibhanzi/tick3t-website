
import { Button } from "@/components/ui/button";
import { QrCode, Users, Sparkles } from "lucide-react";
import { Link } from "react-router-dom";

const Hero = () => {
  return (
    <section className="relative overflow-hidden bg-gradient-to-br from-purple-100 via-pink-100 to-yellow-100 py-20 sm:py-32">
      <div className="absolute inset-0 bg-gradient-to-br from-purple-500/10 to-pink-500/10" />
      
      <div className="container relative mx-auto px-4 sm:px-6 lg:px-8">
        <div className="mx-auto max-w-4xl text-center">
          <div className="mb-8 inline-flex items-center rounded-full bg-white/60 backdrop-blur-sm px-6 py-3 text-sm font-medium text-purple-700 ring-1 ring-purple-200">
            <Sparkles className="mr-2 h-4 w-4 animate-pulse" />
            🎉 Party with Blockchain Power! 🎊
          </div>
          
          <h1 className="mb-8 text-4xl font-bold tracking-tight text-gray-900 sm:text-6xl">
            Your{" "}
            <span className="bg-gradient-to-r from-purple-600 to-pink-600 bg-clip-text text-transparent">
              Party Passport
            </span>{" "}
            to Epic Events
          </h1>
          
          <p className="mb-10 text-xl leading-8 text-gray-600 sm:text-2xl">
            🎪 Create unforgettable events, design custom NFT tickets, and party with confidence! 
            Your tickets, your style, your blockchain-secured memories. 🎭
          </p>
          
          <div className="flex flex-col gap-4 sm:flex-row sm:justify-center sm:gap-6">
            <Link to="/events">
              <Button 
                size="lg" 
                className="bg-gradient-to-r from-purple-500 to-pink-500 hover:from-purple-600 hover:to-pink-600 text-white px-8 py-4 text-lg animate-pulse"
              >
                <Users className="mr-2 h-5 w-5" />
                🎉 Find My Vibe
              </Button>
            </Link>
            <Link to="/create-event">
              <Button 
                size="lg" 
                variant="outline" 
                className="px-8 py-4 text-lg border-2 border-purple-300 hover:bg-purple-50 text-purple-600"
              >
                <QrCode className="mr-2 h-5 w-5" />
                🎨 Create Magic
              </Button>
            </Link>
          </div>
          
          <div className="mt-16 grid grid-cols-2 gap-8 sm:grid-cols-4">
            <div className="text-center">
              <div className="text-3xl font-bold bg-gradient-to-r from-purple-600 to-pink-600 bg-clip-text text-transparent">15K+</div>
              <div className="text-sm text-gray-600">🎪 Epic Events</div>
            </div>
            <div className="text-center">
              <div className="text-3xl font-bold bg-gradient-to-r from-purple-600 to-pink-600 bg-clip-text text-transparent">100K+</div>
              <div className="text-sm text-gray-600">🎫 Tickets Vibed</div>
            </div>
            <div className="text-center">
              <div className="text-3xl font-bold bg-gradient-to-r from-purple-600 to-pink-600 bg-clip-text text-transparent">99%</div>
              <div className="text-sm text-gray-600">😍 Party Satisfaction</div>
            </div>
            <div className="text-center">
              <div className="text-3xl font-bold bg-gradient-to-r from-purple-600 to-pink-600 bg-clip-text text-transparent">0%</div>
              <div className="text-sm text-gray-600">🚫 Fraud Rate</div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default Hero;
