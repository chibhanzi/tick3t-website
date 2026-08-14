
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { TrendingUp, TrendingDown } from "lucide-react";

const eventData = [
  {
    name: "Tech Innovation Summit",
    date: "2024-03-25",
    tickets: 450,
    revenue: 22500,
    capacity: 500,
    trend: "up",
    growth: "+12%"
  },
  {
    name: "Digital Marketing Workshop",
    date: "2024-04-15",
    tickets: 120,
    revenue: 6000,
    capacity: 150,
    trend: "up",
    growth: "+8%"
  },
  {
    name: "Design Conference",
    date: "2024-05-20",
    tickets: 320,
    revenue: 16000,
    capacity: 400,
    trend: "down",
    growth: "-3%"
  },
  {
    name: "Startup Pitch Event",
    date: "2024-06-10",
    tickets: 85,
    revenue: 4250,
    capacity: 100,
    trend: "up",
    growth: "+15%"
  }
];

const EventPerformanceTable = () => {
  return (
    <Card>
      <CardHeader>
        <CardTitle>Event Performance</CardTitle>
      </CardHeader>
      <CardContent>
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Event</TableHead>
              <TableHead>Date</TableHead>
              <TableHead>Tickets Sold</TableHead>
              <TableHead>Revenue</TableHead>
              <TableHead>Fill Rate</TableHead>
              <TableHead>Trend</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {eventData.map((event) => (
              <TableRow key={event.name}>
                <TableCell className="font-medium">{event.name}</TableCell>
                <TableCell>{event.date}</TableCell>
                <TableCell>{event.tickets}/{event.capacity}</TableCell>
                <TableCell>${event.revenue.toLocaleString()}</TableCell>
                <TableCell>
                  <Badge variant={event.tickets / event.capacity > 0.8 ? "default" : "secondary"}>
                    {Math.round((event.tickets / event.capacity) * 100)}%
                  </Badge>
                </TableCell>
                <TableCell>
                  <div className="flex items-center gap-1">
                    {event.trend === "up" ? (
                      <TrendingUp className="h-4 w-4 text-green-500" />
                    ) : (
                      <TrendingDown className="h-4 w-4 text-red-500" />
                    )}
                    <span className={event.trend === "up" ? "text-green-500" : "text-red-500"}>
                      {event.growth}
                    </span>
                  </div>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </CardContent>
    </Card>
  );
};

export default EventPerformanceTable;
