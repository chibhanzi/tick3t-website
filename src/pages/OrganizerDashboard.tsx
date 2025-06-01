
import { useState } from "react";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { useAuth } from "@/contexts/AuthContext";
import { Calendar, Users, DollarSign, TrendingUp, Plus, BarChart3, Eye, Settings } from "lucide-react";
import { Link } from "react-router-dom";
import AnalyticsKPIs from "@/components/analytics/AnalyticsKPIs";
import RevenueChart from "@/components/analytics/RevenueChart";
import TicketSalesChart from "@/components/analytics/TicketSalesChart";
import AudienceInsights from "@/components/analytics/AudienceInsights";
import EventPerformanceTable from "@/components/analytics/EventPerformanceTable";

const OrganizerDashboard = () => {
  const { user } = useAuth();

  const stats = {
    totalEvents: 15,
    activeEvents: 3,
    totalTicketsSold: 2847,
    totalRevenue: 142350,
    monthlyGrowth: 12.5
  };

  const recentEvents = [
    {
      id: "1",
      title: "Tech Innovation Summit",
      date: "March 25, 2024",
      ticketsSold: 450,
      revenue: 22500,
      status: "active"
    },
    {
      id: "2",
      title: "Digital Marketing Workshop",
      date: "April 15, 2024",
      ticketsSold: 120,
      revenue: 6000,
      status: "draft"
    }
  ];

  const analytics = {
    topSellingEvent: "Tech Innovation Summit",
    averageTicketPrice: 85,
    conversionRate: 3.2,
    returnCustomers: 35
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-50 dark:from-slate-950 dark:via-slate-900 dark:to-slate-800">
      <Header />
      
      <main className="container mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="mb-8">
          <div className="flex items-center justify-between mb-6">
            <div>
              <h1 className="text-3xl font-bold bg-gradient-to-r from-blue-600 to-indigo-600 bg-clip-text text-transparent">
                Organizer Dashboard 📊
              </h1>
              <p className="text-muted-foreground">
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

          <div className="grid grid-cols-2 md:grid-cols-5 gap-4 mb-8">
            <Card>
              <CardContent className="p-4 text-center">
                <Calendar className="h-8 w-8 text-blue-500 mx-auto mb-2" />
                <div className="text-2xl font-bold">{stats.totalEvents}</div>
                <div className="text-sm text-muted-foreground">Total Events</div>
              </CardContent>
            </Card>
            <Card>
              <CardContent className="p-4 text-center">
                <Eye className="h-8 w-8 text-green-500 mx-auto mb-2" />
                <div className="text-2xl font-bold">{stats.activeEvents}</div>
                <div className="text-sm text-muted-foreground">Active Events</div>
              </CardContent>
            </Card>
            <Card>
              <CardContent className="p-4 text-center">
                <Users className="h-8 w-8 text-purple-500 mx-auto mb-2" />
                <div className="text-2xl font-bold">{stats.totalTicketsSold.toLocaleString()}</div>
                <div className="text-sm text-muted-foreground">Tickets Sold</div>
              </CardContent>
            </Card>
            <Card>
              <CardContent className="p-4 text-center">
                <DollarSign className="h-8 w-8 text-emerald-500 mx-auto mb-2" />
                <div className="text-2xl font-bold">${stats.totalRevenue.toLocaleString()}</div>
                <div className="text-sm text-muted-foreground">Total Revenue</div>
              </CardContent>
            </Card>
            <Card>
              <CardContent className="p-4 text-center">
                <TrendingUp className="h-8 w-8 text-orange-500 mx-auto mb-2" />
                <div className="text-2xl font-bold">+{stats.monthlyGrowth}%</div>
                <div className="text-sm text-muted-foreground">Monthly Growth</div>
              </CardContent>
            </Card>
          </div>
        </div>

        <Tabs defaultValue="overview" className="space-y-6">
          <TabsList className="grid w-full grid-cols-5">
            <TabsTrigger value="overview">Overview</TabsTrigger>
            <TabsTrigger value="events">My Events</TabsTrigger>
            <TabsTrigger value="analytics">Analytics</TabsTrigger>
            <TabsTrigger value="insights">Insights</TabsTrigger>
            <TabsTrigger value="settings">Settings</TabsTrigger>
          </TabsList>

          <TabsContent value="overview" className="space-y-6">
            <div className="grid md:grid-cols-2 gap-6">
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Calendar className="h-5 w-5" />
                    Recent Events
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    {recentEvents.map((event) => (
                      <div key={event.id} className="flex items-center justify-between p-3 border rounded-lg">
                        <div>
                          <h4 className="font-medium">{event.title}</h4>
                          <p className="text-sm text-muted-foreground">{event.date}</p>
                          <div className="flex items-center gap-4 text-xs text-muted-foreground mt-1">
                            <span>{event.ticketsSold} tickets sold</span>
                            <span>${event.revenue.toLocaleString()} revenue</span>
                          </div>
                        </div>
                        <Badge variant={event.status === 'active' ? 'default' : 'secondary'}>
                          {event.status}
                        </Badge>
                      </div>
                    ))}
                  </div>
                  <Button variant="outline" className="w-full mt-4">
                    View All Events
                  </Button>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <BarChart3 className="h-5 w-5" />
                    Quick Analytics
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    <div className="flex justify-between">
                      <span className="text-sm font-medium">Top Selling Event</span>
                      <span className="text-sm">{analytics.topSellingEvent}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-sm font-medium">Average Ticket Price</span>
                      <span className="text-sm">${analytics.averageTicketPrice}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-sm font-medium">Conversion Rate</span>
                      <span className="text-sm">{analytics.conversionRate}%</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-sm font-medium">Return Customers</span>
                      <span className="text-sm">{analytics.returnCustomers}%</span>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>
          </TabsContent>

          <TabsContent value="events">
            <Card>
              <CardHeader>
                <CardTitle>Event Management</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-muted-foreground mb-4">Manage all your events, tickets, and attendees</p>
                <div className="flex gap-2">
                  <Button asChild>
                    <Link to="/create-event">Create New Event</Link>
                  </Button>
                  <Button variant="outline">View All Events</Button>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="analytics" className="space-y-6">
            <AnalyticsKPIs />
            
            <div className="grid lg:grid-cols-2 gap-6">
              <RevenueChart />
              <TicketSalesChart />
            </div>
            
            <div className="grid lg:grid-cols-2 gap-6">
              <AudienceInsights />
              <Card>
                <CardHeader>
                  <CardTitle>Performance Metrics</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    <div className="flex justify-between items-center p-3 bg-muted rounded-lg">
                      <span className="font-medium">Average Event Capacity</span>
                      <span className="text-xl font-bold">87%</span>
                    </div>
                    <div className="flex justify-between items-center p-3 bg-muted rounded-lg">
                      <span className="font-medium">Customer Satisfaction</span>
                      <span className="text-xl font-bold">4.8/5</span>
                    </div>
                    <div className="flex justify-between items-center p-3 bg-muted rounded-lg">
                      <span className="font-medium">Repeat Purchase Rate</span>
                      <span className="text-xl font-bold">35%</span>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>
          </TabsContent>

          <TabsContent value="insights">
            <EventPerformanceTable />
          </TabsContent>

          <TabsContent value="settings">
            <Card>
              <CardHeader>
                <CardTitle>Organizer Settings</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-muted-foreground mb-4">Manage your organizer profile and preferences</p>
                <Button variant="outline">Edit Profile</Button>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </main>

      <Footer />
    </div>
  );
};

export default OrganizerDashboard;
