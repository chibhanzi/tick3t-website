import Header from "@/components/Header";
import Footer from "@/components/Footer";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { useAuth } from "@/contexts/AuthContext";
import { Plus, ExternalLink } from "lucide-react";
import { Link } from "react-router-dom";
import { useTheme } from "next-themes";
import DashboardStats from "@/components/organizer/DashboardStats";
import RecentEvents from "@/components/organizer/RecentEvents";
import QuickAnalytics from "@/components/organizer/QuickAnalytics";
import MobileAnalyticsDashboard from "@/components/organizer/MobileAnalyticsDashboard";
import EventManagement from "@/components/organizer/EventManagement";
import AttendeeManagement from "@/components/organizer/AttendeeManagement";
import TicketDesignManager from "@/components/organizer/TicketDesignManager";
import RevenuePayouts from "@/components/organizer/RevenuePayouts";
import OrganizerSettings from "@/components/organizer/OrganizerSettings";
import vouchLight from "@/assets/vouch_light.png";
import vouchDark from "@/assets/vouch_dark.png";

const OrganizerDashboard = () => {
  const { user } = useAuth();
  const { theme } = useTheme();

  const stats = {
    totalEvents: 15,
    activeEvents: 3,
    totalTicketsSold: 2847,
    totalRevenue: 142350,
    monthlyGrowth: 12.5
  };

  const vouchLogo = theme === "dark" ? vouchDark : vouchLight;

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-50 dark:from-slate-950 dark:via-slate-900 dark:to-slate-800">
      <Header />
      
      <main className="container mx-auto px-4 sm:px-6 lg:px-8 py-6 md:py-8">
        <div className="mb-6 md:mb-8">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between mb-6 gap-4">
            <div>
              <h1 className="text-2xl md:text-3xl font-bold bg-gradient-to-r from-blue-600 to-indigo-600 bg-clip-text text-transparent">
                Organizer Dashboard
              </h1>
              <p className="text-muted-foreground text-sm md:text-base">
                Welcome back, {user?.name || "Organizer"}! Here's your event overview.
              </p>
            </div>
            <Button asChild className="bg-gradient-to-r from-blue-500 to-indigo-500 hover:from-blue-600 hover:to-indigo-600">
              <Link to="/create-event">
                <Plus className="h-4 w-4 mr-2" />
                Create Event
              </Link>
            </Button>
          </div>

          <DashboardStats stats={stats} />
        </div>

        <Tabs defaultValue="overview" className="space-y-6">
          <div className="overflow-x-auto -mx-4 px-4">
            <TabsList className="inline-flex w-auto min-w-full sm:grid sm:grid-cols-7 text-xs">
              <TabsTrigger value="overview">Overview</TabsTrigger>
              <TabsTrigger value="events">Events</TabsTrigger>
              <TabsTrigger value="attendees">Attendees</TabsTrigger>
              <TabsTrigger value="tickets">Ticket Design</TabsTrigger>
              <TabsTrigger value="revenue">Revenue</TabsTrigger>
              <TabsTrigger value="analytics">Analytics</TabsTrigger>
              <TabsTrigger value="settings">Settings</TabsTrigger>
            </TabsList>
          </div>

          <TabsContent value="overview" className="space-y-6">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              <RecentEvents />
              <QuickAnalytics />
            </div>

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

          <TabsContent value="tickets">
            <TicketDesignManager />
          </TabsContent>

          <TabsContent value="revenue">
            <RevenuePayouts />
          </TabsContent>

          <TabsContent value="analytics" className="space-y-6">
            <MobileAnalyticsDashboard />
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
