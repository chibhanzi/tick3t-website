
import { Button } from "@/components/ui/button";
import EventCard from "./EventCard";
import { Link } from "react-router-dom";

const FeaturedEvents = () => {
  const events = [
    {
      id: "1",
      title: "Tech Innovation Summit 2024",
      date: "March 15, 2024 • 9:00 AM",
      location: "San Francisco Convention Center",
      price: "0.05 ETH",
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
      price: "0.02 ETH",
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
      price: "0.08 ETH",
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
      price: "0.12 ETH",
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
      price: "0.15 ETH",
      image: "https://images.unsplash.com/photo-1544367567-0f2fcb009e0b?w=400&h=300&fit=crop",
      attendees: 200,
      category: "Wellness",
      available: 50,
      total: 100
    }
  ];

  return (
    <section className="py-20 bg-gradient-to-br from-white via-blue-50 to-purple-50">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-16">
          <h2 className="text-3xl font-bold text-gray-900 sm:text-4xl mb-4">
            Featured Events
          </h2>
          <p className="text-xl text-gray-600 max-w-2xl mx-auto">
            Discover amazing events across all categories. From business conferences 
            to music festivals - find what inspires you.
          </p>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 animate-fade-in">
          {events.map((event, index) => (
            <div key={event.id} className="animate-slide-up" style={{ animationDelay: `${index * 0.1}s` }}>
              <EventCard {...event} />
            </div>
          ))}
        </div>
        
        <div className="text-center mt-12">
          <Link to="/events">
            <Button 
              variant="outline" 
              size="lg"
              className="px-8 py-4 text-lg border-2 border-blue-300 hover:bg-blue-50 text-blue-600 transition-all duration-300 hover:scale-105 hover:shadow-lg group"
            >
              <span className="group-hover:scale-110 transition-transform inline-block">🎪</span>
              <span className="ml-2">Explore All Events</span>
            </Button>
          </Link>
        </div>
      </div>
    </section>
  );
};

export default FeaturedEvents;
