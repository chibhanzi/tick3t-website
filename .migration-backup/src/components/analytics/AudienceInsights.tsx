
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { ChartContainer, ChartTooltip, ChartTooltipContent } from "@/components/ui/chart";
import { PieChart, Pie, Cell, ResponsiveContainer } from "recharts";
import { Users } from "lucide-react";

const audienceData = [
  { name: "18-25", value: 25, color: "#3b82f6" },
  { name: "26-35", value: 35, color: "#8b5cf6" },
  { name: "36-45", value: 22, color: "#10b981" },
  { name: "46-55", value: 12, color: "#f59e0b" },
  { name: "55+", value: 6, color: "#ef4444" }
];

const chartConfig = {
  audience: {
    label: "Age Groups"
  }
};

const AudienceInsights = () => {
  return (
    <Card>
      <CardHeader className="pb-2">
        <CardTitle className="flex items-center gap-2 text-sm md:text-base">
          <Users className="h-4 w-4 md:h-5 md:w-5" />
          Audience Demographics
        </CardTitle>
      </CardHeader>
      <CardContent className="px-2 md:px-6">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 md:gap-6">
          <ChartContainer config={chartConfig} className="h-40 md:h-60">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie
                  data={audienceData}
                  cx="50%"
                  cy="50%"
                  innerRadius={25}
                  outerRadius={60}
                  paddingAngle={5}
                  dataKey="value"
                >
                  {audienceData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={entry.color} />
                  ))}
                </Pie>
                <ChartTooltip content={<ChartTooltipContent />} />
              </PieChart>
            </ResponsiveContainer>
          </ChartContainer>
          
          <div className="space-y-2 md:space-y-3">
            {audienceData.map((item) => (
              <div key={item.name} className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <div 
                    className="w-3 h-3 rounded-full" 
                    style={{ backgroundColor: item.color }}
                  />
                  <span className="text-xs md:text-sm font-medium">{item.name} years</span>
                </div>
                <span className="text-xs md:text-sm text-muted-foreground">{item.value}%</span>
              </div>
            ))}
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export default AudienceInsights;
