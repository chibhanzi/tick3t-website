import { useState } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Calendar, MapPin, Users, Search, Plus, Edit, Trash2, Eye, Copy, ChevronDown, ChevronUp, ListOrdered, UserPlus } from "lucide-react";
import { Link } from "react-router-dom";
import { tierSplit, followersGained } from "@/hooks/useOrganizerAnalytics";
import { waitlistSeed } from "@/contexts/WaitlistContext";

interface Event {
  id: string;
  title: string;
  date: string;
  location: string;
  ticketsSold: number;
  totalTickets: number;
  revenue: number;
  status: "active" | "draft" | "completed" | "cancelled";
  category: string;
}

const mockEvents: Event[] = [
  { id: "1", title: "Tech Innovation Summit 2024", date: "2024-03-25", location: "Lagos Convention Center", ticketsSold: 450, totalTickets: 500, revenue: 22500, status: "active", category: "Technology" },
  { id: "2", title: "Digital Marketing Workshop",  date: "2024-04-15", location: "Hub One, Lekki",         ticketsSold: 120, totalTickets: 150, revenue: 6000,  status: "draft",     category: "Business"    },
  { id: "3", title: "Afrobeats Night Live",         date: "2024-05-20", location: "Eko Hotel",              ticketsSold: 800, totalTickets: 800, revenue: 48000, status: "completed", category: "Music"       },
  { id: "4", title: "Web3 Builders Meetup",         date: "2024-06-10", location: "Zone Tech Park",         ticketsSold: 85,  totalTickets: 100, revenue: 4250,  status: "active",    category: "Technology"  },
  { id: "5", title: "Food & Culture Festival",      date: "2024-07-01", location: "Tafawa Balewa Square",   ticketsSold: 0,   totalTickets: 2000, revenue: 0,    status: "draft",     category: "Food"        },
];

const TIER_COLORS = ["bg-indigo-500", "bg-purple-500", "bg-pink-500"] as const;
const TIER_LABELS = ["General", "VIP", "Backstage"] as const;

const EventManagement = () => {
  const [searchQuery, setSearchQuery] = useState("");
  const [statusFilter, setStatusFilter] = useState<string>("all");
  const [events] = useState<Event[]>(mockEvents);
  const [expandedId, setExpandedId] = useState<string | null>(null);

  const filteredEvents = events.filter(event => {
    const matchesSearch = event.title.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesStatus = statusFilter === "all" || event.status === statusFilter;
    return matchesSearch && matchesStatus;
  });

  const statusColor = (status: string) => {
    switch (status) {
      case "active":    return "default";
      case "draft":     return "secondary";
      case "completed": return "outline";
      case "cancelled": return "destructive";
      default:          return "secondary";
    }
  };

  return (
    <div className="space-y-6">
      {/* Actions Bar */}
      <div className="flex flex-col sm:flex-row gap-3 items-start sm:items-center justify-between">
        <div className="flex flex-col sm:flex-row gap-3 w-full sm:w-auto">
          <div className="relative flex-1 sm:w-64">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
            <Input
              placeholder="Search events..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pl-9"
            />
          </div>
          <Select value={statusFilter} onValueChange={setStatusFilter}>
            <SelectTrigger className="w-full sm:w-36">
              <SelectValue placeholder="Status" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Status</SelectItem>
              <SelectItem value="active">Active</SelectItem>
              <SelectItem value="draft">Draft</SelectItem>
              <SelectItem value="completed">Completed</SelectItem>
              <SelectItem value="cancelled">Cancelled</SelectItem>
            </SelectContent>
          </Select>
        </div>
        <Button asChild className="w-full sm:w-auto">
          <Link to="/create-event">
            <Plus className="h-4 w-4 mr-2" />
            Create Event
          </Link>
        </Button>
      </div>

      {/* Events List */}
      <div className="space-y-3">
        {filteredEvents.map((event) => {
          const [generalPct, vipPct, backstagePct] = tierSplit(event.id);
          const gained = followersGained(event.id);
          const waitlistCount = event.ticketsSold >= event.totalTickets ? waitlistSeed(event.id) : 0;
          const isExpanded = expandedId === event.id;
          const sellPct = event.totalTickets > 0
            ? Math.round((event.ticketsSold / event.totalTickets) * 100)
            : 0;

          return (
            <Card key={event.id} className="hover:shadow-md transition-shadow">
              <CardContent className="p-4">
                {/* ── Main row ── */}
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2 mb-1">
                      <h3 className="font-semibold truncate">{event.title}</h3>
                      <Badge variant={statusColor(event.status) as any} className="text-xs shrink-0">
                        {event.status}
                      </Badge>
                    </div>
                    <div className="flex flex-wrap gap-x-4 gap-y-1 text-sm text-muted-foreground">
                      <span className="flex items-center gap-1">
                        <Calendar className="h-3 w-3" />{event.date}
                      </span>
                      <span className="flex items-center gap-1">
                        <MapPin className="h-3 w-3" />{event.location}
                      </span>
                      <span className="flex items-center gap-1">
                        <Users className="h-3 w-3" />{event.ticketsSold}/{event.totalTickets} sold
                      </span>
                    </div>
                    <div className="mt-2">
                      <div className="w-full bg-muted rounded-full h-1.5">
                        <div
                          className="bg-primary h-1.5 rounded-full transition-all"
                          style={{ width: `${sellPct}%` }}
                        />
                      </div>
                      <p className="text-xs text-muted-foreground mt-1">
                        ${event.revenue.toLocaleString()} revenue · {sellPct}% capacity
                      </p>
                    </div>
                  </div>

                  <div className="flex items-center gap-1 shrink-0">
                    {/* Analytics toggle */}
                    <Button
                      variant="ghost"
                      size="sm"
                      className="gap-1 text-xs text-muted-foreground h-8 px-2"
                      onClick={() => setExpandedId(isExpanded ? null : event.id)}
                    >
                      {isExpanded ? <ChevronUp className="h-3.5 w-3.5" /> : <ChevronDown className="h-3.5 w-3.5" />}
                      Analytics
                    </Button>
                    <Button variant="ghost" size="icon" className="h-8 w-8"><Eye className="h-4 w-4" /></Button>
                    <Button variant="ghost" size="icon" className="h-8 w-8"><Edit className="h-4 w-4" /></Button>
                    <Button variant="ghost" size="icon" className="h-8 w-8"><Copy className="h-4 w-4" /></Button>
                    <Button variant="ghost" size="icon" className="h-8 w-8 text-destructive"><Trash2 className="h-4 w-4" /></Button>
                  </div>
                </div>

                {/* ── Analytics accordion ── */}
                {isExpanded && (
                  <div className="mt-4 pt-4 border-t border-border/60 space-y-4">
                    {/* Tier breakdown stacked bar */}
                    <div>
                      <p className="text-[10px] uppercase tracking-wider text-muted-foreground mb-2 font-medium">
                        Ticket Tier Breakdown
                      </p>
                      <div className="flex h-3 w-full rounded-full overflow-hidden gap-px">
                        {([generalPct, vipPct, backstagePct] as const).map((pct, i) => (
                          <div
                            key={TIER_LABELS[i]}
                            className={`${TIER_COLORS[i]} h-full first:rounded-l-full last:rounded-r-full`}
                            style={{ width: `${pct}%` }}
                          />
                        ))}
                      </div>
                      <div className="flex items-center gap-4 mt-2 flex-wrap">
                        {TIER_LABELS.map((label, i) => (
                          <div key={label} className="flex items-center gap-1.5 text-[11px] text-muted-foreground">
                            <div className={`h-2 w-2 rounded-full ${TIER_COLORS[i]}`} />
                            {label}{" "}
                            <span className="font-semibold text-foreground">
                              {[generalPct, vipPct, backstagePct][i]}%
                            </span>
                          </div>
                        ))}
                      </div>
                    </div>

                    {/* Mini stat tiles */}
                    <div className="grid grid-cols-3 gap-2">
                      {/* Revenue */}
                      <div className="flex flex-col items-center justify-center gap-1 p-3 rounded-xl bg-emerald-500/8 border border-emerald-500/20 text-center">
                        <span className="text-[10px] uppercase tracking-wider text-muted-foreground">Revenue</span>
                        <span className="text-base font-bold text-emerald-600 dark:text-emerald-400">
                          ${event.revenue >= 1000
                            ? `${(event.revenue / 1000).toFixed(0)}k`
                            : event.revenue}
                        </span>
                      </div>

                      {/* Waitlist */}
                      <div className="flex flex-col items-center justify-center gap-1 p-3 rounded-xl bg-amber-500/8 border border-amber-500/20 text-center">
                        <div className="flex items-center gap-1">
                          <ListOrdered className="h-3 w-3 text-amber-500" />
                          <span className="text-[10px] uppercase tracking-wider text-muted-foreground">Waitlist</span>
                        </div>
                        <span className="text-base font-bold text-amber-600 dark:text-amber-400">
                          {waitlistCount > 0 ? waitlistCount.toLocaleString() : "—"}
                        </span>
                      </div>

                      {/* Followers gained */}
                      <div className="flex flex-col items-center justify-center gap-1 p-3 rounded-xl bg-violet-500/8 border border-violet-500/20 text-center">
                        <div className="flex items-center gap-1">
                          <UserPlus className="h-3 w-3 text-violet-500" />
                          <span className="text-[10px] uppercase tracking-wider text-muted-foreground">New Followers</span>
                        </div>
                        <span className="text-base font-bold text-violet-600 dark:text-violet-400">
                          +{gained}
                        </span>
                      </div>
                    </div>

                    {/* Sell-through callout */}
                    {sellPct >= 90 && (
                      <p className="text-[11px] text-emerald-600 dark:text-emerald-400 font-medium">
                        🔥 High demand — {sellPct}% sold through. Consider adding capacity.
                      </p>
                    )}
                    {event.ticketsSold === 0 && event.status === "draft" && (
                      <p className="text-[11px] text-muted-foreground">
                        Publish this event to start selling tickets.
                      </p>
                    )}
                  </div>
                )}
              </CardContent>
            </Card>
          );
        })}
      </div>

      {filteredEvents.length === 0 && (
        <Card>
          <CardContent className="p-12 text-center">
            <p className="text-muted-foreground">No events found matching your criteria.</p>
            <Button asChild className="mt-4">
              <Link to="/create-event">Create Your First Event</Link>
            </Button>
          </CardContent>
        </Card>
      )}
    </div>
  );
};

export default EventManagement;
