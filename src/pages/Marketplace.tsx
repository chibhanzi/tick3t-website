
import { useState } from "react";
import { Link } from "react-router-dom";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Search, Shield, Calendar, MapPin, Star, Clock, Users, Filter, Eye, Activity, DollarSign, Award, Navigation } from "lucide-react";
import MarketplaceActions from "@/components/marketplace/MarketplaceActions";
import { useTheme } from "next-themes";

const Marketplace = () => {
  const [searchTerm, setSearchTerm] = useState("");
  const [filterCategory, setFilterCategory] = useState("all");
  const [sortBy, setSortBy] = useState("date");
  const [priceRange, setPriceRange] = useState("all");
  const [locationFilter, setLocationFilter] = useState("all");
  const [showFilters, setShowFilters] = useState(false);
  const { theme } = useTheme();

  const listings = [
    {
      id: "1",
      eventTitle: "Electronic Music Festival 2024",
      eventDate: "March 15, 2024",
      eventTime: "9:00 PM",
      eventLocation: "Miami Beach Arena",
      city: "Miami",
      state: "FL",
      distance: "2.3 miles",
      originalPrice: "$125.00",
      currentPrice: "$200.00",
      seller: "0x1234...5678",
      sellerRating: 4.9,
      verified: true,
      category: "Music",
      image: "https://images.unsplash.com/photo-1470813740244-df37b8c1edcb?w=400&h=300&fit=crop",
      timeLeft: "2 days",
      priceChange: "+60%",
      ticketsSold: 350,
      totalTickets: 500,
      views: 1240,
      description: "Experience the best electronic music with world-class DJs"
    },
    {
      id: "2",
      eventTitle: "Tech Conference 2024",
      eventDate: "March 20, 2024",
      eventTime: "9:00 AM",
      eventLocation: "Convention Center, SF",
      city: "San Francisco",
      state: "CA",
      distance: "15.7 miles",
      originalPrice: "$250.00",
      currentPrice: "$300.00",
      seller: "0x9876...4321",
      sellerRating: 4.7,
      verified: true,
      category: "Tech",
      image: "https://images.unsplash.com/photo-1540575467063-178a50c2df87?w=400&h=300&fit=crop",
      timeLeft: "5 days",
      priceChange: "+20%",
      ticketsSold: 180,
      totalTickets: 300,
      views: 890,
      description: "Join industry leaders for cutting-edge tech insights"
    },
    {
      id: "3",
      eventTitle: "Art Gallery Opening",
      eventDate: "March 18, 2024",
      eventTime: "6:00 PM",
      eventLocation: "Downtown Gallery, NYC",
      city: "New York",
      state: "NY",
      distance: "0.8 miles",
      originalPrice: "$75.00",
      currentPrice: "$62.50",
      seller: "0x5555...7777",
      sellerRating: 4.8,
      verified: false,
      category: "Art",
      image: "https://images.unsplash.com/photo-1578662996442-48f60103fc96?w=400&h=300&fit=crop",
      timeLeft: "1 day",
      priceChange: "-17%",
      ticketsSold: 45,
      totalTickets: 100,
      views: 340,
      description: "Exclusive contemporary art exhibition opening"
    }
  ];

  const filteredListings = listings.filter(listing => {
    const matchesSearch = listing.eventTitle.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         listing.eventLocation.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         listing.city.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesCategory = filterCategory === "all" || listing.category.toLowerCase() === filterCategory.toLowerCase();
    const matchesLocation = locationFilter === "all" || 
                           (locationFilter === "nearby" && parseFloat(listing.distance) < 10) ||
                           listing.state === locationFilter;
    
    let matchesPrice = true;
    if (priceRange !== "all") {
      const price = parseFloat(listing.currentPrice.replace("$", ""));
      if (priceRange === "under-100") matchesPrice = price < 100;
      else if (priceRange === "100-250") matchesPrice = price >= 100 && price <= 250;
      else if (priceRange === "over-250") matchesPrice = price > 250;
    }
    
    return matchesSearch && matchesCategory && matchesPrice && matchesLocation;
  });

  const sortedListings = [...filteredListings].sort((a, b) => {
    switch (sortBy) {
      case "price-low":
        return parseFloat(a.currentPrice.replace("$", "")) - parseFloat(b.currentPrice.replace("$", ""));
      case "price-high":
        return parseFloat(b.currentPrice.replace("$", "")) - parseFloat(a.currentPrice.replace("$", ""));
      case "rating":
        return b.sellerRating - a.sellerRating;
      case "ending":
        return parseInt(a.timeLeft) - parseInt(b.timeLeft);
      case "popular":
        return b.views - a.views;
      case "distance":
        return parseFloat(a.distance) - parseFloat(b.distance);
      default:
        return new Date(a.eventDate).getTime() - new Date(b.eventDate).getTime();
    }
  });

  // Choose logo based on theme
  const logoSrc = theme === 'dark' 
    ? "/lovable-uploads/426ad065-11b6-44a4-accc-c8b230d0cd1f.png"
    : "/lovable-uploads/658387a1-c740-4733-b2a5-3c1bebd8ed00.png";

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-50 dark:from-slate-900 dark:via-slate-800 dark:to-slate-900">
      <Header />
      
      <main className="container mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Hero Section with Logo */}
        <div className="text-center mb-12">
          <div className="flex justify-center mb-6">
            <img 
              src={logoSrc}
              alt="Tick3rt" 
              className="h-16 w-auto"
            />
          </div>
          <h1 className="text-2xl font-bold mb-4 bg-gradient-to-r from-blue-600 to-indigo-600 bg-clip-text text-transparent">
            Ticket Marketplace
          </h1>
          <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
            Discover and trade verified NFT tickets securely on the blockchain
          </p>
        </div>

        {/* Enhanced Search and Filters */}
        <Card className="mb-8 border-slate-200 dark:border-slate-700 shadow-lg">
          <CardContent className="p-6">
            <div className="space-y-4">
              <div className="flex gap-4">
                <div className="relative flex-1">
                  <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground h-4 w-4" />
                  <Input
                    placeholder="Search events, locations, cities..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="pl-10 h-12 border-blue-200 dark:border-slate-600"
                  />
                </div>
                <Button 
                  variant="outline" 
                  onClick={() => setShowFilters(!showFilters)}
                  className="h-12 border-blue-200 dark:border-slate-600"
                >
                  <Filter className="h-4 w-4 mr-2" />
                  Filters
                </Button>
              </div>
              
              {showFilters && (
                <div className="grid grid-cols-1 md:grid-cols-6 gap-4 p-4 bg-blue-50 dark:bg-slate-800 rounded-lg">
                  <Select value={filterCategory} onValueChange={setFilterCategory}>
                    <SelectTrigger className="border-blue-200 dark:border-slate-600">
                      <SelectValue placeholder="All Categories" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="all">All Categories</SelectItem>
                      <SelectItem value="music">🎵 Music</SelectItem>
                      <SelectItem value="tech">💻 Tech</SelectItem>
                      <SelectItem value="art">🎨 Art</SelectItem>
                      <SelectItem value="sports">⚽ Sports</SelectItem>
                    </SelectContent>
                  </Select>

                  <Select value={locationFilter} onValueChange={setLocationFilter}>
                    <SelectTrigger className="border-blue-200 dark:border-slate-600">
                      <SelectValue placeholder="Location" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="all">All Locations</SelectItem>
                      <SelectItem value="nearby">📍 Nearby (10 miles)</SelectItem>
                      <SelectItem value="CA">🌴 California</SelectItem>
                      <SelectItem value="NY">🗽 New York</SelectItem>
                      <SelectItem value="FL">🏖️ Florida</SelectItem>
                      <SelectItem value="TX">🤠 Texas</SelectItem>
                    </SelectContent>
                  </Select>

                  <Select value={priceRange} onValueChange={setPriceRange}>
                    <SelectTrigger className="border-blue-200 dark:border-slate-600">
                      <SelectValue placeholder="Price Range" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="all">All Prices</SelectItem>
                      <SelectItem value="under-100">💸 Under $100</SelectItem>
                      <SelectItem value="100-250">💰 $100 - $250</SelectItem>
                      <SelectItem value="over-250">💎 Over $250</SelectItem>
                    </SelectContent>
                  </Select>

                  <Select value={sortBy} onValueChange={setSortBy}>
                    <SelectTrigger className="border-blue-200 dark:border-slate-600">
                      <SelectValue placeholder="Sort by" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="date">📅 Event Date</SelectItem>
                      <SelectItem value="distance">📍 Distance</SelectItem>
                      <SelectItem value="price-low">💲 Price: Low to High</SelectItem>
                      <SelectItem value="price-high">💲 Price: High to Low</SelectItem>
                      <SelectItem value="rating">⭐ Seller Rating</SelectItem>
                      <SelectItem value="ending">⏰ Ending Soon</SelectItem>
                      <SelectItem value="popular">🔥 Most Popular</SelectItem>
                    </SelectContent>
                  </Select>

                  <Button variant="outline" onClick={() => {
                    setSearchTerm("");
                    setFilterCategory("all");
                    setPriceRange("all");
                    setLocationFilter("all");
                    setSortBy("date");
                  }} className="border-red-200 hover:bg-red-50 dark:border-red-600 dark:hover:bg-red-900/20">
                    Clear All
                  </Button>

                  <div className="text-sm text-muted-foreground flex items-center">
                    <span className="font-medium">{sortedListings.length}</span> results found
                  </div>
                </div>
              )}
            </div>
          </CardContent>
        </Card>

        {/* Enhanced Listings Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {sortedListings.map((listing) => (
            <Card key={listing.id} className="overflow-hidden hover:shadow-2xl transition-all duration-300 hover:scale-[1.02] border-slate-200 dark:border-slate-700 group">
              <div className="relative h-56 overflow-hidden">
                <img 
                  src={listing.image} 
                  alt={listing.eventTitle}
                  className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-300"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent" />
                
                <div className="absolute top-3 left-3 flex gap-2">
                  <Badge className={`${listing.verified ? 'bg-green-500 hover:bg-green-600' : 'bg-yellow-500 hover:bg-yellow-600'} text-white`}>
                    {listing.verified ? '✅ Verified' : '⚠️ Unverified'}
                  </Badge>
                  <Badge variant="secondary" className="bg-background/90 backdrop-blur-sm">
                    {listing.category}
                  </Badge>
                </div>
                
                <div className="absolute top-3 right-3 flex flex-col gap-1">
                  <Badge variant="secondary" className="bg-background/90 backdrop-blur-sm">
                    <Clock className="h-3 w-3 mr-1" />
                    {listing.timeLeft}
                  </Badge>
                  <Badge variant="secondary" className="bg-background/90 backdrop-blur-sm">
                    <Navigation className="h-3 w-3 mr-1" />
                    {listing.distance}
                  </Badge>
                </div>
                
                <div className="absolute bottom-3 left-3 right-3">
                  <h3 className="font-bold text-lg mb-1 line-clamp-2 text-white drop-shadow-lg">{listing.eventTitle}</h3>
                  <div className="flex items-center text-sm text-white/90 mb-1">
                    <Calendar className="h-3 w-3 mr-1" />
                    <span>{listing.eventDate} • {listing.eventTime}</span>
                  </div>
                  <div className="flex items-center text-sm text-white/90">
                    <MapPin className="h-3 w-3 mr-1" />
                    <span>{listing.city}, {listing.state}</span>
                  </div>
                </div>
                
                <div className="absolute bottom-3 right-3">
                  <Badge className={`${listing.priceChange.startsWith('+') ? 'bg-green-500' : 'bg-red-500'} text-white`}>
                    {listing.priceChange}
                  </Badge>
                </div>
              </div>
              
              <CardContent className="p-5">
                <div className="space-y-3 mb-4">
                  <div className="flex items-center justify-between text-sm text-muted-foreground">
                    <div className="flex items-center">
                      <Users className="h-4 w-4 mr-1 text-green-500" />
                      <span>{listing.ticketsSold}/{listing.totalTickets} sold</span>
                    </div>
                    <div className="flex items-center">
                      <Eye className="h-4 w-4 mr-1 text-purple-500" />
                      <span>{listing.views} views</span>
                    </div>
                  </div>
                  <p className="text-sm text-muted-foreground line-clamp-2">{listing.description}</p>
                </div>

                <div className="flex justify-between items-center mb-4">
                  <div>
                    <div className="text-sm text-muted-foreground line-through">{listing.originalPrice}</div>
                    <div className="text-2xl font-bold bg-gradient-to-r from-blue-600 to-indigo-600 bg-clip-text text-transparent">{listing.currentPrice}</div>
                  </div>
                  <div className="text-right">
                    <div className="flex items-center text-sm mb-1">
                      <Star className="h-3 w-3 text-yellow-500 mr-1" />
                      <span className="text-foreground font-medium">{listing.sellerRating}</span>
                    </div>
                    <div className="text-xs text-muted-foreground">{listing.seller}</div>
                  </div>
                </div>

                <div className="flex gap-2">
                  <Button className="flex-1 bg-gradient-to-r from-blue-500 to-indigo-500 hover:from-blue-600 hover:to-indigo-600" size="sm">
                    Buy Now
                  </Button>
                  <Button variant="outline" size="sm" className="border-blue-200 hover:bg-blue-50 dark:border-slate-600 dark:hover:bg-slate-700">
                    Make Offer
                  </Button>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>

        {sortedListings.length === 0 && (
          <div className="text-center py-16">
            <div className="text-8xl mb-6">🔍</div>
            <h2 className="text-3xl font-bold text-muted-foreground mb-4">No listings found</h2>
            <p className="text-lg text-muted-foreground mb-8">Try adjusting your filters or search terms</p>
            <Button onClick={() => {
              setSearchTerm("");
              setFilterCategory("all");
              setPriceRange("all");
              setLocationFilter("all");
              setSortBy("date");
            }} className="bg-gradient-to-r from-blue-500 to-indigo-500 hover:from-blue-600 hover:to-indigo-600">
              Reset Filters
            </Button>
          </div>
        )}

        <MarketplaceActions />
      </main>

      <Footer />
    </div>
  );
};

export default Marketplace;
