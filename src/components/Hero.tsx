
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { QrCode, Users, Sparkles, Shield, Zap, Star, Heart, Globe } from "lucide-react";
import { Link } from "react-router-dom";

const Hero = () => {
  return (
    <section className="relative overflow-hidden py-20 sm:py-32">
      {/* Background Image */}
      <div 
        className="absolute inset-0 bg-cover bg-center bg-no-repeat"
        style={{
          backgroundImage: "url('https://images.unsplash.com/photo-1470813740244-df37b8c1edcb?w=1920&h=1080&fit=crop')",
        }}
      >
        {/* Overlay for better text readability */}
        <div className="absolute inset-0 bg-gradient-to-br from-blue-900/80 via-purple-900/70 to-indigo-900/80"></div>
      </div>
      
      {/* Animated Background Elements */}
      <div className="absolute inset-0">
        <div className="absolute top-20 left-10 w-20 h-20 bg-blue-200/30 rounded-full mix-blend-multiply filter blur-xl opacity-70 animate-pulse"></div>
        <div className="absolute top-40 right-10 w-32 h-32 bg-purple-200/30 rounded-full mix-blend-multiply filter blur-xl opacity-70 animate-pulse animation-delay-2000"></div>
        <div className="absolute bottom-20 left-1/2 w-24 h-24 bg-indigo-200/30 rounded-full mix-blend-multiply filter blur-xl opacity-70 animate-pulse animation-delay-4000"></div>
      </div>
      
      <div className="container relative mx-auto px-4 sm:px-6 lg:px-8">
        <div className="mx-auto max-w-5xl text-center">
          {/* Hero Badge */}
          <div className="mb-8 inline-flex items-center rounded-full bg-white/20 backdrop-blur-sm px-6 py-3 text-sm font-medium text-white ring-1 ring-white/30 shadow-lg hover:scale-105 transition-all duration-300">
            <Shield className="mr-2 h-4 w-4" />
            <span className="flex items-center space-x-2">
              <span>Secure</span>
              <span className="text-white/60">•</span>
              <span>Transparent</span>
              <span className="text-white/60">•</span>
              <span>Revolutionary</span>
            </span>
            <Sparkles className="ml-2 h-4 w-4 text-yellow-300 animate-pulse" />
          </div>
          
          {/* Main Heading */}
          <h1 className="mb-8 text-4xl font-bold tracking-tight text-white sm:text-6xl lg:text-7xl">
            Welcome to the{" "}
            <span className="bg-gradient-to-r from-yellow-300 via-orange-300 to-pink-300 bg-clip-text text-transparent">
              Future
            </span>
            <br />
            of Event Ticketing
          </h1>
          
          {/* Subtitle */}
          <p className="mb-12 text-xl leading-8 text-white/90 sm:text-2xl max-w-4xl mx-auto">
            Create unforgettable experiences with blockchain-powered tickets. 
            From intimate community gatherings to massive international festivals - 
            <span className="text-yellow-300 font-semibold"> we welcome everyone</span>.
          </p>
          
          {/* CTA Buttons */}
          <div className="flex flex-col gap-6 sm:flex-row sm:justify-center sm:gap-8 mb-16">
            <Link to="/events">
              <Button 
                size="lg" 
                className="bg-gradient-to-r from-blue-500 to-purple-500 hover:from-blue-600 hover:to-purple-600 text-white px-10 py-6 text-lg transition-all duration-300 hover:scale-105 hover:shadow-2xl shadow-blue-500/25 group border-0"
              >
                <Users className="mr-3 h-6 w-6 group-hover:scale-110 transition-transform" />
                Explore Events
                <Sparkles className="ml-3 h-5 w-5 text-yellow-300 animate-pulse" />
              </Button>
            </Link>
            <Link to="/auth">
              <Button 
                size="lg" 
                variant="outline" 
                className="px-10 py-6 text-lg border-2 border-white/30 bg-white/10 backdrop-blur-sm hover:bg-white/20 text-white transition-all duration-300 hover:scale-105 hover:shadow-xl group"
              >
                <QrCode className="mr-3 h-6 w-6 group-hover:rotate-12 transition-transform" />
                Get Started Free
              </Button>
            </Link>
          </div>
          
          {/* Trust Indicators */}
          <div className="mb-16 flex flex-wrap justify-center gap-4">
            <Badge variant="secondary" className="bg-white/20 backdrop-blur-sm text-white px-4 py-2 text-sm border border-white/30">
              <Heart className="mr-2 h-4 w-4 text-red-400" />
              Loved by 50K+ Organizers
            </Badge>
            <Badge variant="secondary" className="bg-white/20 backdrop-blur-sm text-white px-4 py-2 text-sm border border-white/30">
              <Globe className="mr-2 h-4 w-4 text-blue-400" />
              Available Worldwide
            </Badge>
            <Badge variant="secondary" className="bg-white/20 backdrop-blur-sm text-white px-4 py-2 text-sm border border-white/30">
              <Star className="mr-2 h-4 w-4 text-yellow-400" />
              4.9/5 Rating
            </Badge>
          </div>
          
          {/* Statistics */}
          <div className="grid grid-cols-2 gap-8 sm:grid-cols-4">
            <div className="text-center group cursor-pointer">
              <div className="text-3xl lg:text-4xl font-bold bg-gradient-to-r from-yellow-300 to-orange-300 bg-clip-text text-transparent group-hover:scale-110 transition-transform duration-300 mb-2">
                50K+
              </div>
              <div className="text-sm lg:text-base text-white/90 font-medium">Events Created</div>
              <div className="text-xs text-white/70">This month: +2.3K</div>
            </div>
            <div className="text-center group cursor-pointer">
              <div className="text-3xl lg:text-4xl font-bold bg-gradient-to-r from-pink-300 to-purple-300 bg-clip-text text-transparent group-hover:scale-110 transition-transform duration-300 mb-2">
                2.5M+
              </div>
              <div className="text-sm lg:text-base text-white/90 font-medium">Happy Attendees</div>
              <div className="text-xs text-white/70">Growing daily</div>
            </div>
            <div className="text-center group cursor-pointer">
              <div className="text-3xl lg:text-4xl font-bold bg-gradient-to-r from-blue-300 to-cyan-300 bg-clip-text text-transparent group-hover:scale-110 transition-transform duration-300 mb-2">
                99.9%
              </div>
              <div className="text-sm lg:text-base text-white/90 font-medium">Uptime</div>
              <div className="text-xs text-white/70">Always reliable</div>
            </div>
            <div className="text-center group cursor-pointer">
              <div className="text-3xl lg:text-4xl font-bold bg-gradient-to-r from-green-300 to-emerald-300 bg-clip-text text-transparent group-hover:scale-110 transition-transform duration-300 mb-2">
                0%
              </div>
              <div className="text-sm lg:text-base text-white/90 font-medium">Fraud Rate</div>
              <div className="text-xs text-white/70">Blockchain secured</div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default Hero;
