
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { ChartContainer, ChartTooltip, ChartTooltipContent } from "@/components/ui/chart";
import { BarChart, Bar, XAxis, YAxis, ResponsiveContainer } from "recharts";
import { Ticket } from "lucide-react";

const salesData = [
  { event: "Tech Summit", sold: 450, total: 500 },
  { event: "Marketing Workshop", sold: 120, total: 150 },
  { event: "Design Conference", sold: 320, total: 400 },
  { event: "Startup Pitch", sold: 85, total: 100 },
  { event: "AI Symposium", sold: 280, total: 300 }
];

const chartConfig = {
  sold: {
    label: "Sold",
    color: "#8b5cf6"
  },
  total: {
    label: "Total",
    color: "#e5e7eb"
  }
};

const TicketSalesChart = () => {
  return (
    <Card>
      <CardHeader className="pb-2">
        <CardTitle className="flex items-center gap-2 text-sm md:text-base">
          <Ticket className="h-4 w-4 md:h-5 md:w-5" />
          Ticket Sales by Event
        </CardTitle>
      </CardHeader>
      <CardContent className="px-2 md:px-6">
        <ChartContainer config={chartConfig} className="h-48 md:h-80">
          <ResponsiveContainer width="100%" height="100%">
            <BarChart data={salesData} layout="horizontal" margin={{ top: 5, right: 5, left: 5, bottom: 5 }}>
              <XAxis type="number" tick={{ fontSize: 10 }} axisLine={false} tickLine={false} />
              <YAxis 
                dataKey="event" 
                type="category" 
                width={80}
                tick={{ fontSize: 9 }}
                axisLine={false}
                tickLine={false}
              />
              <ChartTooltip content={<ChartTooltipContent />} />
              <Bar dataKey="total" fill="var(--color-total)" />
              <Bar dataKey="sold" fill="var(--color-sold)" />
            </BarChart>
          </ResponsiveContainer>
        </ChartContainer>
      </CardContent>
    </Card>
  );
};

export default TicketSalesChart;
