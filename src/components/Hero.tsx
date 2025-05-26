
import { Button } from "@/components/ui/button";
import { QrCode, Users, Sparkles, Shield, Zap } from "lucide-react";
import { Link } from "react-router-dom";

const Hero = () => {
  return (
    <section className="relative overflow-hidden bg-gradient-to-br from-blue-50 via-purple-50 to-indigo-100 py-20 sm:py-32">
      <div className="absolute inset-0 bg-gradient-to-br from-blue-500/5 to-purple-500/5" />
      
      <div className="container relative mx-auto px-4 sm:px-6 lg:px-8">
        <div className="mx-auto max-w-4xl text-center">
          <div className="mb-8 inline-flex items-center rounded-full bg-white/60 backdrop-blur-sm px-6 py-3 text-sm font-medium text-blue-700 ring-1 ring-blue-200">
            <Shield className="mr-2 h-4 w-4" />
            Secure • Transparent • Revolutionary
          </div>
          
          <h1 className="mb-8 text-4xl font-bold tracking-tight text-gray-900 sm:text-6xl">
            The Future of{" "}
            <span className="bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
              Event Ticketing
            </span>
          </h1>
          
          <p className="mb-10 text-xl leading-8 text-gray-600 sm:text-2xl">
            Create, customize, and secure your event tickets with blockchain technology. 
            From intimate gatherings to massive festivals - we've got you covered.
          </p>
          
          <div className="flex flex-col gap-4 sm:flex-row sm:justify-center sm:gap-6">
            <Link to="/events">
              <Button 
                size="lg" 
                className="bg-gradient-to-r from-blue-500 to-purple-500 hover:from-blue-600 hover:to-purple-600 text-white px-8 py-4 text-lg transition-all duration-300 hover:scale-105 hover:shadow-xl group"
              >
                <Users className="mr-2 h-5 w-5 group-hover:scale-110 transition-transform" />
                Explore Events
              </Button>
            </Link>
            <Link to="/create-event">
              <Button 
                size="lg" 
                variant="outline" 
                className="px-8 py-4 text-lg border-2 border-blue-300 hover:bg-blue-50 text-blue-600 transition-all duration-300 hover:scale-105 hover:shadow-lg group"
              >
                <QrCode className="mr-2 h-5 w-5 group-hover:rotate-12 transition-transform" />
                Create Event
              </Button>
            </Link>
          </div>
          
          <div className="mt-16 grid grid-cols-2 gap-8 sm:grid-cols-4">
            <div className="text-center group cursor-pointer">
              <div className="text-3xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent group-hover:scale-110 transition-transform">50K+</div>
              <div className="text-sm text-gray-600">Events Created</div>
            </div>
            <div className="text-center group cursor-pointer">
              <div className="text-3xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent group-hover:scale-110 transition-transform">2M+</div>
              <div className="text-sm text-gray-600">Tickets Issued</div>
            </div>
            <div className="text-center group cursor-pointer">
              <div className="text-3xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent group-hover:scale-110 transition-transform">99.9%</div>
              <div className="text-sm text-gray-600">Uptime</div>
            </div>
            <div className="text-center group cursor-pointer">
              <div className="text-3xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent group-hover:scale-110 transition-transform">0%</div>
              <div className="text-sm text-gray-600">Fraud Rate</div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default Hero;
