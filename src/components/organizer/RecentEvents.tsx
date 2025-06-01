
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Calendar } from "lucide-react";

const RecentEvents = () => {
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

  return (
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
              <div className="flex-1 min-w-0">
                <h4 className="font-medium truncate">{event.title}</h4>
                <p className="text-sm text-muted-foreground">{event.date}</p>
                <div className="flex items-center gap-2 md:gap-4 text-xs text-muted-foreground mt-1 flex-wrap">
                  <span>{event.ticketsSold} tickets sold</span>
                  <span>${event.revenue.toLocaleString()} revenue</span>
                </div>
              </div>
              <Badge variant={event.status === 'active' ? 'default' : 'secondary'} className="ml-2">
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
  );
};

export default RecentEvents;
