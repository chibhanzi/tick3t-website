
import { useState } from "react";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { useAuth } from "@/contexts/AuthContext";
import { Plus } from "lucide-react";
import { Link } from "react-router-dom";
import DashboardStats from "@/components/organizer/DashboardStats";
import RecentEvents from "@/components/organizer/RecentEvents";
import QuickAnalytics from "@/components/organizer/QuickAnalytics";
import MobileAnalyticsDashboard from "@/components/organizer/MobileAnalyticsDashboard";
import EventPerformanceTable from "@/components/analytics/EventPerformanceTable";
import OrganizerSettings from "@/components/organizer/OrganizerSettings";

const OrganizerDashboard = () => {
  const { user } = useAuth();

  const stats = {
    totalEvents: 15,
    activeEvents: 3,
    totalTicketsSold: 2847,
    totalRevenue: 142350,
    monthlyGrowth: 12.5
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-50 dark:from-slate-950 dark:via-slate-900 dark:to-slate-800">
      <Header />
      
      <main className="container mx-auto px-4 sm:px-6 lg:px-8 py-6 md:py-8">
        <div className="mb-6 md:mb-8">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between mb-6 gap-4">
            <div>
              <h1 className="text-2xl md:text-3xl font-bold bg-gradient-to-r from-blue-600 to-indigo-600 bg-clip-text text-transparent">
                Organizer Dashboard 📊
              </h1>
              <p className="text-muted-foreground text-sm md:text-base">
                Welcome back, {user?.name}! Here's your event overview.
              </p>
            </div>
            <Button asChild className="bg-gradient-to-r from-blue-500 to-indigo-500 hover:from-blue-600 hover:to-indigo-600">
              <Link to="/create-event">
                <Plus className="h-4 w-4 mr-2" />
                Create New Event
              </Link>
            </Button>
          </div>

          <DashboardStats stats={stats} />
        </div>

        <Tabs defaultValue="overview" className="space-y-6">
          <TabsList className="grid w-full grid-cols-5 text-xs md:text-sm">
            <TabsTrigger value="overview">Overview</TabsTrigger>
            <TabsTrigger value="events">Events</TabsTrigger>
            <TabsTrigger value="analytics">Analytics</TabsTrigger>
            <TabsTrigger value="insights">Insights</TabsTrigger>
            <TabsTrigger value="settings">Settings</TabsTrigger>
          </TabsList>

          <TabsContent value="overview" className="space-y-6">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              <RecentEvents />
              <QuickAnalytics />
            </div>
          </TabsContent>

          <TabsContent value="events">
            <Card>
              <CardHeader>
                <CardTitle>Event Management</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-muted-foreground mb-4">Manage all your events, tickets, and attendees</p>
                <div className="flex flex-col sm:flex-row gap-2">
                  <Button asChild>
                    <Link to="/create-event">Create New Event</Link>
                  </Button>
                  <Button variant="outline">View All Events</Button>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="analytics" className="space-y-6">
            <MobileAnalyticsDashboard />
          </TabsContent>

          <TabsContent value="insights">
            <EventPerformanceTable />
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
