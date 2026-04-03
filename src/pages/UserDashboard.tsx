
import { useState } from "react";
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
import {
  Calendar, MapPin, Trophy, Clock, Ticket, TrendingUp, Camera,
  DollarSign, Tag, ArrowUpRight, QrCode, Shield, ExternalLink
} from "lucide-react";

const UserDashboard = () => {
  const { user } = useAuth();
  const { toast } = useToast();
  const [profileImage, setProfileImage] = useState(user?.profilePicture || "");

  const handleImageUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (e) => setProfileImage(e.target?.result as string);
      reader.readAsDataURL(file);
    }
  };

  const stats = { eventsAttended: 12, upcoming: 2, totalSpent: 1250, badges: 8 };

  const myTickets = [
    { id: "1", title: "Bass Drop Festival 2024", date: "Mar 15", location: "Miami, FL", tier: "VIP", status: "valid", price: 189 },
    { id: "2", title: "Tech Conference 2024", date: "Mar 25", location: "San Francisco, CA", tier: "General", status: "valid", price: 89 },
    { id: "3", title: "Art Gallery Opening", date: "Feb 10", location: "New York, NY", tier: "General", status: "used", price: 75 },
  ];

  const resaleListings = [
    { id: "r1", title: "Music Festival Extra", date: "Apr 15", location: "Austin, TX", originalPrice: 125, askingPrice: 150, status: "listed" },
  ];

  const recentActivity = [
    { action: "Purchased ticket", detail: "Bass Drop Festival 2024", time: "2 days ago" },
    { action: "Earned badge", detail: "Early Bird", time: "1 week ago" },
    { action: "Listed for resale", detail: "Music Festival Extra", time: "3 days ago" },
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
          <Button asChild variant="outline" size="sm">
            <Link to="/events">Browse Events</Link>
          </Button>
        </div>

        {/* Stats row */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-3 mb-8">
          {[
            { icon: Calendar, value: stats.eventsAttended, label: "Attended", color: "text-primary" },
            { icon: Clock, value: stats.upcoming, label: "Upcoming", color: "text-blue-500" },
            { icon: DollarSign, value: `$${stats.totalSpent}`, label: "Spent", color: "text-green-500" },
            { icon: Trophy, value: stats.badges, label: "Badges", color: "text-yellow-500" },
          ].map((s, i) => (
            <Card key={i} className="border-border/50">
              <CardContent className="p-4 flex items-center gap-3">
                <div className={`p-2 rounded-lg bg-muted ${s.color}`}>
                  <s.icon className="h-5 w-5" />
                </div>
                <div>
                  <p className="text-xl font-bold leading-none">{s.value}</p>
                  <p className="text-xs text-muted-foreground">{s.label}</p>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>

        {/* Tabs */}
        <Tabs defaultValue="tickets" className="space-y-6">
          <TabsList className="grid w-full grid-cols-4 h-10">
            <TabsTrigger value="tickets" className="text-xs sm:text-sm">My Tickets</TabsTrigger>
            <TabsTrigger value="resale" className="text-xs sm:text-sm">Resale</TabsTrigger>
            <TabsTrigger value="activity" className="text-xs sm:text-sm">Activity</TabsTrigger>
            <TabsTrigger value="settings" className="text-xs sm:text-sm">Settings</TabsTrigger>
          </TabsList>

          {/* My Tickets */}
          <TabsContent value="tickets" className="space-y-4">
            {myTickets.map((ticket) => (
              <Card key={ticket.id} className="overflow-hidden border-border/50 hover:shadow-md transition-shadow">
                <CardContent className="p-0">
                  <div className="flex flex-col sm:flex-row">
                    {/* Ticket left accent */}
                    <div className={`w-full sm:w-1.5 h-1.5 sm:h-auto ${ticket.status === "valid" ? "bg-green-500" : "bg-muted-foreground/30"}`} />
                    <div className="flex-1 p-4 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3">
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center gap-2 mb-1">
                          <h3 className="font-semibold text-sm truncate">{ticket.title}</h3>
                          <Badge variant={ticket.status === "valid" ? "default" : "secondary"} className="text-[10px] shrink-0">
                            {ticket.status === "valid" ? "Valid" : "Used"}
                          </Badge>
                        </div>
                        <div className="flex items-center gap-3 text-xs text-muted-foreground">
                          <span className="flex items-center gap-1"><Calendar className="h-3 w-3" />{ticket.date}</span>
                          <span className="flex items-center gap-1"><MapPin className="h-3 w-3" />{ticket.location}</span>
                          <span className="flex items-center gap-1"><Tag className="h-3 w-3" />{ticket.tier}</span>
                        </div>
                      </div>
                      <div className="flex items-center gap-2">
                        <span className="font-bold text-sm">${ticket.price}</span>
                        {ticket.status === "valid" && (
                          <>
                            <Button variant="outline" size="sm" className="h-8 text-xs">
                              <QrCode className="h-3 w-3 mr-1" /> QR
                            </Button>
                            <Button
                              variant="outline"
                              size="sm"
                              className="h-8 text-xs"
                              onClick={() => handleListForResale(ticket.id)}
                            >
                              <ArrowUpRight className="h-3 w-3 mr-1" /> Resell
                            </Button>
                          </>
                        )}
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </TabsContent>

          {/* Resale */}
          <TabsContent value="resale" className="space-y-4">
            <div className="flex items-center justify-between mb-2">
              <h2 className="font-semibold">Your Resale Listings</h2>
              <Button size="sm" variant="outline" asChild>
                <Link to="/marketplace"><ExternalLink className="h-3 w-3 mr-1" /> Marketplace</Link>
              </Button>
            </div>

            {resaleListings.length === 0 ? (
              <Card className="border-dashed border-2">
                <CardContent className="p-8 text-center">
                  <Tag className="h-8 w-8 mx-auto mb-3 text-muted-foreground" />
                  <p className="font-medium mb-1">No listings yet</p>
                  <p className="text-sm text-muted-foreground">Go to My Tickets and click "Resell" on any valid ticket</p>
                </CardContent>
              </Card>
            ) : (
              resaleListings.map((listing) => (
                <Card key={listing.id} className="border-border/50">
                  <CardContent className="p-4 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3">
                    <div>
                      <div className="flex items-center gap-2 mb-1">
                        <h3 className="font-semibold text-sm">{listing.title}</h3>
                        <Badge className="bg-amber-500/10 text-amber-600 border-amber-200 text-[10px]">Listed</Badge>
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
                      <Button variant="destructive" size="sm" className="h-8 text-xs">Remove</Button>
                    </div>
                  </CardContent>
                </Card>
              ))
            )}

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

          {/* Settings */}
          <TabsContent value="settings">
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
                <Button variant="outline">Save Changes</Button>
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
