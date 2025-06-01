
import { Card, CardContent } from "@/components/ui/card";
import { Calendar, Users, DollarSign, TrendingUp, Eye } from "lucide-react";

interface DashboardStatsProps {
  stats: {
    totalEvents: number;
    activeEvents: number;
    totalTicketsSold: number;
    totalRevenue: number;
    monthlyGrowth: number;
  };
}

const DashboardStats = ({ stats }: DashboardStatsProps) => {
  return (
    <div className="grid grid-cols-2 md:grid-cols-5 gap-3 md:gap-4">
      <Card>
        <CardContent className="p-3 md:p-4 text-center">
          <Calendar className="h-6 w-6 md:h-8 md:w-8 text-blue-500 mx-auto mb-2" />
          <div className="text-xl md:text-2xl font-bold">{stats.totalEvents}</div>
          <div className="text-xs md:text-sm text-muted-foreground">Total Events</div>
        </CardContent>
      </Card>
      <Card>
        <CardContent className="p-3 md:p-4 text-center">
          <Eye className="h-6 w-6 md:h-8 md:w-8 text-green-500 mx-auto mb-2" />
          <div className="text-xl md:text-2xl font-bold">{stats.activeEvents}</div>
          <div className="text-xs md:text-sm text-muted-foreground">Active Events</div>
        </CardContent>
      </Card>
      <Card>
        <CardContent className="p-3 md:p-4 text-center">
          <Users className="h-6 w-6 md:h-8 md:w-8 text-purple-500 mx-auto mb-2" />
          <div className="text-xl md:text-2xl font-bold">{stats.totalTicketsSold.toLocaleString()}</div>
          <div className="text-xs md:text-sm text-muted-foreground">Tickets Sold</div>
        </CardContent>
      </Card>
      <Card>
        <CardContent className="p-3 md:p-4 text-center">
          <DollarSign className="h-6 w-6 md:h-8 md:w-8 text-emerald-500 mx-auto mb-2" />
          <div className="text-xl md:text-2xl font-bold">${stats.totalRevenue.toLocaleString()}</div>
          <div className="text-xs md:text-sm text-muted-foreground">Total Revenue</div>
        </CardContent>
      </Card>
      <Card>
        <CardContent className="p-3 md:p-4 text-center">
          <TrendingUp className="h-6 w-6 md:h-8 md:w-8 text-orange-500 mx-auto mb-2" />
          <div className="text-xl md:text-2xl font-bold">+{stats.monthlyGrowth}%</div>
          <div className="text-xs md:text-sm text-muted-foreground">Monthly Growth</div>
        </CardContent>
      </Card>
    </div>
  );
};

export default DashboardStats;
