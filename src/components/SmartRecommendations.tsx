
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
    <section className="relative py-12 bg-gradient-to-br from-purple-50 via-blue-50 to-cyan-50 overflow-hidden">
      {/* Animated Background Elements */}
      <div className="absolute inset-0">
        <div className="absolute top-0 left-0 w-full h-full bg-gradient-to-br from-purple-100/50 via-blue-100/50 to-cyan-100/50 animate-pulse animation-delay-1000"></div>
        <div className="absolute top-8 right-8 w-40 h-40 bg-gradient-to-br from-purple-300 to-blue-300 rounded-full opacity-10 animate-bounce animation-delay-500"></div>
        <div className="absolute bottom-8 left-8 w-32 h-32 bg-gradient-to-br from-cyan-300 to-purple-300 rounded-full opacity-10 animate-bounce animation-delay-1500"></div>
        <div className="absolute top-1/2 left-1/4 w-24 h-24 bg-gradient-to-br from-blue-300 to-cyan-300 rounded-full opacity-8 animate-pulse animation-delay-2000"></div>
      </div>
      
      {/* Color Flow from Previous Section */}
      <div className="absolute top-0 left-0 w-full h-8 bg-gradient-to-r from-purple-600/20 via-blue-500/20 to-cyan-500/20 animate-pulse"></div>
      
      <div className="container mx-auto px-4 relative z-10">
        <div className="flex items-center justify-between mb-8">
          <div className="flex items-center space-x-3">
            <Sparkles className="h-6 w-6 text-purple-600 animate-pulse" />
            <h2 className="text-2xl font-bold bg-gradient-to-r from-purple-600 to-blue-600 bg-clip-text text-transparent">
              Recommended For You
            </h2>
          </div>
          <Button 
            variant="outline" 
            size="sm"
            className="border-purple-200 text-purple-600 hover:bg-purple-50 hover:border-purple-300 transition-all duration-300 hover:scale-105"
          >
            View All
          </Button>
        </div>

        <div className="grid md:grid-cols-2 gap-6">
          {recommendations.map((event, index) => (
            <Card key={event.id} className="group hover:shadow-lg transition-all duration-300 overflow-hidden border-purple-100 hover:border-purple-200 hover:scale-105">
              <CardContent className="p-0">
                <div className="flex">
                  <div className="relative w-24 h-24">
                    <img src={event.image} alt={event.title} className="w-full h-full object-cover" />
                    <Badge className="absolute -top-1 -right-1 bg-gradient-to-r from-green-500 to-emerald-500 text-white text-xs animate-pulse">
                      {event.match}%
                    </Badge>
                  </div>
                  <div className="flex-1 p-4">
                    <h3 className="font-semibold text-sm mb-1 group-hover:text-purple-600 transition-colors duration-300">{event.title}</h3>
                    <p className="text-xs text-gray-600 mb-2 flex items-center">
                      <TrendingUp className="h-3 w-3 mr-1 text-blue-500" />
                      {event.reason}
                    </p>
                    <div className="flex justify-between items-center">
                      <span className="text-xs text-gray-500">{event.date}</span>
                      <span className="font-bold text-sm text-purple-600">{event.price}</span>
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
