import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { useAuth } from "@/contexts/AuthContext";
import { useToast } from "@/hooks/use-toast";
import { VaultToolbar } from "@/components/vault/VaultToolbar";
import OrganizerVault from "@/components/vault/OrganizerVault";
import QRCodeLib from "qrcode";
import {
  Calendar, MapPin, Clock, Wallet,
  DollarSign, Tag, ArrowUpRight, Shield, ExternalLink,
  TrendingUp, Banknote, Download, Archive,
  Music, BadgeCheck, GraduationCap, Gift, Award, AtSign,
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

const Vault = () => {
  const { isOrganizer } = useAuth();
  const { toast } = useToast();

  const [qrCodes, setQrCodes] = useState<Record<string, string>>({});
  const [vaultSearch, setVaultSearch] = useState("");
  const [vaultStatus, setVaultStatus] = useState<"all" | "valid" | "used">("all");
  const [vaultSort, setVaultSort] = useState<"date-desc" | "date-asc" | "price-desc" | "price-asc" | "name">("date-desc");
  const [vaultLayout, setVaultLayout] = useState<"grid" | "list">("grid");
  const [vaultCategory, setVaultCategory] = useState<"all" | VaultCategory>("all");

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
      ticketNumber: "TK-00142", sortDate: "2024-03-15T21:00:00", category: "concert",
    },
    {
      id: "2", title: "Tech Innovation Summit", date: "Mar 25, 2024", time: "10:00 AM",
      location: "SF Convention Center", tier: "General", status: "valid", price: 89,
      bgGradient: "from-cyan-600 to-blue-500", organizer: "TechEvents Co",
      ticketNumber: "TK-00298", sortDate: "2024-03-25T10:00:00", category: "concert",
    },
    {
      id: "3", title: "Art Gallery Opening", date: "Feb 10, 2024", time: "7:00 PM",
      location: "Brooklyn Museum, NYC", tier: "General", status: "used", price: 75,
      bgGradient: "from-amber-500 to-orange-600", organizer: "ArtSpace NYC",
      ticketNumber: "TK-00067", sortDate: "2024-02-10T19:00:00", category: "concert",
    },
    {
      id: "m1", title: "Vouch Insider Club", date: "Renews Jan 2025", time: "Annual",
      location: "Members-only benefits", tier: "Gold", status: "valid", price: 120,
      bgGradient: "from-amber-500 to-orange-600", organizer: "Vouch",
      ticketNumber: "MEM-00812", sortDate: "2025-01-10T00:00:00", category: "membership",
      subtitle: "Priority pre-sales · Lounge access",
    },
    {
      id: "c1", title: "Blockchain Fundamentals", date: "Issued Nov 20, 2024", time: "Verified",
      location: "Tick3t Academy", tier: "Certificate", status: "valid", price: 0,
      bgGradient: "from-emerald-500 to-teal-600", organizer: "Tick3t Academy",
      ticketNumber: "CRED-00021", sortDate: "2024-11-20T00:00:00", category: "course",
      subtitle: "12 modules · 40 hrs",
    },
    {
      id: "g1", title: "Tick3t Gift Card", date: "No expiry", time: "Balance available",
      location: "Redeemable on any event", tier: "$50", status: "valid", price: 50,
      bgGradient: "from-rose-500 to-red-600", organizer: "Tick3t",
      ticketNumber: "GC-9F2A-7K", sortDate: "2024-12-01T00:00:00", category: "giftcard",
      meta: "Balance: $42.50",
    },
    {
      id: "b1", title: "HIFA 2024 Attendee", date: "Awarded May 2024", time: "Lifetime",
      location: "Harare International Festival", tier: "Attendance", status: "valid", price: 0,
      bgGradient: "from-cyan-500 to-blue-600", organizer: "HIFA",
      ticketNumber: "BDG-HIFA24", sortDate: "2024-05-08T00:00:00", category: "badge",
      subtitle: "Proof of attendance",
    },
    {
      id: "u1", title: "@raves", date: "Owned since Jun 2024", time: "Permanent",
      location: "Tick3t handle", tier: "Rare", status: "valid", price: 250,
      bgGradient: "from-fuchsia-500 to-purple-600", organizer: "Tick3t Names",
      ticketNumber: "NAME-RAVES", sortDate: "2024-06-14T00:00:00", category: "username",
      subtitle: "5-letter · Category: Music",
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
              color: { dark: "#000000", light: "#FFFFFF" },
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

  const handleListForResale = (_ticketId: string) => {
    toast({ title: "Listed for resale", description: "Your ticket is now visible on the marketplace." });
  };

  const handleWithdraw = () => {
    toast({ title: "Withdrawal requested", description: `$${resaleStats.pendingPayout} will be sent to your Paynow account.` });
  };

  const visibleVaultTickets = [...myTickets]
    .filter((t) => vaultCategory === "all" || t.category === vaultCategory)
    .filter((t) => vaultStatus === "all" || t.status === vaultStatus)
    .filter((t) => {
      const query = vaultSearch.trim().toLowerCase();
      if (!query) return true;
      return [t.title, t.location, t.organizer, t.ticketNumber, t.tier]
        .some((v) => v.toLowerCase().includes(query));
    })
    .sort((a, b) => {
      switch (vaultSort) {
        case "date-asc":   return a.sortDate.localeCompare(b.sortDate);
        case "price-desc": return b.price - a.price;
        case "price-asc":  return a.price - b.price;
        case "name":       return a.title.localeCompare(b.title);
        default:           return b.sortDate.localeCompare(a.sortDate);
      }
    });

  if (isOrganizer) {
    return (
      <div className="min-h-screen bg-background">
        <Header />
        <main className="container mx-auto px-4 sm:px-6 lg:px-8 py-6">
          <OrganizerVault />
        </main>
        <Footer />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background">
      <Header />

      <main className="container mx-auto px-4 sm:px-6 lg:px-8 py-6">
        {/* Page heading */}
        <div className="flex items-center gap-3 mb-6">
          <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-primary/10">
            <Archive className="h-5 w-5 text-primary" />
          </div>
          <div>
            <h1 className="text-2xl font-bold">Vault</h1>
            <p className="text-sm text-muted-foreground">Your tickets, passes, credentials & resale listings</p>
          </div>
        </div>

        {/* Stat strip */}
        <div className="mb-6 rounded-2xl border border-border/60 bg-card/60 backdrop-blur-sm overflow-hidden">
          <div className="grid grid-cols-4 divide-x divide-border/60">
            {[
              { icon: Archive,    value: myTickets.length.toString(),          label: "Items",   iconBg: "bg-violet-500/10", color: "text-violet-500" },
              { icon: DollarSign, value: `$${resaleStats.totalEarnings}`,       label: "Earned",  iconBg: "bg-emerald-500/10", color: "text-emerald-500" },
              { icon: TrendingUp, value: `$${resaleStats.pendingPayout}`,       label: "Pending", iconBg: "bg-orange-500/10", color: "text-orange-500" },
              { icon: Tag,        value: resaleStats.activeListing.toString(),  label: "Listed",  iconBg: "bg-blue-500/10",   color: "text-blue-500"   },
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

        <Tabs defaultValue="tickets" className="space-y-6">
          <TabsList className="grid w-full grid-cols-2 h-10">
            <TabsTrigger value="tickets" className="gap-1.5">
              <Archive className="h-3.5 w-3.5" /> Vault
            </TabsTrigger>
            <TabsTrigger value="resale">Resale</TabsTrigger>
          </TabsList>

          {/* ── Vault tab ── */}
          <TabsContent value="tickets" className="space-y-6">
            <VaultToolbar
              search={vaultSearch}
              onSearchChange={setVaultSearch}
              category={vaultCategory}
              onCategoryChange={setVaultCategory}
              status={vaultStatus}
              onStatusChange={setVaultStatus}
              sort={vaultSort}
              onSortChange={setVaultSort}
              layout={vaultLayout}
              onLayoutChange={setVaultLayout}
              tickets={myTickets}
            />

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
                <div
                  key={vaultLayout}
                  className={vaultLayout === "grid" ? "grid grid-cols-2 md:grid-cols-2 gap-3 md:gap-6" : "flex flex-col gap-3"}
                >
                  {visibleVaultTickets.map((ticket) => {
                    const catMeta = CATEGORY_META[ticket.category];
                    const CatIcon = catMeta.icon;
                    const isTransferable = ticket.category !== "course" && ticket.category !== "badge";
                    const isConcert = ticket.category === "concert";

                    return (
                      <div
                        key={ticket.id}
                        className={
                          vaultLayout === "list"
                            ? "group relative rounded-2xl border border-border/60 bg-card/70 backdrop-blur-sm overflow-hidden shadow-sm hover:shadow-md hover:border-border transition-all"
                            : "group"
                        }
                      >
                        {vaultLayout === "list" ? (
                          <>
                            <div className={`absolute inset-y-0 left-0 w-1 bg-gradient-to-b ${ticket.bgGradient}`} />
                            <div className="p-4 pl-5 flex items-start gap-3">
                              <div className={`shrink-0 h-12 w-12 rounded-xl bg-gradient-to-br ${ticket.bgGradient} flex items-center justify-center text-white shadow-sm`}>
                                <CatIcon className="h-5 w-5" />
                              </div>
                              <div className="min-w-0 flex-1">
                                <div className="flex items-start justify-between gap-2 mb-1.5">
                                  <div className="min-w-0">
                                    <p className="text-[10px] font-medium uppercase tracking-wider text-muted-foreground truncate">
                                      {ticket.organizer}
                                    </p>
                                    <h3 className="font-semibold leading-snug truncate">{ticket.title}</h3>
                                  </div>
                                  <Badge variant={ticket.status === "valid" ? "default" : "secondary"} className="shrink-0 text-[10px]">
                                    {ticket.status === "valid" ? "Valid" : "Used"}
                                  </Badge>
                                </div>
                                <div className="flex flex-wrap gap-x-3 gap-y-1 text-xs text-muted-foreground">
                                  <span className="inline-flex items-center gap-1"><Calendar className="h-3 w-3" /> {ticket.date}</span>
                                  <span className="inline-flex items-center gap-1"><Clock className="h-3 w-3" /> {ticket.time}</span>
                                  <span className="inline-flex items-center gap-1 min-w-0"><MapPin className="h-3 w-3 shrink-0" /><span className="truncate">{ticket.location}</span></span>
                                </div>
                                <div className="mt-2.5 flex flex-wrap items-center gap-x-4 gap-y-1 text-xs">
                                  <span><span className="text-muted-foreground">Tier</span> <strong>{ticket.tier}</strong></span>
                                  <span><span className="text-muted-foreground">Price</span> <strong>${ticket.price}</strong></span>
                                  <span><span className="text-muted-foreground">No.</span> <strong className="font-mono text-[11px]">{ticket.ticketNumber}</strong></span>
                                </div>
                              </div>
                            </div>
                            {ticket.status === "valid" && (
                              <div className="px-4 pb-4 flex gap-2">
                                {isTransferable && (
                                  <Button variant="outline" size="sm" className="flex-1 h-8 text-xs" onClick={() => handleListForResale(ticket.id)}>
                                    <ArrowUpRight className="h-3 w-3 mr-1" />
                                    {ticket.category === "concert" ? "List for Resale" : ticket.category === "username" ? "List for Sale" : "Transfer / Sell"}
                                  </Button>
                                )}
                                <Button variant="outline" size="sm" className={`h-8 text-xs ${isTransferable ? "" : "flex-1"}`}>
                                  <Download className="h-3 w-3 mr-1" /> Save
                                </Button>
                              </div>
                            )}
                          </>
                        ) : (
                          <>
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
                                    <p className="text-[9px] sm:text-[10px] opacity-60 uppercase tracking-wider">{isConcert ? "Tier" : catMeta.short}</p>
                                    <p className="text-xs sm:text-sm font-bold truncate">{ticket.tier}</p>
                                  </div>
                                  <div className="text-right">
                                    <p className="text-[9px] sm:text-[10px] opacity-60 uppercase tracking-wider">{ticket.category === "giftcard" ? "Value" : ticket.price === 0 ? "Status" : "Price"}</p>
                                    <p className="text-xs sm:text-sm font-bold">{ticket.price === 0 ? "Owned" : `$${ticket.price}`}</p>
                                  </div>
                                </div>
                              </div>
                              <div className="absolute right-0 top-0 bottom-0 w-16 hidden sm:flex flex-col items-center justify-center bg-white/10 backdrop-blur-sm">
                                {isConcert && qrCodes[ticket.id] ? (
                                  <>
                                    <img src={qrCodes[ticket.id]} alt="QR" className="w-12 h-12 rounded" />
                                    <p className="text-[8px] mt-1 opacity-60 font-medium">SCAN</p>
                                  </>
                                ) : (
                                  <>
                                    <div className="w-12 h-12 rounded-lg bg-white/20 flex items-center justify-center">
                                      <CatIcon className="h-6 w-6 text-white" />
                                    </div>
                                    <p className="text-[8px] mt-1 opacity-60 font-medium uppercase">{catMeta.short}</p>
                                  </>
                                )}
                              </div>
                            </div>
                            {ticket.status === "valid" && (
                              <div className="flex gap-2 mt-2">
                                {isTransferable && (
                                  <Button variant="outline" size="sm" className="flex-1 h-8 text-xs" onClick={() => handleListForResale(ticket.id)}>
                                    <ArrowUpRight className="h-3 w-3 mr-1" />
                                    {ticket.category === "concert" ? "Resell" : ticket.category === "username" ? "Sell" : "Transfer"}
                                  </Button>
                                )}
                                <Button variant="outline" size="sm" className={`h-8 text-xs ${isTransferable ? "" : "flex-1"}`}>
                                  <Download className="h-3 w-3 mr-1" /> Save
                                </Button>
                              </div>
                            )}
                          </>
                        )}
                      </div>
                    );
                  })}
                </div>
              );
            })()}
          </TabsContent>

          {/* ── Resale tab ── */}
          <TabsContent value="resale" className="space-y-6">
            {/* Withdraw */}
            {resaleStats.pendingPayout > 0 && (
              <Card className="border-green-200 dark:border-green-900 bg-green-50/50 dark:bg-green-950/20">
                <CardContent className="p-4 flex items-center justify-between">
                  <div>
                    <p className="font-semibold text-sm">Ready to withdraw</p>
                    <p className="text-xs text-muted-foreground">${resaleStats.pendingPayout} available · Sent via Paynow</p>
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
                  <p className="text-xs text-muted-foreground">
                    All resales are verified on the TON blockchain. Buyers get authentic NFT tickets with full ownership transfer.
                  </p>
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </main>

      <Footer />
    </div>
  );
};

export default Vault;
