import { useState } from "react";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import EventCard from "@/components/EventCard";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent } from "@/components/ui/card";
import { Search, Calendar, MapPin, Users, TrendingUp, SlidersHorizontal, X, ChevronDown, Tag } from "lucide-react";

const Events = () => {
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("All");
  const [priceFilter, setPriceFilter] = useState("All");
  const [isFilterOpen, setIsFilterOpen] = useState(false);

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

        <div className="mb-8 rounded-2xl border border-border/60 bg-card/60 backdrop-blur-sm overflow-hidden">
          <div className="grid grid-cols-3 divide-x divide-border/60">
            <div className="flex flex-col items-center justify-center gap-2 p-5">
              <div className="flex h-9 w-9 items-center justify-center rounded-full bg-blue-500/10">
                <Calendar className="h-4 w-4 text-blue-500" />
              </div>
              <div className="text-2xl font-bold tracking-tight">{liveEventsCount}</div>
              <div className="text-[11px] uppercase tracking-wider text-muted-foreground">Live Events</div>
            </div>
            <div className="flex flex-col items-center justify-center gap-2 p-5">
              <div className="flex h-9 w-9 items-center justify-center rounded-full bg-emerald-500/10">
                <Users className="h-4 w-4 text-emerald-500" />
              </div>
              <div className="text-2xl font-bold tracking-tight">{totalTicketsAvailable.toLocaleString()}</div>
              <div className="text-[11px] uppercase tracking-wider text-muted-foreground">Tickets Available</div>
            </div>
            <div className="flex flex-col items-center justify-center gap-2 p-5">
              <div className="flex h-9 w-9 items-center justify-center rounded-full bg-orange-500/10">
                <MapPin className="h-4 w-4 text-orange-500" />
              </div>
              <div className="text-2xl font-bold tracking-tight">6</div>
              <div className="text-[11px] uppercase tracking-wider text-muted-foreground">Cities</div>
            </div>
          </div>
        </div>


        <div className="mb-8 space-y-3">
          {/* Search bar with filter button */}
          <div className="group relative">
            <div className="pointer-events-none absolute -inset-px rounded-2xl bg-gradient-to-r from-blue-500/30 via-indigo-500/20 to-purple-500/30 opacity-0 blur-md transition-opacity duration-300 group-focus-within:opacity-100" />
            <div className="relative flex items-center gap-2 rounded-2xl border border-border/60 bg-card/80 px-4 py-2 shadow-sm backdrop-blur-sm transition-all focus-within:border-primary/40 focus-within:shadow-md">
              <Search className="h-5 w-5 shrink-0 text-muted-foreground" />
              <Input
                placeholder="Search events, artists, or venues…"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="h-11 flex-1 border-0 bg-transparent text-base placeholder:text-muted-foreground/70 focus-visible:ring-0 focus-visible:ring-offset-0"
              />
              {searchTerm && (
                <button
                  type="button"
                  onClick={() => setSearchTerm("")}
                  className="rounded-full p-1.5 text-muted-foreground transition-colors hover:bg-muted hover:text-foreground"
                  aria-label="Clear search"
                >
                  <X className="h-4 w-4" />
                </button>
              )}
              <button
                type="button"
                onClick={() => setIsFilterOpen(!isFilterOpen)}
                className={`relative flex shrink-0 items-center gap-1.5 rounded-xl px-3 py-2 text-sm font-medium transition-all duration-200 ${
                  isFilterOpen
                    ? "bg-primary text-primary-foreground shadow-sm"
                    : "bg-muted/60 text-muted-foreground hover:bg-muted hover:text-foreground"
                }`}
                aria-label="Toggle filters"
              >
                <SlidersHorizontal className="h-4 w-4" />
                <span className="hidden sm:inline">Filters</span>
                <ChevronDown className={`h-3.5 w-3.5 transition-transform duration-200 ${isFilterOpen ? "rotate-180" : ""}`} />
                {(selectedCategory !== "All" || priceFilter !== "All") && (
                  <span className="absolute -top-1 -right-1 flex h-4 w-4 items-center justify-center rounded-full bg-destructive text-[10px] font-bold text-destructive-foreground">
                    {(selectedCategory !== "All" ? 1 : 0) + (priceFilter !== "All" ? 1 : 0)}
                  </span>
                )}
              </button>
            </div>
          </div>

          {/* Active filter chips */}
          {(selectedCategory !== "All" || priceFilter !== "All") && (
            <div className="flex flex-wrap items-center gap-2">
              {selectedCategory !== "All" && (
                <button
                  onClick={() => setSelectedCategory("All")}
                  className="inline-flex items-center gap-1.5 rounded-full bg-primary/10 px-3 py-1.5 text-xs font-medium text-primary transition-colors hover:bg-primary/20"
                >
                  <Tag className="h-3 w-3" />
                  {selectedCategory}
                  <X className="h-3 w-3" />
                </button>
              )}
              {priceFilter !== "All" && (
                <button
                  onClick={() => setPriceFilter("All")}
                  className="inline-flex items-center gap-1.5 rounded-full bg-primary/10 px-3 py-1.5 text-xs font-medium text-primary transition-colors hover:bg-primary/20"
                >
                  <SlidersHorizontal className="h-3 w-3" />
                  {priceFilter}
                  <X className="h-3 w-3" />
                </button>
              )}
              <button
                onClick={() => { setSelectedCategory("All"); setPriceFilter("All"); }}
                className="text-xs text-muted-foreground underline-offset-2 hover:text-foreground hover:underline"
              >
                Clear all
              </button>
            </div>
          )}

          {/* Filter card */}
          {isFilterOpen && (
            <div className="overflow-hidden rounded-2xl border border-border/60 bg-card/80 shadow-lg backdrop-blur-sm animate-in slide-in-from-top-2 duration-200">
              <div className="p-5 space-y-5">
                {/* Category filter */}
                <div>
                  <h3 className="mb-3 text-sm font-semibold text-foreground">Category</h3>
                  <div className="flex flex-wrap gap-2">
                    {categories.map((category) => {
                      const active = selectedCategory === category;
                      return (
                        <button
                          key={category}
                          onClick={() => setSelectedCategory(category)}
                          className={`rounded-full px-4 py-2 text-sm font-medium transition-all duration-200 ${
                            active
                              ? "bg-primary text-primary-foreground shadow-sm"
                              : "bg-muted/50 text-muted-foreground ring-1 ring-border/60 hover:bg-muted hover:text-foreground"
                          }`}
                        >
                          {category}
                        </button>
                      );
                    })}
                  </div>
                </div>

                {/* Divider */}
                <div className="h-px bg-border/60" />

                {/* Price filter */}
                <div>
                  <h3 className="mb-3 text-sm font-semibold text-foreground">Price Range</h3>
                  <div className="flex flex-wrap gap-2">
                    {priceRanges.map((range) => {
                      const active = priceFilter === range;
                      return (
                        <button
                          key={range}
                          onClick={() => setPriceFilter(range)}
                          className={`rounded-full px-4 py-2 text-sm font-medium transition-all duration-200 ${
                            active
                              ? "bg-primary text-primary-foreground shadow-sm"
                              : "bg-muted/50 text-muted-foreground ring-1 ring-border/60 hover:bg-muted hover:text-foreground"
                          }`}
                        >
                          {range}
                        </button>
                      );
                    })}
                  </div>
                </div>
              </div>
            </div>
          )}
        </div>


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
