import { useState } from "react";
import { Link } from "react-router-dom";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import {
  Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle,
} from "@/components/ui/dialog";
import { Label } from "@/components/ui/label";
import { useToast } from "@/hooks/use-toast";
import {
  Search,
  ShieldCheck,
  Calendar,
  MapPin,
  Star,
  Clock,
  Eye,
  SlidersHorizontal,
  LayoutGrid,
  Rows3,
  List,
  TrendingUp,
  TrendingDown,
  ArrowRight,
  CheckCircle2,
  HandCoins,
} from "lucide-react";
import MarketplaceActions from "@/components/marketplace/MarketplaceActions";

type ViewMode = "grid" | "list" | "compact";
type Listing = {
  id: string;
  eventTitle: string;
  eventDate: string;
  eventTime: string;
  eventLocation: string;
  city: string;
  currentPrice: string;
  originalPrice: string;
  seller: string;
  image: string;
  [key: string]: any;
};


const Marketplace = () => {
  const [searchTerm, setSearchTerm] = useState("");
  const [filterCategory, setFilterCategory] = useState("all");
  const [sortBy, setSortBy] = useState("date");
  const [priceRange, setPriceRange] = useState("all");
  const [locationFilter, setLocationFilter] = useState("all");
  const [showFilters, setShowFilters] = useState(false);
  const [viewMode, setViewMode] = useState<ViewMode>("grid");
  const { toast } = useToast();
  const [buyTarget, setBuyTarget] = useState<Listing | null>(null);
  const [offerTarget, setOfferTarget] = useState<Listing | null>(null);
  const [offerAmount, setOfferAmount] = useState("");
  const [offerNote, setOfferNote] = useState("");
  const [processing, setProcessing] = useState(false);

  const openBuy = (l: Listing) => setBuyTarget(l);
  const openOffer = (l: Listing) => {
    setOfferTarget(l);
    const num = Number((l.currentPrice || "").replace(/[^0-9.]/g, ""));
    setOfferAmount(num ? Math.max(1, Math.round(num * 0.9)).toString() : "");
    setOfferNote("");
  };

  const confirmBuy = async () => {
    if (!buyTarget) return;
    setProcessing(true);
    await new Promise((r) => setTimeout(r, 700));
    setProcessing(false);
    toast({
      title: "Purchase confirmed",
      description: `${buyTarget.eventTitle} — ${buyTarget.currentPrice}. Ticket added to your vault.`,
    });
    setBuyTarget(null);
  };

  const submitOffer = async () => {
    if (!offerTarget) return;
    const amount = Number(offerAmount);
    if (!amount || amount <= 0) {
      toast({ title: "Enter a valid offer", variant: "destructive" });
      return;
    }
    setProcessing(true);
    await new Promise((r) => setTimeout(r, 600));
    setProcessing(false);
    toast({
      title: "Offer sent",
      description: `Your $${amount} offer was sent to ${offerTarget.seller}.`,
    });
    setOfferTarget(null);
  };

  const listings = [
    {
      id: "1",
      eventTitle: "Electronic Music Festival 2024",
      eventDate: "March 15, 2024",
      eventTime: "9:00 PM",
      eventLocation: "Miami Beach Arena",
      city: "Harare",
      state: "HRE",
      distance: "2.3 km",
      originalPrice: "$125.00",
      currentPrice: "$200.00",
      seller: "@kuda.t",
      sellerRating: 4.9,
      verified: true,
      category: "Music",
      image: "https://images.unsplash.com/photo-1470813740244-df37b8c1edcb?w=800&h=600&fit=crop",
      timeLeft: "2 days",
      priceChange: "+60%",
      ticketsSold: 350,
      totalTickets: 500,
      views: 1240,
      description: "Experience the best electronic music with world-class DJs",
    },
    {
      id: "2",
      eventTitle: "Tech Conference 2024",
      eventDate: "March 20, 2024",
      eventTime: "9:00 AM",
      eventLocation: "Rainbow Towers",
      city: "Harare",
      state: "HRE",
      distance: "5.7 km",
      originalPrice: "$250.00",
      currentPrice: "$300.00",
      seller: "@tariro.dev",
      sellerRating: 4.7,
      verified: true,
      category: "Tech",
      image: "https://images.unsplash.com/photo-1540575467063-178a50c2df87?w=800&h=600&fit=crop",
      timeLeft: "5 days",
      priceChange: "+20%",
      ticketsSold: 180,
      totalTickets: 300,
      views: 890,
      description: "Join industry leaders for cutting-edge tech insights",
    },
    {
      id: "3",
      eventTitle: "Art Gallery Opening",
      eventDate: "March 18, 2024",
      eventTime: "6:00 PM",
      eventLocation: "National Gallery",
      city: "Bulawayo",
      state: "BYO",
      distance: "0.8 km",
      originalPrice: "$75.00",
      currentPrice: "$62.50",
      seller: "@nyasha.art",
      sellerRating: 4.8,
      verified: false,
      category: "Art",
      image: "https://images.unsplash.com/photo-1578662996442-48f60103fc96?w=800&h=600&fit=crop",
      timeLeft: "1 day",
      priceChange: "-17%",
      ticketsSold: 45,
      totalTickets: 100,
      views: 340,
      description: "Exclusive contemporary art exhibition opening",
    },
  ];

  const filteredListings = listings.filter((listing) => {
    const q = searchTerm.toLowerCase();
    const matchesSearch =
      listing.eventTitle.toLowerCase().includes(q) ||
      listing.eventLocation.toLowerCase().includes(q) ||
      listing.city.toLowerCase().includes(q);
    const matchesCategory =
      filterCategory === "all" || listing.category.toLowerCase() === filterCategory.toLowerCase();
    const matchesLocation =
      locationFilter === "all" ||
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

  const resetFilters = () => {
    setSearchTerm("");
    setFilterCategory("all");
    setPriceRange("all");
    setLocationFilter("all");
    setSortBy("date");
  };

  const PriceTrend = ({ change }: { change: string }) => {
    const up = change.startsWith("+");
    return (
      <span
        className={`inline-flex items-center gap-1 text-xs font-medium ${
          up ? "text-emerald-500" : "text-rose-500"
        }`}
      >
        {up ? <TrendingUp className="h-3 w-3" /> : <TrendingDown className="h-3 w-3" />}
        {change}
      </span>
    );
  };

  const gridClasses: Record<ViewMode, string> = {
    grid: "grid grid-cols-2 lg:grid-cols-3 gap-3 sm:gap-5",
    list: "flex flex-col gap-4",
    compact: "grid grid-cols-1 divide-y divide-border/60 rounded-2xl border border-border/60 bg-card/40 overflow-hidden",
  };

  return (
    <div className="min-h-screen bg-background">
      <Header />

      <main className="container mx-auto px-4 sm:px-6 lg:px-8 py-8 md:py-12">
        {/* Header */}
        <div className="mb-8 md:mb-10">
          <div className="flex items-center gap-2 text-xs uppercase tracking-[0.2em] text-muted-foreground mb-3">
            <ShieldCheck className="h-3.5 w-3.5" />
            <span>Verified Resale</span>
          </div>
          <div className="flex flex-col md:flex-row md:items-end md:justify-between gap-4">
            <div>
              <h1 className="text-3xl md:text-4xl font-bold tracking-tight">Marketplace</h1>
              <p className="text-muted-foreground mt-2 max-w-xl">
                Buy and sell authentic tickets from real fans. Every listing is verified end-to-end.
              </p>
            </div>
            <div className="flex items-center gap-6 text-sm">
              <div>
                <div className="text-2xl font-bold leading-none">{listings.length}</div>
                <div className="text-xs text-muted-foreground mt-1">Active listings</div>
              </div>
              <div className="h-8 w-px bg-border" />
              <div>
                <div className="text-2xl font-bold leading-none">100%</div>
                <div className="text-xs text-muted-foreground mt-1">Verified</div>
              </div>
            </div>
          </div>
        </div>

        {/* Search + Controls Bar */}
        <div className="mb-6 rounded-2xl border border-border/60 bg-card/60 backdrop-blur-sm p-3 md:p-4">
          <div className="flex flex-col md:flex-row gap-3">
            <div className="relative flex-1">
              <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 text-muted-foreground h-4 w-4" />
              <Input
                placeholder="Search events, venues, cities..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-10 h-11 bg-background/50 border-border/60"
              />
            </div>

            <div className="flex items-center gap-2">
              <Select value={sortBy} onValueChange={setSortBy}>
                <SelectTrigger className="h-11 w-[160px] bg-background/50 border-border/60">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="date">Event Date</SelectItem>
                  <SelectItem value="distance">Nearest</SelectItem>
                  <SelectItem value="price-low">Price: Low to High</SelectItem>
                  <SelectItem value="price-high">Price: High to Low</SelectItem>
                  <SelectItem value="rating">Top Sellers</SelectItem>
                  <SelectItem value="ending">Ending Soon</SelectItem>
                  <SelectItem value="popular">Most Popular</SelectItem>
                </SelectContent>
              </Select>

              <Button
                variant="outline"
                onClick={() => setShowFilters(!showFilters)}
                className="h-11 border-border/60"
              >
                <SlidersHorizontal className="h-4 w-4 md:mr-2" />
                <span className="hidden md:inline">Filters</span>
              </Button>

              {/* View arrangement toggle */}
              <div className="inline-flex h-11 items-center rounded-md border border-border/60 bg-background/50 p-1">
                {([
                  { mode: "grid", icon: LayoutGrid, label: "Grid" },
                  { mode: "list", icon: Rows3, label: "List" },
                  { mode: "compact", icon: List, label: "Compact" },
                ] as const).map(({ mode, icon: Icon, label }) => (
                  <button
                    key={mode}
                    onClick={() => setViewMode(mode)}
                    aria-label={`${label} view`}
                    aria-pressed={viewMode === mode}
                    className={`flex h-full w-9 items-center justify-center rounded-sm transition-colors ${
                      viewMode === mode
                        ? "bg-foreground text-background"
                        : "text-muted-foreground hover:text-foreground"
                    }`}
                  >
                    <Icon className="h-4 w-4" />
                  </button>
                ))}
              </div>
            </div>
          </div>

          {showFilters && (
            <div className="mt-4 pt-4 border-t border-border/60 grid grid-cols-2 md:grid-cols-4 gap-3">
              <Select value={filterCategory} onValueChange={setFilterCategory}>
                <SelectTrigger className="bg-background/50 border-border/60"><SelectValue placeholder="Category" /></SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Categories</SelectItem>
                  <SelectItem value="music">Music</SelectItem>
                  <SelectItem value="tech">Tech</SelectItem>
                  <SelectItem value="art">Art</SelectItem>
                  <SelectItem value="sports">Sports</SelectItem>
                </SelectContent>
              </Select>
              <Select value={locationFilter} onValueChange={setLocationFilter}>
                <SelectTrigger className="bg-background/50 border-border/60"><SelectValue placeholder="Location" /></SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Locations</SelectItem>
                  <SelectItem value="nearby">Nearby (10km)</SelectItem>
                  <SelectItem value="HRE">Harare</SelectItem>
                  <SelectItem value="BYO">Bulawayo</SelectItem>
                </SelectContent>
              </Select>
              <Select value={priceRange} onValueChange={setPriceRange}>
                <SelectTrigger className="bg-background/50 border-border/60"><SelectValue placeholder="Price" /></SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">Any Price</SelectItem>
                  <SelectItem value="under-100">Under $100</SelectItem>
                  <SelectItem value="100-250">$100 – $250</SelectItem>
                  <SelectItem value="over-250">Over $250</SelectItem>
                </SelectContent>
              </Select>
              <Button variant="ghost" onClick={resetFilters} className="text-muted-foreground hover:text-foreground">
                Clear all
              </Button>
            </div>
          )}
        </div>

        {/* Results count */}
        <div className="flex items-center justify-between mb-4">
          <p className="text-sm text-muted-foreground">
            <span className="font-medium text-foreground">{sortedListings.length}</span> listings
          </p>
        </div>

        {/* Listings */}
        <div className={gridClasses[viewMode]}>
          {sortedListings.map((listing) => {
            // ----- GRID -----
            if (viewMode === "grid") {
              return (
                <Card
                  key={listing.id}
                  className="group overflow-hidden border-border/60 bg-card/60 backdrop-blur-sm hover:border-border transition-all hover:shadow-lg"
                >
                  <div className="relative aspect-[4/3] overflow-hidden">
                    <img
                      src={listing.image}
                      alt={listing.eventTitle}
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/10 to-transparent" />
                    <div className="absolute top-3 left-3 flex gap-1.5">
                      {listing.verified && (
                        <Badge className="bg-background/80 backdrop-blur text-foreground border-0 text-[10px] gap-1">
                          <ShieldCheck className="h-3 w-3" /> Verified
                        </Badge>
                      )}
                      <Badge variant="outline" className="bg-background/80 backdrop-blur border-0 text-[10px]">
                        {listing.category}
                      </Badge>
                    </div>
                    <div className="absolute top-3 right-3">
                      <Badge className="bg-background/80 backdrop-blur text-foreground border-0 text-[10px] gap-1">
                        <Clock className="h-3 w-3" /> {listing.timeLeft}
                      </Badge>
                    </div>
                    <div className="absolute bottom-3 left-3 right-3 text-white">
                      <h3 className="font-semibold leading-tight line-clamp-2 mb-1">{listing.eventTitle}</h3>
                      <div className="flex items-center gap-3 text-xs text-white/80">
                        <span className="flex items-center gap-1"><Calendar className="h-3 w-3" />{listing.eventDate}</span>
                        <span className="flex items-center gap-1"><MapPin className="h-3 w-3" />{listing.city}</span>
                      </div>
                    </div>
                  </div>

                  <CardContent className="p-4 space-y-3">
                    <div className="flex items-end justify-between">
                      <div>
                        <div className="text-xs text-muted-foreground line-through">{listing.originalPrice}</div>
                        <div className="text-2xl font-bold leading-none">{listing.currentPrice}</div>
                        <div className="mt-1"><PriceTrend change={listing.priceChange} /></div>
                      </div>
                      <div className="text-right">
                        <div className="flex items-center justify-end gap-1 text-sm">
                          <Star className="h-3.5 w-3.5 fill-yellow-500 text-yellow-500" />
                          <span className="font-medium">{listing.sellerRating}</span>
                        </div>
                        <div className="text-xs text-muted-foreground mt-0.5">{listing.seller}</div>
                      </div>
                    </div>

                    <div className="flex items-center justify-between text-xs text-muted-foreground pt-2 border-t border-border/60">
                      <span>{listing.ticketsSold}/{listing.totalTickets} sold</span>
                      <span className="flex items-center gap-1"><Eye className="h-3 w-3" />{listing.views}</span>
                    </div>

                    <div className="flex gap-2">
                      <Button className="flex-1" size="sm" onClick={() => openBuy(listing)}>Buy Now</Button>
                      <Button variant="outline" size="sm" onClick={() => openOffer(listing)}>Offer</Button>
                    </div>
                  </CardContent>
                </Card>
              );
            }

            // ----- LIST -----
            if (viewMode === "list") {
              return (
                <Card key={listing.id} className="overflow-hidden border-border/60 bg-card/60 backdrop-blur-sm hover:border-border transition-colors">
                  <div className="flex flex-col sm:flex-row">
                    <div className="relative sm:w-56 aspect-[4/3] sm:aspect-auto sm:h-auto flex-shrink-0 overflow-hidden">
                      <img src={listing.image} alt={listing.eventTitle} className="w-full h-full object-cover" />
                      {listing.verified && (
                        <Badge className="absolute top-3 left-3 bg-background/80 backdrop-blur text-foreground border-0 text-[10px] gap-1">
                          <ShieldCheck className="h-3 w-3" /> Verified
                        </Badge>
                      )}
                    </div>
                    <div className="flex-1 p-4 sm:p-5 flex flex-col">
                      <div className="flex items-start justify-between gap-3 mb-2">
                        <div className="min-w-0">
                          <div className="flex items-center gap-2 mb-1 text-xs text-muted-foreground">
                            <Badge variant="outline" className="text-[10px] h-5">{listing.category}</Badge>
                            <span className="flex items-center gap-1"><Clock className="h-3 w-3" />{listing.timeLeft} left</span>
                          </div>
                          <h3 className="font-semibold text-base leading-tight truncate">{listing.eventTitle}</h3>
                          <div className="flex flex-wrap items-center gap-x-3 gap-y-1 text-xs text-muted-foreground mt-1.5">
                            <span className="flex items-center gap-1"><Calendar className="h-3 w-3" />{listing.eventDate} • {listing.eventTime}</span>
                            <span className="flex items-center gap-1"><MapPin className="h-3 w-3" />{listing.eventLocation}, {listing.city}</span>
                          </div>
                        </div>
                        <div className="text-right flex-shrink-0">
                          <div className="text-xs text-muted-foreground line-through">{listing.originalPrice}</div>
                          <div className="text-xl font-bold leading-none">{listing.currentPrice}</div>
                          <div className="mt-1"><PriceTrend change={listing.priceChange} /></div>
                        </div>
                      </div>

                      <p className="text-sm text-muted-foreground line-clamp-2 mb-3">{listing.description}</p>

                      <div className="mt-auto flex items-center justify-between gap-3">
                        <div className="flex items-center gap-3 text-xs text-muted-foreground">
                          <span className="flex items-center gap-1">
                            <Star className="h-3 w-3 fill-yellow-500 text-yellow-500" />
                            {listing.sellerRating} · {listing.seller}
                          </span>
                          <span>{listing.ticketsSold}/{listing.totalTickets} sold</span>
                        </div>
                        <div className="flex gap-2">
                          <Button variant="outline" size="sm" onClick={() => openOffer(listing)}>Make Offer</Button>
                          <Button size="sm" onClick={() => openBuy(listing)}>Buy Now</Button>
                        </div>
                      </div>
                    </div>
                  </div>
                </Card>
              );
            }

            // ----- COMPACT -----
            return (
              <div key={listing.id} className="group flex items-center gap-3 p-3 hover:bg-muted/40 transition-colors">
                <img src={listing.image} alt={listing.eventTitle} className="h-14 w-14 rounded-md object-cover flex-shrink-0" />
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2 mb-0.5">
                    <h3 className="font-medium text-sm truncate">{listing.eventTitle}</h3>
                    {listing.verified && <ShieldCheck className="h-3.5 w-3.5 text-emerald-500 flex-shrink-0" />}
                  </div>
                  <div className="flex items-center gap-3 text-xs text-muted-foreground">
                    <span>{listing.eventDate}</span>
                    <span className="hidden sm:flex items-center gap-1"><MapPin className="h-3 w-3" />{listing.city}</span>
                    <span className="hidden md:inline">{listing.ticketsSold}/{listing.totalTickets}</span>
                  </div>
                </div>
                <div className="text-right flex-shrink-0">
                  <div className="text-sm font-semibold leading-none">{listing.currentPrice}</div>
                  <div className="mt-1"><PriceTrend change={listing.priceChange} /></div>
                </div>
                <Button size="sm" variant="ghost" className="flex-shrink-0" onClick={() => openBuy(listing)}>
                  Buy <ArrowRight className="h-3.5 w-3.5 ml-1" />
                </Button>
              </div>
            );
          })}
        </div>

        {sortedListings.length === 0 && (
          <div className="text-center py-20 border border-dashed border-border/60 rounded-2xl">
            <Search className="h-10 w-10 text-muted-foreground mx-auto mb-4" />
            <h2 className="text-lg font-semibold mb-2">No listings match your filters</h2>
            <p className="text-sm text-muted-foreground mb-6">Try widening your search or clearing filters</p>
            <Button onClick={resetFilters} variant="outline">Reset filters</Button>
          </div>
        )}

        <div className="mt-12">
          <MarketplaceActions />
        </div>
      </main>

      <Footer />
    </div>
  );
};

export default Marketplace;
