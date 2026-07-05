import { useEffect, useMemo, useState } from "react";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";
import {
  Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogTrigger
} from "@/components/ui/dialog";
import {
  Select, SelectContent, SelectItem, SelectTrigger, SelectValue
} from "@/components/ui/select";
import { useToast } from "@/hooks/use-toast";
import {
  AtSign, Search, Sparkles, Flame, Crown, Tag, TrendingUp, TrendingDown, Shield,
  LayoutGrid, Rows3, Gavel, Star, Eye, Zap, Globe, Clock, ArrowUpRight, ArrowDownRight,
  Activity, Hammer, Wallet, ShieldCheck, Info, ChevronRight, Filter, BarChart3,
  MessageSquare, Check, X as XIcon, RefreshCw, Lock, Handshake, AlertTriangle, Ban,
} from "lucide-react";

/* -----------------------------------------------------------
   Types
----------------------------------------------------------- */
type Platform =
  | "tick3rt" | "instagram" | "x" | "tiktok" | "twitch"
  | "youtube" | "telegram" | "ens";

type Rarity = "common" | "rare" | "epic" | "legendary" | "mythic";

type Category = "short" | "brand" | "numeric" | "word" | "premium";

type SaleType = "buy_now" | "auction" | "make_offer";

type Listing = {
  id: string;
  handle: string;
  platform: Platform;
  price: number;              // USD
  floor?: number;             // price floor for platform
  change24h: number;          // % change vs comparable sales
  category: Category;
  length: number;
  rarity: Rarity;
  sale: SaleType;
  seller: string;
  offers: number;
  watchers: number;
  views: number;
  verified: boolean;
  trending?: boolean;
  endsAt?: string;            // ISO
  lastSale?: number;
};

/* -----------------------------------------------------------
   Escrow / Negotiation model
----------------------------------------------------------- */
type OfferStatus =
  | "pending"        // buyer sent, seller hasn't responded
  | "countered"      // seller countered, buyer to respond
  | "accepted"       // both parties agreed on price
  | "awaiting_escrow"// waiting for buyer to fund
  | "in_escrow"      // funds held, awaiting seller transfer
  | "transferring"   // seller marked transferred, buyer to confirm
  | "settled"        // funds released, transfer complete
  | "declined"
  | "expired"
  | "disputed";

type OfferEvent = {
  at: string;             // ISO
  by: "buyer" | "seller" | "system";
  label: string;
  amount?: number;
};

type Offer = {
  id: string;
  listingId: string;
  handle: string;
  platform: Platform;
  asking: number;
  amount: number;         // current negotiated amount
  status: OfferStatus;
  role: "buyer" | "seller"; // current user's role in this offer
  counterparty: string;
  createdAt: string;
  expiresAt: string;
  message?: string;
  history: OfferEvent[];
};

/* Platform transfer policy — what the Exchange can/can't do per platform.
   Reflects real third-party rules: on-chain identities transfer instantly,
   assisted transfers use platform-official flows, restricted platforms
   forbid handle transfers (offers are blocked with an explanation).      */
type TransferPolicy = "onchain" | "assisted" | "restricted";
const PLATFORM_POLICY: Record<Platform, { policy: TransferPolicy; note: string }> = {
  tick3rt:   { policy: "onchain",    note: "On-chain settlement. Instant transfer via smart contract." },
  ens:       { policy: "onchain",    note: "ERC-721 transfer on Ethereum. Escrow releases atomically." },
  instagram: { policy: "assisted",   note: "Assisted transfer. Meta does not officially support handle sales; we facilitate a coordinated swap where both parties consent." },
  x:         { policy: "assisted",   note: "Assisted transfer via account credential handover under escrow supervision." },
  tiktok:    { policy: "assisted",   note: "Assisted transfer. Requires both parties to complete official account recovery steps." },
  twitch:    { policy: "assisted",   note: "Assisted username release + reclaim window supervised by escrow." },
  youtube:   { policy: "restricted", note: "YouTube handles are non-transferable per platform policy. Offers disabled." },
  telegram:  { policy: "assisted",   note: "Assisted transfer using Telegram's Fragment auction bridge or direct handover." },
};

/* Seed a small mix of in-flight negotiations so the Offers tab is realistic. */
function seedOffers(): Offer[] {
  const now = Date.now();
  const iso = (mins: number) => new Date(now - mins * 60_000).toISOString();
  const exp = (days: number) => new Date(now + days * 24 * 3600_000).toISOString();
  return [
    {
      id: "o_seed_1", listingId: "3", handle: "harare", platform: "x",
      asking: 9500, amount: 7200, status: "countered", role: "buyer",
      counterparty: "@nightlife", createdAt: iso(180), expiresAt: exp(6),
      history: [
        { at: iso(180), by: "buyer",  label: "Offer sent", amount: 6800 },
        { at: iso(140), by: "seller", label: "Countered",  amount: 7200 },
      ],
    },
    {
      id: "o_seed_2", listingId: "11", handle: "sadza", platform: "tick3rt",
      asking: 3500, amount: 3200, status: "in_escrow", role: "buyer",
      counterparty: "@culture", createdAt: iso(1200), expiresAt: exp(2),
      history: [
        { at: iso(1200), by: "buyer",  label: "Offer sent",     amount: 3200 },
        { at: iso(1150), by: "seller", label: "Accepted",       amount: 3200 },
        { at: iso(1100), by: "buyer",  label: "Escrow funded",  amount: 3200 },
        { at: iso(1099), by: "system", label: "Awaiting on-chain transfer from seller." },
      ],
    },
    {
      id: "o_seed_3", listingId: "9", handle: "hifa", platform: "instagram",
      asking: 900, amount: 750, status: "pending", role: "seller",
      counterparty: "@buyer.hre", createdAt: iso(40), expiresAt: exp(7),
      message: "Long-time follower — would love this handle for the festival account.",
      history: [
        { at: iso(40), by: "buyer", label: "Offer sent", amount: 750 },
      ],
    },
    {
      id: "o_seed_4", listingId: "14", handle: "gamer", platform: "twitch",
      asking: 5400, amount: 5400, status: "transferring", role: "buyer",
      counterparty: "@arena", createdAt: iso(2600), expiresAt: exp(1),
      history: [
        { at: iso(2600), by: "buyer",  label: "Offer sent",       amount: 5000 },
        { at: iso(2500), by: "seller", label: "Countered",        amount: 5400 },
        { at: iso(2400), by: "buyer",  label: "Accepted",         amount: 5400 },
        { at: iso(2300), by: "buyer",  label: "Escrow funded",    amount: 5400 },
        { at: iso(300),  by: "seller", label: "Transfer initiated (assisted)" },
      ],
    },
  ];
}
/* -----------------------------------------------------------
   Meta
----------------------------------------------------------- */
const PLATFORM_META: Record<Platform, { label: string; prefix: string; accent: string; dot: string; }> = {
  tick3rt:   { label: "Tick3rt",   prefix: "@",  accent: "from-fuchsia-500 to-purple-600", dot: "bg-fuchsia-500" },
  instagram: { label: "Instagram", prefix: "@",  accent: "from-pink-500 to-orange-500",    dot: "bg-pink-500" },
  x:         { label: "X",         prefix: "@",  accent: "from-zinc-700 to-zinc-900",      dot: "bg-zinc-500" },
  tiktok:    { label: "TikTok",    prefix: "@",  accent: "from-cyan-400 to-rose-500",      dot: "bg-cyan-400" },
  twitch:    { label: "Twitch",    prefix: "/",  accent: "from-purple-500 to-indigo-600",  dot: "bg-purple-500" },
  youtube:   { label: "YouTube",   prefix: "@",  accent: "from-red-500 to-rose-600",       dot: "bg-red-500" },
  telegram:  { label: "Telegram",  prefix: "@",  accent: "from-sky-400 to-blue-600",       dot: "bg-sky-500" },
  ens:       { label: "ENS",       prefix: "",   accent: "from-blue-500 to-indigo-700",    dot: "bg-blue-500" },
};

const RARITY_META: Record<Rarity, { label: string; gradient: string; ring: string; text: string }> = {
  common:    { label: "Common",    gradient: "from-slate-500 to-slate-700",    ring: "ring-slate-400/30",    text: "text-slate-300" },
  rare:      { label: "Rare",      gradient: "from-sky-500 to-blue-600",       ring: "ring-sky-400/40",      text: "text-sky-300" },
  epic:      { label: "Epic",      gradient: "from-fuchsia-500 to-purple-600", ring: "ring-fuchsia-400/40",  text: "text-fuchsia-300" },
  legendary: { label: "Legendary", gradient: "from-amber-400 to-orange-600",   ring: "ring-amber-400/50",    text: "text-amber-300" },
  mythic:    { label: "Mythic",    gradient: "from-emerald-400 via-cyan-400 to-fuchsia-500", ring: "ring-emerald-400/50", text: "text-emerald-300" },
};

/* -----------------------------------------------------------
   Mock data (representative — real data will paginate from API)
----------------------------------------------------------- */
const LISTINGS: Listing[] = [
  { id: "1",  handle: "raves",     platform: "tick3rt",   price: 12000, floor: 800,  change24h:  18.2, category: "word",    length: 5, rarity: "legendary", sale: "auction",   seller: "@collector",  offers: 14, watchers: 218, views: 4210, verified: true, trending: true, endsAt: iso(2, 4), lastSale: 9400 },
  { id: "2",  handle: "zw",        platform: "instagram", price: 42000, floor: 2500, change24h:  32.4, category: "short",   length: 2, rarity: "mythic",    sale: "auction",   seller: "@names.zw",   offers: 27, watchers: 612, views: 12800, verified: true, trending: true, endsAt: iso(0, 22), lastSale: 31000 },
  { id: "3",  handle: "harare",    platform: "x",         price: 9500,  floor: 400,  change24h:   4.1, category: "brand",   length: 6, rarity: "epic",      sale: "buy_now",   seller: "@nightlife",  offers: 3,  watchers: 92,  views: 1820, verified: true, lastSale: 7200 },
  { id: "4",  handle: "dj",        platform: "x",         price: 86000, floor: 5000, change24h:  12.7, category: "short",   length: 2, rarity: "mythic",    sale: "make_offer",seller: "@vault",      offers: 41, watchers: 1204, views: 21500, verified: true, trending: true, lastSale: 72000 },
  { id: "5",  handle: "afro",      platform: "tiktok",    price: 4800,  floor: 220,  change24h:  -3.6, category: "word",    length: 4, rarity: "epic",      sale: "buy_now",   seller: "@sonics",     offers: 5,  watchers: 78,  views: 990,  verified: true, trending: true, lastSale: 5100 },
  { id: "6",  handle: "808",       platform: "tiktok",    price: 6200,  floor: 300,  change24h:   9.8, category: "numeric", length: 3, rarity: "epic",      sale: "auction",   seller: "@bassdrop",   offers: 8,  watchers: 132, views: 2100, verified: true, endsAt: iso(1, 6), lastSale: 5700 },
  { id: "7",  handle: "vibe",      platform: "instagram", price: 3200,  floor: 150,  change24h:   1.2, category: "word",    length: 4, rarity: "rare",      sale: "buy_now",   seller: "@promoter",   offers: 1,  watchers: 44,  views: 610, verified: true, lastSale: 3150 },
  { id: "8",  handle: "chitown",   platform: "twitch",    price: 2100,  floor: 90,   change24h:  -1.4, category: "brand",   length: 7, rarity: "rare",      sale: "make_offer",seller: "@urban",      offers: 0,  watchers: 21,  views: 340, verified: false, lastSale: 2200 },
  { id: "9",  handle: "hifa",      platform: "instagram", price: 900,   floor: 60,   change24h:   0.0, category: "brand",   length: 4, rarity: "rare",      sale: "buy_now",   seller: "@fest",       offers: 0,  watchers: 12,  views: 210, verified: false },
  { id: "10", handle: "vip",       platform: "telegram",  price: 22000, floor: 900,  change24h:  22.1, category: "short",   length: 3, rarity: "legendary", sale: "auction",   seller: "@lounge",     offers: 19, watchers: 402, views: 6100, verified: true, endsAt: iso(0, 3), lastSale: 18000 },
  { id: "11", handle: "sadza",     platform: "tick3rt",   price: 3500,  floor: 200,  change24h:   6.4, category: "word",    length: 5, rarity: "rare",      sale: "buy_now",   seller: "@culture",    offers: 4,  watchers: 61,  views: 780, verified: true, trending: true, lastSale: 3200 },
  { id: "12", handle: "007",       platform: "x",         price: 7800,  floor: 350,  change24h:  15.9, category: "numeric", length: 3, rarity: "epic",      sale: "auction",   seller: "@digits",     offers: 12, watchers: 188, views: 2950, verified: true, endsAt: iso(3, 1), lastSale: 6800 },
  { id: "13", handle: "afro",      platform: "ens",       price: 15200, floor: 700,  change24h:  11.3, category: "premium", length: 4, rarity: "legendary", sale: "buy_now",   seller: "0x9c…a1",     offers: 6,  watchers: 143, views: 2200, verified: true, lastSale: 13800 },
  { id: "14", handle: "gamer",     platform: "twitch",    price: 5400,  floor: 250,  change24h:  -2.1, category: "word",    length: 5, rarity: "epic",      sale: "make_offer",seller: "@arena",      offers: 3,  watchers: 55,  views: 720, verified: true, lastSale: 5600 },
  { id: "15", handle: "cash",      platform: "youtube",   price: 9900,  floor: 500,  change24h:  14.2, category: "word",    length: 4, rarity: "legendary", sale: "auction",   seller: "@vlogr",      offers: 11, watchers: 220, views: 3140, verified: true, endsAt: iso(0, 12), lastSale: 8700 },
  { id: "16", handle: "za",        platform: "tick3rt",   price: 18500, floor: 1200, change24h:  27.5, category: "short",   length: 2, rarity: "mythic",    sale: "auction",   seller: "@vault",      offers: 22, watchers: 512, views: 7300, verified: true, trending: true, endsAt: iso(1, 2), lastSale: 14500 },
];

function iso(daysFromNow: number, hours: number) {
  const d = new Date();
  d.setDate(d.getDate() + daysFromNow);
  d.setHours(d.getHours() + hours);
  return d.toISOString();
}

/* -----------------------------------------------------------
   Utility
----------------------------------------------------------- */
const fmt = (n: number) => (n >= 1000 ? n.toLocaleString() : n.toString());
const money = (n: number) => `$${fmt(n)}`;

function timeLeft(endsAt?: string) {
  if (!endsAt) return null;
  const diff = new Date(endsAt).getTime() - Date.now();
  if (diff <= 0) return "Ended";
  const h = Math.floor(diff / 36e5);
  const m = Math.floor((diff % 36e5) / 6e4);
  if (h >= 24) return `${Math.floor(h / 24)}d ${h % 24}h`;
  return `${h}h ${m}m`;
}

/* -----------------------------------------------------------
   Live ticker (Bloomberg-style)
----------------------------------------------------------- */
const TICKER = [
  { sym: "@dj/x",         val: 86000, chg:  12.7 },
  { sym: "@zw/ig",        val: 42000, chg:  32.4 },
  { sym: "@za/tick3rt",   val: 18500, chg:  27.5 },
  { sym: "@vip/tg",       val: 22000, chg:  22.1 },
  { sym: "@raves/tick3rt",val: 12000, chg:  18.2 },
  { sym: "afro.eth",      val: 15200, chg:  11.3 },
  { sym: "@cash/yt",      val:  9900, chg:  14.2 },
  { sym: "@harare/x",     val:  9500, chg:   4.1 },
  { sym: "@007/x",        val:  7800, chg:  15.9 },
  { sym: "@808/tt",       val:  6200, chg:   9.8 },
  { sym: "@afro/tt",      val:  4800, chg:  -3.6 },
  { sym: "@gamer/tw",     val:  5400, chg:  -2.1 },
];

const Ticker = () => (
  <div className="relative overflow-hidden border-y border-border/60 bg-muted/40 backdrop-blur-sm">
    <div className="pointer-events-none absolute inset-y-0 left-0 w-16 bg-gradient-to-r from-background to-transparent z-10" />
    <div className="pointer-events-none absolute inset-y-0 right-0 w-16 bg-gradient-to-l from-background to-transparent z-10" />
    <div className="flex whitespace-nowrap animate-[ticker_60s_linear_infinite] gap-8 py-2 text-xs font-mono">
      {[...TICKER, ...TICKER].map((t, i) => (
        <span key={i} className="inline-flex items-center gap-2">
          <span className="text-muted-foreground">{t.sym}</span>
          <span className="tabular-nums text-foreground/90">${t.val.toLocaleString()}</span>
          <span className={`tabular-nums ${t.chg >= 0 ? "text-emerald-500" : "text-red-500"}`}>
            {t.chg >= 0 ? "▲" : "▼"} {Math.abs(t.chg).toFixed(1)}%
          </span>
          <span className="text-border">•</span>
        </span>
      ))}
    </div>
    <style>{`@keyframes ticker { from { transform: translateX(0) } to { transform: translateX(-50%) } }`}</style>
  </div>
);

/* -----------------------------------------------------------
   Page
----------------------------------------------------------- */
const UsernameMarketplace = () => {
  const { toast } = useToast();

  // filters
  const [query, setQuery] = useState("");
  const [platform, setPlatform] = useState<"all" | Platform>("all");
  const [category, setCategory] = useState<"all" | Category>("all");
  const [rarity, setRarity] = useState<"all" | Rarity>("all");
  const [sale, setSale] = useState<"all" | SaleType>("all");
  const [priceMin, setPriceMin] = useState<string>("");
  const [priceMax, setPriceMax] = useState<string>("");
  const [sort, setSort] = useState<"trending" | "price-asc" | "price-desc" | "length" | "offers" | "ending" | "change">("trending");
  const [layout, setLayout] = useState<"grid" | "list">("grid");
  const [tab, setTab] = useState<"market" | "auctions" | "watchlist" | "offers" | "mint">("market");
  const [watchlist, setWatchlist] = useState<string[]>(["4", "10", "16"]);

  // negotiation dialogs
  const [offerFor, setOfferFor] = useState<Listing | null>(null);
  const [offerAmount, setOfferAmount] = useState("");
  const [offerMsg, setOfferMsg] = useState("");
  const [bidFor, setBidFor] = useState<Listing | null>(null);
  const [bidAmount, setBidAmount] = useState("");

  // counter-offer dialog (from Offers tab)
  const [counterFor, setCounterFor] = useState<Offer | null>(null);
  const [counterAmount, setCounterAmount] = useState("");

  // escrow-backed offers (mock persisted state)
  const [offers, setOffers] = useState<Offer[]>(() => seedOffers());

  // mint form
  const [mintHandle, setMintHandle] = useState("");
  const [mintPlatform, setMintPlatform] = useState<Platform>("tick3rt");
  const [mintReserve, setMintReserve] = useState("");

  // tick auctions per minute so countdowns re-render
  const [, setNow] = useState(0);
  useEffect(() => {
    const t = setInterval(() => setNow((n) => n + 1), 30_000);
    return () => clearInterval(t);
  }, []);

  const filtered = useMemo(() => {
    const q = query.trim().toLowerCase();
    let list = LISTINGS.slice();
    if (tab === "auctions") list = list.filter((l) => l.sale === "auction");
    if (tab === "watchlist") list = list.filter((l) => watchlist.includes(l.id));
    if (platform !== "all") list = list.filter((l) => l.platform === platform);
    if (category !== "all") list = list.filter((l) => l.category === category);
    if (rarity !== "all") list = list.filter((l) => l.rarity === rarity);
    if (sale !== "all") list = list.filter((l) => l.sale === sale);
    const pMin = priceMin ? Number(priceMin) : undefined;
    const pMax = priceMax ? Number(priceMax) : undefined;
    if (pMin !== undefined) list = list.filter((l) => l.price >= pMin);
    if (pMax !== undefined) list = list.filter((l) => l.price <= pMax);
    if (q) list = list.filter((l) => l.handle.toLowerCase().includes(q) || PLATFORM_META[l.platform].label.toLowerCase().includes(q));
    list.sort((a, b) => {
      switch (sort) {
        case "price-asc":  return a.price - b.price;
        case "price-desc": return b.price - a.price;
        case "length":     return a.length - b.length;
        case "offers":     return b.offers - a.offers;
        case "change":     return b.change24h - a.change24h;
        case "ending":     return (a.endsAt ? new Date(a.endsAt).getTime() : Infinity) - (b.endsAt ? new Date(b.endsAt).getTime() : Infinity);
        case "trending":
        default:
          return (Number(!!b.trending) - Number(!!a.trending)) || (b.watchers - a.watchers);
      }
    });
    return list;
  }, [query, platform, category, rarity, sale, priceMin, priceMax, sort, tab, watchlist]);

  // KPIs
  const kpis = useMemo(() => {
    const volume = LISTINGS.reduce((s, l) => s + (l.lastSale ?? 0), 0);
    const listed = LISTINGS.length;
    const auctions = LISTINGS.filter((l) => l.sale === "auction").length;
    const hot = LISTINGS.filter((l) => l.change24h > 10).length;
    const avg = Math.round(LISTINGS.reduce((s, l) => s + l.price, 0) / LISTINGS.length);
    return { volume, listed, auctions, hot, avg };
  }, []);

  const toggleWatch = (id: string) => {
    setWatchlist((w) => w.includes(id) ? w.filter((x) => x !== id) : [...w, id]);
  };

  const submitOffer = () => {
    if (!offerFor) return;
    const amt = Number(offerAmount);
    if (!amt || amt <= 0) {
      toast({ title: "Enter a valid offer", variant: "destructive" });
      return;
    }
    const pol = PLATFORM_POLICY[offerFor.platform];
    if (pol.policy === "restricted") {
      toast({
        title: `${PLATFORM_META[offerFor.platform].label} does not permit transfers`,
        description: pol.note,
        variant: "destructive",
      });
      return;
    }
    const now = new Date();
    const expires = new Date(now.getTime() + 7 * 24 * 3600 * 1000).toISOString();
    const newOffer: Offer = {
      id: `o_${Date.now()}`,
      listingId: offerFor.id,
      handle: offerFor.handle,
      platform: offerFor.platform,
      asking: offerFor.price,
      amount: amt,
      status: "pending",
      role: "buyer",
      counterparty: offerFor.seller,
      createdAt: now.toISOString(),
      expiresAt: expires,
      message: offerMsg || undefined,
      history: [
        { at: now.toISOString(), by: "buyer", label: "Offer sent", amount: amt },
        { at: now.toISOString(), by: "system", label: `Escrow reserved. Transfer policy: ${pol.policy}.` },
      ],
    };
    setOffers((prev) => [newOffer, ...prev]);
    toast({
      title: `Offer sent for ${PLATFORM_META[offerFor.platform].prefix}${offerFor.handle}`,
      description: `$${amt.toLocaleString()} sent to ${offerFor.seller}. Track it in the Offers tab.`,
    });
    setOfferFor(null); setOfferAmount(""); setOfferMsg("");
    setTab("offers");
  };

  /* -------- negotiation actions -------- */
  const pushEvent = (id: string, ev: OfferEvent, patch: Partial<Offer> = {}) => {
    setOffers((prev) => prev.map((o) => o.id === id ? { ...o, ...patch, history: [...o.history, ev] } : o));
  };

  const acceptOffer = (o: Offer) => {
    const by = o.role === "seller" ? "seller" : "buyer";
    pushEvent(o.id, { at: new Date().toISOString(), by, label: "Accepted", amount: o.amount },
      { status: "awaiting_escrow" });
    toast({ title: "Offer accepted", description: `Buyer must fund escrow to proceed with transfer of ${PLATFORM_META[o.platform].prefix}${o.handle}.` });
  };

  const declineOffer = (o: Offer) => {
    const by = o.role === "seller" ? "seller" : "buyer";
    pushEvent(o.id, { at: new Date().toISOString(), by, label: "Declined" }, { status: "declined" });
    toast({ title: "Offer declined" });
  };

  const withdrawOffer = (o: Offer) => {
    pushEvent(o.id, { at: new Date().toISOString(), by: "buyer", label: "Withdrawn" }, { status: "declined" });
    toast({ title: "Offer withdrawn" });
  };

  const openCounter = (o: Offer) => {
    setCounterFor(o);
    setCounterAmount(String(Math.round((o.amount + o.asking) / 2)));
  };

  const submitCounter = () => {
    if (!counterFor) return;
    const amt = Number(counterAmount);
    if (!amt || amt <= 0) {
      toast({ title: "Enter a counter amount", variant: "destructive" });
      return;
    }
    const by = counterFor.role === "seller" ? "seller" : "buyer";
    // after a counter, the ball is in the other party's court, so flip role
    pushEvent(counterFor.id,
      { at: new Date().toISOString(), by, label: "Countered", amount: amt },
      { status: "countered", amount: amt, role: counterFor.role === "seller" ? "buyer" : "seller" });
    toast({ title: `Counter sent: $${amt.toLocaleString()}` });
    setCounterFor(null); setCounterAmount("");
  };

  const fundEscrow = (o: Offer) => {
    pushEvent(o.id,
      { at: new Date().toISOString(), by: "buyer", label: "Escrow funded", amount: o.amount },
      { status: "in_escrow" });
    toast({ title: "Escrow funded", description: `$${o.amount.toLocaleString()} held securely. Seller notified to initiate transfer.` });
  };

  const markTransferred = (o: Offer) => {
    pushEvent(o.id,
      { at: new Date().toISOString(), by: "seller", label: `Transfer initiated (${PLATFORM_POLICY[o.platform].policy})` },
      { status: "transferring" });
    toast({ title: "Transfer initiated", description: PLATFORM_POLICY[o.platform].note });
  };

  const confirmReceipt = (o: Offer) => {
    pushEvent(o.id,
      { at: new Date().toISOString(), by: "buyer", label: "Receipt confirmed" },
      { status: "settled" });
    pushEvent(o.id,
      { at: new Date().toISOString(), by: "system", label: `Funds released to ${o.counterparty}. Trade settled.` });
    toast({ title: "Trade settled", description: `${PLATFORM_META[o.platform].prefix}${o.handle} is yours.` });
  };

  const raiseDispute = (o: Offer) => {
    pushEvent(o.id,
      { at: new Date().toISOString(), by: o.role, label: "Dispute opened" },
      { status: "disputed" });
    toast({ title: "Dispute opened", description: "Escrow frozen. Our team will review within 24h." });
  };

  const submitBid = () => {
    if (!bidFor) return;
    const amt = Number(bidAmount);
    if (!amt || amt < bidFor.price) {
      toast({ title: "Bid must exceed current price", description: `Current: $${bidFor.price.toLocaleString()}`, variant: "destructive" });
      return;
    }
    toast({
      title: `Bid placed: $${amt.toLocaleString()}`,
      description: `You are now the top bidder on ${PLATFORM_META[bidFor.platform].prefix}${bidFor.handle}.`,
    });
    setBidFor(null); setBidAmount("");
  };

  const submitBuy = (l: Listing) => {
    toast({
      title: `Escrow opened for ${PLATFORM_META[l.platform].prefix}${l.handle}`,
      description: `Funds held securely. Transfer instructions sent for ${PLATFORM_META[l.platform].label}.`,
    });
  };

  const submitMint = () => {
    if (!mintHandle.trim()) {
      toast({ title: "Enter a handle", variant: "destructive" });
      return;
    }
    toast({
      title: `Minted ${PLATFORM_META[mintPlatform].prefix}${mintHandle}`,
      description: `Listed on the Exchange${mintReserve ? ` with reserve $${Number(mintReserve).toLocaleString()}` : ""}.`,
    });
    setMintHandle(""); setMintReserve("");
  };

  const activeFilters =
    (platform !== "all" ? 1 : 0) +
    (category !== "all" ? 1 : 0) +
    (rarity !== "all" ? 1 : 0) +
    (sale !== "all" ? 1 : 0) +
    (priceMin ? 1 : 0) + (priceMax ? 1 : 0);

  const clearFilters = () => {
    setPlatform("all"); setCategory("all"); setRarity("all");
    setSale("all"); setPriceMin(""); setPriceMax("");
  };

  return (
    <div className="min-h-screen bg-background">
      <Header />
      <Ticker />

      <main className="container mx-auto px-4 sm:px-6 lg:px-8 py-6 space-y-6">

        {/* Hero */}
        <section className="relative overflow-hidden rounded-3xl border border-border/50 bg-card p-6 sm:p-8">
          <div className="absolute -top-24 -right-16 w-72 h-72 rounded-full bg-primary/10 blur-3xl" />
          <div className="absolute -bottom-24 -left-16 w-72 h-72 rounded-full bg-accent/10 blur-3xl" />
          <div className="relative flex flex-col lg:flex-row lg:items-end lg:justify-between gap-6">
            <div className="max-w-2xl">
              <div className="flex items-center gap-2 mb-3">
                <Badge variant="secondary" className="gap-1">
                  <Sparkles className="h-3 w-3" /> TickID Exchange
                </Badge>
                <Badge variant="outline" className="text-[10px] font-mono gap-1.5">
                  <span className="inline-block h-1.5 w-1.5 rounded-full bg-emerald-500 animate-pulse" /> LIVE
                </Badge>
              </div>
              <h1 className="text-3xl sm:text-5xl font-bold tracking-tight mb-3">Username Exchange</h1>
              <p className="text-sm sm:text-base text-muted-foreground">
                The global marketplace for digital identities. Discover, negotiate, buy, sell and mint premium handles across
                Instagram, X, TikTok, Twitch, YouTube, Telegram, ENS and Tick3rt.
              </p>
              <p className="mt-2 text-[11px] text-muted-foreground/80">
                Live market data · Escrow-backed transfers · Only where each platform's rules permit.
              </p>
            </div>
            <div className="grid grid-cols-3 gap-3 lg:min-w-[420px]">
              <StatTile icon={BarChart3} label="30d Volume" value={money(kpis.volume)} accent="text-emerald-500" />
              <StatTile icon={AtSign}    label="Listings"    value={fmt(kpis.listed)} accent="text-primary" />
              <StatTile icon={Gavel}     label="Auctions"    value={fmt(kpis.auctions)} accent="text-amber-500" />
              <StatTile icon={Flame}     label="Hot (24h)"   value={fmt(kpis.hot)} accent="text-orange-500" />
              <StatTile icon={Activity}  label="Avg Price"   value={money(kpis.avg)} accent="text-sky-500" />
              <StatTile icon={ShieldCheck} label="Escrowed"  value="100%" accent="text-emerald-500" />
            </div>
          </div>
        </section>

        {/* Tabs */}
        <Tabs value={tab} onValueChange={(v) => setTab(v as typeof tab)}>
          <TabsList className="w-full sm:w-auto grid grid-cols-5 sm:inline-flex">
            <TabsTrigger value="market" className="gap-1.5"><BarChart3 className="h-3.5 w-3.5" />Market</TabsTrigger>
            <TabsTrigger value="auctions" className="gap-1.5"><Gavel className="h-3.5 w-3.5" />Auctions</TabsTrigger>
            <TabsTrigger value="watchlist" className="gap-1.5"><Star className="h-3.5 w-3.5" />Watchlist</TabsTrigger>
            <TabsTrigger value="offers" className="gap-1.5 relative">
              <Handshake className="h-3.5 w-3.5" />Offers
              {offers.filter((o) => ["pending","countered","awaiting_escrow","in_escrow","transferring","disputed"].includes(o.status)).length > 0 && (
                <span className="ml-1 inline-flex items-center justify-center h-4 min-w-4 px-1 rounded-full bg-primary text-primary-foreground text-[10px] tabular-nums">
                  {offers.filter((o) => ["pending","countered","awaiting_escrow","in_escrow","transferring","disputed"].includes(o.status)).length}
                </span>
              )}
            </TabsTrigger>
            <TabsTrigger value="mint" className="gap-1.5"><Hammer className="h-3.5 w-3.5" />Mint</TabsTrigger>
          </TabsList>

          {/* OFFERS TAB */}
          <TabsContent value="offers" className="mt-6">
            <OffersPanel
              offers={offers}
              onAccept={acceptOffer}
              onDecline={declineOffer}
              onWithdraw={withdrawOffer}
              onCounter={openCounter}
              onFund={fundEscrow}
              onMarkTransferred={markTransferred}
              onConfirm={confirmReceipt}
              onDispute={raiseDispute}
            />
          </TabsContent>


          {/* MINT TAB */}
          <TabsContent value="mint" className="mt-6">
            <div className="grid gap-4 lg:grid-cols-3">
              <Card className="lg:col-span-2 border-border/60">
                <CardContent className="p-6 space-y-4">
                  <div>
                    <h2 className="text-xl font-semibold">Mint a Username NFT</h2>
                    <p className="text-sm text-muted-foreground">Register the identity on-chain (ERC-721), retain provenance, and list it instantly on the Exchange.</p>
                  </div>
                  <div className="grid gap-4 sm:grid-cols-2">
                    <div className="space-y-1.5">
                      <Label>Handle</Label>
                      <div className="relative">
                        <span className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground text-sm">{PLATFORM_META[mintPlatform].prefix}</span>
                        <Input value={mintHandle} onChange={(e) => setMintHandle(e.target.value.replace(/[^a-z0-9_.-]/gi, ""))} placeholder="yourname" className="pl-7" />
                      </div>
                    </div>
                    <div className="space-y-1.5">
                      <Label>Platform</Label>
                      <Select value={mintPlatform} onValueChange={(v) => setMintPlatform(v as Platform)}>
                        <SelectTrigger><SelectValue /></SelectTrigger>
                        <SelectContent>
                          {Object.entries(PLATFORM_META).map(([k, v]) => (
                            <SelectItem key={k} value={k}>{v.label}</SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    </div>
                    <div className="space-y-1.5">
                      <Label>Reserve price (USD, optional)</Label>
                      <Input value={mintReserve} onChange={(e) => setMintReserve(e.target.value.replace(/\D/g, ""))} placeholder="e.g. 500" />
                    </div>
                    <div className="space-y-1.5">
                      <Label>Royalty</Label>
                      <Select defaultValue="5">
                        <SelectTrigger><SelectValue /></SelectTrigger>
                        <SelectContent>
                          <SelectItem value="0">0%</SelectItem>
                          <SelectItem value="2.5">2.5%</SelectItem>
                          <SelectItem value="5">5%</SelectItem>
                          <SelectItem value="7.5">7.5%</SelectItem>
                          <SelectItem value="10">10%</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                  </div>
                  <div className="flex items-center justify-between rounded-xl border border-border/60 bg-muted/40 p-3">
                    <div className="text-xs text-muted-foreground flex items-center gap-2">
                      <Info className="h-3.5 w-3.5" />
                      Mint fee: ~$4 gas · Exchange fee: 2.5% on sale
                    </div>
                    <Button onClick={submitMint} className="gap-1.5"><Hammer className="h-4 w-4" />Mint & List</Button>
                  </div>
                </CardContent>
              </Card>
              <Card className="border-border/60">
                <CardContent className="p-6 space-y-3">
                  <h3 className="font-semibold flex items-center gap-2"><Shield className="h-4 w-4 text-primary" />How transfers work</h3>
                  <ul className="text-xs text-muted-foreground space-y-2">
                    <li className="flex gap-2"><ChevronRight className="h-3.5 w-3.5 shrink-0 mt-0.5" /> Escrow holds funds until platform-side transfer is verified.</li>
                    <li className="flex gap-2"><ChevronRight className="h-3.5 w-3.5 shrink-0 mt-0.5" /> Web3 handles (ENS, Tick3rt) settle on-chain instantly.</li>
                    <li className="flex gap-2"><ChevronRight className="h-3.5 w-3.5 shrink-0 mt-0.5" /> Web2 platforms: we assist buyer & seller through the provider's official flow where permitted.</li>
                    <li className="flex gap-2"><ChevronRight className="h-3.5 w-3.5 shrink-0 mt-0.5" /> Dispute resolution and chargeback protection included.</li>
                  </ul>
                </CardContent>
              </Card>
            </div>
          </TabsContent>

          {/* MARKET / AUCTIONS / WATCHLIST share the same body */}
          {(["market", "auctions", "watchlist"] as const).map((t) => (
            <TabsContent key={t} value={t} className="mt-6 space-y-4">

              {/* Platform strip */}
              <div className="flex items-center gap-2 overflow-x-auto -mx-1 px-1 pb-1">
                <PlatformChip active={platform === "all"} onClick={() => setPlatform("all")}>
                  <Globe className="h-3.5 w-3.5" /> All platforms
                </PlatformChip>
                {(Object.entries(PLATFORM_META) as [Platform, typeof PLATFORM_META[Platform]][]).map(([k, v]) => {
                  const count = LISTINGS.filter((l) => l.platform === k).length;
                  return (
                    <PlatformChip key={k} active={platform === k} onClick={() => setPlatform(k)}>
                      <span className={`inline-block h-2 w-2 rounded-full ${v.dot}`} />
                      {v.label}
                      <span className="text-[10px] opacity-70 tabular-nums">{count}</span>
                    </PlatformChip>
                  );
                })}
              </div>

              {/* Toolbar */}
              <Card className="border-border/60">
                <CardContent className="p-3 space-y-3">
                  <div className="flex flex-col lg:flex-row gap-2">
                    <div className="relative flex-1">
                      <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                      <Input
                        placeholder="Search handles or platforms (e.g. @dj, ENS, tiktok)…"
                        value={query}
                        onChange={(e) => setQuery(e.target.value)}
                        className="pl-9 h-10 font-mono text-sm"
                      />
                    </div>
                    <div className="flex flex-wrap gap-2">
                      <Select value={category} onValueChange={(v) => setCategory(v as typeof category)}>
                        <SelectTrigger className="h-10 w-[130px] text-xs"><SelectValue placeholder="Category" /></SelectTrigger>
                        <SelectContent>
                          <SelectItem value="all">All categories</SelectItem>
                          <SelectItem value="short">Short</SelectItem>
                          <SelectItem value="brand">Brand</SelectItem>
                          <SelectItem value="word">Word</SelectItem>
                          <SelectItem value="numeric">Numeric</SelectItem>
                          <SelectItem value="premium">Premium</SelectItem>
                        </SelectContent>
                      </Select>
                      <Select value={rarity} onValueChange={(v) => setRarity(v as typeof rarity)}>
                        <SelectTrigger className="h-10 w-[130px] text-xs"><SelectValue placeholder="Rarity" /></SelectTrigger>
                        <SelectContent>
                          <SelectItem value="all">All rarities</SelectItem>
                          {(Object.keys(RARITY_META) as Rarity[]).map((r) => (
                            <SelectItem key={r} value={r}>{RARITY_META[r].label}</SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                      <Select value={sale} onValueChange={(v) => setSale(v as typeof sale)}>
                        <SelectTrigger className="h-10 w-[130px] text-xs"><SelectValue placeholder="Sale type" /></SelectTrigger>
                        <SelectContent>
                          <SelectItem value="all">All types</SelectItem>
                          <SelectItem value="buy_now">Buy now</SelectItem>
                          <SelectItem value="auction">Auction</SelectItem>
                          <SelectItem value="make_offer">Make offer</SelectItem>
                        </SelectContent>
                      </Select>
                      <div className="flex items-center gap-1">
                        <Input value={priceMin} onChange={(e) => setPriceMin(e.target.value.replace(/\D/g, ""))} placeholder="Min $" className="h-10 w-24 text-xs" />
                        <span className="text-muted-foreground text-xs">–</span>
                        <Input value={priceMax} onChange={(e) => setPriceMax(e.target.value.replace(/\D/g, ""))} placeholder="Max $" className="h-10 w-24 text-xs" />
                      </div>
                      <Select value={sort} onValueChange={(v) => setSort(v as typeof sort)}>
                        <SelectTrigger className="h-10 w-[150px] text-xs"><SelectValue /></SelectTrigger>
                        <SelectContent>
                          <SelectItem value="trending">Trending</SelectItem>
                          <SelectItem value="change">Top movers 24h</SelectItem>
                          <SelectItem value="price-asc">Price ↑</SelectItem>
                          <SelectItem value="price-desc">Price ↓</SelectItem>
                          <SelectItem value="length">Shortest</SelectItem>
                          <SelectItem value="offers">Most offers</SelectItem>
                          <SelectItem value="ending">Ending soon</SelectItem>
                        </SelectContent>
                      </Select>
                      <div className="inline-flex h-10 items-center rounded-md border border-border/60 p-0.5">
                        <button type="button" onClick={() => setLayout("grid")} aria-label="Grid"
                          className={`flex h-9 w-9 items-center justify-center rounded-sm ${layout === "grid" ? "bg-primary text-primary-foreground" : "text-muted-foreground"}`}>
                          <LayoutGrid className="h-4 w-4" />
                        </button>
                        <button type="button" onClick={() => setLayout("list")} aria-label="List"
                          className={`flex h-9 w-9 items-center justify-center rounded-sm ${layout === "list" ? "bg-primary text-primary-foreground" : "text-muted-foreground"}`}>
                          <Rows3 className="h-4 w-4" />
                        </button>
                      </div>
                    </div>
                  </div>
                  {activeFilters > 0 && (
                    <div className="flex items-center gap-2 text-xs text-muted-foreground">
                      <Filter className="h-3.5 w-3.5" />
                      {activeFilters} filter{activeFilters === 1 ? "" : "s"} active
                      <button onClick={clearFilters} className="text-primary hover:underline">Clear all</button>
                      <span className="ml-auto tabular-nums">{filtered.length} result{filtered.length === 1 ? "" : "s"}</span>
                    </div>
                  )}
                </CardContent>
              </Card>

              {/* Results */}
              {filtered.length === 0 ? (
                <Card className="border-dashed border-2">
                  <CardContent className="p-12 text-center">
                    <AtSign className="h-10 w-10 text-muted-foreground mx-auto mb-3" />
                    <h3 className="font-semibold mb-1">No handles match</h3>
                    <p className="text-sm text-muted-foreground">
                      {t === "watchlist" ? "Star listings to add them to your watchlist." : "Try different filters or search terms."}
                    </p>
                  </CardContent>
                </Card>
              ) : layout === "grid" ? (
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-3 md:gap-4">
                  {filtered.map((l) => (
                    <ListingCard
                      key={l.id}
                      l={l}
                      watched={watchlist.includes(l.id)}
                      onWatch={toggleWatch}
                      onBuy={submitBuy}
                      onOffer={setOfferFor}
                      onBid={setBidFor}
                    />
                  ))}
                </div>
              ) : (
                <ListingTable
                  rows={filtered}
                  watchlist={watchlist}
                  onWatch={toggleWatch}
                  onBuy={submitBuy}
                  onOffer={setOfferFor}
                  onBid={setBidFor}
                />
              )}
            </TabsContent>
          ))}
        </Tabs>

        {/* Trust footer */}
        <Card className="mt-2 bg-muted/40 border-border/50">
          <CardContent className="p-4 flex items-start gap-3">
            <ShieldCheck className="h-5 w-5 text-primary shrink-0 mt-0.5" />
            <div className="text-sm">
              <p className="font-medium">Escrowed transfers · Multi-platform · Chargeback protected</p>
              <p className="text-xs text-muted-foreground">
                TickID Exchange does not own or control usernames on third-party platforms. We provide a secure marketplace
                where users can negotiate and transfer identities where platform rules permit.
              </p>
            </div>
          </CardContent>
        </Card>
      </main>

      {/* Offer dialog */}
      <Dialog open={!!offerFor} onOpenChange={(o) => !o && setOfferFor(null)}>
        <DialogContent>
          {offerFor && (
            <>
              <DialogHeader>
                <DialogTitle>Negotiate {PLATFORM_META[offerFor.platform].prefix}{offerFor.handle}</DialogTitle>
                <DialogDescription>
                  Send a private offer to <span className="font-mono">{offerFor.seller}</span> on {PLATFORM_META[offerFor.platform].label}.
                  Ask: <span className="font-semibold text-foreground">${offerFor.price.toLocaleString()}</span>
                  {offerFor.floor ? ` · Floor: $${offerFor.floor.toLocaleString()}` : ""}
                </DialogDescription>
              </DialogHeader>
              <div className="space-y-3">
                <div className="space-y-1.5">
                  <Label>Your offer (USD)</Label>
                  <Input value={offerAmount} onChange={(e) => setOfferAmount(e.target.value.replace(/\D/g, ""))} placeholder="e.g. 8500" />
                </div>
                <div className="space-y-1.5">
                  <Label>Message (optional)</Label>
                  <Textarea value={offerMsg} onChange={(e) => setOfferMsg(e.target.value)} placeholder="A short note to the seller…" rows={3} />
                </div>
                <div className="rounded-md bg-muted/60 p-2 text-[11px] text-muted-foreground flex items-center gap-2">
                  <Wallet className="h-3.5 w-3.5" /> Offers are held in escrow. Nothing is charged until the seller accepts.
                </div>
              </div>
              <DialogFooter>
                <Button variant="outline" onClick={() => setOfferFor(null)}>Cancel</Button>
                <Button onClick={submitOffer} className="gap-1.5"><Zap className="h-4 w-4" />Send offer</Button>
              </DialogFooter>
            </>
          )}
        </DialogContent>
      </Dialog>

      {/* Bid dialog */}
      <Dialog open={!!bidFor} onOpenChange={(o) => !o && setBidFor(null)}>
        <DialogContent>
          {bidFor && (
            <>
              <DialogHeader>
                <DialogTitle>Place bid on {PLATFORM_META[bidFor.platform].prefix}{bidFor.handle}</DialogTitle>
                <DialogDescription>
                  Current top bid: <span className="font-semibold text-foreground">${bidFor.price.toLocaleString()}</span> ·
                  {" "}Ends in {timeLeft(bidFor.endsAt)}
                </DialogDescription>
              </DialogHeader>
              <div className="space-y-3">
                <div className="space-y-1.5">
                  <Label>Your bid (USD)</Label>
                  <Input value={bidAmount} onChange={(e) => setBidAmount(e.target.value.replace(/\D/g, ""))} placeholder={`> ${bidFor.price}`} />
                </div>
                <div className="grid grid-cols-3 gap-2">
                  {[1.05, 1.10, 1.25].map((mult) => (
                    <Button key={mult} type="button" variant="outline" size="sm"
                      onClick={() => setBidAmount(String(Math.round(bidFor.price * mult)))}>
                      +{Math.round((mult - 1) * 100)}%
                    </Button>
                  ))}
                </div>
              </div>
              <DialogFooter>
                <Button variant="outline" onClick={() => setBidFor(null)}>Cancel</Button>
                <Button onClick={submitBid} className="gap-1.5"><Gavel className="h-4 w-4" />Place bid</Button>
              </DialogFooter>
            </>
          )}
        </DialogContent>
      </Dialog>

      <Footer />
    </div>
  );
};

/* -----------------------------------------------------------
   Sub-components
----------------------------------------------------------- */

const StatTile = ({ icon: Icon, label, value, accent }: { icon: typeof BarChart3; label: string; value: string; accent: string }) => (
  <div className="rounded-xl border border-border/60 bg-card/60 backdrop-blur-sm p-3">
    <div className="flex items-center gap-1.5 text-[10px] uppercase tracking-wider text-muted-foreground">
      <Icon className={`h-3 w-3 ${accent}`} /> {label}
    </div>
    <div className="mt-1 text-lg font-bold tabular-nums">{value}</div>
  </div>
);

const PlatformChip = ({ active, onClick, children }: { active: boolean; onClick: () => void; children: React.ReactNode }) => (
  <button
    type="button"
    onClick={onClick}
    className={`shrink-0 inline-flex items-center gap-1.5 rounded-full px-3 h-8 text-xs font-medium transition-colors border ${
      active
        ? "bg-primary text-primary-foreground border-primary"
        : "bg-background/40 text-muted-foreground border-border/60 hover:text-foreground hover:bg-muted"
    }`}
  >
    {children}
  </button>
);

const ChangeBadge = ({ pct }: { pct: number }) => {
  const up = pct >= 0;
  return (
    <span className={`inline-flex items-center gap-0.5 text-[11px] font-semibold tabular-nums ${up ? "text-emerald-500" : "text-red-500"}`}>
      {up ? <ArrowUpRight className="h-3 w-3" /> : <ArrowDownRight className="h-3 w-3" />}
      {Math.abs(pct).toFixed(1)}%
    </span>
  );
};

type CardProps = {
  l: Listing;
  watched: boolean;
  onWatch: (id: string) => void;
  onBuy: (l: Listing) => void;
  onOffer: (l: Listing) => void;
  onBid: (l: Listing) => void;
};

const ListingCard = ({ l, watched, onWatch, onBuy, onOffer, onBid }: CardProps) => {
  const p = PLATFORM_META[l.platform];
  const r = RARITY_META[l.rarity];
  return (
    <div className={`group relative rounded-2xl border border-border/60 bg-card/70 backdrop-blur-sm overflow-hidden shadow-sm hover:shadow-xl transition-all ring-1 ${r.ring}`}>
      <div className={`relative h-28 bg-gradient-to-br ${r.gradient} flex items-center justify-center overflow-hidden`}>
        <div className="absolute inset-0 opacity-30 bg-[radial-gradient(circle_at_30%_20%,white,transparent_50%)]" />
        <p className="relative text-white text-xl sm:text-2xl font-bold tracking-tight drop-shadow-sm text-center px-3 break-all">
          {p.prefix}{l.handle}
        </p>
        <div className="absolute top-2 left-2 flex items-center gap-1">
          <Badge className="bg-black/40 backdrop-blur text-white border-white/20 text-[10px] gap-1">
            <span className={`h-1.5 w-1.5 rounded-full ${p.dot}`} /> {p.label}
          </Badge>
          {l.verified && (
            <Badge className="bg-black/40 backdrop-blur text-white border-white/20 text-[10px] gap-1">
              <ShieldCheck className="h-3 w-3" />
            </Badge>
          )}
        </div>
        <button
          onClick={() => onWatch(l.id)}
          className="absolute top-2 right-2 h-7 w-7 rounded-full bg-black/40 backdrop-blur border border-white/20 text-white grid place-items-center hover:bg-black/60"
          aria-label="Watch"
        >
          <Star className={`h-3.5 w-3.5 ${watched ? "fill-amber-300 text-amber-300" : ""}`} />
        </button>
        {l.trending && (
          <Badge className="absolute bottom-2 right-2 bg-orange-500/90 text-white border-orange-300/40 text-[10px] gap-1">
            <Flame className="h-3 w-3" /> Hot
          </Badge>
        )}
      </div>
      <div className="p-3 space-y-2.5">
        <div className="flex items-center justify-between text-[10px] uppercase tracking-wider text-muted-foreground">
          <span className={`font-semibold ${r.text}`}>{r.label}</span>
          <span>{l.length} chars</span>
        </div>
        <div className="flex items-end justify-between">
          <div>
            <p className="text-[10px] text-muted-foreground uppercase tracking-wider">
              {l.sale === "auction" ? "Current bid" : "Price"}
            </p>
            <p className="text-lg font-bold tabular-nums">${l.price.toLocaleString()}</p>
          </div>
          <div className="text-right">
            <ChangeBadge pct={l.change24h} />
            {l.lastSale && (
              <p className="text-[10px] text-muted-foreground tabular-nums">Last ${l.lastSale.toLocaleString()}</p>
            )}
          </div>
        </div>
        <div className="flex items-center justify-between text-[10px] text-muted-foreground border-t border-border/50 pt-2">
          <span className="inline-flex items-center gap-1"><Eye className="h-3 w-3" />{fmt(l.views)}</span>
          <span className="inline-flex items-center gap-1"><Star className="h-3 w-3" />{fmt(l.watchers)}</span>
          <span className="inline-flex items-center gap-1"><Tag className="h-3 w-3" />{l.offers}</span>
          {l.sale === "auction" && l.endsAt && (
            <span className="inline-flex items-center gap-1 text-amber-500 font-medium"><Clock className="h-3 w-3" />{timeLeft(l.endsAt)}</span>
          )}
        </div>
        <div className="flex gap-2 pt-0.5">
          {l.sale === "auction" ? (
            <>
              <Button size="sm" className="flex-1 h-8 text-xs gap-1" onClick={() => onBid(l)}>
                <Gavel className="h-3.5 w-3.5" /> Bid
              </Button>
              <Button size="sm" variant="outline" className="flex-1 h-8 text-xs" onClick={() => onOffer(l)}>Offer</Button>
            </>
          ) : l.sale === "buy_now" ? (
            <>
              <Button size="sm" className="flex-1 h-8 text-xs" onClick={() => onBuy(l)}>Buy now</Button>
              <Button size="sm" variant="outline" className="flex-1 h-8 text-xs" onClick={() => onOffer(l)}>Offer</Button>
            </>
          ) : (
            <Button size="sm" className="flex-1 h-8 text-xs gap-1" onClick={() => onOffer(l)}>
              <Zap className="h-3.5 w-3.5" /> Make offer
            </Button>
          )}
        </div>
      </div>
    </div>
  );
};

const ListingTable = ({
  rows, watchlist, onWatch, onBuy, onOffer, onBid,
}: {
  rows: Listing[]; watchlist: string[];
  onWatch: (id: string) => void;
  onBuy: (l: Listing) => void;
  onOffer: (l: Listing) => void;
  onBid: (l: Listing) => void;
}) => (
  <div className="rounded-2xl border border-border/60 bg-card/70 overflow-hidden">
    <div className="hidden md:grid grid-cols-[1.6fr_0.9fr_0.9fr_0.7fr_0.9fr_0.9fr_1.4fr] gap-3 px-4 py-2 text-[10px] uppercase tracking-wider text-muted-foreground border-b border-border/60 bg-muted/30">
      <span>Handle</span><span>Platform</span><span className="text-right">Price</span>
      <span className="text-right">24h</span><span className="text-right">Offers</span>
      <span className="text-right">Ends</span><span className="text-right">Actions</span>
    </div>
    <div className="divide-y divide-border/50">
      {rows.map((l) => {
        const p = PLATFORM_META[l.platform];
        const r = RARITY_META[l.rarity];
        return (
          <div key={l.id} className="grid grid-cols-2 md:grid-cols-[1.6fr_0.9fr_0.9fr_0.7fr_0.9fr_0.9fr_1.4fr] gap-3 px-3 md:px-4 py-3 items-center hover:bg-muted/30 transition-colors">
            <div className="flex items-center gap-2.5 col-span-2 md:col-span-1 min-w-0">
              <div className={`shrink-0 h-9 w-9 rounded-lg bg-gradient-to-br ${r.gradient} grid place-items-center text-white text-xs font-bold`}>
                {l.handle.slice(0, 2).toUpperCase()}
              </div>
              <div className="min-w-0">
                <div className="flex items-center gap-1.5">
                  <p className="font-semibold truncate">{p.prefix}{l.handle}</p>
                  {l.verified && <ShieldCheck className="h-3.5 w-3.5 text-primary shrink-0" />}
                  {l.trending && <Flame className="h-3.5 w-3.5 text-orange-500 shrink-0" />}
                </div>
                <p className={`text-[10px] uppercase tracking-wider ${r.text}`}>{r.label} · {l.length}c</p>
              </div>
              <button onClick={() => onWatch(l.id)} className="ml-auto md:hidden" aria-label="Watch">
                <Star className={`h-4 w-4 ${watchlist.includes(l.id) ? "fill-amber-400 text-amber-400" : "text-muted-foreground"}`} />
              </button>
            </div>
            <div className="hidden md:flex items-center gap-1.5 text-xs">
              <span className={`h-2 w-2 rounded-full ${p.dot}`} />{p.label}
            </div>
            <div className="text-left md:text-right font-semibold tabular-nums text-sm">
              ${l.price.toLocaleString()}
              <div className="text-[10px] text-muted-foreground font-normal md:hidden">{p.label}</div>
            </div>
            <div className="hidden md:flex md:justify-end"><ChangeBadge pct={l.change24h} /></div>
            <div className="hidden md:block text-right text-xs tabular-nums">{l.offers}</div>
            <div className="hidden md:block text-right text-xs tabular-nums text-amber-500">
              {l.sale === "auction" ? timeLeft(l.endsAt) : "—"}
            </div>
            <div className="col-span-2 md:col-span-1 flex justify-end gap-1.5">
              <button onClick={() => onWatch(l.id)} className="hidden md:inline-grid place-items-center h-8 w-8 rounded-md border border-border/60 hover:bg-muted" aria-label="Watch">
                <Star className={`h-3.5 w-3.5 ${watchlist.includes(l.id) ? "fill-amber-400 text-amber-400" : ""}`} />
              </button>
              {l.sale === "auction" ? (
                <Button size="sm" className="h-8 text-xs px-3 gap-1" onClick={() => onBid(l)}><Gavel className="h-3.5 w-3.5" />Bid</Button>
              ) : l.sale === "buy_now" ? (
                <Button size="sm" className="h-8 text-xs px-3" onClick={() => onBuy(l)}>Buy</Button>
              ) : null}
              <Button size="sm" variant="outline" className="h-8 text-xs px-3" onClick={() => onOffer(l)}>Offer</Button>
            </div>
          </div>
        );
      })}
    </div>
  </div>
);

export default UsernameMarketplace;
