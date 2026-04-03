import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Search, Download, Mail, UserCheck, UserX, Filter } from "lucide-react";

interface Attendee {
  id: string;
  name: string;
  email: string;
  event: string;
  ticketType: string;
  status: "confirmed" | "checked-in" | "no-show" | "cancelled";
  purchaseDate: string;
  walletConnected: boolean;
}

const mockAttendees: Attendee[] = [
  { id: "1", name: "Ada Okafor", email: "ada@email.com", event: "Tech Innovation Summit", ticketType: "VIP", status: "checked-in", purchaseDate: "2024-03-10", walletConnected: true },
  { id: "2", name: "Chidi Nwosu", email: "chidi@email.com", event: "Tech Innovation Summit", ticketType: "General", status: "confirmed", purchaseDate: "2024-03-12", walletConnected: false },
  { id: "3", name: "Fatima Bello", email: "fatima@email.com", event: "Afrobeats Night Live", ticketType: "Backstage", status: "confirmed", purchaseDate: "2024-03-15", walletConnected: true },
  { id: "4", name: "Emeka Eze", email: "emeka@email.com", event: "Tech Innovation Summit", ticketType: "General", status: "no-show", purchaseDate: "2024-03-08", walletConnected: false },
  { id: "5", name: "Ngozi Adeyemi", email: "ngozi@email.com", event: "Web3 Builders Meetup", ticketType: "General", status: "cancelled", purchaseDate: "2024-03-20", walletConnected: true },
  { id: "6", name: "Tunde Bakare", email: "tunde@email.com", event: "Afrobeats Night Live", ticketType: "VIP", status: "checked-in", purchaseDate: "2024-03-18", walletConnected: false },
];

const AttendeeManagement = () => {
  const [searchQuery, setSearchQuery] = useState("");
  const [attendees] = useState<Attendee[]>(mockAttendees);

  const filteredAttendees = attendees.filter(a =>
    a.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
    a.email.toLowerCase().includes(searchQuery.toLowerCase()) ||
    a.event.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const statusIcon = (status: string) => {
    switch (status) {
      case "checked-in": return <UserCheck className="h-3 w-3" />;
      case "no-show": case "cancelled": return <UserX className="h-3 w-3" />;
      default: return null;
    }
  };

  const statusVariant = (status: string) => {
    switch (status) {
      case "checked-in": return "default";
      case "confirmed": return "secondary";
      case "no-show": return "destructive";
      case "cancelled": return "outline";
      default: return "secondary";
    }
  };

  const totalCheckedIn = attendees.filter(a => a.status === "checked-in").length;
  const totalConfirmed = attendees.filter(a => a.status === "confirmed").length;
  const totalNoShow = attendees.filter(a => a.status === "no-show").length;

  return (
    <div className="space-y-6">
      {/* Stats */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
        <Card>
          <CardContent className="p-4 text-center">
            <div className="text-2xl font-bold">{attendees.length}</div>
            <div className="text-xs text-muted-foreground">Total Attendees</div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4 text-center">
            <div className="text-2xl font-bold text-green-600">{totalCheckedIn}</div>
            <div className="text-xs text-muted-foreground">Checked In</div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4 text-center">
            <div className="text-2xl font-bold text-blue-600">{totalConfirmed}</div>
            <div className="text-xs text-muted-foreground">Confirmed</div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4 text-center">
            <div className="text-2xl font-bold text-red-600">{totalNoShow}</div>
            <div className="text-xs text-muted-foreground">No Shows</div>
          </CardContent>
        </Card>
      </div>

      {/* Search & Actions */}
      <div className="flex flex-col sm:flex-row gap-3 items-start sm:items-center justify-between">
        <div className="relative w-full sm:w-72">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
          <Input
            placeholder="Search attendees..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="pl-9"
          />
        </div>
        <div className="flex gap-2">
          <Button variant="outline" size="sm">
            <Mail className="h-4 w-4 mr-2" />
            Email All
          </Button>
          <Button variant="outline" size="sm">
            <Download className="h-4 w-4 mr-2" />
            Export CSV
          </Button>
        </div>
      </div>

      {/* Table */}
      <Card>
        <CardContent className="p-0">
          <div className="overflow-x-auto">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Name</TableHead>
                  <TableHead className="hidden md:table-cell">Email</TableHead>
                  <TableHead>Event</TableHead>
                  <TableHead>Ticket</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead className="hidden md:table-cell">Wallet</TableHead>
                  <TableHead>Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filteredAttendees.map((attendee) => (
                  <TableRow key={attendee.id}>
                    <TableCell className="font-medium">{attendee.name}</TableCell>
                    <TableCell className="hidden md:table-cell text-muted-foreground">{attendee.email}</TableCell>
                    <TableCell className="text-sm">{attendee.event}</TableCell>
                    <TableCell>
                      <Badge variant="outline" className="text-xs">{attendee.ticketType}</Badge>
                    </TableCell>
                    <TableCell>
                      <Badge variant={statusVariant(attendee.status) as any} className="text-xs flex items-center gap-1 w-fit">
                        {statusIcon(attendee.status)}
                        {attendee.status}
                      </Badge>
                    </TableCell>
                    <TableCell className="hidden md:table-cell">
                      {attendee.walletConnected ? (
                        <Badge variant="outline" className="text-xs text-green-600">Connected</Badge>
                      ) : (
                        <span className="text-xs text-muted-foreground">Email only</span>
                      )}
                    </TableCell>
                    <TableCell>
                      <div className="flex gap-1">
                        <Button variant="ghost" size="icon" className="h-8 w-8">
                          <Mail className="h-3 w-3" />
                        </Button>
                        <Button variant="ghost" size="icon" className="h-8 w-8">
                          <UserCheck className="h-3 w-3" />
                        </Button>
                      </div>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default AttendeeManagement;
