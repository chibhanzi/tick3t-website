
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
  TrendingUp, Banknote, Download, Search, SlidersHorizontal, ArrowUpDown, Vault,
  LayoutGrid, Rows3, Music, BadgeCheck, GraduationCap, Gift, Award, AtSign, Sparkles
} from "lucide-react";

type VaultCategory = "concert" | "membership" | "course" | "giftcard" | "badge" | "username";

const CATEGORY_META: Record<VaultCategory, { label: string; short: string; icon: any; accent: string }> = {
  concert:    { label: "Concert Tickets",    short: "Tickets",     icon: Music,         accent: "from-violet-600 to-pink-500" },
  membership: { label: "Membership Passes",  short: "Memberships", icon: BadgeCheck,    accent: "from-amber-500 to-orange-600" },
  course:     { label: "Course Credentials", short: "Credentials", icon: GraduationCap, accent: "from-emerald-500 to-teal-600" },
  giftcard:   { label: "Gift Cards",         short: "Gift Cards",  icon: Gift,          accent: "from-rose-500 to-red-600" },
  badge:      { label: "Attendance Badges",  short: "Badges",      icon: Award,         accent: "from-cyan-500 to-blue-600" },
  username:   { label: "Usernames",          short: "Usernames",   icon: AtSign,        accent: "from-fuchsia-500 to-purple-600" },
};
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
  const [vaultLayout, setVaultLayout] = useState<"grid" | "list">("grid");
  const [vaultCategory, setVaultCategory] = useState<"all" | VaultCategory>("all");

  const handleImageUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (e) => setProfileImage(e.target?.result as string);
      reader.readAsDataURL(file);
    }
  };

  const stats = { eventsAttended: 12, upcoming: 2, totalSpent: 1250, resaleEarnings: 320 };

  const myTickets: Array<{
    id: string; title: string; date: string; time: string; location: string;
    tier: string; status: string; price: number; bgGradient: string; organizer: string;
    ticketNumber: string; sortDate: string; category: VaultCategory;
    meta?: string; subtitle?: string;
  }> = [
    {
      id: "1", title: "Bass Drop Festival 2024", date: "Mar 15, 2024", time: "9:00 PM",
      location: "Miami Beach Arena", tier: "VIP", status: "valid", price: 189,
      bgGradient: "from-violet-600 to-pink-500", organizer: "Live Nation",
      ticketNumber: "TK-00142", sortDate: "2024-03-15T21:00:00", category: "concert"
    },
    {
      id: "2", title: "Tech Innovation Summit", date: "Mar 25, 2024", time: "10:00 AM",
      location: "SF Convention Center", tier: "General", status: "valid", price: 89,
      bgGradient: "from-cyan-600 to-blue-500", organizer: "TechEvents Co",
      ticketNumber: "TK-00298", sortDate: "2024-03-25T10:00:00", category: "concert"
    },
    {
      id: "3", title: "Art Gallery Opening", date: "Feb 10, 2024", time: "7:00 PM",
      location: "Brooklyn Museum, NYC", tier: "General", status: "used", price: 75,
      bgGradient: "from-amber-500 to-orange-600", organizer: "ArtSpace NYC",
      ticketNumber: "TK-00067", sortDate: "2024-02-10T19:00:00", category: "concert"
    },
    // Membership passes
    {
      id: "m1", title: "Vouch Insider Club", date: "Renews Jan 2025", time: "Annual",
      location: "Members-only benefits", tier: "Gold", status: "valid", price: 120,
      bgGradient: "from-amber-500 to-orange-600", organizer: "Vouch",
      ticketNumber: "MEM-00812", sortDate: "2025-01-10T00:00:00", category: "membership",
      subtitle: "Priority pre-sales · Lounge access"
    },
    // Course credentials
    {
      id: "c1", title: "Blockchain Fundamentals", date: "Issued Nov 20, 2024", time: "Verified",
      location: "Tick3rt Academy", tier: "Certificate", status: "valid", price: 0,
      bgGradient: "from-emerald-500 to-teal-600", organizer: "Tick3rt Academy",
      ticketNumber: "CRED-00021", sortDate: "2024-11-20T00:00:00", category: "course",
      subtitle: "12 modules · 40 hrs"
    },
    // Gift card
    {
      id: "g1", title: "Tick3rt Gift Card", date: "No expiry", time: "Balance available",
      location: "Redeemable on any event", tier: "$50", status: "valid", price: 50,
      bgGradient: "from-rose-500 to-red-600", organizer: "Tick3rt",
      ticketNumber: "GC-9F2A-7K", sortDate: "2024-12-01T00:00:00", category: "giftcard",
      meta: "Balance: $42.50"
    },
    // Attendance badge
    {
      id: "b1", title: "HIFA 2024 Attendee", date: "Awarded May 2024", time: "Lifetime",
      location: "Harare International Festival", tier: "Attendance", status: "valid", price: 0,
      bgGradient: "from-cyan-500 to-blue-600", organizer: "HIFA",
      ticketNumber: "BDG-HIFA24", sortDate: "2024-05-08T00:00:00", category: "badge",
      subtitle: "Proof of attendance"
    },
    // Username
    {
      id: "u1", title: "@raves", date: "Owned since Jun 2024", time: "Permanent",
      location: "Tick3rt handle", tier: "Rare", status: "valid", price: 250,
      bgGradient: "from-fuchsia-500 to-purple-600", organizer: "Tick3rt Names",
      ticketNumber: "NAME-RAVES", sortDate: "2024-06-14T00:00:00", category: "username",
      subtitle: "5-letter · Category: Music"
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

  const visibleVaultTickets = [...myTickets]
    .filter((ticket) => vaultCategory === "all" || ticket.category === vaultCategory)
    .filter((ticket) => vaultStatus === "all" || ticket.status === vaultStatus)
    .filter((ticket) => {
      const query = vaultSearch.trim().toLowerCase();
      if (!query) return true;

      return [ticket.title, ticket.location, ticket.organizer, ticket.ticketNumber, ticket.tier]
        .some((value) => value.toLowerCase().includes(query));
    })
    .sort((a, b) => {
      switch (vaultSort) {
        case "date-asc":
          return a.sortDate.localeCompare(b.sortDate);
        case "price-desc":
          return b.price - a.price;
        case "price-asc":
          return a.price - b.price;
        case "name":
          return a.title.localeCompare(b.title);
        case "date-desc":
        default:
          return b.sortDate.localeCompare(a.sortDate);
      }
    });

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
            <div className="rounded-2xl border border-border/60 bg-card/60 backdrop-blur-sm p-3 space-y-3">
              {/* Search */}
              <div className="relative">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                <Input
                  placeholder="Search your vault..."
                  value={vaultSearch}
                  onChange={(e) => setVaultSearch(e.target.value)}
                  className="pl-9 h-10 bg-background/50 border-border/60"
                />
              </div>

              {/* Category chips */}
              <div className="flex items-center gap-1.5 overflow-x-auto -mx-1 px-1 pb-0.5">
                {([
                  { v: "all" as const, label: "All", icon: Sparkles },
                  ...(Object.entries(CATEGORY_META).map(([v, m]) => ({ v: v as VaultCategory, label: m.short, icon: m.icon }))),
                ]).map((c) => {
                  const active = vaultCategory === c.v;
                  const count = c.v === "all" ? myTickets.length : myTickets.filter(t => t.category === c.v).length;
                  const Icon = c.icon;
                  return (
                    <button
                      key={c.v}
                      type="button"
                      onClick={() => setVaultCategory(c.v)}
                      className={`shrink-0 inline-flex items-center gap-1.5 rounded-full px-3 h-8 text-xs font-medium transition-colors border ${
                        active
                          ? "bg-primary text-primary-foreground border-primary"
                          : "bg-background/40 text-muted-foreground border-border/60 hover:text-foreground hover:bg-muted"
                      }`}
                    >
                      <Icon className="h-3.5 w-3.5" />
                      {c.label}
                      <span className={`text-[10px] px-1.5 rounded-full ${active ? "bg-primary-foreground/20" : "bg-muted"}`}>{count}</span>
                    </button>
                  );
                })}
              </div>


              {/* Status pills */}
              <div className="flex items-center gap-1.5 overflow-x-auto -mx-1 px-1 pb-0.5">
                {([
                  { v: "all", label: "All", count: myTickets.length },
                  { v: "valid", label: "Valid", count: myTickets.filter(t => t.status === "valid").length },
                  { v: "used", label: "Used", count: myTickets.filter(t => t.status === "used").length },
                ] as const).map((s) => (
                  <button
                    key={s.v}
                    type="button"
                    onClick={() => setVaultStatus(s.v as typeof vaultStatus)}
                    className={`shrink-0 inline-flex items-center gap-1.5 rounded-full px-3 h-8 text-xs font-medium transition-colors ${
                      vaultStatus === s.v
                        ? "bg-primary text-primary-foreground"
                        : "bg-muted/60 text-muted-foreground hover:bg-muted"
                    }`}
                  >
                    {s.label}
                    <span className={`text-[10px] px-1.5 rounded-full ${vaultStatus === s.v ? "bg-primary-foreground/20" : "bg-background/60"}`}>
                      {s.count}
                    </span>
                  </button>
                ))}
              </div>

              {/* Sort + Layout */}
              <div className="flex items-center gap-2">
                <Select value={vaultSort} onValueChange={(v) => setVaultSort(v as typeof vaultSort)}>
                  <SelectTrigger className="h-9 flex-1 bg-background/50 border-border/60 text-xs">
                    <ArrowUpDown className="h-3.5 w-3.5 mr-1.5 text-muted-foreground shrink-0" />
                    <span className="text-muted-foreground mr-1 hidden xs:inline">Sort:</span>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="date-desc">Newest first</SelectItem>
                    <SelectItem value="date-asc">Oldest first</SelectItem>
                    <SelectItem value="price-desc">Price: High to Low</SelectItem>
                    <SelectItem value="price-asc">Price: Low to High</SelectItem>
                    <SelectItem value="name">Name (A → Z)</SelectItem>
                  </SelectContent>
                </Select>
                <div className="inline-flex h-9 items-center rounded-md border border-border/60 bg-background/50 p-0.5 shrink-0">
                  <button
                    type="button"
                    onClick={() => setVaultLayout("grid")}
                    aria-label="Grid view"
                    aria-pressed={vaultLayout === "grid"}
                    className={`flex h-8 w-8 items-center justify-center rounded-sm transition-colors ${vaultLayout === "grid" ? "bg-primary text-primary-foreground shadow-sm" : "text-muted-foreground hover:text-foreground"}`}
                  >
                    <LayoutGrid className="h-4 w-4" />
                  </button>
                  <button
                    type="button"
                    onClick={() => setVaultLayout("list")}
                    aria-label="List view"
                    aria-pressed={vaultLayout === "list"}
                    className={`flex h-8 w-8 items-center justify-center rounded-sm transition-colors ${vaultLayout === "list" ? "bg-primary text-primary-foreground shadow-sm" : "text-muted-foreground hover:text-foreground"}`}
                  >
                    <Rows3 className="h-4 w-4" />
                  </button>
                </div>
              </div>
            </div>

            {(() => {
              if (visibleVaultTickets.length === 0) {
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
                <div key={vaultLayout} className={vaultLayout === "grid" ? "grid grid-cols-2 md:grid-cols-2 gap-3 md:gap-6" : "flex flex-col gap-3"}>
                  {visibleVaultTickets.map((ticket) => {
                    const catMeta = CATEGORY_META[ticket.category];
                    const CatIcon = catMeta.icon;
                    const isTransferable = ticket.category !== "course" && ticket.category !== "badge";
                    const isConcert = ticket.category === "concert";
                    return (
                    <div key={ticket.id} className={vaultLayout === "list" ? "group rounded-2xl border border-border/60 bg-card/70 backdrop-blur-sm overflow-hidden shadow-sm" : "group"}>

                      {vaultLayout === "list" ? (
                        <>
                          <div className={`h-1.5 bg-gradient-to-r ${ticket.bgGradient}`} />
                          <div className="p-4 flex items-start gap-3">
                            <div className={`shrink-0 h-14 w-14 rounded-xl bg-gradient-to-br ${ticket.bgGradient} flex items-center justify-center text-primary-foreground shadow-md`}>
                              <Vault className="h-6 w-6" />
                            </div>

                            <div className="min-w-0 flex-1">
                              <div className="flex items-start justify-between gap-2 mb-1">
                                <div className="min-w-0">
                                  <p className="text-[10px] font-medium uppercase tracking-wider text-muted-foreground truncate">
                                    {ticket.organizer}
                                  </p>
                                  <h3 className="font-bold leading-snug truncate">{ticket.title}</h3>
                                </div>
                                <Badge variant={ticket.status === "valid" ? "default" : "secondary"} className="shrink-0 text-[10px]">
                                  {ticket.status === "valid" ? "Valid" : "Used"}
                                </Badge>
                              </div>

                              <div className="grid grid-cols-1 sm:grid-cols-3 gap-1.5 text-xs text-muted-foreground">
                                <span className="flex items-center gap-1.5 min-w-0"><Calendar className="h-3 w-3 shrink-0" /> {ticket.date}</span>
                                <span className="flex items-center gap-1.5 min-w-0"><Clock className="h-3 w-3 shrink-0" /> {ticket.time}</span>
                                <span className="flex items-center gap-1.5 min-w-0 truncate"><MapPin className="h-3 w-3 shrink-0" /> {ticket.location}</span>
                              </div>

                              <div className="mt-3 flex flex-wrap items-center gap-x-4 gap-y-2 text-xs">
                                <span><span className="text-muted-foreground">Tier</span> <strong>{ticket.tier}</strong></span>
                                <span><span className="text-muted-foreground">Price</span> <strong>${ticket.price}</strong></span>
                                <span><span className="text-muted-foreground">No.</span> <strong>{ticket.ticketNumber}</strong></span>
                              </div>
                            </div>

                            <div className="hidden sm:flex shrink-0 flex-col items-center gap-1">
                              {qrCodes[ticket.id] ? (
                                <img src={qrCodes[ticket.id]} alt="QR" className="w-12 h-12 rounded border border-border" />
                              ) : (
                                <div className="w-12 h-12 rounded bg-muted flex items-center justify-center text-muted-foreground text-xs">—</div>
                              )}
                            </div>
                          </div>

                          {ticket.status === "valid" && (
                            <div className="px-4 pb-4 flex gap-2">
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
                        </>
                      ) : (
                        <>
                      {/* Visual Ticket Card */}
                      <div className={`relative rounded-2xl overflow-hidden bg-gradient-to-br ${ticket.bgGradient} text-white shadow-lg hover:shadow-xl transition-all duration-300`}>
                        <div className="absolute right-0 top-0 bottom-0 w-12 sm:w-16 hidden sm:flex flex-col justify-center">
                          <div className="border-l-2 border-dashed border-white/30 h-full" />
                        </div>

                        <div className="p-3 sm:p-5 sm:pr-20 relative">
                          <div className="flex items-center justify-between mb-2 sm:mb-3 gap-1">
                            <span className="text-[9px] sm:text-[10px] font-medium tracking-wider uppercase opacity-80 truncate">
                              {ticket.organizer}
                            </span>
                            <Badge className={`text-[9px] sm:text-[10px] shrink-0 ${ticket.status === "valid" ? "bg-white/20 text-white border-white/30" : "bg-black/20 text-white/70 border-white/20"}`}>
                              {ticket.status === "valid" ? "✓" : "Used"}
                            </Badge>
                          </div>

                          <h3 className="text-sm sm:text-lg font-bold mb-2 sm:mb-3 leading-tight line-clamp-2">{ticket.title}</h3>

                          <div className="flex flex-col sm:grid sm:grid-cols-2 gap-1 sm:gap-2 mb-2 sm:mb-3 text-[11px] sm:text-xs">
                            <div className="flex items-center gap-1.5 opacity-90 min-w-0">
                              <Calendar className="h-3 w-3 shrink-0" />
                              <span className="truncate">{ticket.date}</span>
                            </div>
                            <div className="flex items-center gap-1.5 opacity-90 min-w-0">
                              <Clock className="h-3 w-3 shrink-0" />
                              <span className="truncate">{ticket.time}</span>
                            </div>
                            <div className="flex items-center gap-1.5 opacity-90 sm:col-span-2 min-w-0">
                              <MapPin className="h-3 w-3 shrink-0" />
                              <span className="truncate">{ticket.location}</span>
                            </div>
                          </div>

                          <div className="flex items-end justify-between pt-2 border-t border-white/20 gap-2">
                            <div className="min-w-0">
                              <p className="text-[9px] sm:text-[10px] opacity-60 uppercase tracking-wider">Tier</p>
                              <p className="text-xs sm:text-sm font-bold truncate">{ticket.tier}</p>
                            </div>
                            <div className="text-right">
                              <p className="text-[9px] sm:text-[10px] opacity-60 uppercase tracking-wider">Price</p>
                              <p className="text-xs sm:text-sm font-bold">${ticket.price}</p>
                            </div>
                          </div>
                        </div>

                        <div className="absolute right-0 top-0 bottom-0 w-16 hidden sm:flex flex-col items-center justify-center bg-white/10 backdrop-blur-sm">
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
                        </>
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
