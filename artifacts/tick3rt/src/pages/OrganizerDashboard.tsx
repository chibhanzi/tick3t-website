import Header from "@/components/Header";
import Footer from "@/components/Footer";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { useAuth } from "@/contexts/AuthContext";
import { ExternalLink, ListOrdered, TrendingUp, Lightbulb } from "lucide-react";
import OrganizerProfileCard from "@/components/organizer/OrganizerProfileCard";
import { useSearchParams } from "react-router-dom";
import { useTheme } from "next-themes";
import DashboardStats from "@/components/organizer/DashboardStats";
import DraftEventBanner from "@/components/DraftEventBanner";
import RecentEvents from "@/components/organizer/RecentEvents";
import QuickAnalytics from "@/components/organizer/QuickAnalytics";
import AnalyticsSummaryStats from "@/components/organizer/AnalyticsSummaryStats";
import AudienceSnapshot from "@/components/organizer/AudienceSnapshot";
import MobileAnalyticsDashboard from "@/components/organizer/MobileAnalyticsDashboard";
import EventManagement from "@/components/organizer/EventManagement";
import AttendeeManagement from "@/components/organizer/AttendeeManagement";
import RevenuePayouts from "@/components/organizer/RevenuePayouts";
import OrganizerSettings from "@/components/organizer/OrganizerSettings";
import vouchLight from "@/assets/vouch_light.png";
import vouchDark from "@/assets/vouch_dark.png";

const OrganizerDashboard = () => {
  const { user } = useAuth();
  const { theme } = useTheme();
  const [searchParams] = useSearchParams();
  // When arriving via a share deep-link (?tab=events&event=<id>), land on the right tab
  const defaultTab = searchParams.get("tab") ?? "overview";

  const stats = {
    totalEvents: 15,
    activeEvents: 3,
    totalTicketsSold: 2847,
    totalRevenue: 142350,
    monthlyGrowth: 12.5,
    totalFollowers: 1247,
  };

  const vouchLogo = theme === "dark" ? vouchDark : vouchLight;

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-50 dark:from-slate-950 dark:via-slate-900 dark:to-slate-800">
      <Header />
      
      <main className="container mx-auto px-4 sm:px-6 lg:px-8 py-6 md:py-8">
        <OrganizerProfileCard
          name={user?.name || "Organiser"}
          email={user?.email || ""}
          stats={{
            totalFollowers: stats.totalFollowers,
            totalEvents: stats.totalEvents,
            totalTicketsSold: stats.totalTicketsSold,
          }}
        />

        <div className="mb-6 md:mb-8">
          <DraftEventBanner />
          <DashboardStats stats={stats} />
        </div>

        <Tabs defaultValue={defaultTab} className="space-y-6">
          <div className="overflow-x-auto -mx-4 px-4">
            <TabsList className="inline-flex w-auto min-w-full sm:grid sm:grid-cols-7 text-xs">
              <TabsTrigger value="overview">Overview</TabsTrigger>
              <TabsTrigger value="events">Events</TabsTrigger>
              <TabsTrigger value="attendees">Attendees</TabsTrigger>
              <TabsTrigger value="revenue">Revenue</TabsTrigger>
              <TabsTrigger value="analytics">Analytics</TabsTrigger>
              <TabsTrigger value="settings">Settings</TabsTrigger>
            </TabsList>
          </div>

          <TabsContent value="overview" className="space-y-6">
            {/* Animated stat row + 30-day sparkline */}
            <AnalyticsSummaryStats />

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              <RecentEvents />
              <QuickAnalytics />
            </div>

            {/* Waitlist Demand — social proof + nudge card */}
            {(() => {
              const waitlistEvents = [
                { id: "w1", title: "Digital Art Rave", date: "Mar 22", count: 287, trend: "+34 this week" },
                { id: "w2", title: "Bass Drop After-Party", date: "Apr 5", count: 64, trend: "+8 today" },
              ];
              return (
                <Card className="border-amber-200/60 dark:border-amber-900/60 bg-amber-50/40 dark:bg-amber-950/20">
                  <CardHeader className="pb-3">
                    <CardTitle className="text-base flex items-center gap-2">
                      <ListOrdered className="h-4 w-4 text-amber-500" />
                      Waitlist Demand
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-3">
                    {waitlistEvents.map((ev) => (
                      <div key={ev.id} className="flex items-center justify-between gap-3 p-3 rounded-lg bg-background/70 border border-border/50">
                        <div className="min-w-0">
                          <p className="font-medium text-sm truncate">{ev.title}</p>
                          <p className="text-xs text-muted-foreground">{ev.date}</p>
                        </div>
                        <div className="text-right shrink-0">
                          <p className="font-bold text-sm text-amber-600 dark:text-amber-400">
                            {ev.count.toLocaleString()} waiting
                          </p>
                          <p className="text-[10px] text-muted-foreground flex items-center gap-0.5 justify-end">
                            <TrendingUp className="h-2.5 w-2.5 text-emerald-500" />{ev.trend}
                          </p>
                        </div>
                      </div>
                    ))}
                    <div className="flex items-start gap-2 pt-1 text-xs text-muted-foreground">
                      <Lightbulb className="h-3.5 w-3.5 text-amber-500 shrink-0 mt-0.5" />
                      <p>
                        High demand detected — consider{" "}
                        <button className="underline underline-offset-2 text-foreground hover:text-primary transition-colors font-medium">
                          adding capacity
                        </button>{" "}
                        or scheduling a follow-up event.
                      </p>
                    </div>
                  </CardContent>
                </Card>
              );
            })()}

            {/* Vouch Scanner Integration Card */}
            <Card className="border-border/50">
              <CardHeader className="pb-3">
                <CardTitle className="text-base flex items-center gap-2">
                  Check-in Scanner
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="flex flex-col sm:flex-row items-center gap-4">
                  <img src={vouchLogo} alt="Vouch" className="h-10 w-auto" />
                  <div className="flex-1 text-center sm:text-left">
                    <p className="text-sm font-medium">Powered by Vouch</p>
                    <p className="text-xs text-muted-foreground">
                      Use the Vouch app to scan and validate tickets at your events. Fast, reliable, and works offline.
                    </p>
                  </div>
                  <Button variant="outline" size="sm" className="shrink-0">
                    <ExternalLink className="h-3 w-3 mr-1" />
                    Open Vouch
                  </Button>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="events">
            <EventManagement />
          </TabsContent>

          <TabsContent value="attendees">
            <AttendeeManagement />
          </TabsContent>


          <TabsContent value="revenue">
            <RevenuePayouts />
          </TabsContent>

          <TabsContent value="analytics" className="space-y-6">
            <MobileAnalyticsDashboard />
            {/* Audience snapshot — tier split donut + referral sources */}
            <AudienceSnapshot />
          </TabsContent>

          <TabsContent value="settings">
            <OrganizerSettings />
          </TabsContent>
        </Tabs>
      </main>

      <Footer />
    </div>
  );
};

export default OrganizerDashboard;
