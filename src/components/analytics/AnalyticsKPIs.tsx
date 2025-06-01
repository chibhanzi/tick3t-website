
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
      <CardContent className="p-4">
        <div className="flex items-center justify-between">
          <div>
            <p className="text-sm font-medium text-muted-foreground">{title}</p>
            <p className="text-2xl font-bold">{value}</p>
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
          <div className="p-2 bg-muted rounded-lg">
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
      icon: <DollarSign className="h-5 w-5 text-emerald-500" />
    },
    {
      title: "Events Created",
      value: "15",
      change: "+3",
      trend: "up" as const,
      icon: <Calendar className="h-5 w-5 text-blue-500" />
    },
    {
      title: "Total Attendees",
      value: "2,847",
      change: "+18.2%",
      trend: "up" as const,
      icon: <Users className="h-5 w-5 text-purple-500" />
    },
    {
      title: "Conversion Rate",
      value: "3.2%",
      change: "-0.3%",
      trend: "down" as const,
      icon: <Target className="h-5 w-5 text-orange-500" />
    }
  ];

  return (
    <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
      {kpis.map((kpi) => (
        <KPICard key={kpi.title} {...kpi} />
      ))}
    </div>
  );
};

export default AnalyticsKPIs;
