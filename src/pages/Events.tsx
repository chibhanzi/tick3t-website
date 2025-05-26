
import { useState } from "react";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import EventCard from "@/components/EventCard";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Search } from "lucide-react";

const Events = () => {
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("All");

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
    // Add more events as needed
  ];

  const categories = ["All", "🎶 Music Festival", "🎭 Art & Culture", "💼 Tech & Networking", "🎮 Gaming", "🏖️ Beach Party", "👠 Fashion"];

  const filteredEvents = events.filter(event => {
    const matchesSearch = event.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         event.location.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesCategory = selectedCategory === "All" || event.category === selectedCategory;
    return matchesSearch && matchesCategory;
  });

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-50 via-pink-50 to-yellow-50">
      <Header />
      
      <main className="container mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="text-center mb-12">
          <h1 className="text-4xl font-bold mb-4 bg-gradient-to-r from-purple-600 to-pink-600 bg-clip-text text-transparent">
            🎉 Discover Epic Events
          </h1>
          <p className="text-xl text-gray-600 max-w-2xl mx-auto">
            From underground raves to exclusive experiences - find your perfect vibe! 🔥
          </p>
        </div>

        <div className="flex flex-col md:flex-row gap-4 mb-8">
          <div className="relative flex-1">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
            <Input
              placeholder="Search events, locations, vibes..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-10 border-purple-200 focus:border-purple-400"
            />
          </div>
          
          <div className="flex gap-2 flex-wrap">
            {categories.map((category) => (
              <Button
                key={category}
                variant={selectedCategory === category ? "default" : "outline"}
                size="sm"
                onClick={() => setSelectedCategory(category)}
                className={selectedCategory === category 
                  ? "bg-gradient-to-r from-purple-500 to-pink-500 text-white" 
                  : "border-purple-200 hover:bg-purple-50"
                }
              >
                {category}
              </Button>
            ))}
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {filteredEvents.map((event) => (
            <EventCard key={event.id} {...event} />
          ))}
        </div>

        {filteredEvents.length === 0 && (
          <div className="text-center py-12">
            <p className="text-xl text-gray-500 mb-4">😢 No events match your search</p>
            <p className="text-gray-400">Try adjusting your filters or search terms</p>
          </div>
        )}
      </main>

      <Footer />
    </div>
  );
};

export default Events;
