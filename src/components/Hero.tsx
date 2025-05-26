
import { Button } from "@/components/ui/button";
import { QrCode, Users } from "lucide-react";

const Hero = () => {
  return (
    <section className="relative overflow-hidden bg-gradient-to-br from-blockchain-50 via-white to-neon-50 py-20 sm:py-32">
      <div className="absolute inset-0 bg-gradient-to-br from-blockchain-500/5 to-neon-500/5" />
      
      <div className="container relative mx-auto px-4 sm:px-6 lg:px-8">
        <div className="mx-auto max-w-4xl text-center">
          <div className="mb-8 inline-flex items-center rounded-full bg-white/60 backdrop-blur-sm px-4 py-2 text-sm font-medium text-gray-700 ring-1 ring-gray-900/10">
            <QrCode className="mr-2 h-4 w-4" />
            Powered by Blockchain Technology
          </div>
          
          <h1 className="mb-8 text-4xl font-bold tracking-tight text-gray-900 sm:text-6xl">
            The Future of{" "}
            <span className="blockchain-gradient-text">
              Digital Ticketing
            </span>
          </h1>
          
          <p className="mb-10 text-xl leading-8 text-gray-600 sm:text-2xl">
            Secure, transparent, and transferable NFT tickets. 
            Create events, sell tickets, and manage attendance with blockchain technology.
          </p>
          
          <div className="flex flex-col gap-4 sm:flex-row sm:justify-center sm:gap-6">
            <Button 
              size="lg" 
              className="bg-neon-gradient hover:opacity-90 text-white px-8 py-4 text-lg animate-glow"
            >
              <Users className="mr-2 h-5 w-5" />
              Explore Events
            </Button>
            <Button 
              size="lg" 
              variant="outline" 
              className="px-8 py-4 text-lg border-2 hover:bg-gray-50"
            >
              Create Event
            </Button>
          </div>
          
          <div className="mt-16 grid grid-cols-2 gap-8 sm:grid-cols-4">
            <div className="text-center">
              <div className="text-3xl font-bold text-gray-900">10K+</div>
              <div className="text-sm text-gray-600">Events Created</div>
            </div>
            <div className="text-center">
              <div className="text-3xl font-bold text-gray-900">50K+</div>
              <div className="text-sm text-gray-600">Tickets Sold</div>
            </div>
            <div className="text-center">
              <div className="text-3xl font-bold text-gray-900">98%</div>
              <div className="text-sm text-gray-600">Satisfaction</div>
            </div>
            <div className="text-center">
              <div className="text-3xl font-bold text-gray-900">0%</div>
              <div className="text-sm text-gray-600">Fraud Rate</div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default Hero;
