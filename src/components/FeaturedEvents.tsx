
import { Button } from "@/components/ui/button";
import EventCard from "./EventCard";
import { Link } from "react-router-dom";

const FeaturedEvents = () => {
  const events = [
    {
      id: "1",
      title: "🎵 Bass Drop Festival 2024",
      date: "March 15, 2024 • 9:00 PM",
      location: "🌴 Miami Beach Arena",
      price: "0.05 ETH",
      image: "https://images.unsplash.com/photo-1470813740244-df37b8c1edcb?w=400&h=300&fit=crop",
      attendees: 2500,
      category: "🎶 Music Festival",
      available: 150,
      total: 500
    },
    {
      id: "2",
      title: "🎨 Digital Art Rave",
      date: "March 22, 2024 • 10:00 PM",
      location: "🏙️ Brooklyn Warehouse, NYC",
      price: "0.02 ETH",
      image: "https://images.unsplash.com/photo-1500673922987-e212871fec22?w=400&h=300&fit=crop",
      attendees: 800,
      category: "🎭 Art & Culture",
      available: 0,
      total: 200
    },
    {
      id: "3",
      title: "🚀 Web3 Party Conference",
      date: "April 5, 2024 • 6:00 PM",
      location: "🇬🇧 London Excel Centre",
      price: "0.08 ETH",
      image: "https://images.unsplash.com/photo-1526374965328-7f61d4dc18c5?w=400&h=300&fit=crop",
      attendees: 1200,
      category: "💼 Tech & Networking",
      available: 75,
      total: 300
    },
    {
      id: "4",
      title: "🎮 GameFi Meetup & Party",
      date: "April 12, 2024 • 7:00 PM",
      location: "🇩🇪 Berlin Tech Hub",
      price: "Free",
      image: "https://images.unsplash.com/photo-1605810230434-7631ac76ec81?w=400&h=300&fit=crop",
      attendees: 400,
      category: "🎮 Gaming",
      available: 120,
      total: 150
    },
    {
      id: "5",
      title: "🌊 Crypto Beach Festival",
      date: "May 1, 2024 • 2:00 PM",
      location: "🏖️ Malibu Beach",
      price: "0.15 ETH",
      image: "https://images.unsplash.com/photo-1500375592092-40eb2168fd21?w=400&h=300&fit=crop",
      attendees: 3000,
      category: "🏖️ Beach Party",
      available: 500,
      total: 1000
    },
    {
      id: "6",
      title: "👗 Metaverse Fashion Week",
      date: "May 20, 2024 • 8:00 PM",
      location: "🌐 Virtual Reality Space",
      price: "0.03 ETH",
      image: "https://images.unsplash.com/photo-1470813740244-df37b8c1edcb?w=400&h=300&fit=crop",
      attendees: 1800,
      category: "👠 Fashion",
      available: 300,
      total: 600
    }
  ];

  return (
    <section className="py-20 bg-gradient-to-br from-white via-purple-50 to-pink-50">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-16">
          <h2 className="text-3xl font-bold text-gray-900 sm:text-4xl mb-4">
            🔥 Hottest Events Right Now
          </h2>
          <p className="text-xl text-gray-600 max-w-2xl mx-auto">
            From underground raves to exclusive galas - find your tribe and create memories that last forever! 
            Each ticket is a unique NFT designed by the event creators. 🎨✨
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
              className="px-8 py-4 text-lg border-2 border-purple-300 hover:bg-purple-50 text-purple-600"
            >
              🎪 Explore All Events
            </Button>
          </Link>
        </div>
      </div>
    </section>
  );
};

export default FeaturedEvents;
