import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { QrCode, Search, UserCheck, Clock, AlertTriangle, CheckCircle2, XCircle } from "lucide-react";

interface ScanResult {
  id: string;
  attendeeName: string;
  ticketType: string;
  event: string;
  time: string;
  status: "valid" | "already-scanned" | "invalid";
}

const recentScans: ScanResult[] = [
  { id: "1", attendeeName: "Ada Okafor", ticketType: "VIP", event: "Tech Innovation Summit", time: "2 min ago", status: "valid" },
  { id: "2", attendeeName: "Chidi Nwosu", ticketType: "General", event: "Tech Innovation Summit", time: "5 min ago", status: "valid" },
  { id: "3", attendeeName: "Unknown Ticket", ticketType: "General", event: "Tech Innovation Summit", time: "8 min ago", status: "invalid" },
  { id: "4", attendeeName: "Fatima Bello", ticketType: "General", event: "Tech Innovation Summit", time: "12 min ago", status: "already-scanned" },
];

const ScannerCheckin = () => {
  const [manualCode, setManualCode] = useState("");
  const [scanActive, setScanActive] = useState(false);

  const checkinStats = {
    total: 450,
    checkedIn: 287,
    remaining: 163,
    rate: 63.8,
  };

  return (
    <div className="space-y-6">
      {/* Check-in Stats */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
        <Card>
          <CardContent className="p-4 text-center">
            <div className="text-2xl font-bold">{checkinStats.total}</div>
            <div className="text-xs text-muted-foreground">Total Tickets</div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4 text-center">
            <div className="text-2xl font-bold text-green-600">{checkinStats.checkedIn}</div>
            <div className="text-xs text-muted-foreground">Checked In</div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4 text-center">
            <div className="text-2xl font-bold text-amber-600">{checkinStats.remaining}</div>
            <div className="text-xs text-muted-foreground">Remaining</div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4 text-center">
            <div className="text-2xl font-bold">{checkinStats.rate}%</div>
            <div className="text-xs text-muted-foreground">Check-in Rate</div>
          </CardContent>
        </Card>
      </div>

      {/* Scanner */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <QrCode className="h-5 w-5" />
            Ticket Scanner
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="flex flex-col items-center justify-center p-8 border-2 border-dashed rounded-xl bg-muted/30">
            {scanActive ? (
              <div className="text-center space-y-3">
                <div className="w-48 h-48 bg-black rounded-xl flex items-center justify-center mx-auto">
                  <QrCode className="h-16 w-16 text-white animate-pulse" />
                </div>
                <p className="text-sm text-muted-foreground">Camera active — point at ticket QR code</p>
                <Button variant="destructive" size="sm" onClick={() => setScanActive(false)}>
                  Stop Scanner
                </Button>
              </div>
            ) : (
              <div className="text-center space-y-3">
                <QrCode className="h-12 w-12 mx-auto text-muted-foreground" />
                <p className="text-sm text-muted-foreground">Scan QR codes to check in attendees</p>
                <Button onClick={() => setScanActive(true)}>
                  <QrCode className="h-4 w-4 mr-2" />
                  Start Scanner
                </Button>
              </div>
            )}
          </div>

          {/* Manual Entry */}
          <div className="flex gap-2">
            <Input
              placeholder="Enter ticket code manually..."
              value={manualCode}
              onChange={(e) => setManualCode(e.target.value)}
            />
            <Button variant="outline">
              <Search className="h-4 w-4 mr-2" />
              Verify
            </Button>
          </div>
        </CardContent>
      </Card>

      {/* Recent Scans */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2 text-base">
            <Clock className="h-4 w-4" />
            Recent Scans
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-3">
            {recentScans.map((scan) => (
              <div key={scan.id} className="flex items-center justify-between p-3 rounded-lg bg-muted/50">
                <div className="flex items-center gap-3">
                  {scan.status === "valid" && <CheckCircle2 className="h-5 w-5 text-green-600 shrink-0" />}
                  {scan.status === "already-scanned" && <AlertTriangle className="h-5 w-5 text-amber-600 shrink-0" />}
                  {scan.status === "invalid" && <XCircle className="h-5 w-5 text-red-600 shrink-0" />}
                  <div>
                    <p className="font-medium text-sm">{scan.attendeeName}</p>
                    <p className="text-xs text-muted-foreground">{scan.ticketType} · {scan.time}</p>
                  </div>
                </div>
                <Badge
                  variant={scan.status === "valid" ? "default" : scan.status === "already-scanned" ? "secondary" : "destructive"}
                  className="text-xs"
                >
                  {scan.status === "valid" ? "Checked In" : scan.status === "already-scanned" ? "Duplicate" : "Invalid"}
                </Badge>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default ScannerCheckin;
