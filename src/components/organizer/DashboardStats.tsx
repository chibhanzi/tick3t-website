import { Card, CardContent } from "@/components/ui/card";
import { Calendar, Eye, TrendingUp } from "lucide-react";

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
  const items = [
    {
      label: "Total Events",
      value: stats.totalEvents.toString(),
      icon: Calendar,
      accent: "from-blue-500/20 to-indigo-500/10",
      iconColor: "text-blue-500",
    },
    {
      label: "Active Events",
      value: stats.activeEvents.toString(),
      icon: Eye,
      accent: "from-emerald-500/20 to-green-500/10",
      iconColor: "text-emerald-500",
    },
    {
      label: "Monthly Growth",
      value: `+${stats.monthlyGrowth}%`,
      icon: TrendingUp,
      accent: "from-orange-500/20 to-amber-500/10",
      iconColor: "text-orange-500",
    },
  ];

  return (
    <div className="grid grid-cols-3 gap-3 md:gap-4">
      {items.map(({ label, value, icon: Icon, accent, iconColor }) => (
        <Card
          key={label}
          className="relative overflow-hidden border-border/50 hover:border-border transition-colors"
        >
          <div className={`absolute inset-0 bg-gradient-to-br ${accent} opacity-60 pointer-events-none`} />
          <CardContent className="relative p-3 md:p-5">
            <div className="flex items-center justify-between mb-2 md:mb-3">
              <Icon className={`h-4 w-4 md:h-5 md:w-5 ${iconColor}`} />
            </div>
            <div className="text-lg md:text-2xl font-bold leading-tight">{value}</div>
            <div className="text-[11px] md:text-xs text-muted-foreground mt-0.5">{label}</div>
          </CardContent>
        </Card>
      ))}
    </div>
  );
};

export default DashboardStats;
