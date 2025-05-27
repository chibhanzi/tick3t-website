
import { useState } from "react";
import { Link } from "react-router-dom";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Search, TrendingUp, Shield, Calendar, MapPin, Star, Clock, Users } from "lucide-react";

const Marketplace = () => {
  const [searchTerm, setSearchTerm] = useState("");
  const [filterCategory, setFilterCategory] = useState("all");
  const [sortBy, setSortBy] = useState("date");
  const [priceRange, setPriceRange] = useState("all");

  const listings = [
    {
      id: "1",
      eventTitle: "Electronic Music Festival 2024",
      eventDate: "March 15, 2024",
      eventLocation: "Miami Beach Arena",
      originalPrice: "0.05 ETH",
      currentPrice: "0.08 ETH",
      seller: "0x1234...5678",
      sellerRating: 4.9,
      verified: true,
      category: "Music",
      image: "https://images.unsplash.com/photo-1470813740244-df37b8c1edcb?w=400&h=300&fit=crop",
      timeLeft: "2 days",
      priceChange: "+60%",
      ticketsSold: 350,
      totalTickets: 500
    },
    {
      id: "2",
      eventTitle: "Tech Conference 2024",
      eventDate: "March 20, 2024",
      eventLocation: "Convention Center, SF",
      originalPrice: "0.1 ETH",
      currentPrice: "0.12 ETH",
      seller: "0x9876...4321",
      sellerRating: 4.7,
      verified: true,
      category: "Tech",
      image: "https://images.unsplash.com/photo-1540575467063-178a50c2df87?w=400&h=300&fit=crop",
      timeLeft: "5 days",
      priceChange: "+20%",
      ticketsSold: 180,
      totalTickets: 300
    },
    {
      id: "3",
      eventTitle: "Art Gallery Opening",
      eventDate: "March 18, 2024",
      eventLocation: "Downtown Gallery, NYC",
      originalPrice: "0.03 ETH",
      currentPrice: "0.025 ETH",
      seller: "0x5555...7777",
      sellerRating: 4.8,
      verified: false,
      category: "Art",
      image: "https://images.unsplash.com/photo-1578662996442-48f60103fc96?w=400&h=300&fit=crop",
      timeLeft: "1 day",
      priceChange: "-17%",
      ticketsSold: 45,
      totalTickets: 100
    }
  ];

  const filteredListings = listings.filter(listing => {
    const matchesSearch = listing.eventTitle.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         listing.eventLocation.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesCategory = filterCategory === "all" || listing.category.toLowerCase() === filterCategory.toLowerCase();
    
    let matchesPrice = true;
    if (priceRange !== "all") {
      const price = parseFloat(listing.currentPrice.replace(" ETH", ""));
      if (priceRange === "under-0.05") matchesPrice = price < 0.05;
      else if (priceRange === "0.05-0.1") matchesPrice = price >= 0.05 && price <= 0.1;
      else if (priceRange === "over-0.1") matchesPrice = price > 0.1;
    }
    
    return matchesSearch && matchesCategory && matchesPrice;
  });

  const sortedListings = [...filteredListings].sort((a, b) => {
    switch (sortBy) {
      case "price-low":
        return parseFloat(a.currentPrice.replace(" ETH", "")) - parseFloat(b.currentPrice.replace(" ETH", ""));
      case "price-high":
        return parseFloat(b.currentPrice.replace(" ETH", "")) - parseFloat(a.currentPrice.replace(" ETH", ""));
      case "rating":
        return b.sellerRating - a.sellerRating;
      case "ending":
        return parseInt(a.timeLeft) - parseInt(b.timeLeft);
      default:
        return new Date(a.eventDate).getTime() - new Date(b.eventDate).getTime();
    }
  });

  const marketStats = {
    activeListings: listings.length,
    totalVolume: "127.8 ETH",
    avgPrice: "0.068 ETH",
    verifiedSellers: Math.round(listings.filter(l => l.verified).length / listings.length * 100)
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-50 dark:from-slate-900 dark:via-slate-800 dark:to-slate-900">
      <Header />
      
      <main className="container mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Hero Section */}
        <div className="text-center mb-12">
          <h1 className="text-4xl font-bold mb-4 bg-gradient-to-r from-blue-600 to-indigo-600 bg-clip-text text-transparent">
            Ticket Marketplace
          </h1>
          <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
            Buy and sell verified NFT tickets securely on the blockchain
          </p>
        </div>

        {/* Improved Stats */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
          <Card className="border-blue-200 dark:border-slate-700">
            <CardContent className="p-4 text-center">
              <TrendingUp className="h-6 w-6 text-blue-500 mx-auto mb-2" />
              <div className="text-xl font-bold text-foreground">{marketStats.activeListings}</div>
              <div className="text-xs text-muted-foreground">Active Listings</div>
            </CardContent>
          </Card>
          <Card className="border-green-200 dark:border-slate-700">
            <CardContent className="p-4 text-center">
              <Shield className="h-6 w-6 text-green-500 mx-auto mb-2" />
              <div className="text-xl font-bold text-foreground">{marketStats.verifiedSellers}%</div>
              <div className="text-xs text-muted-foreground">Verified Sellers</div>
            </CardContent>
          </Card>
          <Card className="border-purple-200 dark:border-slate-700">
            <CardContent className="p-4 text-center">
              <Calendar className="h-6 w-6 text-purple-500 mx-auto mb-2" />
              <div className="text-xl font-bold text-foreground">{marketStats.totalVolume}</div>
              <div className="text-xs text-muted-foreground">Total Volume</div>
            </CardContent>
          </Card>
          <Card className="border-orange-200 dark:border-slate-700">
            <CardContent className="p-4 text-center">
              <Star className="h-6 w-6 text-orange-500 mx-auto mb-2" />
              <div className="text-xl font-bold text-foreground">{marketStats.avgPrice}</div>
              <div className="text-xs text-muted-foreground">Average Price</div>
            </CardContent>
          </Card>
        </div>

        {/* Enhanced Filters */}
        <Card className="mb-8 border-slate-200 dark:border-slate-700">
          <CardContent className="p-6">
            <div className="space-y-4">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground h-4 w-4" />
                <Input
                  placeholder="Search events, locations, sellers..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-10 h-12"
                />
              </div>
              
              <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                <Select value={filterCategory} onValueChange={setFilterCategory}>
                  <SelectTrigger>
                    <SelectValue placeholder="All Categories" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">All Categories</SelectItem>
                    <SelectItem value="music">Music</SelectItem>
                    <SelectItem value="tech">Tech</SelectItem>
                    <SelectItem value="art">Art</SelectItem>
                    <SelectItem value="sports">Sports</SelectItem>
                  </SelectContent>
                </Select>

                <Select value={priceRange} onValueChange={setPriceRange}>
                  <SelectTrigger>
                    <SelectValue placeholder="Price Range" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">All Prices</SelectItem>
                    <SelectItem value="under-0.05">Under 0.05 ETH</SelectItem>
                    <SelectItem value="0.05-0.1">0.05 - 0.1 ETH</SelectItem>
                    <SelectItem value="over-0.1">Over 0.1 ETH</SelectItem>
                  </SelectContent>
                </Select>

                <Select value={sortBy} onValueChange={setSortBy}>
                  <SelectTrigger>
                    <SelectValue placeholder="Sort by" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="date">Event Date</SelectItem>
                    <SelectItem value="price-low">Price: Low to High</SelectItem>
                    <SelectItem value="price-high">Price: High to Low</SelectItem>
                    <SelectItem value="rating">Seller Rating</SelectItem>
                    <SelectItem value="ending">Ending Soon</SelectItem>
                  </SelectContent>
                </Select>

                <Button variant="outline" onClick={() => {
                  setSearchTerm("");
                  setFilterCategory("all");
                  setPriceRange("all");
                  setSortBy("date");
                }}>
                  Clear Filters
                </Button>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Listings Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {sortedListings.map((listing) => (
            <Card key={listing.id} className="overflow-hidden hover:shadow-xl transition-all duration-300 hover:scale-[1.02] border-slate-200 dark:border-slate-700">
              <div className="relative h-48">
                <img 
                  src={listing.image} 
                  alt={listing.eventTitle}
                  className="w-full h-full object-cover"
                />
                <div className="absolute top-3 left-3 flex gap-2">
                  <Badge className={`${listing.verified ? 'bg-green-500 hover:bg-green-600' : 'bg-yellow-500 hover:bg-yellow-600'} text-white`}>
                    {listing.verified ? 'Verified' : 'Unverified'}
                  </Badge>
                </div>
                <div className="absolute top-3 right-3">
                  <Badge variant="secondary" className="bg-background/90">
                    <Clock className="h-3 w-3 mr-1" />
                    {listing.timeLeft}
                  </Badge>
                </div>
                <div className="absolute bottom-3 right-3">
                  <Badge className={`${listing.priceChange.startsWith('+') ? 'bg-green-500' : 'bg-red-500'} text-white`}>
                    {listing.priceChange}
                  </Badge>
                </div>
              </div>
              
              <CardContent className="p-4">
                <h3 className="font-bold text-lg mb-2 line-clamp-2 text-foreground">{listing.eventTitle}</h3>
                
                <div className="space-y-2 mb-4">
                  <div className="flex items-center text-sm text-muted-foreground">
                    <Calendar className="h-4 w-4 mr-2 flex-shrink-0" />
                    <span className="truncate">{listing.eventDate}</span>
                  </div>
                  <div className="flex items-center text-sm text-muted-foreground">
                    <MapPin className="h-4 w-4 mr-2 flex-shrink-0" />
                    <span className="truncate">{listing.eventLocation}</span>
                  </div>
                  <div className="flex items-center text-sm text-muted-foreground">
                    <Users className="h-4 w-4 mr-2 flex-shrink-0" />
                    <span>{listing.ticketsSold}/{listing.totalTickets} sold</span>
                  </div>
                </div>

                <div className="flex justify-between items-center mb-4">
                  <div>
                    <div className="text-sm text-muted-foreground line-through">{listing.originalPrice}</div>
                    <div className="text-xl font-bold bg-gradient-to-r from-blue-600 to-indigo-600 bg-clip-text text-transparent">{listing.currentPrice}</div>
                  </div>
                  <div className="text-right">
                    <div className="flex items-center text-sm mb-1">
                      <Star className="h-3 w-3 text-yellow-500 mr-1" />
                      <span className="text-foreground">{listing.sellerRating}</span>
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
          <div className="text-center py-12">
            <div className="text-6xl mb-4">🔍</div>
            <p className="text-xl text-muted-foreground mb-4">No listings match your criteria</p>
            <p className="text-muted-foreground">Try adjusting your filters or search terms</p>
          </div>
        )}

        {/* Call to Action */}
        <div className="text-center mt-12">
          <Card className="max-w-2xl mx-auto border-slate-200 dark:border-slate-700">
            <CardContent className="p-8">
              <h2 className="text-2xl font-bold mb-4 text-foreground">Have tickets to sell?</h2>
              <p className="text-muted-foreground mb-6">
                List your tickets on our secure marketplace and reach thousands of buyers
              </p>
              <Button className="bg-gradient-to-r from-blue-500 to-indigo-500 hover:from-blue-600 hover:to-indigo-600">
                List Your Tickets
              </Button>
            </CardContent>
          </Card>
        </div>
      </main>

      <Footer />
    </div>
  );
};

export default Marketplace;
