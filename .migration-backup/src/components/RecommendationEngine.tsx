
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Star, MapPin, Calendar, TrendingUp, Users } from "lucide-react";
import { Link } from "react-router-dom";

interface RecommendedEvent {
  id: string;
  title: string;
  date: string;
  location: string;
  price: string;
  image: string;
  category: string;
  matchReason: string;
  attendees: number;
}

const RecommendationEngine = () => {
  const recommendations: RecommendedEvent[] = [
    {
      id: "rec-1",
      title: "AI & Machine Learning Summit",
      date: "April 12, 2024",
      location: "Tech Hub, SF",
      price: "$180.00",
      image: "https://images.unsplash.com/photo-1485827404703-89b55fcc595e?w=300&h=200&fit=crop",
      category: "Technology",
      matchReason: "Similar to events you've attended",
      attendees: 850
    },
    {
      id: "rec-2",
      title: "Digital Marketing Workshop",
      date: "April 18, 2024",
      location: "Downtown Center",
      price: "$95.00",
      image: "https://images.unsplash.com/photo-1552664730-d307ca884978?w=300&h=200&fit=crop",
      category: "Business",
      matchReason: "Popular in your area",
      attendees: 320
    }
  ];

  return (
    <Card className="mb-8">
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <TrendingUp className="h-5 w-5 text-purple-500" />
          Recommended for You
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {recommendations.map((event) => (
            <div key={event.id} className="flex gap-3 p-3 border rounded-lg hover:shadow-md transition-shadow">
              <img 
                src={event.image} 
                alt={event.title}
                className="w-20 h-20 rounded-lg object-cover"
              />
              <div className="flex-1">
                <h4 className="font-medium text-sm mb-1">{event.title}</h4>
                <div className="flex items-center text-xs text-muted-foreground mb-1">
                  <Calendar className="h-3 w-3 mr-1" />
                  {event.date}
                </div>
                <div className="flex items-center text-xs text-muted-foreground mb-2">
                  <MapPin className="h-3 w-3 mr-1" />
                  {event.location}
                </div>
                <div className="flex items-center justify-between">
                  <Badge variant="outline" className="text-xs">{event.matchReason}</Badge>
                  <span className="font-bold text-sm text-blue-600">{event.price}</span>
                </div>
              </div>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  );
};

export default RecommendationEngine;
