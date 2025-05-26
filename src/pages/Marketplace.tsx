
import { useState } from "react";
import { Link } from "react-router-dom";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Search, Filter, TrendingUp, Shield, Calendar, MapPin, Star } from "lucide-react";

const Marketplace = () => {
  const [searchTerm, setSearchTerm] = useState("");
  const [filterCategory, setFilterCategory] = useState("all");
  const [sortBy, setSortBy] = useState("date");

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
      priceChange: "+60%"
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
      priceChange: "+20%"
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
      priceChange: "-17%"
    }
  ];

  const filteredListings = listings.filter(listing => {
    const matchesSearch = listing.eventTitle.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         listing.eventLocation.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesCategory = filterCategory === "all" || listing.category.toLowerCase() === filterCategory.toLowerCase();
    return matchesSearch && matchesCategory;
  });

  const sortedListings = [...filteredListings].sort((a, b) => {
    switch (sortBy) {
      case "price-low":
        return parseFloat(a.currentPrice) - parseFloat(b.currentPrice);
      case "price-high":
        return parseFloat(b.currentPrice) - parseFloat(a.currentPrice);
      case "rating":
        return b.sellerRating - a.sellerRating;
      case "ending":
        return parseInt(a.timeLeft) - parseInt(b.timeLeft);
      default:
        return new Date(a.eventDate).getTime() - new Date(b.eventDate).getTime();
    }
  });

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-50">
      <Header />
      
      <main className="container mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Hero Section */}
        <div className="text-center mb-12">
          <h1 className="text-4xl font-bold mb-4 bg-gradient-to-r from-blue-600 to-indigo-600 bg-clip-text text-transparent">
            Ticket Marketplace
          </h1>
          <p className="text-xl text-gray-600 max-w-2xl mx-auto">
            Buy and sell verified NFT tickets securely on the blockchain
          </p>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
          <Card className="text-center">
            <CardContent className="p-6">
              <TrendingUp className="h-8 w-8 text-green-500 mx-auto mb-2" />
              <div className="text-2xl font-bold">1,247</div>
              <div className="text-sm text-gray-600">Active Listings</div>
            </CardContent>
          </Card>
          <Card className="text-center">
            <CardContent className="p-6">
              <Shield className="h-8 w-8 text-blue-500 mx-auto mb-2" />
              <div className="text-2xl font-bold">99.9%</div>
              <div className="text-sm text-gray-600">Verified Tickets</div>
            </CardContent>
          </Card>
          <Card className="text-center">
            <CardContent className="p-6">
              <Star className="h-8 w-8 text-yellow-500 mx-auto mb-2" />
              <div className="text-2xl font-bold">4.8</div>
              <div className="text-sm text-gray-600">Avg Rating</div>
            </CardContent>
          </Card>
          <Card className="text-center">
            <CardContent className="p-6">
              <Calendar className="h-8 w-8 text-purple-500 mx-auto mb-2" />
              <div className="text-2xl font-bold">156</div>
              <div className="text-sm text-gray-600">Events Today</div>
            </CardContent>
          </Card>
        </div>

        {/* Filters */}
        <Card className="mb-8">
          <CardContent className="p-6">
            <div className="flex flex-col md:flex-row gap-4">
              <div className="flex-1 relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
                <Input
                  placeholder="Search events, locations..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-10"
                />
              </div>
              <Select value={filterCategory} onValueChange={setFilterCategory}>
                <SelectTrigger className="w-full md:w-48">
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
              <Select value={sortBy} onValueChange={setSortBy}>
                <SelectTrigger className="w-full md:w-48">
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
            </div>
          </CardContent>
        </Card>

        {/* Listings */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {sortedListings.map((listing) => (
            <Card key={listing.id} className="overflow-hidden hover:shadow-xl transition-all duration-300 hover:scale-105">
              <div className="relative">
                <img 
                  src={listing.image} 
                  alt={listing.eventTitle}
                  className="w-full h-48 object-cover"
                />
                <div className="absolute top-3 left-3">
                  <Badge className={`${listing.verified ? 'bg-green-500' : 'bg-yellow-500'} text-white`}>
                    {listing.verified ? 'Verified' : 'Unverified'}
                  </Badge>
                </div>
                <div className="absolute top-3 right-3">
                  <Badge variant="secondary" className="bg-white/90">
                    {listing.timeLeft} left
                  </Badge>
                </div>
                <div className="absolute bottom-3 right-3">
                  <Badge className={`${listing.priceChange.startsWith('+') ? 'bg-green-500' : 'bg-red-500'} text-white`}>
                    {listing.priceChange}
                  </Badge>
                </div>
              </div>
              
              <CardContent className="p-4">
                <h3 className="font-bold text-lg mb-2 line-clamp-2">{listing.eventTitle}</h3>
                
                <div className="space-y-2 mb-4">
                  <div className="flex items-center text-sm text-gray-600">
                    <Calendar className="h-4 w-4 mr-2" />
                    {listing.eventDate}
                  </div>
                  <div className="flex items-center text-sm text-gray-600">
                    <MapPin className="h-4 w-4 mr-2" />
                    {listing.eventLocation}
                  </div>
                </div>

                <div className="flex justify-between items-center mb-4">
                  <div>
                    <div className="text-sm text-gray-500 line-through">{listing.originalPrice}</div>
                    <div className="text-lg font-bold text-blue-600">{listing.currentPrice}</div>
                  </div>
                  <div className="text-right">
                    <div className="flex items-center text-sm">
                      <Star className="h-3 w-3 text-yellow-500 mr-1" />
                      {listing.sellerRating}
                    </div>
                    <div className="text-xs text-gray-500">{listing.seller}</div>
                  </div>
                </div>

                <div className="flex gap-2">
                  <Button className="flex-1" size="sm">
                    Buy Now
                  </Button>
                  <Button variant="outline" size="sm">
                    Make Offer
                  </Button>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>

        {/* Call to Action */}
        <div className="text-center mt-12">
          <Card className="max-w-2xl mx-auto">
            <CardContent className="p-8">
              <h2 className="text-2xl font-bold mb-4">Have tickets to sell?</h2>
              <p className="text-gray-600 mb-6">
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
