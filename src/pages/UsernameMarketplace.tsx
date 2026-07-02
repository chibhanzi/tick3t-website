import { useMemo, useState } from "react";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import {
  Select, SelectContent, SelectItem, SelectTrigger, SelectValue
} from "@/components/ui/select";
import { useToast } from "@/hooks/use-toast";
import {
  AtSign, Search, Sparkles, Flame, Crown, Tag, TrendingUp, Shield, LayoutGrid, Rows3
} from "lucide-react";

type UsernameListing = {
  id: string;
  handle: string;
  price: number;
  category: "short" | "brand" | "numeric" | "word";
  length: number;
  rarity: "common" | "rare" | "epic" | "legendary";
  trending?: boolean;
  seller: string;
  offers: number;
};

const RARITY_STYLES: Record<UsernameListing["rarity"], { label: string; gradient: string; ring: string }> = {
  common:    { label: "Common",    gradient: "from-slate-500 to-slate-700",    ring: "ring-slate-400/30" },
  rare:      { label: "Rare",      gradient: "from-sky-500 to-blue-600",       ring: "ring-sky-400/40" },
  epic:      { label: "Epic",      gradient: "from-fuchsia-500 to-purple-600", ring: "ring-fuchsia-400/40" },
  legendary: { label: "Legendary", gradient: "from-amber-400 to-orange-600",   ring: "ring-amber-400/50" },
};

const LISTINGS: UsernameListing[] = [
  { id: "1", handle: "raves",    price: 1200, category: "word",    length: 5, rarity: "legendary", trending: true,  seller: "@collector",  offers: 8 },
  { id: "2", handle: "zw",       price: 4200, category: "short",   length: 2, rarity: "legendary", trending: true,  seller: "@names.zw",   offers: 14 },
  { id: "3", handle: "harare",   price: 950,  category: "brand",   length: 6, rarity: "epic",                       seller: "@nightlife",  offers: 3 },
  { id: "4", handle: "dj",       price: 3600, category: "short",   length: 2, rarity: "legendary",                  seller: "@vault",      offers: 6 },
  { id: "5", handle: "afro",     price: 480,  category: "word",    length: 4, rarity: "epic",     trending: true,  seller: "@sonics",     offers: 5 },
  { id: "6", handle: "808",      price: 620,  category: "numeric", length: 3, rarity: "epic",                       seller: "@bassdrop",   offers: 2 },
  { id: "7", handle: "vibe",     price: 320,  category: "word",    length: 4, rarity: "rare",                       seller: "@promoter",   offers: 1 },
  { id: "8", handle: "chitown",  price: 210,  category: "brand",   length: 7, rarity: "rare",                       seller: "@urban",      offers: 0 },
  { id: "9", handle: "hifa2024", price: 90,   category: "brand",   length: 8, rarity: "common",                     seller: "@fest",       offers: 0 },
  { id: "10",handle: "vip",      price: 2200, category: "short",   length: 3, rarity: "legendary",                  seller: "@lounge",     offers: 9 },
  { id: "11",handle: "sadza",    price: 350,  category: "word",    length: 5, rarity: "rare",     trending: true,  seller: "@culture",    offers: 4 },
  { id: "12",handle: "007",      price: 780,  category: "numeric", length: 3, rarity: "epic",                       seller: "@digits",     offers: 3 },
];

const UsernameMarketplace = () => {
  const { toast } = useToast();
  const [query, setQuery] = useState("");
  const [category, setCategory] = useState<"all" | UsernameListing["category"]>("all");
  const [sort, setSort] = useState<"trending" | "price-asc" | "price-desc" | "length" | "offers">("trending");
  const [layout, setLayout] = useState<"grid" | "list">("grid");

  const visible = useMemo(() => {
    const q = query.trim().toLowerCase();
    let list = LISTINGS.filter((l) => (category === "all" ? true : l.category === category));
    if (q) list = list.filter((l) => l.handle.toLowerCase().includes(q));
    list = [...list].sort((a, b) => {
      switch (sort) {
        case "price-asc":  return a.price - b.price;
        case "price-desc": return b.price - a.price;
        case "length":     return a.length - b.length;
        case "offers":     return b.offers - a.offers;
        case "trending":
        default:
          return (Number(!!b.trending) - Number(!!a.trending)) || (b.offers - a.offers);
      }
    });
    return list;
  }, [query, category, sort]);

  const totalVolume = LISTINGS.reduce((s, l) => s + l.price, 0);

  const stats = [
    { label: "Listings", value: LISTINGS.length.toString(), icon: AtSign,     bg: "bg-fuchsia-500/10", color: "text-fuchsia-500" },
    { label: "Volume",   value: `$${totalVolume.toLocaleString()}`, icon: TrendingUp, bg: "bg-emerald-500/10", color: "text-emerald-500" },
    { label: "Trending", value: LISTINGS.filter((l) => l.trending).length.toString(), icon: Flame, bg: "bg-orange-500/10", color: "text-orange-500" },
    { label: "Rare+",    value: LISTINGS.filter((l) => l.rarity !== "common").length.toString(), icon: Crown, bg: "bg-amber-500/10", color: "text-amber-500" },
  ];

  const handleBuy = (l: UsernameListing) => {
    toast({ title: `Purchasing @${l.handle}`, description: `Redirecting to secure Paynow checkout for $${l.price}.` });
  };
  const handleOffer = (l: UsernameListing) => {
    toast({ title: `Offer sent for @${l.handle}`, description: "The seller will be notified of your bid." });
  };

  const categoryOptions: { v: "all" | UsernameListing["category"]; label: string }[] = [
    { v: "all", label: "All" },
    { v: "short", label: "Short" },
    { v: "brand", label: "Brand" },
    { v: "word", label: "Word" },
    { v: "numeric", label: "Numeric" },
  ];

  return (
    <div className="min-h-screen bg-background">
      <Header />

      <main className="container mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Hero */}
        <div className="mb-8 rounded-3xl border border-border/60 bg-gradient-to-br from-fuchsia-500/10 via-purple-500/5 to-transparent p-6 sm:p-8 relative overflow-hidden">
          <div className="absolute -top-16 -right-16 w-56 h-56 rounded-full bg-fuchsia-500/10 blur-3xl" />
          <div className="relative">
            <Badge className="mb-3 bg-fuchsia-500/15 text-fuchsia-600 dark:text-fuchsia-300 border-fuchsia-500/20 hover:bg-fuchsia-500/15">
              <Sparkles className="h-3 w-3 mr-1" /> Tick3rt Names
            </Badge>
            <h1 className="text-2xl sm:text-4xl font-bold tracking-tight mb-2">Username Marketplace</h1>
            <p className="text-sm sm:text-base text-muted-foreground max-w-2xl">
              Own your identity on Tick3rt. Buy, sell and offer on premium handles — verified, transferable and yours forever.
            </p>
          </div>
        </div>

        {/* Stats */}
        <div className="mb-6 rounded-2xl border border-border/60 bg-card/60 backdrop-blur-sm overflow-hidden">
          <div className="grid grid-cols-4 divide-x divide-border/60">
            {stats.map((s) => (
              <div key={s.label} className="flex flex-col items-center justify-center gap-2 p-5">
                <div className={`flex h-9 w-9 items-center justify-center rounded-full ${s.bg}`}>
                  <s.icon className={`h-4 w-4 ${s.color}`} />
                </div>
                <div className="text-xl sm:text-2xl font-bold tracking-tight">{s.value}</div>
                <div className="text-[10px] sm:text-[11px] uppercase tracking-wider text-muted-foreground text-center">{s.label}</div>
              </div>
            ))}
          </div>
        </div>

        {/* Toolbar */}
        <div className="mb-6 rounded-2xl border border-border/60 bg-card/60 backdrop-blur-sm p-3 space-y-3">
          <div className="flex flex-col sm:flex-row gap-2">
            <div className="relative flex-1">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
              <Input
                placeholder="Search @handles..."
                value={query}
                onChange={(e) => setQuery(e.target.value)}
                className="pl-9 h-10 bg-background/50 border-border/60"
              />
            </div>
            <div className="flex gap-2">
              <Select value={sort} onValueChange={(v) => setSort(v as typeof sort)}>
                <SelectTrigger className="h-10 w-[160px] bg-background/50 border-border/60 text-xs">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="trending">Trending</SelectItem>
                  <SelectItem value="price-asc">Price: Low to High</SelectItem>
                  <SelectItem value="price-desc">Price: High to Low</SelectItem>
                  <SelectItem value="length">Shortest first</SelectItem>
                  <SelectItem value="offers">Most offers</SelectItem>
                </SelectContent>
              </Select>
              <div className="inline-flex h-10 items-center rounded-md border border-border/60 bg-background/50 p-0.5">
                <button
                  type="button"
                  onClick={() => setLayout("grid")}
                  aria-label="Grid view"
                  className={`flex h-9 w-9 items-center justify-center rounded-sm transition-colors ${layout === "grid" ? "bg-primary text-primary-foreground shadow-sm" : "text-muted-foreground hover:text-foreground"}`}
                >
                  <LayoutGrid className="h-4 w-4" />
                </button>
                <button
                  type="button"
                  onClick={() => setLayout("list")}
                  aria-label="List view"
                  className={`flex h-9 w-9 items-center justify-center rounded-sm transition-colors ${layout === "list" ? "bg-primary text-primary-foreground shadow-sm" : "text-muted-foreground hover:text-foreground"}`}
                >
                  <Rows3 className="h-4 w-4" />
                </button>
              </div>
            </div>
          </div>

          <div className="flex items-center gap-1.5 overflow-x-auto -mx-1 px-1 pb-0.5">
            {categoryOptions.map((c) => {
              const active = category === c.v;
              const count = c.v === "all" ? LISTINGS.length : LISTINGS.filter((l) => l.category === c.v).length;
              return (
                <button
                  key={c.v}
                  type="button"
                  onClick={() => setCategory(c.v)}
                  className={`shrink-0 inline-flex items-center gap-1.5 rounded-full px-3 h-8 text-xs font-medium transition-colors border ${
                    active
                      ? "bg-primary text-primary-foreground border-primary"
                      : "bg-background/40 text-muted-foreground border-border/60 hover:text-foreground hover:bg-muted"
                  }`}
                >
                  {c.label}
                  <span className={`text-[10px] px-1.5 rounded-full ${active ? "bg-primary-foreground/20" : "bg-muted"}`}>{count}</span>
                </button>
              );
            })}
          </div>
        </div>

        {/* Listings */}
        {visible.length === 0 ? (
          <Card className="border-dashed border-2">
            <CardContent className="p-12 text-center">
              <AtSign className="h-10 w-10 text-muted-foreground mx-auto mb-3" />
              <h3 className="font-semibold mb-1">No handles match</h3>
              <p className="text-sm text-muted-foreground">Try a different search or category.</p>
            </CardContent>
          </Card>
        ) : layout === "grid" ? (
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-3 md:gap-4">
            {visible.map((l) => {
              const r = RARITY_STYLES[l.rarity];
              return (
                <div key={l.id} className={`group rounded-2xl border border-border/60 bg-card/70 backdrop-blur-sm overflow-hidden shadow-sm hover:shadow-lg transition-all ring-1 ${r.ring}`}>
                  <div className={`relative h-24 bg-gradient-to-br ${r.gradient} flex items-center justify-center overflow-hidden`}>
                    <div className="absolute inset-0 opacity-30 bg-[radial-gradient(circle_at_30%_20%,white,transparent_50%)]" />
                    <p className="relative text-white text-lg sm:text-2xl font-bold tracking-tight drop-shadow-sm">@{l.handle}</p>
                    {l.trending && (
                      <Badge className="absolute top-2 right-2 bg-black/40 backdrop-blur text-white border-white/20 text-[10px] gap-1">
                        <Flame className="h-3 w-3" /> Hot
                      </Badge>
                    )}
                  </div>
                  <div className="p-3 space-y-2">
                    <div className="flex items-center justify-between text-[10px] uppercase tracking-wider text-muted-foreground">
                      <span>{r.label}</span>
                      <span>{l.length} chars</span>
                    </div>
                    <div className="flex items-baseline justify-between">
                      <span className="text-[10px] text-muted-foreground">Price</span>
                      <span className="font-bold text-sm">${l.price.toLocaleString()}</span>
                    </div>
                    <div className="flex gap-2 pt-1">
                      <Button size="sm" className="flex-1 h-8 text-xs" onClick={() => handleBuy(l)}>Buy</Button>
                      <Button size="sm" variant="outline" className="flex-1 h-8 text-xs" onClick={() => handleOffer(l)}>
                        Offer
                      </Button>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        ) : (
          <div className="flex flex-col gap-2">
            {visible.map((l) => {
              const r = RARITY_STYLES[l.rarity];
              return (
                <div key={l.id} className="rounded-2xl border border-border/60 bg-card/70 backdrop-blur-sm overflow-hidden shadow-sm">
                  <div className={`h-1 bg-gradient-to-r ${r.gradient}`} />
                  <div className="p-3 flex items-center gap-3">
                    <div className={`shrink-0 h-12 w-12 rounded-xl bg-gradient-to-br ${r.gradient} flex items-center justify-center text-white shadow-md`}>
                      <AtSign className="h-5 w-5" />
                    </div>
                    <div className="min-w-0 flex-1">
                      <div className="flex items-center gap-2 mb-0.5">
                        <p className="font-bold truncate">@{l.handle}</p>
                        {l.trending && (
                          <Badge className="bg-orange-500/15 text-orange-500 border-orange-500/20 text-[10px] gap-1">
                            <Flame className="h-3 w-3" /> Hot
                          </Badge>
                        )}
                      </div>
                      <div className="flex flex-wrap gap-x-3 gap-y-0.5 text-[11px] text-muted-foreground">
                        <span>{r.label}</span>
                        <span>{l.length} chars</span>
                        <span className="hidden sm:inline">Seller {l.seller}</span>
                        {l.offers > 0 && <span className="flex items-center gap-1"><Tag className="h-3 w-3" /> {l.offers} offers</span>}
                      </div>
                    </div>
                    <div className="text-right shrink-0">
                      <p className="text-[10px] text-muted-foreground uppercase tracking-wider">Price</p>
                      <p className="font-bold text-sm">${l.price.toLocaleString()}</p>
                    </div>
                    <div className="hidden sm:flex flex-col gap-1.5 shrink-0">
                      <Button size="sm" className="h-8 text-xs px-3" onClick={() => handleBuy(l)}>Buy</Button>
                      <Button size="sm" variant="outline" className="h-8 text-xs px-3" onClick={() => handleOffer(l)}>Offer</Button>
                    </div>
                  </div>
                  <div className="sm:hidden px-3 pb-3 flex gap-2">
                    <Button size="sm" className="flex-1 h-8 text-xs" onClick={() => handleBuy(l)}>Buy</Button>
                    <Button size="sm" variant="outline" className="flex-1 h-8 text-xs" onClick={() => handleOffer(l)}>Offer</Button>
                  </div>
                </div>
              );
            })}
          </div>
        )}

        {/* Trust footer */}
        <Card className="mt-8 bg-muted/40 border-border/50">
          <CardContent className="p-4 flex items-start gap-3">
            <Shield className="h-5 w-5 text-primary shrink-0 mt-0.5" />
            <div>
              <p className="font-medium text-sm">Verified transfers</p>
              <p className="text-xs text-muted-foreground">Every handle is one-of-one and secured on-chain. Ownership transfers instantly on purchase.</p>
            </div>
          </CardContent>
        </Card>
      </main>

      <Footer />
    </div>
  );
};

export default UsernameMarketplace;
