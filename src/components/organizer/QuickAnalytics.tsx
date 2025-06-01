
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { BarChart3 } from "lucide-react";

const QuickAnalytics = () => {
  const analytics = {
    topSellingEvent: "Tech Innovation Summit",
    averageTicketPrice: 85,
    conversionRate: 3.2,
    returnCustomers: 35
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <BarChart3 className="h-5 w-5" />
          Quick Analytics
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          <div className="flex justify-between">
            <span className="text-sm font-medium">Top Selling Event</span>
            <span className="text-sm truncate ml-2">{analytics.topSellingEvent}</span>
          </div>
          <div className="flex justify-between">
            <span className="text-sm font-medium">Average Ticket Price</span>
            <span className="text-sm">${analytics.averageTicketPrice}</span>
          </div>
          <div className="flex justify-between">
            <span className="text-sm font-medium">Conversion Rate</span>
            <span className="text-sm">{analytics.conversionRate}%</span>
          </div>
          <div className="flex justify-between">
            <span className="text-sm font-medium">Return Customers</span>
            <span className="text-sm">{analytics.returnCustomers}%</span>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export default QuickAnalytics;
