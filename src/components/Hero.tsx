
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { QrCode, Users, Sparkles, Shield, Zap, Star, Heart, Globe, Search, MapPin, Clock, Calendar, Filter } from "lucide-react";
import { Link } from "react-router-dom";
import { useState } from "react";

const Hero = () => {
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedLocation, setSelectedLocation] = useState("All Cities");

  const popularSearches = ["Concert", "Conference", "Festival", "Workshop", "Networking"];
  const topLocations = ["New York", "Los Angeles", "London", "Berlin", "Tokyo"];
  const liveStats = {
    browsing: 2847,
    ticketsSold: 127,
    activeEvents: 1234,
    cities: 85
  };

  return (
    <section className="relative overflow-hidden py-12 sm:py-20">
      {/* Background with better contrast */}
      <div 
        className="absolute inset-0 bg-cover bg-center bg-no-repeat"
        style={{
          backgroundImage: "url('https://images.unsplash.com/photo-1492684223066-81342ee5ff30?w=1920&h=1080&fit=crop')",
        }}
      >
        <div className="absolute inset-0 bg-gradient-to-br from-blue-900/85 via-purple-900/80 to-indigo-900/85"></div>
      </div>

      {/* Live Activity Indicators - More Prominent */}
      <div className="absolute top-4 right-4 space-y-2">
        <div className="bg-green-500/90 backdrop-blur-sm rounded-lg px-3 py-2 border border-green-400/50">
          <div className="flex items-center space-x-2 text-white text-sm font-medium">
            <div className="w-2 h-2 bg-green-300 rounded-full animate-pulse"></div>
            <span>{liveStats.browsing.toLocaleString()} browsing now</span>
          </div>
        </div>
        <div className="bg-blue-500/90 backdrop-blur-sm rounded-lg px-3 py-2 border border-blue-400/50">
          <div className="flex items-center space-x-2 text-white text-sm font-medium">
            <Zap className="w-3 h-3" />
            <span>{liveStats.ticketsSold} sold in last hour</span>
          </div>
        </div>
      </div>

      {/* City Stats */}
      <div className="absolute top-4 left-4">
        <div className="bg-purple-500/90 backdrop-blur-sm rounded-lg px-3 py-2 border border-purple-400/50">
          <div className="flex items-center space-x-2 text-white text-sm font-medium">
            <Globe className="w-3 h-3" />
            <span>{liveStats.activeEvents.toLocaleString()} events in {liveStats.cities} cities</span>
          </div>
        </div>
      </div>
      
      <div className="container relative mx-auto px-4 sm:px-6 lg:px-8">
        <div className="mx-auto max-w-5xl text-center">
          {/* Trust Badge */}
          <div className="mb-6 inline-flex items-center rounded-full bg-white/20 backdrop-blur-sm px-4 py-2 text-sm font-medium text-white ring-1 ring-white/30">
            <Shield className="mr-2 h-4 w-4" />
            <span>🔒 Blockchain-Secured Tickets</span>
            <Sparkles className="ml-2 h-4 w-4 text-yellow-300" />
          </div>
          
          {/* Main Heading - More Action-Oriented */}
          <h1 className="mb-6 text-3xl font-bold tracking-tight text-white sm:text-5xl lg:text-6xl">
            Find Your Next{" "}
            <span className="bg-gradient-to-r from-yellow-300 via-orange-300 to-pink-300 bg-clip-text text-transparent">
              Amazing Event
            </span>
            <br />
            <span className="text-2xl sm:text-3xl lg:text-4xl text-white/90">Starting Tonight</span>
          </h1>

          {/* Enhanced Search Section */}
          <div className="mb-8 mx-auto max-w-4xl">
            {/* Main Search Bar */}
            <div className="relative mb-4">
              <div className="flex flex-col sm:flex-row gap-2 p-2 bg-white/10 backdrop-blur-sm rounded-2xl border border-white/20">
                {/* Search Input */}
                <div className="relative flex-1">
                  <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 text-white/70 h-5 w-5" />
                  <Input
                    type="text"
                    placeholder="What event are you looking for?"
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    className="w-full pl-12 pr-4 py-3 text-base bg-transparent border-0 text-white placeholder-white/70 focus:ring-0"
                  />
                </div>
                
                {/* Location Selector */}
                <div className="relative min-w-[160px]">
                  <MapPin className="absolute left-3 top-1/2 transform -translate-y-1/2 text-white/70 h-4 w-4" />
                  <select 
                    value={selectedLocation}
                    onChange={(e) => setSelectedLocation(e.target.value)}
                    className="w-full pl-10 pr-8 py-3 text-base bg-transparent border-0 text-white appearance-none focus:ring-0"
                  >
                    <option value="All Cities">All Cities</option>
                    {topLocations.map(city => (
                      <option key={city} value={city} className="text-black">{city}</option>
                    ))}
                  </select>
                </div>
                
                {/* Search Button */}
                <Button className="px-8 py-3 bg-gradient-to-r from-yellow-400 to-orange-400 hover:from-yellow-500 hover:to-orange-500 text-black font-semibold border-0">
                  <Search className="w-4 h-4 mr-2" />
                  Find Events
                </Button>
              </div>
            </div>
            
            {/* Quick Filters - Inspired by Tix.Africa */}
            <div className="flex flex-wrap justify-center gap-2 mb-4">
              {[
                { label: "Tonight", icon: "🌙", color: "bg-red-500/20 border-red-400/50 text-red-200" },
                { label: "This Weekend", icon: "🎉", color: "bg-green-500/20 border-green-400/50 text-green-200" },
                { label: "Free Events", icon: "🎁", color: "bg-yellow-500/20 border-yellow-400/50 text-yellow-200" },
                { label: "Music", icon: "🎵", color: "bg-purple-500/20 border-purple-400/50 text-purple-200" },
                { label: "Business", icon: "💼", color: "bg-blue-500/20 border-blue-400/50 text-blue-200" },
                { label: "Food & Drink", icon: "🍽️", color: "bg-orange-500/20 border-orange-400/50 text-orange-200" }
              ].map((filter, index) => (
                <Badge 
                  key={index}
                  className={`px-3 py-1 text-sm border cursor-pointer transition-all duration-300 hover:scale-105 ${filter.color}`}
                >
                  <span className="mr-1">{filter.icon}</span>
                  {filter.label}
                </Badge>
              ))}
            </div>
            
            {/* Popular Searches */}
            <div className="flex flex-wrap justify-center items-center gap-2 text-sm">
              <span className="text-white/70">Trending:</span>
              {popularSearches.map((search, index) => (
                <button
                  key={index}
                  className="text-yellow-300 hover:text-yellow-200 underline transition-colors"
                  onClick={() => setSearchQuery(search)}
                >
                  {search}
                </button>
              ))}
            </div>
          </div>

          {/* Action Buttons */}
          <div className="flex flex-col gap-4 sm:flex-row sm:justify-center sm:gap-6 mb-10">
            <Link to="/events">
              <Button 
                size="lg" 
                className="bg-gradient-to-r from-blue-500 to-purple-500 hover:from-blue-600 hover:to-purple-600 text-white px-8 py-4 text-lg transition-all duration-300 hover:scale-105 hover:shadow-2xl group border-0"
              >
                <Calendar className="mr-3 h-5 w-5 group-hover:scale-110 transition-transform" />
                Browse All Events
                <span className="ml-2 text-xs bg-white/20 px-2 py-1 rounded-full">
                  {liveStats.activeEvents.toLocaleString()}+
                </span>
              </Button>
            </Link>
            <div className="flex gap-3">
              <Button 
                size="lg" 
                variant="outline" 
                className="px-6 py-4 text-base border-2 border-white/30 bg-white/10 backdrop-blur-sm hover:bg-white/20 text-white transition-all duration-300 hover:scale-105"
              >
                <MapPin className="mr-2 h-4 w-4" />
                Near Me
              </Button>
              <Button 
                size="lg" 
                variant="outline" 
                className="px-6 py-4 text-base border-2 border-yellow-300/50 bg-yellow-300/10 backdrop-blur-sm hover:bg-yellow-300/20 text-white transition-all duration-300 hover:scale-105"
              >
                <Zap className="mr-2 h-4 w-4" />
                Surprise Me
              </Button>
            </div>
          </div>
          
          {/* Social Proof - Inspired by TicketSwap */}
          <div className="mb-12 flex flex-wrap justify-center gap-4">
            <Badge variant="secondary" className="bg-white/15 backdrop-blur-sm text-white px-4 py-2 border border-white/20">
              <Heart className="mr-2 h-4 w-4 text-red-400" />
              2.5M+ Happy Attendees
            </Badge>
            <Badge variant="secondary" className="bg-white/15 backdrop-blur-sm text-white px-4 py-2 border border-white/20">
              <Shield className="mr-2 h-4 w-4 text-green-400" />
              100% Fraud Protection
            </Badge>
            <Badge variant="secondary" className="bg-white/15 backdrop-blur-sm text-white px-4 py-2 border border-white/20">
              <Star className="mr-2 h-4 w-4 text-yellow-400" />
              4.9/5 Rating
            </Badge>
          </div>
          
          {/* Statistics Grid */}
          <div className="grid grid-cols-2 gap-6 sm:grid-cols-4">
            <div className="text-center group cursor-pointer">
              <div className="text-2xl lg:text-3xl font-bold bg-gradient-to-r from-yellow-300 to-orange-300 bg-clip-text text-transparent group-hover:scale-110 transition-transform duration-300 mb-1">
                {liveStats.activeEvents.toLocaleString()}+
              </div>
              <div className="text-xs lg:text-sm text-white/90 font-medium">Live Events</div>
            </div>
            <div className="text-center group cursor-pointer">
              <div className="text-2xl lg:text-3xl font-bold bg-gradient-to-r from-pink-300 to-purple-300 bg-clip-text text-transparent group-hover:scale-110 transition-transform duration-300 mb-1">
                2.5M+
              </div>
              <div className="text-xs lg:text-sm text-white/90 font-medium">Attendees</div>
            </div>
            <div className="text-center group cursor-pointer">
              <div className="text-2xl lg:text-3xl font-bold bg-gradient-to-r from-blue-300 to-cyan-300 bg-clip-text text-transparent group-hover:scale-110 transition-transform duration-300 mb-1">
                {liveStats.cities}+
              </div>
              <div className="text-xs lg:text-sm text-white/90 font-medium">Cities</div>
            </div>
            <div className="text-center group cursor-pointer">
              <div className="text-2xl lg:text-3xl font-bold bg-gradient-to-r from-green-300 to-emerald-300 bg-clip-text text-transparent group-hover:scale-110 transition-transform duration-300 mb-1">
                0%
              </div>
              <div className="text-xs lg:text-sm text-white/90 font-medium">Fraud Rate</div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default Hero;
