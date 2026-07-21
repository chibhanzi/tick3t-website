
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { TrendingUp, Calendar, DollarSign, MapPin, Clock, Award } from "lucide-react";

const UserInsights = () => {
  const insights = {
    totalSpent: 1250,
    eventsAttended: 12,
    favoriteCategory: "Technology",
    averagePrice: 104,
    monthlySpending: [
      { month: "Jan", amount: 0 },
      { month: "Feb", amount: 125 },
      { month: "Mar", amount: 350 },
      { month: "Apr", amount: 200 },
      { month: "May", amount: 180 },
      { month: "Jun", amount: 395 }
    ],
    categoryBreakdown: [
      { category: "Technology", count: 5, percentage: 42 },
      { category: "Business", count: 3, percentage: 25 },
      { category: "Arts", count: 2, percentage: 17 },
      { category: "Music", count: 2, percentage: 16 }
    ],
    upcomingBudget: 500,
    savingsGoal: 200
  };

  const maxSpending = Math.max(...insights.monthlySpending.map(m => m.amount));

  return (
    <div className="space-y-6">
      {/* Spending Overview */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card>
          <CardContent className="p-4 text-center">
            <DollarSign className="h-8 w-8 text-green-500 mx-auto mb-2" />
            <div className="text-2xl font-bold">${insights.totalSpent}</div>
            <div className="text-sm text-muted-foreground">Total Spent</div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4 text-center">
            <Calendar className="h-8 w-8 text-blue-500 mx-auto mb-2" />
            <div className="text-2xl font-bold">{insights.eventsAttended}</div>
            <div className="text-sm text-muted-foreground">Events Attended</div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4 text-center">
            <TrendingUp className="h-8 w-8 text-purple-500 mx-auto mb-2" />
            <div className="text-2xl font-bold">${insights.averagePrice}</div>
            <div className="text-sm text-muted-foreground">Avg. Ticket Price</div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4 text-center">
            <Award className="h-8 w-8 text-yellow-500 mx-auto mb-2" />
            <div className="text-lg font-bold">{insights.favoriteCategory}</div>
            <div className="text-sm text-muted-foreground">Favorite Category</div>
          </CardContent>
        </Card>
      </div>

      {/* Monthly Spending Trend */}
      <Card>
        <CardHeader>
          <CardTitle>Monthly Spending Trend</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-3">
            {insights.monthlySpending.map((month) => (
              <div key={month.month} className="flex items-center gap-3">
                <div className="w-8 text-sm font-medium">{month.month}</div>
                <div className="flex-1">
                  <Progress 
                    value={(month.amount / maxSpending) * 100} 
                    className="h-2"
                  />
                </div>
                <div className="w-16 text-sm font-medium text-right">
                  ${month.amount}
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Category Breakdown */}
      <Card>
        <CardHeader>
          <CardTitle>Event Categories</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-3">
            {insights.categoryBreakdown.map((category) => (
              <div key={category.category} className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div className="text-sm font-medium">{category.category}</div>
                  <Badge variant="outline">{category.count} events</Badge>
                </div>
                <div className="flex items-center gap-2">
                  <Progress value={category.percentage} className="w-20 h-2" />
                  <span className="text-sm text-muted-foreground w-10">
                    {category.percentage}%
                  </span>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Budget Tracking */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Clock className="h-5 w-5" />
            Budget Goals
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            <div>
              <div className="flex justify-between mb-2">
                <span className="text-sm font-medium">Monthly Budget</span>
                <span className="text-sm">${insights.upcomingBudget}</span>
              </div>
              <Progress value={60} className="h-2" />
              <p className="text-xs text-muted-foreground mt-1">
                You've used 60% of your monthly budget
              </p>
            </div>
            <div>
              <div className="flex justify-between mb-2">
                <span className="text-sm font-medium">Savings Goal</span>
                <span className="text-sm">${insights.savingsGoal}</span>
              </div>
              <Progress value={75} className="h-2" />
              <p className="text-xs text-muted-foreground mt-1">
                75% towards your savings goal this month
              </p>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default UserInsights;
