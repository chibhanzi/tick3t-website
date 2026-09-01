
import { useEffect, useState } from "react";
import { useParams, Link } from "react-router-dom";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import SocialShareButton from "@/components/SocialShareButton";
import AttendeeShareModal from "@/components/AttendeeShareModal";
import FollowButton from "@/components/FollowButton";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent } from "@/components/ui/card";
import { Calendar, MapPin, Users, Clock, Heart, Minus, Plus, ChevronLeft, Shield, Ticket, MessageCircle, CheckCircle, ShoppingBag, Share2, PartyPopper, ListOrdered } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { useNavigate } from "react-router-dom";
import { useAuth } from "@/contexts/AuthContext";
import { useWaitlist } from "@/contexts/WaitlistContext";
import { getPurchasedTicketStatus, recordTicketPurchase } from "@/lib/ticketPurchases";
import { getPublishedEvent, type PublishedEventRecord } from "@/lib/publishedEvents";

/* ------------------------------------------------------------------ */
/*  Mock events — keyed by id so we can demo sold-out (id=2) vs not   */
/* ------------------------------------------------------------------ */
const MOCK_EVENTS: Record<string, {
  id: string; title: string; date: string; time: string; location: string;
  fullAddress: string; description: string; image: string; attendees: number;
  category: string; available: number; total: number; organizer: string;
  organizerId: string; isVerifiedOrganizer: boolean; tags: string[]; amenities: string[];
  resaleAvailable?: number; resaleFromPrice?: number;
  purchaseLimitPerAccount?: number;
  price?: number;
  currency?: string;
}> = {
  "1": {
    id: "1",
    title: "Bass Drop Festival 2024",
    date: "March 15, 2024",
    time: "9:00 PM",
    location: "Miami Beach Arena",
    fullAddress: "1901 Biscayne Blvd, Miami, FL 33132",
    description: "Get ready for the ultimate electronic music experience! Bass Drop Festival brings together the hottest DJs and producers for a night of non-stop dancing under the Miami stars.\n\nFeaturing Skrillex, Diplo, Marshmello and many more. This isn't just a concert — it's a full sensory experience with cutting-edge visuals, interactive art installations, and the best sound system on the East Coast.",
    image: "https://images.unsplash.com/photo-1470813740244-df37b8c1edcb?w=1200&h=600&fit=crop",
    attendees: 2500,
    category: "Music Festival",
    available: 150,
    total: 500,
    organizer: "Bass Events Miami",
    organizerId: "org-bass",
    isVerifiedOrganizer: true,
    tags: ["Electronic", "Dance", "Festival", "Miami"],
    amenities: ["Food Trucks", "Premium Bar", "Valet Parking", "Free WiFi", "24/7 Security"],
    resaleAvailable: 7,
    resaleFromPrice: 110,
    purchaseLimitPerAccount: 4,
  },
  "2": {
    id: "2",
    title: "Digital Art Rave",
    date: "March 22, 2024",
    time: "10:00 PM",
    location: "Brooklyn Warehouse, NYC",
    fullAddress: "56 Water St, Brooklyn, NY 11201",
    description: "An immersive night where digital art meets electronic music. Stunning projection mapping, generative visuals, and underground DJs create a one-of-a-kind sensory experience.\n\nFully sold out — but don't miss your chance. Join the waitlist and be first in line when a ticket drops.",
    image: "https://images.unsplash.com/photo-1500673922987-e212871fec22?w=1200&h=600&fit=crop",
    attendees: 800,
    category: "Art & Culture",
    available: 0,
    total: 200,
    organizer: "Digital Art Collective",
    organizerId: "org-digitalart",
    isVerifiedOrganizer: false,
    tags: ["Art", "Electronic", "Immersive", "NYC"],
    amenities: ["Projection Mapping", "Open Bar", "Gallery Installations", "Live Art"],
    resaleAvailable: 0,
    resaleFromPrice: 0,
  },
  "3": {
    id: "3",
    title: "Tech Innovation Summit",
    date: "March 28, 2024",
    time: "9:00 AM",
    location: "Silicon Valley Convention Center",
    fullAddress: "5001 Great America Pkwy, Santa Clara, CA 95054",
    description: "Meet the founders, engineers, and investors shaping the next generation of technology. This full-day summit features practical talks, product demos, and focused networking sessions.",
    image: "https://images.unsplash.com/photo-1540575467063-178a50c2df87?w=1200&h=600&fit=crop",
    attendees: 1200,
    category: "Tech & Networking",
    available: 300,
    total: 400,
    organizer: "Tech Events Network",
    organizerId: "org-techevents",
    isVerifiedOrganizer: true,
    tags: ["Technology", "Startups", "Networking", "Innovation"],
    amenities: ["Coffee & Lunch", "Founder Lounge", "Fast WiFi", "Demo Hall"],
  },
};

const DEFAULT_EVENT = MOCK_EVENTS["1"];

const EventDetail = () => {
  const { id } = useParams();
  const { toast } = useToast();
  const navigate = useNavigate();
  const { user } = useAuth();
  const { isOnWaitlist, join, leave, position, displayCount } = useWaitlist();

  const [publishedEvent, setPublishedEvent] = useState<PublishedEventRecord | null>(null);
  const [serverAvailable, setServerAvailable] = useState<number | null>(null);
  const fallbackEvent = MOCK_EVENTS[id ?? ""] ?? DEFAULT_EVENT;
  const event = {
    ...(publishedEvent ?? fallbackEvent),
    ...(serverAvailable === null ? {} : { available: serverAvailable }),
  };
  const resaleAvailable = event.resaleAvailable ?? 0;
  const resaleFromPrice = event.resaleFromPrice ?? 0;

  const [quantity, setQuantity] = useState(1);
  const [selectedTier, setSelectedTier] = useState("general");
  const [liked, setLiked] = useState(false);
  const [isAttending, setIsAttending] = useState(false);
  const [showShareModal, setShowShareModal] = useState(false);
  const [purchasedQuantity, setPurchasedQuantity] = useState(0);
  const [lastPurchaseQuantity, setLastPurchaseQuantity] = useState(0);
  const [isBuying, setIsBuying] = useState(false);

  const accountLimit = Number.isInteger(event.purchaseLimitPerAccount) && event.purchaseLimitPerAccount! > 0
    ? event.purchaseLimitPerAccount!
    : null;
  const remainingAccountAllowance = accountLimit === null
    ? null
    : Math.max(0, accountLimit - purchasedQuantity);
  const maxPurchaseQuantity = Math.min(10, event.available, remainingAccountAllowance ?? 10);
  const hasReachedAccountLimit = remainingAccountAllowance === 0;

  useEffect(() => {
    let active = true;
    setPublishedEvent(null);
    setServerAvailable(null);
    if (id) {
      void getPublishedEvent(id).then((serverEvent) => {
        if (!active || !serverEvent) return;
        setPublishedEvent(serverEvent);
        setServerAvailable(serverEvent.available);
      });
    }
    return () => {
      active = false;
    };
  }, [id]);

  useEffect(() => {
    let active = true;
    setPurchasedQuantity(0);
    if (user && id) {
      void getPurchasedTicketStatus(id)
        .then((status) => {
          if (!active) return;
          setPurchasedQuantity(status.purchasedQuantity);
          setServerAvailable(status.available);
        })
        .catch(() => {
          if (active) setPurchasedQuantity(0);
        });
    }
    return () => {
      active = false;
    };
  }, [id, user?.id]);

  useEffect(() => {
    setQuantity(1);
  }, [id, user?.id]);

  useEffect(() => {
    if (maxPurchaseQuantity > 0 && quantity > maxPurchaseQuantity) {
      setQuantity(maxPurchaseQuantity);
    }
  }, [maxPurchaseQuantity, quantity]);

  const handleJoinWaitlist = () => {
    if (!user) {
      toast({ title: "Sign in to join the waitlist", description: "Create a free account to save your spot." });
      navigate("/auth");
      return;
    }
    const pos = join(event.id, {
      eventTitle: event.title,
      eventDate: event.date,
      eventLocation: event.location,
      eventImage: event.image,
    });
    toast({
      title: `You're #${pos} on the waitlist! 🎟️`,
      description: "We'll let you know the moment a ticket opens up.",
    });
  };

  const basePrice = event.price ?? 89;
  const tiers = [
    { id: "general", name: "General Admission", price: basePrice, perks: ["Event access", "Standing area"] },
    { id: "vip", name: "VIP", price: Math.round(basePrice * 2.1), perks: ["Priority entry", "VIP lounge", "Complimentary drink"] },
    { id: "backstage", name: "Backstage Pass", price: Math.round(basePrice * 3.9), perks: ["All VIP perks", "Meet & greet", "Backstage access"] },
  ];

  const selectedTierData = tiers.find(t => t.id === selectedTier)!;
  const totalPrice = selectedTierData.price * quantity;
  const soldPercent = ((event.total - event.available) / event.total) * 100;

  const whatsappShareUrl = `https://wa.me/?text=${encodeURIComponent(`🎉 Check out ${event.title} on ${event.date} at ${event.location}! Get tickets: ${window.location.href}`)}`;

  const handleBuy = async () => {
    if (!user) {
      toast({
        title: "Sign in to get tickets",
        description: "Ticket limits are linked to your Tick3t account.",
      });
      navigate("/auth");
      return;
    }

    if (remainingAccountAllowance !== null && quantity > remainingAccountAllowance) {
      toast({
        variant: "destructive",
        title: "Ticket limit reached",
        description: remainingAccountAllowance === 0
          ? `This event allows ${accountLimit} ticket${accountLimit === 1 ? "" : "s"} per account.`
          : `You can purchase ${remainingAccountAllowance} more ticket${remainingAccountAllowance === 1 ? "" : "s"} for this event.`,
      });
      return;
    }

    setIsBuying(true);
    try {
      const status = await recordTicketPurchase(event.id, quantity);
      setPurchasedQuantity(status.purchasedQuantity);
      setServerAvailable(status.available);
    } catch (error) {
      const errorData =
        typeof error === "object" &&
        error !== null &&
        "data" in error &&
        typeof error.data === "object" &&
        error.data !== null
          ? error.data as Record<string, unknown>
          : null;
      if (typeof errorData?.purchasedQuantity === "number") {
        setPurchasedQuantity(errorData.purchasedQuantity);
      }
      if (typeof errorData?.available === "number") {
        setServerAvailable(errorData.available);
      }
      toast({
        variant: "destructive",
        title:
          typeof errorData?.accountLimit === "number"
            ? "Ticket limit reached"
            : "Could not reserve tickets",
        description:
          typeof errorData?.error === "string"
            ? errorData.error
            : error instanceof Error
              ? error.message
              : "Please try again.",
      });
      return;
    } finally {
      setIsBuying(false);
    }
    setLastPurchaseQuantity(quantity);
    setIsAttending(true);
    setShowShareModal(true);
    toast({
      title: "🎉 Tickets reserved!",
      description: `${quantity}x ${selectedTierData.name} — $${totalPrice.toFixed(2)}`,
    });
  };

  return (
    <div className="min-h-screen bg-background">
      <Header />

      <AttendeeShareModal
        open={showShareModal}
        onClose={() => setShowShareModal(false)}
        eventTitle={event.title}
        eventDate={event.date}
        eventLocation={event.location}
        eventImage={event.image}
        tierName={selectedTierData.name}
        quantity={lastPurchaseQuantity || quantity}
        totalPrice={selectedTierData.price * (lastPurchaseQuantity || quantity)}
      />

      <main>
        {/* Hero image */}
        <div className="relative h-[50vh] min-h-[320px] overflow-hidden">
          <img src={event.image} alt={event.title} className="w-full h-full object-cover" />
          <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/30 to-transparent" />
          <div className="absolute top-4 left-4">
            <Link to="/events">
              <Button variant="ghost" size="sm" className="text-white hover:bg-white/20">
                <ChevronLeft className="h-4 w-4 mr-1" /> Back
              </Button>
            </Link>
          </div>
          <div className="absolute bottom-6 left-6 right-6 max-w-4xl">
            <div className="flex items-center gap-2 mb-3">
              <Badge className="bg-white/20 text-white border-white/30 backdrop-blur-sm">{event.category}</Badge>
              {event.available < 100 && event.available > 0 && (
                <Badge className="bg-red-500/90 text-white">Almost sold out</Badge>
              )}
            </div>
            <h1 className="text-3xl md:text-5xl font-bold text-white mb-2 tracking-tight">{event.title}</h1>
            <div className="flex items-center gap-3 flex-wrap">
              <div className="flex items-center gap-2 text-white/80">
                <span>by {event.organizer}</span>
                {event.isVerifiedOrganizer && (
                  <Badge className="bg-green-500/90 text-white border-0 text-[10px] gap-0.5">
                    <CheckCircle className="h-3 w-3" />
                    Verified
                  </Badge>
                )}
              </div>
              <FollowButton organizerId={event.organizerId} variant="pill" />
            </div>
          </div>
        </div>

        <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <div className="grid grid-cols-1 lg:grid-cols-5 gap-8">
            {/* Left — Details */}
            <div className="lg:col-span-3 space-y-6">
              {/* Quick info row */}
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                {[
                  { icon: Calendar, label: event.date, sub: event.time },
                  { icon: MapPin, label: event.location, sub: "Miami, FL" },
                  { icon: Users, label: `${event.attendees.toLocaleString()} going`, sub: "Join them" },
                  { icon: Clock, label: "6 hours", sub: "Duration" },
                ].map((item, i) => (
                  <Card key={i} className="border-border/50">
                    <CardContent className="p-4 flex items-start gap-3">
                      <item.icon className="h-5 w-5 text-primary mt-0.5 shrink-0" />
                      <div>
                        <p className="font-medium text-sm leading-tight">{item.label}</p>
                        <p className="text-xs text-muted-foreground">{item.sub}</p>
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>

              {/* About */}
              <div>
                <h2 className="text-xl font-semibold mb-3">About this event</h2>
                <div className="prose prose-sm dark:prose-invert max-w-none text-muted-foreground">
                  {event.description.split('\n').filter(Boolean).map((p, i) => (
                    <p key={i} className="mb-3 leading-relaxed">{p}</p>
                  ))}
                </div>
              </div>

              {/* What's included */}
              <div>
                <h2 className="text-xl font-semibold mb-3">What's included</h2>
                <div className="flex flex-wrap gap-2">
                  {event.amenities.map((a) => (
                    <Badge key={a} variant="secondary" className="text-sm py-1 px-3">{a}</Badge>
                  ))}
                </div>
              </div>

              {/* Tags */}
              <div className="flex flex-wrap gap-2">
                {event.tags.map((tag) => (
                  <Badge key={tag} variant="outline" className="text-xs">{tag}</Badge>
                ))}
              </div>
            </div>

            {/* Right — Purchase card */}
            <div className="lg:col-span-2">
              <Card className="sticky top-20 border-border shadow-lg">
                <CardContent className="p-6 space-y-5">
                  {/* Attending banner — shown after purchase */}
                  {isAttending && (
                    <div className="flex items-center justify-between rounded-xl bg-gradient-to-r from-primary/10 to-violet-500/10 border border-primary/20 px-4 py-3">
                      <div className="flex items-center gap-2">
                        <PartyPopper className="h-5 w-5 text-primary" />
                        <div>
                          <p className="text-sm font-semibold leading-tight">You're going! 🎉</p>
                          <p className="text-xs text-muted-foreground">
                             {lastPurchaseQuantity || quantity}× {selectedTierData.name}
                          </p>
                        </div>
                      </div>
                      <Button
                        size="sm"
                        variant="outline"
                        className="h-8 gap-1.5 border-primary/30 text-primary hover:bg-primary/10 text-xs"
                        onClick={() => setShowShareModal(true)}
                      >
                        <Share2 className="h-3.5 w-3.5" />
                        Share
                      </Button>
                    </div>
                  )}

                  {/* Tier selection */}
                  <div className="space-y-2">
                    <h3 className="font-semibold text-sm text-muted-foreground uppercase tracking-wide">Select Ticket</h3>
                    {tiers.map((tier) => (
                      <button
                        key={tier.id}
                        onClick={() => setSelectedTier(tier.id)}
                        className={`w-full text-left p-3 rounded-lg border transition-all ${
                          selectedTier === tier.id
                            ? "border-primary bg-primary/5 ring-1 ring-primary"
                            : "border-border hover:border-primary/50"
                        }`}
                      >
                        <div className="flex justify-between items-center">
                          <span className="font-medium text-sm">{tier.name}</span>
                          <span className="font-bold">${tier.price}</span>
                        </div>
                        <p className="text-xs text-muted-foreground mt-1">{tier.perks.join(" · ")}</p>
                      </button>
                    ))}
                  </div>

                  {/* Quantity */}
                  <div className="flex items-center justify-between">
                    <span className="text-sm font-medium">Quantity</span>
                    <div className="flex items-center gap-3">
                      <Button
                        variant="outline"
                        size="icon"
                        className="h-8 w-8"
                        aria-label="Decrease ticket quantity"
                        onClick={() => setQuantity(Math.max(1, quantity - 1))}
                        disabled={quantity <= 1}
                      >
                        <Minus className="h-3 w-3" />
                      </Button>
                      <span className="font-bold w-6 text-center" data-testid="ticket-quantity">{quantity}</span>
                      <Button
                        variant="outline"
                        size="icon"
                        className="h-8 w-8"
                        aria-label="Increase ticket quantity"
                        onClick={() => setQuantity(Math.min(maxPurchaseQuantity, quantity + 1))}
                        disabled={maxPurchaseQuantity === 0 || quantity >= maxPurchaseQuantity}
                      >
                        <Plus className="h-3 w-3" />
                      </Button>
                    </div>
                  </div>
                  {accountLimit !== null && (
                    <div
                      className={`rounded-lg border px-3 py-2 text-xs ${
                        hasReachedAccountLimit
                          ? "border-amber-300 bg-amber-50 text-amber-800 dark:border-amber-800 dark:bg-amber-950/40 dark:text-amber-300"
                          : "border-primary/20 bg-primary/5 text-muted-foreground"
                      }`}
                      role={hasReachedAccountLimit ? "alert" : undefined}
                    >
                      {hasReachedAccountLimit
                        ? `You have reached this event's ${accountLimit}-ticket account limit · 0 remaining for you.`
                        : `${accountLimit} ticket${accountLimit === 1 ? "" : "s"} per account · ${remainingAccountAllowance} remaining for you`}
                    </div>
                  )}

                  <div className="border-t border-border" />

                  {/* Total */}
                  <div className="flex justify-between items-center">
                    <span className="text-muted-foreground">Total</span>
                    <span className="text-2xl font-bold">${totalPrice.toFixed(2)}</span>
                  </div>

                  {/* Buy / Waitlist CTA */}
                  {event.available === 0 ? (
                    resaleAvailable > 0 ? (
                      /* ── Resale available (takes priority) ── */
                      <Button
                        className="w-full h-12 text-base font-semibold bg-gradient-to-r from-violet-600 to-fuchsia-600 hover:opacity-90"
                        onClick={() => navigate(`/marketplace?event=${event.id}`)}
                      >
                        <ShoppingBag className="h-4 w-4 mr-2" />
                        Buy from Resale ({resaleAvailable} available)
                      </Button>
                    ) : isOnWaitlist(event.id) ? (
                      /* ── Already on waitlist — confirmation state ── */
                      <div className="rounded-xl border border-primary/25 bg-primary/5 p-4 space-y-2 text-center">
                        <CheckCircle className="h-6 w-6 text-primary mx-auto" />
                        <p className="font-semibold text-sm">
                          You're #{position(event.id)} on the waitlist
                        </p>
                        <p className="text-xs text-muted-foreground leading-relaxed">
                          Joining {displayCount(event.id).toLocaleString()} people waiting —
                          we'll let you know the moment a ticket opens up.
                        </p>
                        <button
                          onClick={() => leave(event.id)}
                          className="text-xs text-muted-foreground underline underline-offset-2 hover:text-foreground transition-colors"
                        >
                          Leave waitlist
                        </button>
                      </div>
                    ) : (
                      /* ── No resale, not on waitlist ── */
                      <Button
                        className="w-full h-12 text-base font-semibold gap-2 bg-amber-500 hover:bg-amber-600 text-white border-0"
                        onClick={handleJoinWaitlist}
                      >
                        <ListOrdered className="h-4 w-4" />
                        Join {displayCount(event.id).toLocaleString()} others on the waitlist
                      </Button>
                    )
                  ) : (
                    /* ── Tickets available ── */
                    <Button
                      className="w-full h-12 text-base font-semibold"
                      onClick={handleBuy}
                      disabled={hasReachedAccountLimit || isBuying}
                    >
                      <Ticket className="h-4 w-4 mr-2" />
                      {hasReachedAccountLimit
                        ? "Account ticket limit reached"
                        : isBuying
                          ? "Reserving tickets…"
                          : "Get Tickets"}
                    </Button>
                  )}

                  {event.available === 0 && resaleAvailable > 0 && (
                    <p className="text-[11px] text-center text-muted-foreground -mt-1">
                      Verified fan resale · from ${resaleFromPrice}
                    </p>
                  )}

                  {/* Trust badge */}
                  <div className="flex items-center justify-center gap-2 py-2 px-3 rounded-lg bg-green-500/10 border border-green-500/20">
                    <Shield className="h-4 w-4 text-green-600" />
                    <span className="text-xs text-green-700 dark:text-green-400 font-medium">Secure Payment via Paynow</span>
                  </div>

                  {/* Actions row */}
                  <div className="flex gap-2">
                    <Button variant="outline" className="flex-1" onClick={() => setLiked(!liked)}>
                      <Heart className={`h-4 w-4 mr-1 ${liked ? "fill-red-500 text-red-500" : ""}`} />
                      {liked ? "Saved" : "Save"}
                    </Button>
                    {isAttending ? (
                      <Button
                        className="flex-1 bg-gradient-to-r from-primary to-violet-600 text-white hover:opacity-90 border-0"
                        onClick={() => setShowShareModal(true)}
                      >
                        <Share2 className="h-4 w-4 mr-1" />
                        Tell friends
                      </Button>
                    ) : (
                      <Button
                        variant="outline"
                        className="flex-1 bg-green-500/10 border-green-500/30 hover:bg-green-500/20 text-green-700 dark:text-green-400"
                        onClick={() => window.open(whatsappShareUrl, "_blank")}
                      >
                        <MessageCircle className="h-4 w-4 mr-1" />
                        WhatsApp
                      </Button>
                    )}
                  </div>

                  {/* Full share — only show when not yet attending */}
                  {!isAttending && (
                    <SocialShareButton
                      eventTitle={event.title}
                      eventDate={event.date}
                      eventLocation={event.location}
                      ticketsLeft={event.available}
                      price={selectedTierData.price}
                    />
                  )}

                  {/* Availability bar */}
                  <div className="space-y-2">
                    <div className="flex justify-between text-xs text-muted-foreground">
                      <span>{event.total - event.available} sold</span>
                      <span>{event.available} remaining</span>
                    </div>
                    <div className="w-full bg-secondary rounded-full h-2">
                      <div className="bg-primary h-2 rounded-full transition-all" style={{ width: `${soldPercent}%` }} />
                    </div>
                  </div>

                  <div className="flex items-center justify-center gap-1 text-xs text-muted-foreground">
                    <Shield className="h-3 w-3" />
                    <span>Verified NFT ticket on TON blockchain</span>
                  </div>
                </CardContent>
              </Card>
            </div>
          </div>
        </div>
      </main>

      <Footer />
    </div>
  );
};

export default EventDetail;
