
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { ChartContainer, ChartTooltip, ChartTooltipContent } from "@/components/ui/chart";
import { LineChart, Line, XAxis, YAxis, ResponsiveContainer } from "recharts";
import { DollarSign } from "lucide-react";

const revenueData = [
  { month: "Jan", revenue: 12000, target: 10000 },
  { month: "Feb", revenue: 15000, target: 12000 },
  { month: "Mar", revenue: 18000, target: 15000 },
  { month: "Apr", revenue: 22000, target: 18000 },
  { month: "May", revenue: 25000, target: 22000 },
  { month: "Jun", revenue: 28000, target: 25000 }
];

const chartConfig = {
  revenue: {
    label: "Revenue",
    color: "#3b82f6"
  },
  target: {
    label: "Target",
    color: "#10b981"
  }
};

const RevenueChart = () => {
  return (
    <Card>
      <CardHeader className="pb-2">
        <CardTitle className="flex items-center gap-2 text-sm md:text-base">
          <DollarSign className="h-4 w-4 md:h-5 md:w-5" />
          Revenue Analytics
        </CardTitle>
      </CardHeader>
      <CardContent className="px-2 md:px-6">
        <ChartContainer config={chartConfig} className="h-48 md:h-80">
          <ResponsiveContainer width="100%" height="100%">
            <LineChart data={revenueData} margin={{ top: 5, right: 5, left: 5, bottom: 5 }}>
              <XAxis 
                dataKey="month" 
                tick={{ fontSize: 10 }}
                axisLine={false}
                tickLine={false}
              />
              <YAxis 
                tick={{ fontSize: 10 }}
                axisLine={false}
                tickLine={false}
                width={40}
              />
              <ChartTooltip content={<ChartTooltipContent />} />
              <Line 
                type="monotone" 
                dataKey="revenue" 
                stroke="var(--color-revenue)" 
                strokeWidth={2}
                dot={{ r: 3 }}
              />
              <Line 
                type="monotone" 
                dataKey="target" 
                stroke="var(--color-target)" 
                strokeWidth={2}
                strokeDasharray="5 5"
                dot={{ r: 3 }}
              />
            </LineChart>
          </ResponsiveContainer>
        </ChartContainer>
      </CardContent>
    </Card>
  );
};

export default RevenueChart;
