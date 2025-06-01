
import { Card, CardContent } from "@/components/ui/card";
import { TrendingUp, TrendingDown, Users, Calendar, DollarSign, Target } from "lucide-react";

interface KPICardProps {
  title: string;
  value: string;
  change: string;
  trend: "up" | "down";
  icon: React.ReactNode;
}

const KPICard = ({ title, value, change, trend, icon }: KPICardProps) => {
  return (
    <Card>
      <CardContent className="p-3 md:p-4">
        <div className="flex items-center justify-between">
          <div className="flex-1 min-w-0">
            <p className="text-xs md:text-sm font-medium text-muted-foreground truncate">{title}</p>
            <p className="text-lg md:text-2xl font-bold">{value}</p>
            <div className="flex items-center gap-1 mt-1">
              {trend === "up" ? (
                <TrendingUp className="h-3 w-3 text-green-500" />
              ) : (
                <TrendingDown className="h-3 w-3 text-red-500" />
              )}
              <span className={`text-xs ${trend === "up" ? "text-green-500" : "text-red-500"}`}>
                {change}
              </span>
            </div>
          </div>
          <div className="p-2 bg-muted rounded-lg flex-shrink-0">
            {icon}
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

const AnalyticsKPIs = () => {
  const kpis = [
    {
      title: "Total Revenue",
      value: "$142,350",
      change: "+12.5%",
      trend: "up" as const,
      icon: <DollarSign className="h-4 w-4 md:h-5 md:w-5 text-emerald-500" />
    },
    {
      title: "Events Created",
      value: "15",
      change: "+3",
      trend: "up" as const,
      icon: <Calendar className="h-4 w-4 md:h-5 md:w-5 text-blue-500" />
    },
    {
      title: "Total Attendees",
      value: "2,847",
      change: "+18.2%",
      trend: "up" as const,
      icon: <Users className="h-4 w-4 md:h-5 md:w-5 text-purple-500" />
    },
    {
      title: "Conversion Rate",
      value: "3.2%",
      change: "-0.3%",
      trend: "down" as const,
      icon: <Target className="h-4 w-4 md:h-5 md:w-5 text-orange-500" />
    }
  ];

  return (
    <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 md:gap-4">
      {kpis.map((kpi) => (
        <KPICard key={kpi.title} {...kpi} />
      ))}
    </div>
  );
};

export default AnalyticsKPIs;
