
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import EventCard from "./EventCard";
import { Link } from "react-router-dom";
import { Clock, TrendingUp, MapPin } from "lucide-react";

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

  const trendingEvents = events.slice(0, 3);
  const urgentEvents = events.filter(event => event.available < 100 && event.available > 0);

  return (
    <section className="py-20 bg-gradient-to-br from-white via-blue-50 to-purple-50">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        {/* Urgent Events Alert */}
        {urgentEvents.length > 0 && (
          <div className="mb-12 bg-gradient-to-r from-red-500 to-pink-500 rounded-xl p-6 text-white">
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-3">
                <Clock className="h-6 w-6 animate-pulse" />
                <div>
                  <h3 className="text-xl font-bold">⚡ Limited Tickets Alert!</h3>
                  <p className="text-red-100">These events are almost sold out. Grab your tickets now!</p>
                </div>
              </div>
              <Badge className="bg-white/20 text-white">
                {urgentEvents.length} events
              </Badge>
            </div>
          </div>
        )}

        {/* Trending Now Section */}
        <div className="mb-16">
          <div className="flex items-center justify-between mb-8">
            <div className="flex items-center space-x-3">
              <TrendingUp className="h-6 w-6 text-orange-500" />
              <h2 className="text-2xl font-bold text-gray-900">🔥 Trending Now</h2>
              <Badge className="bg-orange-100 text-orange-700">Hot</Badge>
            </div>
            <Link to="/events?filter=trending">
              <Button variant="outline" size="sm">View All Trending</Button>
            </Link>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {trendingEvents.map((event, index) => (
              <div key={event.id} className="relative">
                <EventCard {...event} />
                {index === 0 && (
                  <Badge className="absolute -top-2 -right-2 bg-orange-500 text-white z-10">
                    #1 Trending
                  </Badge>
                )}
              </div>
            ))}
          </div>
        </div>

        {/* Featured Events Header */}
        <div className="text-center mb-16">
          <h2 className="text-3xl font-bold text-gray-900 sm:text-4xl mb-4">
            🎯 Handpicked Events For You
          </h2>
          <p className="text-xl text-gray-600 max-w-2xl mx-auto">
            Discover amazing events across all categories. From business conferences 
            to music festivals - find what inspires you.
          </p>
          
          {/* Live Activity Indicator */}
          <div className="mt-6 flex items-center justify-center space-x-4 text-sm text-gray-500">
            <div className="flex items-center space-x-2">
              <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></div>
              <span>1,247 people viewing events</span>
            </div>
            <span>•</span>
            <div className="flex items-center space-x-2">
              <span>127 tickets sold in the last hour</span>
            </div>
          </div>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 animate-fade-in">
          {events.map((event, index) => (
            <div key={event.id} className="animate-slide-up relative" style={{ animationDelay: `${index * 0.1}s` }}>
              <EventCard {...event} />
              
              {/* Urgency Badges */}
              {event.available === 0 && (
                <Badge className="absolute top-3 left-3 bg-red-500 text-white">
                  Sold Out
                </Badge>
              )}
              {event.available > 0 && event.available < 50 && (
                <Badge className="absolute top-3 left-3 bg-orange-500 text-white animate-pulse">
                  Only {event.available} left!
                </Badge>
              )}
              {event.price === "Free" && (
                <Badge className="absolute top-3 right-3 bg-green-500 text-white">
                  Free Event
                </Badge>
              )}
            </div>
          ))}
        </div>
        
        {/* Enhanced CTA Section */}
        <div className="text-center mt-16 bg-gradient-to-r from-blue-50 to-purple-50 rounded-2xl p-8">
          <h3 className="text-2xl font-bold mb-4">Can't Find What You're Looking For?</h3>
          <p className="text-gray-600 mb-6">Browse our complete catalog of events or create an alert for your interests</p>
          
          <div className="flex flex-col sm:flex-row gap-4 justify-center items-center">
            <Link to="/events">
              <Button 
                size="lg"
                className="px-8 py-4 text-lg bg-gradient-to-r from-blue-500 to-purple-500 hover:from-blue-600 hover:to-purple-600 text-white transition-all duration-300 hover:scale-105 hover:shadow-lg group"
              >
                <span className="group-hover:scale-110 transition-transform inline-block">🎪</span>
                <span className="ml-2">Explore All 50,000+ Events</span>
              </Button>
            </Link>
            
            <Button 
              variant="outline" 
              size="lg"
              className="px-8 py-4 text-lg border-2 border-purple-300 hover:bg-purple-50 text-purple-600"
            >
              🔔 Set Event Alerts
            </Button>
          </div>
          
          {/* Location-Based CTA */}
          <div className="mt-6 flex items-center justify-center space-x-2 text-sm text-gray-500">
            <MapPin className="h-4 w-4" />
            <span>Showing events worldwide • </span>
            <button className="text-blue-600 hover:underline">Filter by your location</button>
          </div>
        </div>
      </div>
    </section>
  );
};

export default FeaturedEvents;
