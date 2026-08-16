import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import { useAuth } from "@/contexts/AuthContext";
import { useFollow } from "@/contexts/FollowContext";
import { useWaitlist } from "@/contexts/WaitlistContext";
import { useToast } from "@/hooks/use-toast";
import { MOCK_ORGANIZERS } from "@/data/mockOrganizers";
import FollowButton from "@/components/FollowButton";
import {
  Calendar, Clock, BadgeCheck, Bell, Users, ListOrdered,
  ChevronRight, Ticket, Cpu, Shield, CreditCard, Gift,
  HelpCircle, LogOut, Copy, Check, Pencil, Instagram, Twitter,
  Wallet, CheckCircle,
} from "lucide-react";

// ── Mock social friends (Party Animals) ──────────────────────────────────────
const MOCK_FRIENDS = [
  {
    id: "f1", name: "Tanya M.", color: "#E1306C",
    events: ["Bass Drop Festival 2024", "Afrobeats Night"],
    socials: [{ platform: "instagram", handle: "tanyavibes" }],
  },
  {
    id: "f2", name: "Kwame D.", color: "#6366F1",
    events: ["Tech Innovation Summit 2024"],
    socials: [{ platform: "twitter", handle: "kwame_dev" }],
  },
  {
    id: "f3", name: "Sasha L.", color: "#10B981",
    events: ["Jazz in the Park", "Afrobeats Night"],
    socials: [],
  },
  {
    id: "f4", name: "Rico T.", color: "#F59E0B",
    events: ["Bass Drop Festival 2024"],
    socials: [{ platform: "twitter", handle: "ricotunes" }],
  },
];

// ── Referral code generator ───────────────────────────────────────────────────
function genReferral(name: string) {
  const slug = name.replace(/\s/g, "").toUpperCase().slice(0, 4) || "USER";
  const hash = Math.abs(name.split("").reduce((a, c) => a + c.charCodeAt(0), 0) % 9000) + 1000;
  return `TICK3T-${slug}-${hash}`;
}

const UserDashboard = () => {
  const { user, logout } = useAuth();
  const { following } = useFollow();
  const { entries: waitlistEntries, leave: leaveWaitlist, position: wPosition, displayCount: wDisplayCount } = useWaitlist();
  const { toast } = useToast();
  const navigate = useNavigate();

  // Edit mode
  const [editing, setEditing] = useState(false);
  const [editName, setEditName] = useState(user?.name ?? "");
  const [editEmail, setEditEmail] = useState(user?.email ?? "");

  // Settings toggles
  const [notifEvents, setNotifEvents] = useState(true);
  const [notifResale, setNotifResale] = useState(true);
  const [notifTransfers, setNotifTransfers] = useState(true);
  const [notifMarketing, setNotifMarketing] = useState(false);
  const [twoFA, setTwoFA] = useState(false);
  const [biometric, setBiometric] = useState(true);

  // Paynow form
  const [paynowPhone, setPaynowPhone] = useState("");
  const [paynowName, setPaynowName] = useState("");
  const [paynowEmail, setPaynowEmail] = useState("");
  const [paynowSaved, setPaynowSaved] = useState(false);

  // Wallet
  const [walletAddress, setWalletAddress] = useState("");
  const [walletSaved, setWalletSaved] = useState(false);

  // Referral copy
  const [copied, setCopied] = useState(false);

  // Expanded settings rows
  const [expandedRow, setExpandedRow] = useState<string | null>(null);

  // Party Animals expanded
  const [expandedFriend, setExpandedFriend] = useState<string | null>(null);

  const stats = {
    upcoming: 2,
    attended: 12,
    totalSpent: 1250,
    activeListings: 1,
  };

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

  const displayName = user?.name ?? "Guest";
  const initials = displayName.split(" ").map((w: string) => w[0]).join("").toUpperCase().slice(0, 2);
  const referralCode = genReferral(displayName);

  const handleSave = () => setEditing(false);

  const handleCopyReferral = () => {
    navigator.clipboard.writeText(referralCode);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
    toast({ title: "Copied!", description: "Referral code copied to clipboard." });
  };

  const handleSignOut = () => {
    logout();
    navigate("/");
    toast({ title: "Signed out" });
  };

  const handleSavePaynow = () => {
    if (!paynowPhone.trim()) {
      toast({ title: "Required", description: "Enter your Paynow phone number.", variant: "destructive" });
      return;
    }
    setPaynowSaved(true);
    setTimeout(() => { setPaynowSaved(false); setExpandedRow(null); }, 1500);
    toast({ title: "Paynow saved" });
  };

  const handleSaveWallet = () => {
    if (!walletAddress.trim().startsWith("EQ") && !walletAddress.trim().startsWith("UQ")) {
      toast({ title: "Invalid address", description: "TON addresses start with EQ… or UQ…", variant: "destructive" });
      return;
    }
    setWalletSaved(true);
    setTimeout(() => { setWalletSaved(false); setExpandedRow(null); }, 1500);
    toast({ title: "Wallet connected" });
  };

  const toggleRow = (key: string) => setExpandedRow(prev => prev === key ? null : key);

  // Settings menu row component
  const MenuRow = ({
    icon: Icon,
    label,
    value,
    rowKey,
    danger,
    onClick,
    iconColor = "text-foreground",
    iconBg = "bg-muted",
  }: {
    icon: React.ElementType;
    label: string;
    value?: string;
    rowKey?: string;
    danger?: boolean;
    onClick?: () => void;
    iconColor?: string;
    iconBg?: string;
  }) => {
    const isExpanded = rowKey ? expandedRow === rowKey : false;
    const handleClick = onClick ?? (rowKey ? () => toggleRow(rowKey) : undefined);
    return (
      <button
        type="button"
        onClick={handleClick}
        className={`w-full flex items-center gap-3 px-4 py-3.5 transition-colors ${danger ? "hover:bg-destructive/5" : "hover:bg-muted/60"} group`}
      >
        <div className={`flex h-9 w-9 shrink-0 items-center justify-center rounded-xl ${iconBg}`}>
          <Icon className={`h-4 w-4 ${danger ? "text-destructive" : iconColor}`} />
        </div>
        <div className="flex-1 text-left min-w-0">
          <p className={`text-sm font-medium ${danger ? "text-destructive" : ""}`}>{label}</p>
          {value && <p className="text-xs text-muted-foreground truncate">{value}</p>}
        </div>
        {!danger && <ChevronRight className={`h-4 w-4 text-muted-foreground/50 transition-transform ${isExpanded ? "rotate-90" : ""}`} />}
      </button>
    );
  };

  return (
    <div className="min-h-screen bg-background">
      <Header />

      <main className="container mx-auto px-4 sm:px-6 lg:px-8 py-6">

        {/* ── Profile header ─────────────────────────────────────────── */}
        <div className="flex items-start gap-5 mb-8">
          {/* Avatar with ring */}
          <div className="relative shrink-0">
            <div className="w-[72px] h-[72px] rounded-full ring-2 ring-primary/30 ring-offset-2 ring-offset-background flex items-center justify-center bg-primary/10">
              <span className="text-2xl font-black text-primary">{initials}</span>
            </div>
          </div>

          {/* Info + edit */}
          <div className="flex-1 min-w-0">
            {editing ? (
              <div className="space-y-2 max-w-xs">
                <Input
                  value={editName}
                  onChange={e => setEditName(e.target.value)}
                  placeholder="Display name"
                  className="h-8 text-sm"
                />
                <Input
                  value={editEmail}
                  onChange={e => setEditEmail(e.target.value)}
                  placeholder="Email"
                  className="h-8 text-sm"
                />
              </div>
            ) : (
              <>
                <h1 className="text-xl font-black tracking-tight leading-tight">{displayName}</h1>
                <p className="text-sm text-muted-foreground">{user?.email}</p>
                <div className="mt-1.5 flex items-center gap-2 flex-wrap">
                  <span className="inline-flex items-center gap-1 rounded-full border border-primary/30 bg-primary/10 px-2 py-0.5 text-[11px] font-semibold text-primary">
                    🎟 Attendee
                  </span>
                  <span className="text-[11px] text-muted-foreground">Member since 2024</span>
                </div>
              </>
            )}
          </div>

          {/* Edit / Save button */}
          <button
            onClick={() => editing ? handleSave() : setEditing(true)}
            className={`shrink-0 rounded-full border px-3 py-1.5 text-xs font-semibold transition-colors ${
              editing
                ? "border-primary bg-primary text-primary-foreground"
                : "border-border text-muted-foreground hover:border-foreground/40"
            }`}
          >
            {editing ? "Save" : "Edit"}
          </button>
        </div>

        {/* ── Stats strip ────────────────────────────────────────────── */}
        <div className="mb-8 rounded-2xl border border-border/60 bg-card/60 backdrop-blur-sm overflow-hidden">
          <div className="grid grid-cols-4 divide-x divide-border/60">
            {[
              { value: stats.upcoming.toString(), label: "Upcoming", iconBg: "bg-emerald-500/10", color: "text-emerald-500" },
              { value: stats.attended.toString(), label: "Attended", iconBg: "bg-blue-500/10", color: "text-blue-500" },
              { value: `$${stats.totalSpent}`, label: "Spent", iconBg: "bg-orange-500/10", color: "text-orange-500" },
              { value: stats.activeListings.toString(), label: "Listings", iconBg: "bg-violet-500/10", color: "text-violet-500" },
            ].map((s) => (
              <div key={s.label} className="flex flex-col items-center justify-center gap-1.5 p-4">
                <div className="text-xl sm:text-2xl font-black tracking-tight">{s.value}</div>
                <div className="text-[10px] sm:text-[11px] uppercase tracking-wider text-muted-foreground text-center">{s.label}</div>
              </div>
            ))}
          </div>
        </div>

        {/* ── Following – story rings ─────────────────────────────────── */}
        {following.length > 0 && (
          <div className="mb-8">
            <div className="flex items-center justify-between mb-3">
              <h2 className="text-sm font-semibold flex items-center gap-1.5">
                <Users className="h-3.5 w-3.5 text-primary" />
                Following
              </h2>
              <span className="text-xs text-muted-foreground">{following.length} organiser{following.length !== 1 ? "s" : ""}</span>
            </div>
            <div className="flex gap-4 overflow-x-auto pb-1 -mx-1 px-1 scrollbar-none">
              {following.map((orgId) => {
                const org = MOCK_ORGANIZERS[orgId];
                if (!org) return null;
                const color = (org as any).color ?? "hsl(var(--primary))";
                const abbr = org.name.split(" ").map((w: string) => w[0]).join("").toUpperCase().slice(0, 2);
                return (
                  <button key={orgId} className="flex flex-col items-center gap-1.5 shrink-0 group">
                    <div
                      className="w-14 h-14 rounded-full flex items-center justify-center ring-2 ring-offset-2 ring-offset-background transition-transform group-hover:scale-105"
                      style={{ backgroundColor: color + "22", outline: `2.5px solid ${color}55`, outlineOffset: "3px" }}
                    >
                      <span className="text-sm font-black" style={{ color }}>{abbr}</span>
                    </div>
                    <div className="flex items-center gap-1">
                      <p className="text-[11px] font-medium text-center leading-tight max-w-[60px] truncate">{org.name.split(" ")[0]}</p>
                      {org.verified && <BadgeCheck className="h-3 w-3 text-primary shrink-0" />}
                    </div>
                  </button>
                );
              })}
            </div>
          </div>
        )}

        {/* ── Party Animals ───────────────────────────────────────────── */}
        <div className="mb-8">
          <div className="flex items-center justify-between mb-3">
            <h2 className="text-sm font-semibold">Party Animals 🎉</h2>
            <span className="text-xs text-muted-foreground">{MOCK_FRIENDS.length} friends</span>
          </div>
          <div className="space-y-2">
            {MOCK_FRIENDS.map((friend) => {
              const isExpanded = expandedFriend === friend.id;
              const abbr = friend.name.split(" ").map(w => w[0]).join("").toUpperCase();
              return (
                <div key={friend.id} className="rounded-xl border border-border/60 overflow-hidden">
                  <button
                    className="w-full flex items-center gap-3 p-3 hover:bg-muted/40 transition-colors"
                    onClick={() => setExpandedFriend(isExpanded ? null : friend.id)}
                  >
                    {/* Avatar */}
                    <div
                      className="w-10 h-10 rounded-full flex items-center justify-center shrink-0 font-black text-sm"
                      style={{ backgroundColor: friend.color + "22", color: friend.color, border: `2px solid ${friend.color}55` }}
                    >
                      {abbr}
                    </div>
                    <div className="flex-1 text-left min-w-0">
                      <p className="text-sm font-semibold">{friend.name}</p>
                      <p className="text-xs text-muted-foreground truncate">
                        {friend.events.length} event{friend.events.length !== 1 ? "s" : ""}
                        {friend.socials.length > 0 && ` · @${friend.socials[0].handle}`}
                      </p>
                    </div>
                    <div className="flex items-center gap-1.5 shrink-0">
                      {friend.events.map((ev, i) => (
                        <span
                          key={i}
                          className="h-2 w-2 rounded-full"
                          style={{ backgroundColor: friend.color }}
                        />
                      ))}
                      <ChevronRight className={`h-4 w-4 text-muted-foreground/40 transition-transform ${isExpanded ? "rotate-90" : ""}`} />
                    </div>
                  </button>

                  {isExpanded && (
                    <div className="px-3 pb-3 space-y-1.5 border-t border-border/60 pt-2.5">
                      {friend.events.map((ev, i) => (
                        <div
                          key={i}
                          className="flex items-center gap-2 rounded-lg border border-border/50 bg-muted/30 px-3 py-2 text-xs"
                        >
                          <Ticket className="h-3 w-3 shrink-0" style={{ color: friend.color }} />
                          <span className="flex-1 font-medium truncate">{ev}</span>
                          <ChevronRight className="h-3 w-3 text-muted-foreground/40" />
                        </div>
                      ))}
                      {friend.socials.length > 0 && (
                        <div className="flex items-center gap-2 pt-1">
                          {friend.socials.map(s => (
                            <span
                              key={s.platform}
                              className="inline-flex items-center gap-1 rounded-full px-2 py-0.5 text-[10px] font-semibold border"
                              style={{
                                backgroundColor: s.platform === "instagram" ? "#E1306C18" : "#1A8CD818",
                                borderColor: s.platform === "instagram" ? "#E1306C44" : "#1A8CD844",
                                color: s.platform === "instagram" ? "#E1306C" : "#1A8CD8",
                              }}
                            >
                              {s.platform === "instagram" ? <Instagram className="h-2.5 w-2.5" /> : <Twitter className="h-2.5 w-2.5" />}
                              @{s.handle}
                            </span>
                          ))}
                        </div>
                      )}
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        </div>

        {/* ── Tabs ───────────────────────────────────────────────────── */}
        <Tabs defaultValue="activity" className="space-y-6">
          <div className="overflow-x-auto -mx-1 px-1">
            <TabsList className="inline-flex w-auto min-w-full sm:grid sm:grid-cols-4 h-10">
              <TabsTrigger value="activity" className="text-[11px] sm:text-xs">Activity</TabsTrigger>
              <TabsTrigger value="waitlist" className="relative text-[11px] sm:text-xs gap-1">
                <ListOrdered className="h-3 w-3 hidden sm:block" />
                <span>Waitlist</span>
                {Object.keys(waitlistEntries).length > 0 && (
                  <span className="absolute -top-1 -right-1 flex h-4 w-4 items-center justify-center rounded-full bg-amber-500 text-[9px] font-bold text-white">
                    {Object.keys(waitlistEntries).length}
                  </span>
                )}
              </TabsTrigger>
              <TabsTrigger value="following" className="relative text-[11px] sm:text-xs gap-1">
                <Bell className="h-3 w-3 hidden sm:block" />
                <span>Following</span>
                {following.length > 0 && (
                  <span className="absolute -top-1 -right-1 flex h-4 w-4 items-center justify-center rounded-full bg-primary text-[9px] font-bold text-primary-foreground">
                    {following.length}
                  </span>
                )}
              </TabsTrigger>
              <TabsTrigger value="settings" className="text-[11px] sm:text-xs">Settings</TabsTrigger>
            </TabsList>
          </div>

          {/* ── Activity ─────────────────────────────────────────────── */}
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

          {/* ── Waitlist ──────────────────────────────────────────────── */}
          <TabsContent value="waitlist" className="space-y-4">
            {Object.keys(waitlistEntries).length === 0 ? (
              <div className="flex flex-col items-center justify-center py-16 text-center gap-4">
                <div className="flex h-16 w-16 items-center justify-center rounded-full bg-muted">
                  <ListOrdered className="h-7 w-7 text-muted-foreground" />
                </div>
                <div>
                  <p className="font-semibold text-lg">No waitlists yet</p>
                  <p className="text-sm text-muted-foreground mt-1 max-w-xs mx-auto">
                    When an event sells out, you can join the waitlist for a chance at tickets.
                  </p>
                </div>
                <Link to="/events">
                  <Button variant="outline" className="gap-2">
                    <Calendar className="h-4 w-4" />
                    Browse events
                  </Button>
                </Link>
              </div>
            ) : (
              <div className="space-y-3">
                <div className="flex items-center gap-2">
                  <ListOrdered className="h-4 w-4 text-amber-500" />
                  <h3 className="font-semibold">
                    Waiting for {Object.keys(waitlistEntries).length} event{Object.keys(waitlistEntries).length !== 1 ? "s" : ""}
                  </h3>
                </div>
                <div className="space-y-3">
                  {Object.entries(waitlistEntries).map(([eventId, entry]) => (
                    <Card key={eventId} className="border-border/60 overflow-hidden">
                      <CardContent className="p-0">
                        <div className="flex items-stretch gap-0">
                          {entry.eventImage && (
                            <div className="w-20 shrink-0 overflow-hidden">
                              <img src={entry.eventImage} alt={entry.eventTitle} className="h-full w-full object-cover" />
                            </div>
                          )}
                          <div className="flex-1 p-3 min-w-0">
                            <div className="flex items-start justify-between gap-2">
                              <div className="min-w-0">
                                <p className="font-semibold text-sm leading-snug truncate">{entry.eventTitle}</p>
                                <p className="text-xs text-muted-foreground mt-0.5">{entry.eventDate} · {entry.eventLocation}</p>
                              </div>
                              <Badge className="shrink-0 bg-amber-100 text-amber-700 dark:bg-amber-900/40 dark:text-amber-400 border-0 text-[10px]">
                                #{wPosition(eventId)}
                              </Badge>
                            </div>
                            <div className="mt-2 flex items-center justify-between">
                              <p className="text-xs text-muted-foreground">{wDisplayCount(eventId).toLocaleString()} people waiting</p>
                              <button
                                onClick={() => {
                                  leaveWaitlist(eventId);
                                  toast({ title: "Left waitlist", description: `Removed from ${entry.eventTitle} waitlist.` });
                                }}
                                className="text-xs text-destructive underline underline-offset-2 hover:opacity-80 transition-opacity"
                              >
                                Leave
                              </button>
                            </div>
                          </div>
                        </div>
                      </CardContent>
                    </Card>
                  ))}
                </div>
                <p className="text-xs text-muted-foreground text-center pt-1">You'll be notified as soon as a ticket becomes available.</p>
              </div>
            )}
          </TabsContent>

          {/* ── Following tab ─────────────────────────────────────────── */}
          <TabsContent value="following" className="space-y-4">
            {following.length === 0 ? (
              <div className="flex flex-col items-center justify-center py-16 text-center gap-4">
                <div className="flex h-16 w-16 items-center justify-center rounded-full bg-muted">
                  <Bell className="h-7 w-7 text-muted-foreground" />
                </div>
                <div>
                  <p className="font-semibold text-lg">No organisers followed yet</p>
                  <p className="text-sm text-muted-foreground mt-1 max-w-xs mx-auto">
                    Follow organisers from any event page to get notified when they post new events.
                  </p>
                </div>
                <Link to="/events">
                  <Button variant="outline" className="gap-2">
                    <Calendar className="h-4 w-4" />
                    Browse events
                  </Button>
                </Link>
              </div>
            ) : (
              <div className="space-y-3">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <Users className="h-4 w-4 text-primary" />
                    <h3 className="font-semibold">{following.length} organiser{following.length !== 1 ? "s" : ""} you follow</h3>
                  </div>
                  <Link to="/events" className="text-xs text-primary underline underline-offset-2 hover:opacity-80">
                    Browse events →
                  </Link>
                </div>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  {following.map((orgId) => {
                    const org = MOCK_ORGANIZERS[orgId];
                    if (!org) return null;
                    return (
                      <Card key={orgId} className="border-border/60">
                        <CardContent className="p-4 flex items-center gap-4">
                          <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-full bg-gradient-to-br from-primary/20 to-violet-500/20 ring-1 ring-border">
                            <span className="text-lg font-bold text-primary">{org.name.charAt(0)}</span>
                          </div>
                          <div className="flex-1 min-w-0">
                            <div className="flex items-center gap-1.5 flex-wrap">
                              <p className="font-semibold text-sm leading-tight truncate">{org.name}</p>
                              {org.verified && <BadgeCheck className="h-3.5 w-3.5 text-primary shrink-0" />}
                            </div>
                            <p className="text-xs text-muted-foreground mt-0.5">{org.category}</p>
                            <p className="text-xs text-muted-foreground">{(org.followerSeed).toLocaleString()} followers</p>
                          </div>
                          <FollowButton organizerId={orgId} variant="button" />
                        </CardContent>
                      </Card>
                    );
                  })}
                </div>
              </div>
            )}
          </TabsContent>

          {/* ── Settings ──────────────────────────────────────────────── */}
          <TabsContent value="settings" className="space-y-4">

            {/* Referral card */}
            <Card className="border-primary/20 bg-gradient-to-br from-primary/5 to-violet-500/5">
              <CardContent className="p-4">
                <div className="flex items-center gap-3">
                  <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-primary/10">
                    <Gift className="h-5 w-5 text-primary" />
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-semibold">Refer Friends</p>
                    <p className="text-xs text-muted-foreground">Share your code and earn rewards</p>
                    <div className="mt-2 flex items-center gap-2">
                      <code className="flex-1 rounded-md bg-background/80 border border-border/60 px-2.5 py-1 text-xs font-mono font-bold tracking-wider truncate">
                        {referralCode}
                      </code>
                      <button
                        onClick={handleCopyReferral}
                        className="shrink-0 flex items-center gap-1 rounded-md bg-primary text-primary-foreground px-2.5 py-1 text-xs font-semibold transition-all hover:opacity-90 active:scale-95"
                      >
                        {copied ? <Check className="h-3 w-3" /> : <Copy className="h-3 w-3" />}
                        {copied ? "Copied" : "Copy"}
                      </button>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Action menu */}
            <Card className="overflow-hidden divide-y divide-border/60">

              {/* My Tickets → vault */}
              <MenuRow
                icon={Ticket}
                label="My Tickets"
                value={`${stats.attended} total · visit Vault`}
                iconColor="text-primary"
                iconBg="bg-primary/10"
                onClick={() => navigate("/vault")}
              />

              {/* NFT Wallet */}
              <MenuRow
                icon={Cpu}
                label="NFT Wallet"
                value={walletAddress ? walletAddress.slice(0, 10) + "…" : "TON Blockchain · not linked"}
                rowKey="wallet"
                iconColor="text-violet-500"
                iconBg="bg-violet-500/10"
              />
              {expandedRow === "wallet" && (
                <div className="px-4 pb-4 pt-3 bg-muted/30 space-y-3">
                  <p className="text-xs text-muted-foreground">Connect your TON wallet to receive NFT tickets directly. Addresses start with EQ… or UQ…</p>
                  <div className="space-y-1.5">
                    <Label className="text-xs">Wallet Address</Label>
                    <Input placeholder="EQx…" value={walletAddress} onChange={e => setWalletAddress(e.target.value)} className="h-8 text-sm font-mono" />
                  </div>
                  <div className="flex gap-2">
                    {walletSaved
                      ? <div className="flex items-center gap-1.5 text-sm text-emerald-500 font-semibold"><CheckCircle className="h-4 w-4" /> Connected!</div>
                      : <Button size="sm" onClick={handleSaveWallet} className="h-8">Connect Wallet</Button>
                    }
                    <Button size="sm" variant="ghost" onClick={() => setExpandedRow(null)} className="h-8">Cancel</Button>
                  </div>
                </div>
              )}

              {/* Notifications */}
              <MenuRow
                icon={Bell}
                label="Notifications"
                value={`${[notifEvents, notifResale, notifTransfers, notifMarketing].filter(Boolean).length} active`}
                rowKey="notif"
                iconColor="text-amber-500"
                iconBg="bg-amber-500/10"
              />
              {expandedRow === "notif" && (
                <div className="px-4 pb-4 pt-3 bg-muted/30 space-y-3">
                  {[
                    { label: "New events from followed organisers", value: notifEvents, set: setNotifEvents },
                    { label: "Resale & price drop alerts", value: notifResale, set: setNotifResale },
                    { label: "Ticket transfers", value: notifTransfers, set: setNotifTransfers },
                    { label: "Marketing & promos", value: notifMarketing, set: setNotifMarketing },
                  ].map(item => (
                    <div key={item.label} className="flex items-center justify-between gap-3">
                      <Label className="text-xs font-normal cursor-pointer">{item.label}</Label>
                      <Switch checked={item.value} onCheckedChange={item.set} />
                    </div>
                  ))}
                </div>
              )}

              {/* Security */}
              <MenuRow
                icon={Shield}
                label="Security"
                value={`2FA: ${twoFA ? "On" : "Off"} · Biometric: ${biometric ? "On" : "Off"}`}
                rowKey="security"
                iconColor="text-emerald-500"
                iconBg="bg-emerald-500/10"
              />
              {expandedRow === "security" && (
                <div className="px-4 pb-4 pt-3 bg-muted/30 space-y-3">
                  <div className="flex items-center justify-between gap-3">
                    <Label className="text-xs font-normal cursor-pointer">Two-factor authentication (2FA)</Label>
                    <Switch checked={twoFA} onCheckedChange={setTwoFA} />
                  </div>
                  <div className="flex items-center justify-between gap-3">
                    <Label className="text-xs font-normal cursor-pointer">Biometric login</Label>
                    <Switch checked={biometric} onCheckedChange={setBiometric} />
                  </div>
                </div>
              )}

              {/* Paynow */}
              <MenuRow
                icon={CreditCard}
                label="Paynow"
                value={paynowPhone ? paynowPhone : "Not linked"}
                rowKey="paynow"
                iconColor="text-blue-500"
                iconBg="bg-blue-500/10"
              />
              {expandedRow === "paynow" && (
                <div className="px-4 pb-4 pt-3 bg-muted/30 space-y-3">
                  <p className="text-xs text-muted-foreground">Add your Paynow details for faster purchases and resale withdrawals.</p>
                  <div className="space-y-1.5">
                    <Label className="text-xs">Phone Number</Label>
                    <Input placeholder="e.g. 0771234567" value={paynowPhone} onChange={e => setPaynowPhone(e.target.value)} className="h-8 text-sm" />
                  </div>
                  <div className="space-y-1.5">
                    <Label className="text-xs">Account Holder Name</Label>
                    <Input placeholder="Your full name as registered" value={paynowName} onChange={e => setPaynowName(e.target.value)} className="h-8 text-sm" />
                  </div>
                  <div className="space-y-1.5">
                    <Label className="text-xs">Email (optional)</Label>
                    <Input type="email" placeholder="email@example.com" value={paynowEmail} onChange={e => setPaynowEmail(e.target.value)} className="h-8 text-sm" />
                  </div>
                  <div className="flex gap-2">
                    {paynowSaved
                      ? <div className="flex items-center gap-1.5 text-sm text-emerald-500 font-semibold"><CheckCircle className="h-4 w-4" /> Saved!</div>
                      : <Button size="sm" onClick={handleSavePaynow} className="h-8">Save Details</Button>
                    }
                    <Button size="sm" variant="ghost" onClick={() => setExpandedRow(null)} className="h-8">Cancel</Button>
                  </div>
                </div>
              )}

              {/* Account settings */}
              <MenuRow
                icon={Pencil}
                label="Account Details"
                value={`${user?.name ?? ""} · ${user?.email ?? ""}`}
                rowKey="account"
                iconBg="bg-muted"
                iconColor="text-foreground"
              />
              {expandedRow === "account" && (
                <div className="px-4 pb-4 pt-3 bg-muted/30 space-y-3">
                  <div className="space-y-1.5">
                    <Label className="text-xs">Full Name</Label>
                    <Input defaultValue={user?.name} className="h-8 text-sm" />
                  </div>
                  <div className="space-y-1.5">
                    <Label className="text-xs">Email</Label>
                    <Input defaultValue={user?.email} disabled className="h-8 text-sm opacity-60" />
                  </div>
                  <Button size="sm" className="h-8">Save Changes</Button>
                </div>
              )}

              {/* Help */}
              <MenuRow
                icon={HelpCircle}
                label="Help & Support"
                value="FAQs, contact us"
                iconBg="bg-muted"
                iconColor="text-foreground"
                rowKey="help"
              />
              {expandedRow === "help" && (
                <div className="px-4 pb-4 pt-3 bg-muted/30 space-y-2 text-sm text-muted-foreground">
                  <p>📧 support@tick3t.app</p>
                  <p>💬 Live chat available Mon–Fri, 9am–6pm CAT</p>
                  <p>🔗 <a href="#" className="text-primary underline underline-offset-2">Help Center</a></p>
                </div>
              )}
            </Card>

            {/* Wallet row for TON info */}
            <Card className="overflow-hidden border-border/60">
              <div className="px-4 py-3 flex items-center gap-2">
                <Wallet className="h-4 w-4 text-muted-foreground" />
                <p className="text-xs text-muted-foreground flex-1">Your payment details are encrypted and only used for ticket purchases and resale payouts.</p>
              </div>
            </Card>

            {/* Sign out */}
            <Card className="overflow-hidden">
              <MenuRow
                icon={LogOut}
                label="Sign Out"
                danger
                onClick={handleSignOut}
              />
            </Card>
          </TabsContent>
        </Tabs>
      </main>

      <Footer />
    </div>
  );
};

export default UserDashboard;
