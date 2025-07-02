
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Search, MapPin, Calendar, Users, Star, Zap, TrendingUp, Music, Palette, Briefcase } from "lucide-react";
import { Link } from "react-router-dom";
import { useState } from "react";

const Hero = () => {
  const [searchQuery, setSearchQuery] = useState("");

  const quickFilters = [
    { label: "Tonight", emoji: "🌙", count: 23, gradient: "from-indigo-500 to-purple-600" },
    { label: "This Weekend", emoji: "🎉", count: 156, gradient: "from-pink-500 to-rose-500" },
    { label: "Free Events", emoji: "🎁", count: 42, gradient: "from-green-500 to-emerald-500" },
    { label: "Music", emoji: "🎵", count: 289, gradient: "from-blue-500 to-cyan-500" },
    { label: "Food & Drink", emoji: "🍽️", count: 67, gradient: "from-orange-500 to-amber-500" }
  ];

  const categories = [
    { icon: Music, label: "Music", count: "1.2k" },
    { icon: Palette, label: "Arts", count: "840" },
    { icon: Briefcase, label: "Business", count: "620" },
  ];

  return (
    <section className="relative overflow-hidden bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900 dark:from-slate-950 dark:via-purple-950 dark:to-slate-950 text-white min-h-[90vh] flex items-center">
      {/* Animated Background */}
      <div className="absolute inset-0">
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_20%_50%,rgba(120,119,198,0.3),transparent_50%)] dark:bg-[radial-gradient(circle_at_20%_50%,rgba(120,119,198,0.2),transparent_50%)] animate-pulse"></div>
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_80%_20%,rgba(255,119,198,0.3),transparent_50%)] dark:bg-[radial-gradient(circle_at_80%_20%,rgba(255,119,198,0.2),transparent_50%)] animate-pulse animation-delay-2000"></div>
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_40%_80%,rgba(119,198,255,0.3),transparent_50%)] dark:bg-[radial-gradient(circle_at_40%_80%,rgba(119,198,255,0.2),transparent_50%)] animate-pulse animation-delay-4000"></div>
      </div>

      {/* Floating Elements */}
      <div className="absolute top-20 left-10 w-20 h-20 bg-gradient-to-r from-pink-500 to-violet-500 dark:from-pink-600 dark:to-violet-600 rounded-full opacity-20 dark:opacity-15 animate-bounce"></div>
      <div className="absolute top-40 right-20 w-16 h-16 bg-gradient-to-r from-cyan-500 to-blue-500 dark:from-cyan-600 dark:to-blue-600 rounded-full opacity-20 dark:opacity-15 animate-bounce animation-delay-2000"></div>
      <div className="absolute bottom-40 left-20 w-12 h-12 bg-gradient-to-r from-green-500 to-emerald-500 dark:from-green-600 dark:to-emerald-600 rounded-full opacity-20 dark:opacity-15 animate-bounce animation-delay-4000"></div>

      {/* Live Activity Indicator */}
      <div className="absolute top-6 right-6 bg-green-500/90 dark:bg-green-600/90 backdrop-blur-sm text-white px-4 py-2 rounded-full text-sm font-medium flex items-center space-x-2 shadow-lg border border-green-400/30 dark:border-green-500/30">
        <div className="relative">
          <div className="w-2 h-2 bg-white rounded-full"></div>
          <div className="absolute inset-0 w-2 h-2 bg-white rounded-full animate-ping"></div>
        </div>
        <span>1,247 browsing now</span>
      </div>

      <div className="container relative mx-auto px-4 py-16">
        <div className="mx-auto max-w-5xl text-center">
          
          {/* Main Headline with Animation */}
          <div className="mb-8 space-y-4">
            <h1 className="text-5xl md:text-7xl font-bold tracking-tight">
              <span className="inline-block animate-fade-in">Find</span>{" "}
              <span className="inline-block bg-gradient-to-r from-pink-400 via-purple-400 to-cyan-400 bg-clip-text text-transparent animate-fade-in animation-delay-200">
                Amazing
              </span>{" "}
              <span className="inline-block animate-fade-in animation-delay-400">Events</span>
              <br />
              <span className="inline-block text-4xl md:text-6xl animate-fade-in animation-delay-600">Near You</span>
            </h1>
            
            <p className="text-xl md:text-2xl text-gray-300 dark:text-gray-400 max-w-3xl mx-auto animate-fade-in animation-delay-800">
              Discover concerts, festivals, workshops, and more. 
              <br className="hidden md:block" />
              <span className="bg-gradient-to-r from-yellow-400 to-orange-400 bg-clip-text text-transparent font-semibold">
                Secure tickets in seconds, memories that last forever.
              </span>
            </p>
          </div>

          {/* Enhanced Search Bar */}
          <div className="mb-10 mx-auto max-w-3xl animate-slide-up animation-delay-1000">
            <div className="relative">
              <div className="absolute inset-0 bg-gradient-to-r from-pink-500 to-violet-500 rounded-2xl blur opacity-20 dark:opacity-15"></div>
              <div className="relative flex items-center bg-white/10 dark:bg-white/5 backdrop-blur-lg rounded-2xl border border-white/20 dark:border-white/10 p-2 shadow-2xl">
                <Search className="absolute left-6 h-6 w-6 text-gray-300 dark:text-gray-400" />
                <Input
                  type="text"
                  placeholder="Search events, artists, or venues..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="flex-1 pl-14 pr-4 py-6 text-lg border-0 focus:ring-0 bg-transparent text-white placeholder-gray-300 dark:placeholder-gray-400"
                />
                <Button className="px-8 py-6 bg-gradient-to-r from-pink-500 to-violet-500 hover:from-pink-600 hover:to-violet-600 text-white rounded-xl shadow-lg hover:shadow-xl transition-all duration-300 transform hover:scale-105">
                  <Search className="mr-2 h-5 w-5" />
                  Search
                </Button>
              </div>
            </div>
          </div>

          {/* Quick Filters with Hover Effects */}
          <div className="mb-12 flex flex-wrap justify-center gap-4 animate-fade-in animation-delay-1200">
            {quickFilters.map((filter, index) => (
              <Button
                key={index}
                variant="outline"
                className={`group relative overflow-hidden bg-white/10 dark:bg-white/5 backdrop-blur-sm border-white/20 dark:border-white/10 text-white hover:text-white hover:scale-110 transition-all duration-300 shadow-lg hover:shadow-xl`}
              >
                <div className={`absolute inset-0 bg-gradient-to-r ${filter.gradient} opacity-0 group-hover:opacity-100 transition-opacity duration-300`}></div>
                <div className="relative flex items-center space-x-2">
                  <span className="text-lg">{filter.emoji}</span>
                  <span>{filter.label}</span>
                  <Badge className="bg-white/20 dark:bg-white/10 text-white text-xs">
                    {filter.count}
                  </Badge>
                </div>
              </Button>
            ))}
          </div>

          {/* Category Icons */}
          <div className="mb-12 flex justify-center space-x-8 animate-fade-in animation-delay-1400">
            {categories.map((category, index) => (
              <div key={index} className="text-center group cursor-pointer">
                <div className="w-16 h-16 mx-auto mb-2 bg-white/10 dark:bg-white/5 backdrop-blur-sm rounded-2xl flex items-center justify-center group-hover:bg-white/20 dark:group-hover:bg-white/10 transition-all duration-300 group-hover:scale-110">
                  <category.icon className="h-8 w-8 text-gray-300 dark:text-gray-400 group-hover:text-white" />
                </div>
                <div className="text-sm text-gray-300 dark:text-gray-400 group-hover:text-white transition-colors">
                  {category.label}
                </div>
                <div className="text-xs text-gray-500 dark:text-gray-600">{category.count} events</div>
              </div>
            ))}
          </div>

          {/* CTA Buttons */}
          <div className="flex flex-col sm:flex-row gap-4 justify-center mb-12 animate-slide-up animation-delay-1600">
            <Link to="/events">
              <Button 
                size="lg" 
                className="group px-10 py-6 text-lg bg-gradient-to-r from-pink-500 to-violet-500 hover:from-pink-600 hover:to-violet-600 text-white rounded-xl shadow-lg hover:shadow-2xl transition-all duration-300 transform hover:scale-105"
              >
                <Calendar className="mr-3 h-6 w-6 group-hover:rotate-12 transition-transform" />
                Browse All Events
                <div className="absolute inset-0 bg-gradient-to-r from-pink-400 to-violet-400 rounded-xl opacity-0 group-hover:opacity-20 transition-opacity duration-300"></div>
              </Button>
            </Link>
            <Button 
              size="lg" 
              variant="outline"
              className="px-10 py-6 text-lg border-2 border-white/30 dark:border-white/20 bg-white/10 dark:bg-white/5 backdrop-blur-sm text-white hover:bg-white/20 dark:hover:bg-white/10 hover:scale-105 rounded-xl shadow-lg hover:shadow-2xl transition-all duration-300"
            >
              <MapPin className="mr-3 h-6 w-6" />
              Events Near Me
            </Button>
          </div>

          {/* Animated Stats */}
          <div className="grid grid-cols-3 gap-8 max-w-lg mx-auto animate-fade-in animation-delay-1800">
            <div className="text-center group">
              <div className="text-3xl md:text-4xl font-bold text-transparent bg-gradient-to-r from-pink-400 to-violet-400 bg-clip-text group-hover:scale-110 transition-transform duration-300">
                45+
              </div>
              <div className="text-sm text-gray-400 dark:text-gray-500">Events Today</div>
            </div>
            <div className="text-center group">
              <div className="text-3xl md:text-4xl font-bold text-transparent bg-gradient-to-r from-cyan-400 to-blue-400 bg-clip-text group-hover:scale-110 transition-transform duration-300">
                2.5M+
              </div>
              <div className="text-sm text-gray-400 dark:text-gray-500">Happy Fans</div>
            </div>
            <div className="text-center group">
              <div className="text-3xl md:text-4xl font-bold text-transparent bg-gradient-to-r from-green-400 to-emerald-400 bg-clip-text group-hover:scale-110 transition-transform duration-300">
                85+
              </div>
              <div className="text-sm text-gray-400 dark:text-gray-500">Cities</div>
            </div>
          </div>

          {/* Trust Indicators */}
          <div className="mt-16 flex flex-wrap justify-center gap-6 text-sm text-gray-400 dark:text-gray-500 animate-fade-in animation-delay-2000">
            <div className="flex items-center space-x-2 group">
              <Star className="h-4 w-4 text-yellow-500 group-hover:scale-125 transition-transform" />
              <span>4.9/5 rating</span>
            </div>
            <span className="hidden md:inline">•</span>
            <div className="flex items-center space-x-2 group">
              <Users className="h-4 w-4 text-blue-400 group-hover:scale-125 transition-transform" />
              <span>2.5M+ users</span>
            </div>
            <span className="hidden md:inline">•</span>
            <div className="flex items-center space-x-2 group">
              <Zap className="h-4 w-4 text-green-400 group-hover:scale-125 transition-transform" />
              <span>Instant tickets</span>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default Hero;
