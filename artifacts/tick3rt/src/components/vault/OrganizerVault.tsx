import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  Archive, ArrowUpRight, CalendarDays, CircleDollarSign, Layers3,
  MoreHorizontal, Send, TicketCheck, Users,
} from "lucide-react";

const batches = [
  {
    id: "batch-1",
    event: "Bass Drop Festival 2026",
    date: "Sep 18, 2026",
    batch: "General Admission",
    issued: 800,
    claimed: 614,
    checkedIn: 0,
    status: "Distributing",
    royalty: "8%",
  },
  {
    id: "batch-2",
    event: "Tech Innovation Summit",
    date: "Oct 04, 2026",
    batch: "Early Bird",
    issued: 250,
    claimed: 250,
    checkedIn: 0,
    status: "Fully claimed",
    royalty: "5%",
  },
  {
    id: "batch-3",
    event: "Art After Dark",
    date: "Aug 15, 2026",
    batch: "All access",
    issued: 180,
    claimed: 176,
    checkedIn: 164,
    status: "Completed",
    royalty: "10%",
  },
];

const OrganizerVault = () => {
  const issued = batches.reduce((sum, batch) => sum + batch.issued, 0);
  const claimed = batches.reduce((sum, batch) => sum + batch.claimed, 0);

  return (
    <div className="space-y-6">
      <div className="flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
        <div>
          <div className="mb-2 flex items-center gap-2 text-xs font-semibold uppercase tracking-[0.18em] text-primary">
            <Archive className="h-3.5 w-3.5" />
            Organiser inventory
          </div>
          <h1 className="text-3xl font-bold tracking-tight">Organiser Vault</h1>
          <p className="mt-2 max-w-2xl text-sm text-muted-foreground">
            Track issued ticket batches, distribution progress, check-ins, and royalties earned when tickets are resold.
          </p>
        </div>
        <Button className="gap-2">
          <Send className="h-4 w-4" />
          Distribute tickets
        </Button>
      </div>

      <div className="grid grid-cols-2 gap-3 lg:grid-cols-4">
        {[
          { label: "Tickets issued", value: issued.toLocaleString(), icon: Layers3, color: "text-violet-500" },
          { label: "Claimed", value: claimed.toLocaleString(), icon: TicketCheck, color: "text-emerald-500" },
          { label: "Active events", value: "2", icon: CalendarDays, color: "text-blue-500" },
          { label: "Resale royalties", value: "$1,284", icon: CircleDollarSign, color: "text-amber-500" },
        ].map(({ label, value, icon: Icon, color }) => (
          <Card key={label} className="border-border/60 bg-card/60">
            <CardContent className="p-4 sm:p-5">
              <Icon className={`mb-3 h-5 w-5 ${color}`} />
              <p className="text-xl font-bold sm:text-2xl">{value}</p>
              <p className="mt-1 text-xs text-muted-foreground">{label}</p>
            </CardContent>
          </Card>
        ))}
      </div>

      <Card className="border-border/60 overflow-hidden">
        <CardHeader className="border-b border-border/60 bg-muted/20">
          <div className="flex items-center justify-between">
            <div>
              <CardTitle className="text-base">Event-linked batches</CardTitle>
              <p className="mt-1 text-xs text-muted-foreground">Inventory is grouped by event and ticket release.</p>
            </div>
            <Button variant="outline" size="sm" className="gap-1.5">
              View reports <ArrowUpRight className="h-3.5 w-3.5" />
            </Button>
          </div>
        </CardHeader>
        <CardContent className="p-0">
          <div className="divide-y divide-border/60">
            {batches.map((batch) => {
              const claimedPercent = Math.round((batch.claimed / batch.issued) * 100);
              return (
                <div key={batch.id} className="p-4 sm:p-5">
                  <div className="flex items-start justify-between gap-3">
                    <div className="min-w-0">
                      <div className="flex flex-wrap items-center gap-2">
                        <h2 className="font-semibold">{batch.event}</h2>
                        <Badge variant="outline" className="text-[10px]">{batch.status}</Badge>
                      </div>
                      <p className="mt-1 text-xs text-muted-foreground">{batch.date} · {batch.batch}</p>
                    </div>
                    <Button variant="ghost" size="icon" className="h-8 w-8 shrink-0" aria-label={`Actions for ${batch.event}`}>
                      <MoreHorizontal className="h-4 w-4" />
                    </Button>
                  </div>

                  <div className="mt-4 h-2 overflow-hidden rounded-full bg-muted">
                    <div className="h-full rounded-full bg-primary" style={{ width: `${claimedPercent}%` }} />
                  </div>
                  <div className="mt-2 flex justify-between text-[11px] text-muted-foreground">
                    <span>{batch.claimed.toLocaleString()} of {batch.issued.toLocaleString()} claimed</span>
                    <span>{claimedPercent}%</span>
                  </div>

                  <div className="mt-4 grid grid-cols-3 gap-2 rounded-xl bg-muted/30 p-3 text-center">
                    <div>
                      <p className="font-semibold">{batch.issued.toLocaleString()}</p>
                      <p className="text-[10px] text-muted-foreground">Issued</p>
                    </div>
                    <div className="border-x border-border/60">
                      <p className="font-semibold">{batch.checkedIn.toLocaleString()}</p>
                      <p className="text-[10px] text-muted-foreground">Checked in</p>
                    </div>
                    <div>
                      <p className="font-semibold">{batch.royalty}</p>
                      <p className="text-[10px] text-muted-foreground">Resale royalty</p>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </CardContent>
      </Card>

      <Card className="border-amber-500/20 bg-amber-500/5">
        <CardContent className="flex items-start gap-3 p-4">
          <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-amber-500/10">
            <Users className="h-4 w-4 text-amber-600" />
          </div>
          <div>
            <p className="text-sm font-semibold">Royalty protection stays attached</p>
            <p className="mt-1 text-xs text-muted-foreground">
              Your configured royalty is applied automatically whenever an eligible ticket changes hands in the resale marketplace.
            </p>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default OrganizerVault;