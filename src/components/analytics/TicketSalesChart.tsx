
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
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Ticket className="h-5 w-5" />
          Ticket Sales by Event
        </CardTitle>
      </CardHeader>
      <CardContent>
        <ChartContainer config={chartConfig} className="h-80">
          <ResponsiveContainer width="100%" height="100%">
            <BarChart data={salesData} layout="horizontal">
              <XAxis type="number" />
              <YAxis dataKey="event" type="category" width={120} />
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
