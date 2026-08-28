import { useState } from "react";
import { Link } from "react-router-dom";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import {
  Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle,
} from "@/components/ui/dialog";
import { useAuth } from "@/contexts/AuthContext";
import { useFollow } from "@/contexts/FollowContext";
import { useWaitlist } from "@/contexts/WaitlistContext";
import { useToast } from "@/hooks/use-toast";
import { MOCK_ORGANIZERS } from "@/data/mockOrganizers";
import FollowButton from "@/components/FollowButton";
import {
  Calendar, BadgeCheck, Users, ListOrdered, MapPin,
  ChevronRight, Ticket, Instagram, Twitter,
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

const UserDashboard = () => {
  const { user } = useAuth();
  const { following } = useFollow();
  const { entries: waitlistEntries, leave: leaveWaitlist, position: wPosition, displayCount: wDisplayCount } = useWaitlist();
  const { toast } = useToast();

  const [editing, setEditing] = useState(false);
  const [editName, setEditName] = useState(user?.name ?? "");
  const [expandedFriend, setExpandedFriend] = useState<string | null>(null);
  const [selectedOrganizerId, setSelectedOrganizerId] = useState<string | null>(null);
  const selectedOrganizer = selectedOrganizerId ? MOCK_ORGANIZERS[selectedOrganizerId] : null;

  const displayName = user?.name ?? "Guest";
  const initials = displayName.split(" ").map((w: string) => w[0]).join("").toUpperCase().slice(0, 2);
  const followedOrganizers = following
    .map((orgId) => MOCK_ORGANIZERS[orgId])
    .filter((org): org is (typeof MOCK_ORGANIZERS)[string] => Boolean(org));

  return (
    <div className="min-h-screen bg-background">
      <Header />

      <main className="container mx-auto px-4 sm:px-6 lg:px-8 py-6">

        {/* ── Profile header ─────────────────────────────────────────── */}
        <div className="flex items-start gap-5 mb-8">
          <div className="relative shrink-0">
            <div className="w-[72px] h-[72px] rounded-full ring-2 ring-primary/30 ring-offset-2 ring-offset-background flex items-center justify-center bg-primary/10">
              <span className="text-2xl font-black text-primary">{initials}</span>
            </div>
          </div>

          <div className="flex-1 min-w-0">
            {editing ? (
              <div className="space-y-2 max-w-xs">
                <Input
                  value={editName}
                  onChange={e => setEditName(e.target.value)}
                  placeholder="Display name"
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

          <button
            onClick={() => setEditing(v => !v)}
            className={`shrink-0 rounded-full border px-3 py-1.5 text-xs font-semibold transition-colors ${
              editing
                ? "border-primary bg-primary text-primary-foreground"
                : "border-border text-muted-foreground hover:border-foreground/40"
            }`}
          >
            {editing ? "Save" : "Edit"}
          </button>
        </div>

        {/* ── Following – story rings ─────────────────────────────────── */}
        <div className="mb-8">
          <div className="flex items-center justify-between mb-3">
            <h2 className="text-sm font-semibold flex items-center gap-1.5">
              <Users className="h-3.5 w-3.5 text-primary" />
              Following
            </h2>
            {followedOrganizers.length > 0 && (
              <span className="text-xs text-muted-foreground">
                {followedOrganizers.length} organiser{followedOrganizers.length !== 1 ? "s" : ""}
              </span>
            )}
          </div>
          {followedOrganizers.length > 0 ? (
            <div className="flex gap-4 overflow-x-auto pb-1 -mx-1 px-1 scrollbar-none">
              {followedOrganizers.map((org) => {
                const color = (org as any).color ?? "hsl(var(--primary))";
                const abbr = org.name.split(" ").map((w: string) => w[0]).join("").toUpperCase().slice(0, 2);
                return (
                  <button
                    key={orgId}
                    type="button"
                    onClick={() => setSelectedOrganizerId(orgId)}
                    className="flex flex-col items-center gap-1.5 shrink-0 group"
                    aria-label={`View ${org.name}`}
                  >
                    <div
                      className="w-14 h-14 rounded-full flex items-center justify-center transition-transform group-hover:scale-105"
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
          ) : (
            <div className="flex items-center gap-3 rounded-xl border border-dashed border-border/70 bg-muted/20 p-4">
              <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-primary/10">
                <Users className="h-4 w-4 text-primary" />
              </div>
              <div className="min-w-0 flex-1">
                <p className="text-sm font-medium">Build your event feed</p>
                <p className="mt-0.5 text-xs text-muted-foreground">
                  Follow organisers to see their latest events and updates here.
                </p>
              </div>
              <Button asChild variant="outline" size="sm" className="shrink-0">
                <Link to="/events">Browse events</Link>
              </Button>
            </div>
          )}
        </div>

        <Dialog open={!!selectedOrganizer} onOpenChange={(open) => !open && setSelectedOrganizerId(null)}>
          <DialogContent className="sm:max-w-lg overflow-hidden p-0">
            {selectedOrganizer && (
              <>
                <div className="h-28 bg-gradient-to-br from-primary/80 via-violet-500/70 to-fuchsia-500/70" />
                <div className="px-6 pb-6">
                  <div className="-mt-9 mb-4 flex items-end justify-between gap-4">
                    <div className="flex h-20 w-20 items-center justify-center rounded-full border-4 border-background bg-primary/10 text-xl font-black text-primary">
                      {selectedOrganizer.name.split(" ").map((word) => word[0]).join("").slice(0, 2)}
                    </div>
                    <FollowButton organizerId={selectedOrganizer.id} />
                  </div>
                  <DialogHeader className="text-left">
                    <DialogTitle className="flex items-center gap-1.5">
                      {selectedOrganizer.name}
                      {selectedOrganizer.verified && <BadgeCheck className="h-4 w-4 text-primary" />}
                    </DialogTitle>
                    <DialogDescription>
                      {selectedOrganizer.category} organiser creating memorable live experiences.
                    </DialogDescription>
                  </DialogHeader>
                  <div className="mt-5 grid grid-cols-2 gap-3">
                    <div className="rounded-xl border border-border/60 bg-muted/30 p-3">
                      <p className="text-xl font-bold">{selectedOrganizer.followerSeed.toLocaleString()}</p>
                      <p className="text-xs text-muted-foreground">Followers</p>
                    </div>
                    <div className="rounded-xl border border-border/60 bg-muted/30 p-3">
                      <p className="text-xl font-bold">3</p>
                      <p className="text-xs text-muted-foreground">Upcoming events</p>
                    </div>
                  </div>
                  <div className="mt-5">
                    <p className="mb-2 text-xs font-semibold uppercase tracking-wider text-muted-foreground">Next event</p>
                    <div className="rounded-xl border border-border/60 p-4">
                      <p className="font-semibold">{selectedOrganizer.category} Live 2026</p>
                      <div className="mt-2 flex flex-wrap gap-3 text-xs text-muted-foreground">
                        <span className="inline-flex items-center gap-1"><Calendar className="h-3 w-3" /> Sep 18, 2026</span>
                        <span className="inline-flex items-center gap-1"><MapPin className="h-3 w-3" /> Harare</span>
                      </div>
                    </div>
                  </div>
                </div>
              </>
            )}
          </DialogContent>
        </Dialog>

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
                      {friend.events.map((_, i) => (
                        <span key={i} className="h-2 w-2 rounded-full" style={{ backgroundColor: friend.color }} />
                      ))}
                      <ChevronRight className={`h-4 w-4 text-muted-foreground/40 transition-transform ${isExpanded ? "rotate-90" : ""}`} />
                    </div>
                  </button>

                  {isExpanded && (
                    <div className="px-3 pb-3 space-y-1.5 border-t border-border/60 pt-2.5">
                      {friend.events.map((ev, i) => (
                        <div key={i} className="flex items-center gap-2 rounded-lg border border-border/50 bg-muted/30 px-3 py-2 text-xs">
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

        {/* ── Waitlist ───────────────────────────────────────────────── */}
        <div className="mb-8">
          <div className="flex items-center justify-between mb-3">
            <h2 className="text-sm font-semibold flex items-center gap-1.5">
              <ListOrdered className="h-3.5 w-3.5 text-amber-500" />
              Waitlist
              {Object.keys(waitlistEntries).length > 0 && (
                <span className="flex h-4 w-4 items-center justify-center rounded-full bg-amber-500 text-[9px] font-bold text-white">
                  {Object.keys(waitlistEntries).length}
                </span>
              )}
            </h2>
            {Object.keys(waitlistEntries).length > 0 && (
              <span className="text-xs text-muted-foreground">
                {Object.keys(waitlistEntries).length} event{Object.keys(waitlistEntries).length !== 1 ? "s" : ""}
              </span>
            )}
          </div>

          {Object.keys(waitlistEntries).length === 0 ? (
            <div className="rounded-xl border border-border/60 border-dashed p-8 text-center">
              <div className="flex h-12 w-12 items-center justify-center rounded-full bg-muted mx-auto mb-3">
                <ListOrdered className="h-5 w-5 text-muted-foreground" />
              </div>
              <p className="font-semibold text-sm">No waitlists yet</p>
              <p className="text-xs text-muted-foreground mt-1 mb-4 max-w-xs mx-auto">
                When an event sells out, join the waitlist for a chance at tickets.
              </p>
              <Link to="/events">
                <Button variant="outline" size="sm" className="gap-2">
                  <Calendar className="h-3.5 w-3.5" />
                  Browse events
                </Button>
              </Link>
            </div>
          ) : (
            <div className="space-y-2">
              {Object.entries(waitlistEntries).map(([eventId, entry]) => (
                <Card key={eventId} className="border-border/60 overflow-hidden">
                  <CardContent className="p-0">
                    <div className="flex items-stretch">
                      {entry.eventImage && (
                        <div className="w-16 shrink-0 overflow-hidden">
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
                          <p className="text-xs text-muted-foreground">{wDisplayCount(eventId).toLocaleString()} waiting</p>
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
              <p className="text-xs text-muted-foreground text-center pt-1">
                You'll be notified as soon as a ticket becomes available.
              </p>
            </div>
          )}
        </div>

      </main>

      <Footer />
    </div>
  );
};

export default UserDashboard;
