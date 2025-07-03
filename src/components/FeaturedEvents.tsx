import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import EventCard from "./EventCard";
import { Link } from "react-router-dom";
import { Clock, MapPin, Calendar, Users, Zap } from "lucide-react";

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

  const urgentEvents = events.filter(event => event.available < 100 && event.available > 0);
  const freeEvents = events.filter(event => event.price === "Free");

  return (
    <section className="py-16 bg-gray-50 dark:bg-gray-800">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Section Header */}
        <div className="text-center mb-12">
          <h2 className="text-3xl font-bold text-gray-900 dark:text-white mb-4">
            Trending Events
          </h2>
          <p className="text-lg text-gray-600 dark:text-gray-300 max-w-2xl mx-auto">
            Popular events people are booking right now
          </p>
        </div>

        {/* Ending Soon Section */}
        {urgentEvents.length > 0 && (
          <div className="mb-12">
            <div className="flex items-center justify-between mb-6">
              <div className="flex items-center space-x-3">
                <Clock className="h-5 w-5 text-red-500 dark:text-red-400" />
                <h3 className="text-xl font-semibold text-gray-900 dark:text-white">Almost Sold Out</h3>
                <Badge className="bg-red-100 dark:bg-red-900 text-red-700 dark:text-red-300 border-red-200 dark:border-red-700">Limited</Badge>
              </div>
              <Link to="/events?filter=ending-soon">
                <Button variant="outline" size="sm" className="border-gray-300 dark:border-gray-600 text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700">
                  View All
                </Button>
              </Link>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              {urgentEvents.slice(0, 3).map((event) => (
                <div key={event.id} className="relative">
                  <EventCard {...event} />
                  <Badge className="absolute -top-2 -right-2 bg-red-500 dark:bg-red-600 text-white z-10">
                    {event.available} left
                  </Badge>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Free Events */}
        {freeEvents.length > 0 && (
          <div className="mb-12">
            <div className="flex items-center justify-between mb-6">
              <div className="flex items-center space-x-3">
                <h3 className="text-xl font-semibold text-gray-900 dark:text-white">Free Events</h3>
                <Badge className="bg-green-100 dark:bg-green-900 text-green-700 dark:text-green-300 border-green-200 dark:border-green-700">No Cost</Badge>
              </div>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              {freeEvents.map((event) => (
                <div key={event.id} className="relative">
                  <EventCard {...event} />
                  <Badge className="absolute top-3 right-3 bg-green-500 dark:bg-green-600 text-white z-10">
                    Free
                  </Badge>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* All Events Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-12">
          {events.map((event) => (
            <div key={event.id} className="group">
              <EventCard {...event} />
            </div>
          ))}
        </div>
        
        {/* Simple CTA */}
        <div className="text-center">
          <Link to="/events">
            <Button 
              size="lg"
              className="px-8 py-4 bg-gradient-to-r from-blue-500 to-purple-500 hover:from-blue-600 hover:to-purple-600 text-white rounded-xl"
            >
              <Calendar className="mr-2 h-5 w-5" />
              See All Events
            </Button>
          </Link>
        </div>
      </div>
    </section>
  );
};

export default FeaturedEvents;
