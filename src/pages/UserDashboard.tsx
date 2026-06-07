
import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useAuth } from "@/contexts/AuthContext";
import { useToast } from "@/hooks/use-toast";
import QRCodeLib from "qrcode";
import {
  Calendar, MapPin, Trophy, Clock, Camera, Wallet,
  DollarSign, Tag, ArrowUpRight, Shield, ExternalLink,
  TrendingUp, Banknote, Download, Search, SlidersHorizontal, ArrowUpDown, Vault
} from "lucide-react";
import {
  Select, SelectContent, SelectItem, SelectTrigger, SelectValue
} from "@/components/ui/select";

const UserDashboard = () => {
  const { user } = useAuth();
  const { toast } = useToast();
  const [profileImage, setProfileImage] = useState(user?.profilePicture || "");
  const [qrCodes, setQrCodes] = useState<Record<string, string>>({});
  const [vaultSearch, setVaultSearch] = useState("");
  const [vaultStatus, setVaultStatus] = useState<"all" | "valid" | "used">("all");
  const [vaultSort, setVaultSort] = useState<"date-desc" | "date-asc" | "price-desc" | "price-asc" | "name">("date-desc");

  const handleImageUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (e) => setProfileImage(e.target?.result as string);
      reader.readAsDataURL(file);
    }
  };

  const stats = { eventsAttended: 12, upcoming: 2, totalSpent: 1250, resaleEarnings: 320 };

  const myTickets = [
    {
      id: "1", title: "Bass Drop Festival 2024", date: "Mar 15, 2024", time: "9:00 PM",
      location: "Miami Beach Arena", tier: "VIP", status: "valid", price: 189,
      bgGradient: "from-violet-600 to-pink-500", organizer: "Live Nation",
      ticketNumber: "TK-00142"
    },
    {
      id: "2", title: "Tech Innovation Summit", date: "Mar 25, 2024", time: "10:00 AM",
      location: "SF Convention Center", tier: "General", status: "valid", price: 89,
      bgGradient: "from-cyan-600 to-blue-500", organizer: "TechEvents Co",
      ticketNumber: "TK-00298"
    },
    {
      id: "3", title: "Art Gallery Opening", date: "Feb 10, 2024", time: "7:00 PM",
      location: "Brooklyn Museum, NYC", tier: "General", status: "used", price: 75,
      bgGradient: "from-amber-500 to-orange-600", organizer: "ArtSpace NYC",
      ticketNumber: "TK-00067"
    },
  ];

  const resaleListings = [
    { id: "r1", title: "Music Festival Extra", date: "Apr 15", location: "Austin, TX", originalPrice: 125, askingPrice: 150, status: "listed" },
    { id: "r2", title: "Comedy Night VIP", date: "May 2", location: "Chicago, IL", originalPrice: 80, askingPrice: 95, status: "sold" },
  ];

  const resaleStats = {
    totalEarnings: 320,
    pendingPayout: 150,
    ticketsSold: 3,
    activeListing: 1,
  };

  // Generate QR codes dynamically on render
  useEffect(() => {
    const generateQRCodes = async () => {
      const codes: Record<string, string> = {};
      for (const ticket of myTickets) {
        if (ticket.status === "valid") {
          try {
            const qrData = JSON.stringify({
              ticketId: ticket.id,
              ticketNumber: ticket.ticketNumber,
              event: ticket.title,
              timestamp: Date.now(),
            });
            codes[ticket.id] = await QRCodeLib.toDataURL(qrData, {
              width: 80, margin: 1,
              color: { dark: '#000000', light: '#FFFFFF' }
            });
          } catch (e) {
            console.error("QR generation failed", e);
          }
        }
      }
      setQrCodes(codes);
    };
    generateQRCodes();
  }, []);

  const recentActivity = [
    { action: "Purchased ticket", detail: "Bass Drop Festival 2024", time: "2 days ago" },
    { action: "Earned badge", detail: "Early Bird", time: "1 week ago" },
    { action: "Sold ticket", detail: "Comedy Night VIP — $95", time: "5 days ago" },
  ];

  const badges = [
    { name: "Early Bird", icon: "🐦", earned: true },
    { name: "Tech Fan", icon: "💻", earned: true },
    { name: "Social Star", icon: "🦋", earned: true },
    { name: "Collector", icon: "💎", earned: false },
    { name: "Superfan", icon: "🔥", earned: false },
    { name: "Pioneer", icon: "🚀", earned: true },
  ];

  const handleListForResale = (ticketId: string) => {
    toast({ title: "Listed for resale", description: "Your ticket is now visible on the marketplace." });
  };

  const handleWithdraw = () => {
    toast({ title: "Withdrawal requested", description: `$${resaleStats.pendingPayout} will be sent to your Paynow account.` });
  };

  return (
    <div className="min-h-screen bg-background">
      <Header />

      <main className="container mx-auto px-4 sm:px-6 lg:px-8 py-6">
        {/* Profile header */}
        <div className="flex flex-col sm:flex-row items-start sm:items-center gap-4 mb-8">
          <div className="relative">
            <img
              src={profileImage}
              alt={user?.name}
              className="w-16 h-16 rounded-full border-2 border-primary/20 object-cover bg-muted"
            />
            <button
              onClick={() => document.getElementById("profile-upload")?.click()}
              className="absolute -bottom-1 -right-1 w-7 h-7 rounded-full bg-primary text-primary-foreground flex items-center justify-center shadow-md"
            >
              <Camera className="h-3 w-3" />
            </button>
            <input id="profile-upload" type="file" accept="image/*" className="hidden" onChange={handleImageUpload} />
          </div>
          <div className="flex-1">
            <h1 className="text-2xl font-bold">Hi, {user?.name} 👋</h1>
            <p className="text-sm text-muted-foreground">Member since 2024</p>
          </div>
          <Button asChild size="sm">
            <Link to="/events">Browse Events</Link>
          </Button>
        </div>

        {/* Stats row - unified divided card */}
        <div className="mb-8 rounded-2xl border border-border/60 bg-card/60 backdrop-blur-sm overflow-hidden">
          <div className="grid grid-cols-4 divide-x divide-border/60">
            {[
              { icon: Calendar, value: stats.eventsAttended.toString(), label: "Attended", iconBg: "bg-blue-500/10", color: "text-blue-500" },
              { icon: Clock, value: stats.upcoming.toString(), label: "Upcoming", iconBg: "bg-emerald-500/10", color: "text-emerald-500" },
              { icon: DollarSign, value: `$${stats.totalSpent}`, label: "Spent", iconBg: "bg-orange-500/10", color: "text-orange-500" },
              { icon: TrendingUp, value: `$${stats.resaleEarnings}`, label: "Resale", iconBg: "bg-violet-500/10", color: "text-violet-500" },
            ].map((s) => (
              <div key={s.label} className="flex flex-col items-center justify-center gap-2 p-5">
                <div className={`flex h-9 w-9 items-center justify-center rounded-full ${s.iconBg}`}>
                  <s.icon className={`h-4 w-4 ${s.color}`} />
                </div>
                <div className="text-xl sm:text-2xl font-bold tracking-tight">{s.value}</div>
                <div className="text-[10px] sm:text-[11px] uppercase tracking-wider text-muted-foreground text-center">{s.label}</div>
              </div>
            ))}
          </div>
        </div>

        {/* Tabs */}
        <Tabs defaultValue="tickets" className="space-y-6">
          <TabsList className="grid w-full grid-cols-4 h-10">
            <TabsTrigger value="tickets" className="text-xs sm:text-sm gap-1.5">
              <Vault className="h-3.5 w-3.5" /> Vault
            </TabsTrigger>
            <TabsTrigger value="resale" className="text-xs sm:text-sm">Resale</TabsTrigger>
            <TabsTrigger value="activity" className="text-xs sm:text-sm">Activity</TabsTrigger>
            <TabsTrigger value="settings" className="text-xs sm:text-sm">Settings</TabsTrigger>
          </TabsList>

          {/* Vault - Visual ticket cards with search/filter/sort */}
          <TabsContent value="tickets" className="space-y-6">
            {/* Vault toolbar */}
            <div className="rounded-2xl border border-border/60 bg-card/60 backdrop-blur-sm p-3 flex flex-col sm:flex-row gap-2">
              <div className="relative flex-1">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                <Input
                  placeholder="Search your vault..."
                  value={vaultSearch}
                  onChange={(e) => setVaultSearch(e.target.value)}
                  className="pl-9 h-10 bg-background/50 border-border/60"
                />
              </div>
              <Select value={vaultStatus} onValueChange={(v) => setVaultStatus(v as typeof vaultStatus)}>
                <SelectTrigger className="h-10 w-full sm:w-[140px] bg-background/50 border-border/60">
                  <SlidersHorizontal className="h-3.5 w-3.5 mr-1.5 text-muted-foreground" />
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All tickets</SelectItem>
                  <SelectItem value="valid">Valid</SelectItem>
                  <SelectItem value="used">Used</SelectItem>
                </SelectContent>
              </Select>
              <Select value={vaultSort} onValueChange={(v) => setVaultSort(v as typeof vaultSort)}>
                <SelectTrigger className="h-10 w-full sm:w-[160px] bg-background/50 border-border/60">
                  <ArrowUpDown className="h-3.5 w-3.5 mr-1.5 text-muted-foreground" />
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="date-desc">Newest first</SelectItem>
                  <SelectItem value="date-asc">Oldest first</SelectItem>
                  <SelectItem value="price-desc">Price: High to Low</SelectItem>
                  <SelectItem value="price-asc">Price: Low to High</SelectItem>
                  <SelectItem value="name">A → Z</SelectItem>
                </SelectContent>
              </Select>
            </div>

            {(() => {
              const q = vaultSearch.trim().toLowerCase();
              const filtered = myTickets
                .filter((t) => vaultStatus === "all" || t.status === vaultStatus)
                .filter((t) =>
                  !q ||
                  t.title.toLowerCase().includes(q) ||
                  t.location.toLowerCase().includes(q) ||
                  t.organizer.toLowerCase().includes(q) ||
                  t.ticketNumber.toLowerCase().includes(q)
                )
                .sort((a, b) => {
                  switch (vaultSort) {
                    case "date-asc": return new Date(a.date).getTime() - new Date(b.date).getTime();
                    case "price-desc": return b.price - a.price;
                    case "price-asc": return a.price - b.price;
                    case "name": return a.title.localeCompare(b.title);
                    default: return new Date(b.date).getTime() - new Date(a.date).getTime();
                  }
                });

              if (filtered.length === 0) {
                return (
                  <Card className="border-dashed border-2">
                    <CardContent className="p-12 text-center">
                      <div className="text-5xl mb-4">🎫</div>
                      <h3 className="font-semibold text-lg mb-2">
                        {myTickets.length === 0 ? "Your vault is empty" : "No matching tickets"}
                      </h3>
                      <p className="text-sm text-muted-foreground mb-4">
                        {myTickets.length === 0
                          ? "Browse events and grab your first ticket!"
                          : "Try adjusting your search or filters."}
                      </p>
                      {myTickets.length === 0 && (
                        <Button asChild><Link to="/events">Browse Events</Link></Button>
                      )}
                    </CardContent>
                  </Card>
                );
              }

              return (
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  {filtered.map((ticket) => (
                    <div key={ticket.id} className="group">
                      {/* Visual Ticket Card */}
                      <div className={`relative rounded-2xl overflow-hidden bg-gradient-to-br ${ticket.bgGradient} text-white shadow-lg hover:shadow-xl transition-all duration-300`}>
                        <div className="absolute right-0 top-0 bottom-0 w-16 flex flex-col justify-center">
                          <div className="border-l-2 border-dashed border-white/30 h-full" />
                        </div>

                        <div className="p-5 pr-20 relative">
                          <div className="flex items-center justify-between mb-3">
                            <span className="text-[10px] font-medium tracking-wider uppercase opacity-80">
                              {ticket.organizer}
                            </span>
                            <Badge className={`text-[10px] ${ticket.status === "valid" ? "bg-white/20 text-white border-white/30" : "bg-black/20 text-white/70 border-white/20"}`}>
                              {ticket.status === "valid" ? "✓ Valid" : "Used"}
                            </Badge>
                          </div>

                          <h3 className="text-lg font-bold mb-3 leading-tight">{ticket.title}</h3>

                          <div className="grid grid-cols-2 gap-2 mb-3 text-xs">
                            <div className="flex items-center gap-1.5 opacity-90">
                              <Calendar className="h-3 w-3" />
                              <span>{ticket.date}</span>
                            </div>
                            <div className="flex items-center gap-1.5 opacity-90">
                              <Clock className="h-3 w-3" />
                              <span>{ticket.time}</span>
                            </div>
                            <div className="flex items-center gap-1.5 opacity-90 col-span-2">
                              <MapPin className="h-3 w-3" />
                              <span>{ticket.location}</span>
                            </div>
                          </div>

                          <div className="flex items-end justify-between pt-2 border-t border-white/20">
                            <div>
                              <p className="text-[10px] opacity-60 uppercase tracking-wider">Tier</p>
                              <p className="text-sm font-bold">{ticket.tier}</p>
                            </div>
                            <div className="text-center">
                              <p className="text-[10px] opacity-60 uppercase tracking-wider">Price</p>
                              <p className="text-sm font-bold">${ticket.price}</p>
                            </div>
                            <div className="text-right">
                              <p className="text-[10px] opacity-60 uppercase tracking-wider">Ticket</p>
                              <p className="text-sm font-bold">{ticket.ticketNumber}</p>
                            </div>
                          </div>
                        </div>

                        <div className="absolute right-0 top-0 bottom-0 w-16 flex flex-col items-center justify-center bg-white/10 backdrop-blur-sm">
                          {qrCodes[ticket.id] ? (
                            <img src={qrCodes[ticket.id]} alt="QR" className="w-12 h-12 rounded" />
                          ) : (
                            <div className="w-12 h-12 rounded bg-white/20 flex items-center justify-center">
                              <span className="text-xs opacity-60">—</span>
                            </div>
                          )}
                          <p className="text-[8px] mt-1 opacity-60 font-medium">SCAN</p>
                        </div>
                      </div>

                      {ticket.status === "valid" && (
                        <div className="flex gap-2 mt-2">
                          <Button
                            variant="outline" size="sm" className="flex-1 h-8 text-xs"
                            onClick={() => handleListForResale(ticket.id)}
                          >
                            <ArrowUpRight className="h-3 w-3 mr-1" /> List for Resale
                          </Button>
                          <Button variant="outline" size="sm" className="h-8 text-xs">
                            <Download className="h-3 w-3 mr-1" /> Save
                          </Button>
                        </div>
                      )}
                    </div>
                  ))}
                </div>
              );
            })()}
          </TabsContent>

          {/* Resale - with earnings tracking */}
          <TabsContent value="resale" className="space-y-6">
            {/* Resale earnings overview */}
            <div className="rounded-2xl border border-border/60 bg-card/60 backdrop-blur-sm overflow-hidden">
              <div className="grid grid-cols-4 divide-x divide-border/60">
                {[
                  { label: "Earned", value: `$${resaleStats.totalEarnings}`, icon: TrendingUp, iconBg: "bg-emerald-500/10", color: "text-emerald-500" },
                  { label: "Pending", value: `$${resaleStats.pendingPayout}`, icon: Banknote, iconBg: "bg-orange-500/10", color: "text-orange-500" },
                  { label: "Sold", value: resaleStats.ticketsSold.toString(), icon: Tag, iconBg: "bg-blue-500/10", color: "text-blue-500" },
                  { label: "Active", value: resaleStats.activeListing.toString(), icon: ArrowUpRight, iconBg: "bg-violet-500/10", color: "text-violet-500" },
                ].map((s) => (
                  <div key={s.label} className="flex flex-col items-center justify-center gap-2 p-5">
                    <div className={`flex h-9 w-9 items-center justify-center rounded-full ${s.iconBg}`}>
                      <s.icon className={`h-4 w-4 ${s.color}`} />
                    </div>
                    <div className="text-xl sm:text-2xl font-bold tracking-tight">{s.value}</div>
                    <div className="text-[10px] sm:text-[11px] uppercase tracking-wider text-muted-foreground text-center">{s.label}</div>
                  </div>
                ))}
              </div>
            </div>

            {/* Withdraw button */}
            {resaleStats.pendingPayout > 0 && (
              <Card className="border-green-200 dark:border-green-900 bg-green-50/50 dark:bg-green-950/20">
                <CardContent className="p-4 flex items-center justify-between">
                  <div>
                    <p className="font-semibold text-sm">Ready to withdraw</p>
                    <p className="text-xs text-muted-foreground">
                      ${resaleStats.pendingPayout} available · Sent via Paynow
                    </p>
                  </div>
                  <Button size="sm" onClick={handleWithdraw} className="bg-green-600 hover:bg-green-700">
                    <Wallet className="h-3 w-3 mr-1" /> Withdraw
                  </Button>
                </CardContent>
              </Card>
            )}

            {/* Listings */}
            <div>
              <div className="flex items-center justify-between mb-3">
                <h2 className="font-semibold text-sm">Your Listings</h2>
                <Button size="sm" variant="outline" asChild>
                  <Link to="/marketplace"><ExternalLink className="h-3 w-3 mr-1" /> Marketplace</Link>
                </Button>
              </div>

              {resaleListings.map((listing) => (
                <Card key={listing.id} className="border-border/50 mb-3">
                  <CardContent className="p-4 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3">
                    <div>
                      <div className="flex items-center gap-2 mb-1">
                        <h3 className="font-semibold text-sm">{listing.title}</h3>
                        <Badge className={`text-[10px] ${listing.status === "sold" ? "bg-green-100 text-green-700 border-green-200" : "bg-amber-100 text-amber-700 border-amber-200"}`}>
                          {listing.status === "sold" ? "✓ Sold" : "Listed"}
                        </Badge>
                      </div>
                      <div className="flex gap-3 text-xs text-muted-foreground">
                        <span>{listing.date}</span>
                        <span>{listing.location}</span>
                      </div>
                    </div>
                    <div className="flex items-center gap-4">
                      <div className="text-right">
                        <p className="text-xs text-muted-foreground line-through">${listing.originalPrice}</p>
                        <p className="font-bold text-sm">${listing.askingPrice}</p>
                      </div>
                      {listing.status === "listed" && (
                        <Button variant="destructive" size="sm" className="h-8 text-xs">Remove</Button>
                      )}
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>

            <Card className="bg-muted/50 border-border/50">
              <CardContent className="p-4 flex items-start gap-3">
                <Shield className="h-5 w-5 text-primary shrink-0 mt-0.5" />
                <div>
                  <p className="font-medium text-sm">Secure Resale</p>
                  <p className="text-xs text-muted-foreground">All resales are verified on the TON blockchain. Buyers get authentic NFT tickets with full ownership transfer.</p>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          {/* Activity */}
          <TabsContent value="activity" className="space-y-4">
            <div className="grid md:grid-cols-2 gap-6">
              <Card>
                <CardHeader><CardTitle className="text-base">Recent Activity</CardTitle></CardHeader>
                <CardContent className="space-y-3">
                  {recentActivity.map((a, i) => (
                    <div key={i} className="flex items-start gap-3">
                      <div className="w-2 h-2 rounded-full bg-primary mt-1.5 shrink-0" />
                      <div>
                        <p className="text-sm font-medium">{a.action}</p>
                        <p className="text-xs text-muted-foreground">{a.detail} · {a.time}</p>
                      </div>
                    </div>
                  ))}
                </CardContent>
              </Card>

              <Card>
                <CardHeader><CardTitle className="text-base">Badges</CardTitle></CardHeader>
                <CardContent>
                  <div className="grid grid-cols-3 gap-3">
                    {badges.map((b, i) => (
                      <div
                        key={i}
                        className={`text-center p-3 rounded-lg border ${b.earned ? "border-primary/20 bg-primary/5" : "border-border opacity-40"}`}
                      >
                        <span className="text-2xl">{b.icon}</span>
                        <p className="text-xs font-medium mt-1">{b.name}</p>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            </div>
          </TabsContent>

          {/* Settings - with Paynow payment details */}
          <TabsContent value="settings" className="space-y-6">
            <Card>
              <CardHeader><CardTitle className="text-base">Account Settings</CardTitle></CardHeader>
              <CardContent className="space-y-4 max-w-md">
                <div className="space-y-2">
                  <Label htmlFor="name">Full Name</Label>
                  <Input id="name" defaultValue={user?.name} />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="email">Email</Label>
                  <Input id="email" defaultValue={user?.email} disabled />
                </div>
                <Button variant="outline" size="sm">Save Changes</Button>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle className="text-base flex items-center gap-2">
                  <Wallet className="h-4 w-4" />
                  Payment Details — Paynow
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4 max-w-md">
                <p className="text-xs text-muted-foreground">
                  Add your Paynow details for faster ticket purchases and resale withdrawals.
                </p>
                <div className="space-y-2">
                  <Label htmlFor="paynow-phone">Paynow Phone Number</Label>
                  <Input id="paynow-phone" placeholder="e.g. 0771234567" />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="paynow-name">Account Holder Name</Label>
                  <Input id="paynow-name" placeholder="Your full name as registered" />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="paynow-email">Paynow Email (optional)</Label>
                  <Input id="paynow-email" type="email" placeholder="email@example.com" />
                </div>
                <div className="flex gap-2">
                  <Button size="sm">Save Payment Details</Button>
                </div>
                <p className="text-[10px] text-muted-foreground">
                  Your payment details are encrypted and only used for ticket purchases and resale payouts.
                </p>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle className="text-base">TON Wallet (Optional)</CardTitle>
              </CardHeader>
              <CardContent className="space-y-3 max-w-md">
                <p className="text-xs text-muted-foreground">
                  Connect your TON wallet to receive NFT tickets directly. Not required — tickets are delivered via email by default.
                </p>
                <div className="space-y-2">
                  <Label htmlFor="ton-wallet">Wallet Address</Label>
                  <Input id="ton-wallet" placeholder="EQx..." />
                </div>
                <Button variant="outline" size="sm">Connect Wallet</Button>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </main>

      <Footer />
    </div>
  );
};

export default UserDashboard;
