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
      iconBg: "bg-blue-500/10",
      iconColor: "text-blue-500",
    },
    {
      label: "Active Events",
      value: stats.activeEvents.toString(),
      icon: Eye,
      iconBg: "bg-emerald-500/10",
      iconColor: "text-emerald-500",
    },
    {
      label: "Monthly Growth",
      value: `+${stats.monthlyGrowth}%`,
      icon: TrendingUp,
      iconBg: "bg-orange-500/10",
      iconColor: "text-orange-500",
    },
  ];

  return (
    <div className="rounded-2xl border border-border/60 bg-card/60 backdrop-blur-sm overflow-hidden">
      <div className="grid grid-cols-3 divide-x divide-border/60">
        {items.map(({ label, value, icon: Icon, iconBg, iconColor }) => (
          <div key={label} className="flex flex-col items-center justify-center gap-2 p-5">
            <div className={`flex h-9 w-9 items-center justify-center rounded-full ${iconBg}`}>
              <Icon className={`h-4 w-4 ${iconColor}`} />
            </div>
            <div className="text-2xl font-bold tracking-tight">{value}</div>
            <div className="text-[11px] uppercase tracking-wider text-muted-foreground text-center">{label}</div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default DashboardStats;
