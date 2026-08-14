
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import EventCard from "./EventCard";
import { Link } from "react-router-dom";
import { Clock, Calendar } from "lucide-react";

const FeaturedEvents = () => {
  const events = [
    {
      id: "1",
      title: "Tech Innovation Summit 2024",
      date: "March 15, 2024 • 9:00 AM",
      location: "San Francisco Convention Center",
      price: "$125.00",
      image: "https://images.unsplash.com/photo-1540575467063-178a50c2df87?w=400&h=300&fit=crop",
      attendees: 2500,
      category: "Technology",
      available: 150,
      total: 500
    },
    {
      id: "2",
      title: "Digital Art Exhibition",
      date: "March 22, 2024 • 6:00 PM",
      location: "Brooklyn Museum, NYC",
      price: "$45.00",
      image: "https://images.unsplash.com/photo-1571115764595-644a1f56a55c?w=400&h=300&fit=crop",
      attendees: 800,
      category: "Art & Culture",
      available: 0,
      total: 200
    },
    {
      id: "3",
      title: "Business Networking Gala",
      date: "April 5, 2024 • 7:00 PM",
      location: "London Excel Centre",
      price: "$195.00",
      image: "https://images.unsplash.com/photo-1511578314322-379afb476865?w=400&h=300&fit=crop",
      attendees: 1200,
      category: "Business",
      available: 75,
      total: 300
    },
    {
      id: "4",
      title: "Music Festival Summer",
      date: "May 20, 2024 • 3:00 PM",
      location: "Central Park, NYC",
      price: "$299.00",
      image: "https://images.unsplash.com/photo-1470813740244-df37b8c1edcb?w=400&h=300&fit=crop",
      attendees: 5000,
      category: "Music",
      available: 800,
      total: 2000
    },
    {
      id: "5",
      title: "Startup Pitch Competition",
      date: "April 28, 2024 • 2:00 PM",
      location: "Silicon Valley Hub",
      price: "Free",
      image: "https://images.unsplash.com/photo-1556761175-b413da4baf72?w=400&h=300&fit=crop",
      attendees: 400,
      category: "Business",
      available: 120,
      total: 150
    },
    {
      id: "6",
      title: "Wellness & Mindfulness Retreat",
      date: "June 10, 2024 • 9:00 AM",
      location: "Malibu Retreat Center",
      price: "$350.00",
      image: "https://images.unsplash.com/photo-1544367567-0f2fcb009e0b?w=400&h=300&fit=crop",
      attendees: 200,
      category: "Wellness",
      available: 50,
      total: 100
    },
  ];

  const almostGone = events.filter(e => e.available > 0 && e.available < 100);
  const allAvailable = events.filter(e => e.available > 0);

  return (
    <section className="py-12 bg-muted/30">
      <div className="container mx-auto px-4">

        {/* Almost Sold Out */}
        {almostGone.length > 0 && (
          <div className="mb-12">
            <div className="flex items-center gap-2 mb-5">
              <Clock className="h-5 w-5 text-red-500" />
              <h2 className="text-xl font-bold text-foreground">Almost Sold Out</h2>
              <Badge variant="destructive" className="text-xs">Limited</Badge>
            </div>
            <div className="grid grid-cols-2 lg:grid-cols-3 gap-4">
              {almostGone.map((event) => (
                <div key={event.id} className="relative">
                  <EventCard {...event} />
                  <Badge className="absolute -top-2 -right-2 bg-red-500 text-white text-xs z-10">
                    {event.available} left
                  </Badge>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* All Events */}
        <div className="mb-8">
          <div className="flex items-center justify-between mb-5">
            <h2 className="text-xl font-bold text-foreground">Trending Events</h2>
            <Link to="/events">
              <Button variant="outline" size="sm" className="text-xs">
                View All
              </Button>
            </Link>
          </div>
          <div className="grid grid-cols-2 lg:grid-cols-3 gap-4">
            {allAvailable.map((event) => (
              <EventCard key={event.id} {...event} />
            ))}
          </div>
        </div>

        {/* Simple CTA */}
        <div className="text-center pt-4">
          <Link to="/events">
            <Button size="lg" className="rounded-full px-8">
              <Calendar className="mr-2 h-4 w-4" />
              See All Events
            </Button>
          </Link>
        </div>
      </div>
    </section>
  );
};

export default FeaturedEvents;
