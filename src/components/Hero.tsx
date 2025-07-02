
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Search, MapPin, Calendar, Users, Star, Zap } from "lucide-react";
import { Link } from "react-router-dom";
import { useState } from "react";

const Hero = () => {
  const [searchQuery, setSearchQuery] = useState("");

  const quickFilters = [
    { label: "Tonight", emoji: "🌙", count: 23 },
    { label: "This Weekend", emoji: "🎉", count: 156 },
    { label: "Free Events", emoji: "🎁", count: 42 },
    { label: "Music", emoji: "🎵", count: 289 },
    { label: "Food & Drink", emoji: "🍽️", count: 67 }
  ];

  const liveStats = {
    browsing: 1247,
    eventsToday: 45,
    cities: 85
  };

  return (
    <section className="relative overflow-hidden bg-gradient-to-br from-blue-50 via-white to-purple-50">
      {/* Subtle Background Pattern */}
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_30%_20%,rgba(59,130,246,0.05),transparent_50%)] bg-[radial-gradient(circle_at_70%_80%,rgba(147,51,234,0.05),transparent_50%)]"></div>
      
      {/* Live Activity Badge */}
      <div className="absolute top-6 right-6 bg-green-500 text-white px-3 py-1 rounded-full text-sm font-medium flex items-center space-x-2 shadow-lg">
        <div className="w-2 h-2 bg-white rounded-full animate-pulse"></div>
        <span>{liveStats.browsing.toLocaleString()} browsing now</span>
      </div>

      <div className="container relative mx-auto px-4 py-16 sm:py-24">
        <div className="mx-auto max-w-4xl text-center">
          
          {/* Simple, Powerful Headline */}
          <h1 className="mb-6 text-4xl font-bold tracking-tight text-gray-900 sm:text-6xl">
            Find Amazing Events
            <br />
            <span className="bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
              Near You
            </span>
          </h1>

          <p className="mb-8 text-xl text-gray-600 max-w-2xl mx-auto">
            Discover concerts, festivals, workshops, and more. 
            Secure tickets in seconds, memories that last forever.
          </p>

          {/* Clean Search Bar */}
          <div className="mb-8 mx-auto max-w-2xl">
            <div className="relative flex items-center bg-white rounded-2xl shadow-lg border border-gray-200 p-2">
              <Search className="absolute left-4 h-5 w-5 text-gray-400" />
              <Input
                type="text"
                placeholder="Search events, artists, or venues..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="flex-1 pl-12 pr-4 py-4 text-base border-0 focus:ring-0 bg-transparent"
              />
              <Button className="px-8 py-3 bg-gradient-to-r from-blue-500 to-purple-500 hover:from-blue-600 hover:to-purple-600 text-white rounded-xl">
                Search
              </Button>
            </div>
          </div>

          {/* Quick Filters */}
          <div className="mb-12 flex flex-wrap justify-center gap-3">
            {quickFilters.map((filter, index) => (
              <Button
                key={index}
                variant="outline"
                className="bg-white/80 backdrop-blur-sm border-gray-200 hover:bg-white hover:scale-105 transition-all duration-200 shadow-sm"
              >
                <span className="mr-2">{filter.emoji}</span>
                {filter.label}
                <Badge className="ml-2 bg-gray-100 text-gray-700 text-xs">
                  {filter.count}
                </Badge>
              </Button>
            ))}
          </div>

          {/* Clean CTA Buttons */}
          <div className="flex flex-col sm:flex-row gap-4 justify-center mb-12">
            <Link to="/events">
              <Button 
                size="lg" 
                className="px-8 py-4 text-lg bg-gradient-to-r from-blue-500 to-purple-500 hover:from-blue-600 hover:to-purple-600 text-white rounded-xl shadow-lg hover:shadow-xl transition-all duration-300"
              >
                <Calendar className="mr-2 h-5 w-5" />
                Browse All Events
              </Button>
            </Link>
            <Button 
              size="lg" 
              variant="outline"
              className="px-8 py-4 text-lg border-2 border-gray-300 hover:bg-gray-50 rounded-xl shadow-lg hover:shadow-xl transition-all duration-300"
            >
              <MapPin className="mr-2 h-5 w-5" />
              Events Near Me
            </Button>
          </div>

          {/* Simple Stats */}
          <div className="grid grid-cols-3 gap-8 max-w-md mx-auto">
            <div className="text-center">
              <div className="text-2xl font-bold text-gray-900 mb-1">
                {liveStats.eventsToday}+
              </div>
              <div className="text-sm text-gray-600">Events Today</div>
            </div>
            <div className="text-center">
              <div className="text-2xl font-bold text-gray-900 mb-1">
                2.5M+
              </div>
              <div className="text-sm text-gray-600">Happy Fans</div>
            </div>
            <div className="text-center">
              <div className="text-2xl font-bold text-gray-900 mb-1">
                {liveStats.cities}+
              </div>
              <div className="text-sm text-gray-600">Cities</div>
            </div>
          </div>

          {/* Trust Indicators */}
          <div className="mt-12 flex flex-wrap justify-center gap-4 text-sm text-gray-500">
            <div className="flex items-center space-x-2">
              <Star className="h-4 w-4 text-yellow-500" />
              <span>4.9/5 rating</span>
            </div>
            <span>•</span>
            <div className="flex items-center space-x-2">
              <Users className="h-4 w-4 text-blue-500" />
              <span>2.5M+ users</span>
            </div>
            <span>•</span>
            <div className="flex items-center space-x-2">
              <Zap className="h-4 w-4 text-green-500" />
              <span>Instant tickets</span>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default Hero;
