
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Sparkles, TrendingUp, Heart } from "lucide-react";
import { Link } from "react-router-dom";

const SmartRecommendations = () => {
  const recommendations = [
    {
      id: "1",
      title: "Jazz Night at Blue Note",
      reason: "Based on your music preferences",
      image: "https://images.unsplash.com/photo-1493225457124-a3eb161ffa5f?w=300&h=200&fit=crop",
      date: "Tonight • 8:00 PM",
      price: "$35.00",
      match: 95
    },
    {
      id: "2", 
      title: "Tech Startup Mixer",
      reason: "Popular in your network",
      image: "https://images.unsplash.com/photo-1556761175-b413da4baf72?w=300&h=200&fit=crop",
      date: "Tomorrow • 6:00 PM",
      price: "Free",
      match: 88
    }
  ];

  return (
    <section className="py-12 bg-gradient-to-br from-purple-50 to-blue-50">
      <div className="container mx-auto px-4">
        <div className="flex items-center justify-between mb-8">
          <div className="flex items-center space-x-3">
            <Sparkles className="h-6 w-6 text-purple-600" />
            <h2 className="text-2xl font-bold">Recommended For You</h2>
          </div>
          <Button variant="outline" size="sm">View All</Button>
        </div>

        <div className="grid md:grid-cols-2 gap-6">
          {recommendations.map((event) => (
            <Card key={event.id} className="group hover:shadow-lg transition-all duration-300 overflow-hidden">
              <CardContent className="p-0">
                <div className="flex">
                  <div className="relative w-24 h-24">
                    <img src={event.image} alt={event.title} className="w-full h-full object-cover" />
                    <Badge className="absolute -top-1 -right-1 bg-green-500 text-white text-xs">
                      {event.match}%
                    </Badge>
                  </div>
                  <div className="flex-1 p-4">
                    <h3 className="font-semibold text-sm mb-1">{event.title}</h3>
                    <p className="text-xs text-gray-600 mb-2 flex items-center">
                      <TrendingUp className="h-3 w-3 mr-1" />
                      {event.reason}
                    </p>
                    <div className="flex justify-between items-center">
                      <span className="text-xs text-gray-500">{event.date}</span>
                      <span className="font-bold text-sm">{event.price}</span>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    </section>
  );
};

export default SmartRecommendations;
