import { Button } from "@/components/ui/button";
import EventCard from "./EventCard";

const FeaturedEvents = () => {
  const events = [
    {
      title: "Blockchain Summit 2024",
      date: "March 15, 2024 • 9:00 AM",
      location: "San Francisco Convention Center",
      price: "0.05 ETH",
      image: "/placeholder.svg",
      attendees: 1200,
      category: "Technology",
      available: 150,
      total: 500
    },
    {
      title: "NFT Art Gallery Opening",
      date: "March 22, 2024 • 7:00 PM",
      location: "Digital Arts Museum, NYC",
      price: "0.02 ETH",
      image: "/placeholder.svg",
      attendees: 350,
      category: "Art & Culture",
      available: 0,
      total: 200
    },
    {
      title: "DeFi Conference",
      date: "April 5, 2024 • 10:00 AM",
      location: "London Excel Centre",
      price: "0.08 ETH",
      image: "/placeholder.svg",
      attendees: 800,
      category: "Finance",
      available: 75,
      total: 300
    },
    {
      title: "Web3 Developers Meetup",
      date: "April 12, 2024 • 6:00 PM",
      location: "Berlin Tech Hub",
      price: "Free",
      image: "/placeholder.svg",
      attendees: 250,
      category: "Technology",
      available: 120,
      total: 150
    },
    {
      title: "Crypto Music Festival",
      date: "May 1, 2024 • 2:00 PM",
      location: "Miami Beach",
      price: "0.15 ETH",
      image: "/placeholder.svg",
      attendees: 2500,
      category: "Music",
      available: 500,
      total: 1000
    },
    {
      title: "Metaverse Fashion Week",
      date: "May 20, 2024 • 12:00 PM",
      location: "Virtual Reality Space",
      price: "0.03 ETH",
      image: "/placeholder.svg",
      attendees: 1800,
      category: "Fashion",
      available: 300,
      total: 600
    }
  ];

  return (
    <section className="py-20 bg-white">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-16">
          <h2 className="text-3xl font-bold text-gray-900 sm:text-4xl mb-4">
            Featured Events
          </h2>
          <p className="text-xl text-gray-600 max-w-2xl mx-auto">
            Discover amazing events powered by blockchain technology. 
            Secure your spot with NFT tickets that you truly own.
          </p>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 animate-fade-in">
          {events.map((event, index) => (
            <div key={index} className="animate-slide-up" style={{ animationDelay: `${index * 0.1}s` }}>
              <EventCard {...event} />
            </div>
          ))}
        </div>
        
        <div className="text-center mt-12">
          <Button 
            variant="outline" 
            size="lg"
            className="px-8 py-4 text-lg border-2 hover:bg-gray-50"
          >
            View All Events
          </Button>
        </div>
      </div>
    </section>
  );
};

export default FeaturedEvents;
