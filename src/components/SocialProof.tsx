
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Users, Star, MessageCircle } from "lucide-react";

const SocialProof = () => {
  const recentActivity = [
    { user: "Sarah M.", action: "bought 2 tickets to", event: "Summer Music Festival", time: "2m ago" },
    { user: "Mike R.", action: "reviewed", event: "Tech Conference 2024", rating: 5, time: "5m ago" },
    { user: "Emma L.", action: "shared", event: "Art Gallery Opening", time: "8m ago" }
  ];

  const stats = [
    { icon: Users, value: "2.5M+", label: "Happy Users" },
    { icon: Star, value: "4.9/5", label: "Average Rating" },
    { icon: MessageCircle, value: "150K+", label: "Reviews" }
  ];

  return (
    <section className="py-12 bg-white border-t border-gray-100">
      <div className="container mx-auto px-4">
        <div className="text-center mb-8">
          <h2 className="text-2xl font-bold mb-2">Trusted by Event Lovers</h2>
          <p className="text-gray-600">Join millions who found their perfect events</p>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-3 gap-6 mb-8 max-w-md mx-auto">
          {stats.map((stat, index) => (
            <div key={index} className="text-center">
              <stat.icon className="h-6 w-6 mx-auto mb-2 text-blue-600" />
              <div className="font-bold text-lg">{stat.value}</div>
              <div className="text-xs text-gray-600">{stat.label}</div>
            </div>
          ))}
        </div>

        {/* Live Activity */}
        <div className="max-w-md mx-auto">
          <h3 className="text-center font-semibold mb-4 flex items-center justify-center">
            <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse mr-2"></div>
            Live Activity
          </h3>
          <div className="space-y-3">
            {recentActivity.map((activity, index) => (
              <div key={index} className="flex items-center space-x-3 p-2 bg-gray-50 rounded-lg">
                <Avatar className="h-6 w-6">
                  <AvatarImage src={`https://i.pravatar.cc/100?img=${index + 1}`} />
                  <AvatarFallback>{activity.user[0]}</AvatarFallback>
                </Avatar>
                <div className="flex-1 text-sm">
                  <span className="font-medium">{activity.user}</span>
                  <span className="text-gray-600"> {activity.action} </span>
                  <span className="font-medium">{activity.event}</span>
                  {activity.rating && (
                    <div className="flex items-center space-x-1 ml-1 inline-flex">
                      {[...Array(activity.rating)].map((_, i) => (
                        <Star key={i} className="h-3 w-3 fill-yellow-400 text-yellow-400" />
                      ))}
                    </div>
                  )}
                </div>
                <span className="text-xs text-gray-500">{activity.time}</span>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
};

export default SocialProof;
