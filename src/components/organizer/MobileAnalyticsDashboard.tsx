
import AnalyticsKPIs from "@/components/analytics/AnalyticsKPIs";
import RevenueChart from "@/components/analytics/RevenueChart";
import TicketSalesChart from "@/components/analytics/TicketSalesChart";
import AudienceInsights from "@/components/analytics/AudienceInsights";
import EventPerformanceTable from "@/components/analytics/EventPerformanceTable";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

const MobileAnalyticsDashboard = () => {
  return (
    <div className="space-y-4 md:space-y-6">
      {/* KPIs - Stack on mobile, grid on larger screens */}
      <AnalyticsKPIs />
      
      {/* Charts - Stack on mobile */}
      <div className="space-y-4 lg:space-y-6">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 lg:gap-6">
          <RevenueChart />
          <TicketSalesChart />
        </div>
        
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 lg:gap-6">
          <AudienceInsights />
          <Card>
            <CardHeader>
              <CardTitle>Performance Metrics</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                <div className="flex justify-between items-center p-3 bg-muted rounded-lg">
                  <span className="font-medium text-sm">Avg Capacity</span>
                  <span className="text-lg md:text-xl font-bold">87%</span>
                </div>
                <div className="flex justify-between items-center p-3 bg-muted rounded-lg">
                  <span className="font-medium text-sm">Satisfaction</span>
                  <span className="text-lg md:text-xl font-bold">4.8/5</span>
                </div>
                <div className="flex justify-between items-center p-3 bg-muted rounded-lg">
                  <span className="font-medium text-sm">Repeat Rate</span>
                  <span className="text-lg md:text-xl font-bold">35%</span>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
};

export default MobileAnalyticsDashboard;
