
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { QrCode, Users, Sparkles, Shield, Zap, Star, Heart, Globe, Search, MapPin, Clock } from "lucide-react";
import { Link } from "react-router-dom";
import { useState } from "react";

const Hero = () => {
  const [searchQuery, setSearchQuery] = useState("");

  const popularSearches = ["Music Festival", "Tech Conference", "Art Exhibition", "Business Networking"];
  const urgentEvents = [
    { name: "Tech Summit 2024", tickets: 23, location: "San Francisco" },
    { name: "Art Gala", tickets: 7, location: "Brooklyn" },
  ];

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

      {/* Live Activity Notifications */}
      <div className="absolute top-8 right-8 hidden lg:block">
        <div className="bg-white/20 backdrop-blur-sm rounded-lg p-3 border border-white/30 animate-fade-in">
          <div className="flex items-center space-x-2 text-white text-sm">
            <div className="w-2 h-2 bg-green-400 rounded-full animate-pulse"></div>
            <span>2,847 people browsing events now</span>
          </div>
        </div>
      </div>

      {/* Urgent Events Ticker */}
      <div className="absolute top-20 left-8 hidden lg:block space-y-2">
        {urgentEvents.map((event, index) => (
          <div key={index} className="bg-red-500/90 backdrop-blur-sm rounded-lg p-2 border border-red-400/50 animate-pulse">
            <div className="text-white text-xs">
              <div className="font-bold">{event.name}</div>
              <div className="flex items-center space-x-1">
                <Clock className="w-3 h-3" />
                <span>Only {event.tickets} tickets left!</span>
              </div>
            </div>
          </div>
        ))}
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
            Discover Amazing{" "}
            <span className="bg-gradient-to-r from-yellow-300 via-orange-300 to-pink-300 bg-clip-text text-transparent">
              Events
            </span>
            <br />
            Near You Tonight
          </h1>
          
          {/* Search Bar */}
          <div className="mb-8 mx-auto max-w-2xl">
            <div className="relative">
              <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-400 h-5 w-5" />
              <Input
                type="text"
                placeholder="Search events, venues, or cities..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full pl-12 pr-4 py-4 text-lg bg-white/10 backdrop-blur-sm border-white/30 text-white placeholder-white/70 rounded-xl focus:ring-2 focus:ring-yellow-300 focus:border-transparent"
              />
              <Button className="absolute right-2 top-1/2 transform -translate-y-1/2 bg-gradient-to-r from-yellow-400 to-orange-400 hover:from-yellow-500 hover:to-orange-500 text-black font-semibold">
                Search
              </Button>
            </div>
            
            {/* Popular Searches */}
            <div className="mt-4 flex flex-wrap justify-center gap-2">
              <span className="text-white/70 text-sm">Popular:</span>
              {popularSearches.map((search, index) => (
                <button
                  key={index}
                  className="text-sm text-yellow-300 hover:text-yellow-200 underline transition-colors"
                  onClick={() => setSearchQuery(search)}
                >
                  {search}
                </button>
              ))}
            </div>
          </div>

          {/* Quick Action Buttons */}
          <div className="flex flex-col gap-6 sm:flex-row sm:justify-center sm:gap-8 mb-8">
            <Link to="/events">
              <Button 
                size="lg" 
                className="bg-gradient-to-r from-blue-500 to-purple-500 hover:from-blue-600 hover:to-purple-600 text-white px-10 py-6 text-lg transition-all duration-300 hover:scale-105 hover:shadow-2xl shadow-blue-500/25 group border-0"
              >
                <Users className="mr-3 h-6 w-6 group-hover:scale-110 transition-transform" />
                Browse All Events
                <Sparkles className="ml-3 h-5 w-5 text-yellow-300 animate-pulse" />
              </Button>
            </Link>
            <div className="flex gap-4">
              <Button 
                size="lg" 
                variant="outline" 
                className="px-6 py-6 text-lg border-2 border-white/30 bg-white/10 backdrop-blur-sm hover:bg-white/20 text-white transition-all duration-300 hover:scale-105 hover:shadow-xl group"
              >
                <MapPin className="mr-2 h-5 w-5 group-hover:bounce transition-transform" />
                Near Me
              </Button>
              <Button 
                size="lg" 
                variant="outline" 
                className="px-6 py-6 text-lg border-2 border-yellow-300/50 bg-yellow-300/10 backdrop-blur-sm hover:bg-yellow-300/20 text-white transition-all duration-300 hover:scale-105 hover:shadow-xl group"
              >
                <Zap className="mr-2 h-5 w-5 group-hover:rotate-12 transition-transform" />
                Surprise Me
              </Button>
            </div>
          </div>

          {/* Quick Filters */}
          <div className="mb-12 flex flex-wrap justify-center gap-3">
            {[
              { label: "Tonight", icon: "🌙", urgent: true },
              { label: "This Weekend", icon: "🎉", popular: true },
              { label: "Free Events", icon: "🎁", savings: true },
              { label: "Music", icon: "🎵" },
              { label: "Food & Drink", icon: "🍽️" },
              { label: "Business", icon: "💼" }
            ].map((filter, index) => (
              <Badge 
                key={index}
                variant="secondary" 
                className={`
                  px-4 py-2 text-sm border cursor-pointer transition-all duration-300 hover:scale-105
                  ${filter.urgent ? 'bg-red-500/20 border-red-400/50 text-red-200 animate-pulse' : ''}
                  ${filter.popular ? 'bg-green-500/20 border-green-400/50 text-green-200' : ''}
                  ${filter.savings ? 'bg-yellow-500/20 border-yellow-400/50 text-yellow-200' : ''}
                  ${!filter.urgent && !filter.popular && !filter.savings ? 'bg-white/20 border-white/30 text-white' : ''}
                `}
              >
                <span className="mr-2">{filter.icon}</span>
                {filter.label}
                {filter.urgent && <span className="ml-1 text-xs">🔥</span>}
                {filter.popular && <span className="ml-1 text-xs">⭐</span>}
              </Badge>
            ))}
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
