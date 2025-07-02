
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import EventCard from "./EventCard";
import { Link } from "react-router-dom";
import { Clock, TrendingUp, MapPin, Calendar, Users, Zap, Fire } from "lucide-react";

const FeaturedEvents = () => {
  const events = [
    {
      id: "1",
      title: "Tech Innovation Summit 2024",
      date: "March 15, 2024 • 9:00 AM",
      location: "San Francisco Convention Center",
      price: "$125.00",
      image: "https://images.unsplash.com/photo-1540575467063-178a50c2df87?w=400&h=300&fit=crop",
      attendees: 2500,
      category: "Technology",
      available: 150,
      total: 500
    },
    {
      id: "2",
      title: "Digital Art Exhibition",
      date: "March 22, 2024 • 6:00 PM",
      location: "Brooklyn Museum, NYC",
      price: "$45.00",
      image: "https://images.unsplash.com/photo-1571115764595-644a1f56a55c?w=400&h=300&fit=crop",
      attendees: 800,
      category: "Art & Culture",
      available: 0,
      total: 200
    },
    {
      id: "3",
      title: "Business Networking Gala",
      date: "April 5, 2024 • 7:00 PM",
      location: "London Excel Centre",
      price: "$195.00",
      image: "https://images.unsplash.com/photo-1511578314322-379afb476865?w=400&h=300&fit=crop",
      attendees: 1200,
      category: "Business",
      available: 75,
      total: 300
    },
    {
      id: "4",
      title: "Music Festival Summer",
      date: "May 20, 2024 • 3:00 PM",
      location: "Central Park, NYC",
      price: "$299.00",
      image: "https://images.unsplash.com/photo-1470813740244-df37b8c1edcb?w=400&h=300&fit=crop",
      attendees: 5000,
      category: "Music",
      available: 800,
      total: 2000
    },
    {
      id: "5",
      title: "Startup Pitch Competition",
      date: "April 28, 2024 • 2:00 PM",
      location: "Silicon Valley Hub",
      price: "Free",
      image: "https://images.unsplash.com/photo-1556761175-b413da4baf72?w=400&h=300&fit=crop",
      attendees: 400,
      category: "Business",
      available: 120,
      total: 150
    },
    {
      id: "6",
      title: "Wellness & Mindfulness Retreat",
      date: "June 10, 2024 • 9:00 AM",
      location: "Malibu Retreat Center",
      price: "$350.00",
      image: "https://images.unsplash.com/photo-1544367567-0f2fcb009e0b?w=400&h=300&fit=crop",
      attendees: 200,
      category: "Wellness",
      available: 50,
      total: 100
    }
  ];

  // Enhanced categorization
  const hotEvents = events.slice(0, 3);
  const urgentEvents = events.filter(event => event.available < 100 && event.available > 0);
  const freeEvents = events.filter(event => event.price === "Free");
  const endingSoon = events.filter(event => event.available < 50 && event.available > 0);

  return (
    <section className="py-16 bg-gradient-to-br from-white via-blue-50/50 to-purple-50/50">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Real-time Activity Banner */}
        <div className="mb-12 bg-gradient-to-r from-green-500 to-emerald-500 rounded-2xl p-6 text-white relative overflow-hidden">
          <div className="absolute inset-0 bg-gradient-to-r from-green-400/20 to-emerald-400/20"></div>
          <div className="relative flex flex-col sm:flex-row items-center justify-between">
            <div className="flex items-center space-x-4 mb-4 sm:mb-0">
              <div className="flex items-center space-x-2">
                <div className="w-3 h-3 bg-white rounded-full animate-pulse"></div>
                <span className="font-bold text-lg">🔥 Live Activity</span>
              </div>
              <div className="text-green-100">
                <span className="font-semibold">347 tickets</span> sold in the last 10 minutes
              </div>
            </div>
            <Button variant="outline" className="bg-white/20 border-white/30 text-white hover:bg-white/30">
              <Users className="w-4 h-4 mr-2" />
              See What's Popular
            </Button>
          </div>
        </div>

        {/* Multiple Event Categories */}
        
        {/* Ending Soon Section */}
        {endingSoon.length > 0 && (
          <div className="mb-16">
            <div className="flex items-center justify-between mb-8">
              <div className="flex items-center space-x-3">
                <Clock className="h-6 w-6 text-red-500 animate-pulse" />
                <h2 className="text-2xl font-bold text-gray-900">⏰ Ending Soon</h2>
                <Badge className="bg-red-100 text-red-700 animate-pulse">Limited Time</Badge>
              </div>
              <Link to="/events?filter=ending-soon">
                <Button variant="outline" size="sm" className="border-red-200 text-red-600 hover:bg-red-50">
                  View All
                </Button>
              </Link>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              {endingSoon.map((event, index) => (
                <div key={event.id} className="relative">
                  <EventCard {...event} />
                  <Badge className="absolute -top-2 -right-2 bg-red-500 text-white z-10 animate-pulse">
                    Only {event.available} left!
                  </Badge>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Hot Events Section */}
        <div className="mb-16">
          <div className="flex items-center justify-between mb-8">
            <div className="flex items-center space-x-3">
              <Fire className="h-6 w-6 text-orange-500" />
              <h2 className="text-2xl font-bold text-gray-900">🔥 Hot Right Now</h2>
              <Badge className="bg-orange-100 text-orange-700">Trending</Badge>
            </div>
            <Link to="/events?filter=hot">
              <Button variant="outline" size="sm">View All Hot Events</Button>
            </Link>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {hotEvents.map((event, index) => (
              <div key={event.id} className="relative group">
                <EventCard {...event} />
                {index === 0 && (
                  <Badge className="absolute -top-2 -right-2 bg-gradient-to-r from-orange-500 to-red-500 text-white z-10">
                    #1 Popular
                  </Badge>
                )}
                <div className="absolute inset-0 bg-gradient-to-t from-orange-500/10 to-transparent opacity-0 group-hover:opacity-100 transition-opacity rounded-lg pointer-events-none"></div>
              </div>
            ))}
          </div>
        </div>

        {/* Quick Category Filters */}
        <div className="mb-12">
          <div className="flex flex-wrap justify-center gap-3">
            {[
              { label: "Tonight", count: 23, color: "bg-purple-100 text-purple-700 border-purple-200" },
              { label: "This Weekend", count: 89, color: "bg-blue-100 text-blue-700 border-blue-200" },
              { label: "Free Events", count: 15, color: "bg-green-100 text-green-700 border-green-200" },
              { label: "Music", count: 156, color: "bg-pink-100 text-pink-700 border-pink-200" },
              { label: "Business", count: 67, color: "bg-orange-100 text-orange-700 border-orange-200" },
              { label: "Food & Drink", count: 34, color: "bg-yellow-100 text-yellow-700 border-yellow-200" }
            ].map((category, index) => (
              <Button 
                key={index}
                variant="outline"
                className={`${category.color} hover:scale-105 transition-all duration-200`}
              >
                {category.label}
                <Badge className="ml-2 bg-white/70 text-xs">
                  {category.count}
                </Badge>
              </Button>
            ))}
          </div>
        </div>

        {/* Main Featured Events */}
        <div className="text-center mb-12">
          <h2 className="text-3xl font-bold text-gray-900 sm:text-4xl mb-4">
            🎯 All Featured Events
          </h2>
          <p className="text-xl text-gray-600 max-w-2xl mx-auto mb-6">
            Hand-picked events across all categories. From conferences to concerts - find your perfect experience.
          </p>
          
          {/* Enhanced Activity Indicators */}
          <div className="flex items-center justify-center space-x-6 text-sm text-gray-500">
            <div className="flex items-center space-x-2">
              <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></div>
              <span><strong>1,247</strong> people browsing</span>
            </div>
            <span>•</span>
            <div className="flex items-center space-x-2">
              <Zap className="w-4 h-4 text-yellow-500" />
              <span><strong>127</strong> tickets sold this hour</span>
            </div>
            <span>•</span>
            <div className="flex items-center space-x-2">
              <Calendar className="w-4 h-4 text-blue-500" />
              <span><strong>23</strong> events happening today</span>
            </div>
          </div>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {events.map((event, index) => (
            <div key={event.id} className="relative group" style={{ animationDelay: `${index * 0.1}s` }}>
              <EventCard {...event} />
              
              {/* Enhanced Badges */}
              {event.available === 0 && (
                <Badge className="absolute top-3 left-3 bg-gray-800 text-white z-10">
                  Sold Out
                </Badge>
              )}
              {event.available > 0 && event.available < 50 && (
                <Badge className="absolute top-3 left-3 bg-red-500 text-white animate-pulse z-10">
                  Only {event.available} left!
                </Badge>
              )}
              {event.price === "Free" && (
                <Badge className="absolute top-3 right-3 bg-green-500 text-white z-10">
                  Free Entry
                </Badge>
              )}
              {event.attendees > 2000 && (
                <Badge className="absolute bottom-3 left-3 bg-blue-500/90 text-white text-xs z-10">
                  🔥 Popular
                </Badge>
              )}
            </div>
          ))}
        </div>
        
        {/* Enhanced CTA Section */}
        <div className="text-center mt-16">
          <div className="bg-gradient-to-r from-blue-50 via-purple-50 to-pink-50 rounded-3xl p-8 mb-8">
            <h3 className="text-2xl font-bold mb-4">Don't See What You're Looking For?</h3>
            <p className="text-gray-600 mb-6">Explore our complete collection of events or set up personalized alerts</p>
            
            <div className="flex flex-col sm:flex-row gap-4 justify-center items-center">
              <Link to="/events">
                <Button 
                  size="lg"
                  className="px-8 py-4 text-lg bg-gradient-to-r from-blue-500 to-purple-500 hover:from-blue-600 hover:to-purple-600 text-white transition-all duration-300 hover:scale-105 hover:shadow-xl group"
                >
                  <Calendar className="mr-2 h-5 w-5 group-hover:rotate-12 transition-transform" />
                  Browse All 50,000+ Events
                </Button>
              </Link>
              
              <Button 
                variant="outline" 
                size="lg"
                className="px-8 py-4 text-lg border-2 border-purple-300 hover:bg-purple-50 text-purple-600 hover:scale-105 transition-all duration-300"
              >
                🔔 Create Event Alert
              </Button>
            </div>
          </div>
          
          {/* Location Suggestion */}
          <div className="flex items-center justify-center space-x-2 text-sm text-gray-500">
            <MapPin className="h-4 w-4" />
            <span>Events worldwide • </span>
            <button className="text-blue-600 hover:underline font-medium">
              Show events near me
            </button>
          </div>
        </div>
      </div>
    </section>
  );
};

export default FeaturedEvents;
