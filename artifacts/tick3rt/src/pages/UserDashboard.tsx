
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
import { useFollow } from "@/contexts/FollowContext";
import { useWaitlist } from "@/contexts/WaitlistContext";
import { useToast } from "@/hooks/use-toast";
import { MOCK_ORGANIZERS } from "@/data/mockOrganizers";
import FollowButton from "@/components/FollowButton";
import {
  Calendar, Camera, Wallet, DollarSign, TrendingUp, Clock,
  BadgeCheck, Bell, Users, ListOrdered,
} from "lucide-react";

const UserDashboard = () => {
  const { user } = useAuth();
  const { following } = useFollow();
  const { entries: waitlistEntries, leave: leaveWaitlist, position: wPosition, displayCount: wDisplayCount } = useWaitlist();
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

  const stats = { eventsAttended: 12, upcoming: 2, totalSpent: 1250, resaleEarnings: 320 };

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
          {/* Waitlist tab */}
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
                          {/* Thumbnail */}
                          {entry.eventImage && (
                            <div className="w-20 shrink-0 overflow-hidden">
                              <img
                                src={entry.eventImage}
                                alt={entry.eventTitle}
                                className="h-full w-full object-cover"
                              />
                            </div>
                          )}
                          {/* Info */}
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
                              <p className="text-xs text-muted-foreground">
                                {wDisplayCount(eventId).toLocaleString()} people waiting
                              </p>
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
                <p className="text-xs text-muted-foreground text-center pt-1">
                  You'll be notified as soon as a ticket becomes available.
                </p>
              </div>
            )}
          </TabsContent>

          {/* Following tab */}
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
                    <h3 className="font-semibold">
                      {following.length} organiser{following.length !== 1 ? "s" : ""} you follow
                    </h3>
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
                          {/* Avatar */}
                          <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-full bg-gradient-to-br from-primary/20 to-violet-500/20 ring-1 ring-border">
                            <span className="text-lg font-bold text-primary">
                              {org.name.charAt(0)}
                            </span>
                          </div>
                          {/* Info */}
                          <div className="flex-1 min-w-0">
                            <div className="flex items-center gap-1.5 flex-wrap">
                              <p className="font-semibold text-sm leading-tight truncate">{org.name}</p>
                              {org.verified && (
                                <BadgeCheck className="h-3.5 w-3.5 text-primary shrink-0" />
                              )}
                            </div>
                            <p className="text-xs text-muted-foreground mt-0.5">{org.category}</p>
                            <p className="text-xs text-muted-foreground">
                              {(org.followerSeed).toLocaleString()} followers
                            </p>
                          </div>
                          {/* Unfollow */}
                          <FollowButton organizerId={orgId} variant="button" />
                        </CardContent>
                      </Card>
                    );
                  })}
                </div>
              </div>
            )}
          </TabsContent>

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
