
import { useState } from "react";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import EventCard from "@/components/EventCard";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent } from "@/components/ui/card";
import { Search, Calendar, MapPin, Users, TrendingUp } from "lucide-react";

const Events = () => {
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("All");
  const [priceFilter, setPriceFilter] = useState("All");

  const events = [
    {
      id: "1",
      title: "Bass Drop Festival 2024",
      date: "March 15, 2024 • 9:00 PM",
      location: "Miami Beach Arena",
      price: "$120",
      image: "https://images.unsplash.com/photo-1470813740244-df37b8c1edcb?w=400&h=300&fit=crop",
      attendees: 2500,
      category: "Music Festival",
      available: 150,
      total: 500
    },
    {
      id: "2",
      title: "Digital Art Rave",
      date: "March 22, 2024 • 10:00 PM",
      location: "Brooklyn Warehouse, NYC",
      price: "$48",
      image: "https://images.unsplash.com/photo-1500673922987-e212871fec22?w=400&h=300&fit=crop",
      attendees: 800,
      category: "Art & Culture",
      available: 0,
      total: 200
    },
    {
      id: "3",
      title: "Tech Innovation Summit",
      date: "March 28, 2024 • 9:00 AM",
      location: "Silicon Valley Convention Center",
      price: "$240",
      image: "https://images.unsplash.com/photo-1540575467063-178a50c2df87?w=400&h=300&fit=crop",
      attendees: 1200,
      category: "Tech & Networking",
      available: 300,
      total: 400
    },
    {
      id: "4",
      title: "Gaming Championship",
      date: "April 5, 2024 • 2:00 PM",
      location: "Los Angeles Arena",
      price: "$72",
      image: "https://images.unsplash.com/photo-1542751371-adc38448a05e?w=400&h=300&fit=crop",
      attendees: 5000,
      category: "Gaming",
      available: 800,
      total: 1000
    },
    {
      id: "5",
      title: "Beach Party Sunset",
      date: "April 12, 2024 • 6:00 PM",
      location: "Malibu Beach Club",
      price: "$60",
      image: "https://images.unsplash.com/photo-1544551763-46a013bb70d5?w=400&h=300&fit=crop",
      attendees: 300,
      category: "Beach Party",
      available: 50,
      total: 150
    },
    {
      id: "6",
      title: "Fashion Week Gala",
      date: "April 20, 2024 • 8:00 PM",
      location: "Manhattan Design Center",
      price: "$360",
      image: "https://images.unsplash.com/photo-1469334031218-e382a71b716b?w=400&h=300&fit=crop",
      attendees: 600,
      category: "Fashion",
      available: 25,
      total: 100
    }
  ];

  const categories = ["All", "Music Festival", "Art & Culture", "Tech & Networking", "Gaming", "Beach Party", "Fashion"];
  const priceRanges = ["All", "Under $100", "$100 - $200", "Over $200"];

  const filteredEvents = events.filter(event => {
    const matchesSearch = event.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         event.location.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesCategory = selectedCategory === "All" || event.category === selectedCategory;
    
    let matchesPrice = true;
    if (priceFilter !== "All") {
      const price = parseFloat(event.price.replace("$", ""));
      if (priceFilter === "Under $100") matchesPrice = price < 100;
      else if (priceFilter === "$100 - $200") matchesPrice = price >= 100 && price <= 200;
      else if (priceFilter === "Over $200") matchesPrice = price > 200;
    }
    
    return matchesSearch && matchesCategory && matchesPrice;
  });

  const liveEventsCount = events.length;
  const totalTicketsAvailable = events.reduce((sum, event) => sum + event.available, 0);
  const totalRevenue = events.reduce((sum, event) => sum + (parseFloat(event.price.replace("$", "")) * (event.total - event.available)), 0).toFixed(0);

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-50 dark:from-slate-900 dark:via-slate-800 dark:to-slate-900">
      <Header />
      
      <main className="container mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Hero Section */}
        <div className="text-center mb-12">
          <h1 className="text-4xl font-bold mb-4 bg-gradient-to-r from-blue-600 to-indigo-600 bg-clip-text text-transparent">
            Discover Amazing Events
          </h1>
          <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
            From music festivals to tech conferences - find your perfect event experience
          </p>
        </div>

        {/* Improved Stats */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
          <Card className="border-blue-200 dark:border-slate-700">
            <CardContent className="p-4 text-center">
              <Calendar className="h-6 w-6 text-blue-500 mx-auto mb-2" />
              <div className="text-xl font-bold text-foreground">{liveEventsCount}</div>
              <div className="text-xs text-muted-foreground">Live Events</div>
            </CardContent>
          </Card>
          <Card className="border-green-200 dark:border-slate-700">
            <CardContent className="p-4 text-center">
              <Users className="h-6 w-6 text-green-500 mx-auto mb-2" />
              <div className="text-xl font-bold text-foreground">{totalTicketsAvailable}</div>
              <div className="text-xs text-muted-foreground">Tickets Available</div>
            </CardContent>
          </Card>
          <Card className="border-purple-200 dark:border-slate-700">
            <CardContent className="p-4 text-center">
              <TrendingUp className="h-6 w-6 text-purple-500 mx-auto mb-2" />
              <div className="text-xl font-bold text-foreground">${totalRevenue}</div>
              <div className="text-xs text-muted-foreground">Total Revenue</div>
            </CardContent>
          </Card>
          <Card className="border-orange-200 dark:border-slate-700">
            <CardContent className="p-4 text-center">
              <MapPin className="h-6 w-6 text-orange-500 mx-auto mb-2" />
              <div className="text-xl font-bold text-foreground">6</div>
              <div className="text-xs text-muted-foreground">Cities</div>
            </CardContent>
          </Card>
        </div>

        {/* Search and Filters */}
        <Card className="mb-8 border-slate-200 dark:border-slate-700">
          <CardContent className="p-6">
            <div className="flex flex-col gap-4">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground h-4 w-4" />
                <Input
                  placeholder="Search events, locations..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-10 h-12"
                />
              </div>
              
              <div className="flex flex-col sm:flex-row gap-4">
                <div className="flex-1">
                  <label className="text-sm font-medium mb-2 block text-foreground">Category</label>
                  <div className="flex gap-2 flex-wrap">
                    {categories.map((category) => (
                      <Badge
                        key={category}
                        variant={selectedCategory === category ? "default" : "outline"}
                        className={`cursor-pointer transition-all ${
                          selectedCategory === category 
                            ? "bg-blue-500 hover:bg-blue-600 text-white" 
                            : "hover:bg-muted border-slate-300 dark:border-slate-600"
                        }`}
                        onClick={() => setSelectedCategory(category)}
                      >
                        {category}
                      </Badge>
                    ))}
                  </div>
                </div>
                
                <div className="sm:w-48">
                  <label className="text-sm font-medium mb-2 block text-foreground">Price Range</label>
                  <div className="flex flex-col gap-1">
                    {priceRanges.map((range) => (
                      <Badge
                        key={range}
                        variant={priceFilter === range ? "default" : "outline"}
                        className={`cursor-pointer text-center transition-all ${
                          priceFilter === range 
                            ? "bg-blue-500 hover:bg-blue-600 text-white" 
                            : "hover:bg-muted border-slate-300 dark:border-slate-600"
                        }`}
                        onClick={() => setPriceFilter(range)}
                      >
                        {range}
                      </Badge>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Events Grid - 2 cards per row on mobile, 3 on desktop */}
        <div className="grid grid-cols-2 lg:grid-cols-3 gap-4 lg:gap-8">
          {filteredEvents.map((event) => (
            <EventCard key={event.id} {...event} />
          ))}
        </div>

        {filteredEvents.length === 0 && (
          <div className="text-center py-12">
            <div className="text-6xl mb-4">🔍</div>
            <p className="text-xl text-muted-foreground mb-4">No events match your search</p>
            <p className="text-muted-foreground">Try adjusting your filters or search terms</p>
          </div>
        )}
      </main>

      <Footer />
    </div>
  );
};

export default Events;
