
import { useState } from "react";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { useAuth } from "@/contexts/AuthContext";
import { Calendar, MapPin, Star, Trophy, Clock, Ticket, Users, TrendingUp, Upload, Camera } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

const UserDashboard = () => {
  const { user } = useAuth();
  const [activeTab, setActiveTab] = useState("overview");
  const [profileImage, setProfileImage] = useState(user?.profilePicture || "");

  const handleImageUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (e) => {
        setProfileImage(e.target?.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  const upcomingEvents = [
    {
      id: "1",
      title: "Tech Conference 2024",
      date: "March 25, 2024",
      location: "San Francisco, CA",
      status: "confirmed",
      ticketType: "VIP"
    },
    {
      id: "2",
      title: "Music Festival",
      date: "April 15, 2024",
      location: "Austin, TX",
      status: "pending",
      ticketType: "General"
    }
  ];

  const recentActivity = [
    { id: 1, action: "Purchased ticket", event: "Tech Conference 2024", date: "2 days ago" },
    { id: 2, action: "Earned badge", event: "Early Bird", date: "1 week ago" },
    { id: 3, action: "Attended event", event: "Local Meetup", date: "2 weeks ago" }
  ];

  const badges = [
    { name: "Early Bird", icon: "🐦", description: "First 100 tickets purchased" },
    { name: "Tech Enthusiast", icon: "💻", description: "Attended 5+ tech events" },
    { name: "Social Butterfly", icon: "🦋", description: "Shared 10+ events" }
  ];

  const stats = {
    eventsAttended: 12,
    upcomingEvents: 2,
    totalSpent: 1250,
    badgesEarned: 8
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-50 via-pink-50 to-yellow-50 dark:from-slate-900 dark:via-slate-800 dark:to-slate-900">
      <Header />
      
      <main className="container mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="mb-8">
          <div className="flex items-center space-x-4 mb-4">
            <div className="relative">
              <img 
                src={profileImage} 
                alt={user?.name}
                className="w-16 h-16 rounded-full border-4 border-white shadow-lg object-cover"
              />
              <Button
                size="sm"
                variant="outline"
                className="absolute -bottom-2 -right-2 rounded-full w-8 h-8 p-0"
                onClick={() => document.getElementById('profile-upload')?.click()}
              >
                <Camera className="h-3 w-3" />
              </Button>
              <input
                id="profile-upload"
                type="file"
                accept="image/*"
                className="hidden"
                onChange={handleImageUpload}
              />
            </div>
            <div>
              <h1 className="text-3xl font-bold bg-gradient-to-r from-purple-600 to-pink-600 bg-clip-text text-transparent">
                Welcome back, {user?.name}! 👋
              </h1>
              <p className="text-muted-foreground">
                Member since 2024
              </p>
            </div>
          </div>

          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
            <Card>
              <CardContent className="p-4 text-center">
                <Calendar className="h-8 w-8 text-purple-500 mx-auto mb-2" />
                <div className="text-2xl font-bold">{stats.eventsAttended}</div>
                <div className="text-sm text-muted-foreground">Events Attended</div>
              </CardContent>
            </Card>
            <Card>
              <CardContent className="p-4 text-center">
                <Clock className="h-8 w-8 text-blue-500 mx-auto mb-2" />
                <div className="text-2xl font-bold">{stats.upcomingEvents}</div>
                <div className="text-sm text-muted-foreground">Upcoming</div>
              </CardContent>
            </Card>
            <Card>
              <CardContent className="p-4 text-center">
                <TrendingUp className="h-8 w-8 text-green-500 mx-auto mb-2" />
                <div className="text-2xl font-bold">${stats.totalSpent}</div>
                <div className="text-sm text-muted-foreground">Total Spent</div>
              </CardContent>
            </Card>
            <Card>
              <CardContent className="p-4 text-center">
                <Trophy className="h-8 w-8 text-yellow-500 mx-auto mb-2" />
                <div className="text-2xl font-bold">{stats.badgesEarned}</div>
                <div className="text-sm text-muted-foreground">Badges Earned</div>
              </CardContent>
            </Card>
          </div>
        </div>

        <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-6">
          <TabsList className="grid w-full grid-cols-4">
            <TabsTrigger value="overview">Overview</TabsTrigger>
            <TabsTrigger value="tickets">My Tickets</TabsTrigger>
            <TabsTrigger value="badges">Badges</TabsTrigger>
            <TabsTrigger value="settings">Settings</TabsTrigger>
          </TabsList>

          <TabsContent value="overview" className="space-y-6">
            <div className="grid md:grid-cols-2 gap-6">
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Ticket className="h-5 w-5" />
                    Upcoming Events
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    {upcomingEvents.map((event) => (
                      <div key={event.id} className="flex items-center justify-between p-3 border rounded-lg">
                        <div>
                          <h4 className="font-medium">{event.title}</h4>
                          <div className="flex items-center text-sm text-muted-foreground gap-4">
                            <span className="flex items-center gap-1">
                              <Calendar className="h-3 w-3" />
                              {event.date}
                            </span>
                            <span className="flex items-center gap-1">
                              <MapPin className="h-3 w-3" />
                              {event.location}
                            </span>
                          </div>
                        </div>
                        <Badge variant={event.status === 'confirmed' ? 'default' : 'secondary'}>
                          {event.status}
                        </Badge>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle>Recent Activity</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-3">
                    {recentActivity.map((activity) => (
                      <div key={activity.id} className="flex items-center space-x-3">
                        <div className="w-2 h-2 bg-purple-500 rounded-full"></div>
                        <div className="flex-1">
                          <p className="text-sm font-medium">{activity.action}</p>
                          <p className="text-xs text-muted-foreground">{activity.event} • {activity.date}</p>
                        </div>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            </div>
          </TabsContent>

          <TabsContent value="tickets">
            <Card>
              <CardHeader>
                <CardTitle>My Tickets</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-muted-foreground mb-4">View and manage all your tickets</p>
                <Button>View All Tickets</Button>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="badges">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Trophy className="h-5 w-5" />
                  Achievement Badges
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  {badges.map((badge, index) => (
                    <div key={index} className="text-center p-4 border rounded-lg">
                      <div className="text-4xl mb-2">{badge.icon}</div>
                      <h3 className="font-medium">{badge.name}</h3>
                      <p className="text-sm text-muted-foreground">{badge.description}</p>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="settings">
            <Card>
              <CardHeader>
                <CardTitle>Account Settings</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="name">Full Name</Label>
                  <Input id="name" defaultValue={user?.name} />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="email">Email</Label>
                  <Input id="email" defaultValue={user?.email} disabled />
                </div>
                <Button variant="outline">Save Changes</Button>
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
