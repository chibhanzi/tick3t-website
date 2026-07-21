import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { DollarSign, ArrowUpRight, ArrowDownRight, Wallet, Clock, CheckCircle2 } from "lucide-react";

interface Payout {
  id: string;
  amount: number;
  event: string;
  date: string;
  status: "completed" | "pending" | "processing";
  method: string;
}

const payouts: Payout[] = [
  { id: "1", amount: 18500, event: "Tech Innovation Summit", date: "2024-03-20", status: "completed", method: "TON Wallet" },
  { id: "2", amount: 6000, event: "Digital Marketing Workshop", date: "2024-03-25", status: "processing", method: "Bank Transfer" },
  { id: "3", amount: 48000, event: "Afrobeats Night Live", date: "2024-03-28", status: "pending", method: "TON Wallet" },
  { id: "4", amount: 3200, event: "Web3 Builders Meetup", date: "2024-04-01", status: "completed", method: "TON Wallet" },
];

const RevenuePayouts = () => {
  const totalRevenue = 142350;
  const totalPaidOut = 21700;
  const pendingPayout = 54000;
  const platformFees = 7117;

  return (
    <div className="space-y-6">
      {/* Revenue Overview */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center gap-2 mb-2">
              <DollarSign className="h-4 w-4 text-green-600" />
              <span className="text-xs text-muted-foreground">Total Revenue</span>
            </div>
            <div className="text-xl font-bold">${totalRevenue.toLocaleString()}</div>
            <div className="flex items-center gap-1 mt-1">
              <ArrowUpRight className="h-3 w-3 text-green-600" />
              <span className="text-xs text-green-600">+12.5%</span>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center gap-2 mb-2">
              <CheckCircle2 className="h-4 w-4 text-blue-600" />
              <span className="text-xs text-muted-foreground">Paid Out</span>
            </div>
            <div className="text-xl font-bold">${totalPaidOut.toLocaleString()}</div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center gap-2 mb-2">
              <Clock className="h-4 w-4 text-amber-600" />
              <span className="text-xs text-muted-foreground">Pending</span>
            </div>
            <div className="text-xl font-bold">${pendingPayout.toLocaleString()}</div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center gap-2 mb-2">
              <Wallet className="h-4 w-4 text-muted-foreground" />
              <span className="text-xs text-muted-foreground">Platform Fees</span>
            </div>
            <div className="text-xl font-bold">${platformFees.toLocaleString()}</div>
            <span className="text-xs text-muted-foreground">5% of revenue</span>
          </CardContent>
        </Card>
      </div>

      {/* Request Payout */}
      <Card>
        <CardContent className="p-4 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3">
          <div>
            <h4 className="font-medium">Available for Withdrawal</h4>
            <p className="text-2xl font-bold text-green-600">${(totalRevenue - totalPaidOut - platformFees).toLocaleString()}</p>
          </div>
          <Button>
            <Wallet className="h-4 w-4 mr-2" />
            Request Payout
          </Button>
        </CardContent>
      </Card>

      {/* Payout History */}
      <Card>
        <CardHeader>
          <CardTitle className="text-base">Payout History</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-3">
            {payouts.map((payout) => (
              <div key={payout.id} className="flex items-center justify-between p-3 rounded-lg border">
                <div>
                  <p className="font-medium text-sm">{payout.event}</p>
                  <p className="text-xs text-muted-foreground">{payout.date} · {payout.method}</p>
                </div>
                <div className="flex items-center gap-3">
                  <span className="font-semibold">${payout.amount.toLocaleString()}</span>
                  <Badge
                    variant={payout.status === "completed" ? "default" : payout.status === "processing" ? "secondary" : "outline"}
                    className="text-xs"
                  >
                    {payout.status}
                  </Badge>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default RevenuePayouts;
