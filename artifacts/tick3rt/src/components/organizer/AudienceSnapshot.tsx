import { useEffect, useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { PieChart, Pie, Cell, Tooltip, ResponsiveContainer } from "recharts";
import { Users, Link, MessageCircle, AtSign, Globe } from "lucide-react";

/* ------------------------------------------------------------------ */
/*  Static mock data                                                    */
/* ------------------------------------------------------------------ */
const TIER_DATA = [
  { name: "General Admission", short: "General",  value: 55, color: "#6366f1" },
  { name: "VIP",               short: "VIP",      value: 30, color: "#8b5cf6" },
  { name: "Backstage Pass",    short: "Backstage", value: 15, color: "#d946ef" },
];

const REFERRAL_DATA = [
  { source: "Direct link",     pct: 42, Icon: Link            },
  { source: "WhatsApp share",  pct: 28, Icon: MessageCircle   },
  { source: "Instagram",       pct: 18, Icon: AtSign          },
  { source: "Other",           pct: 12, Icon: Globe           },
];

/* ------------------------------------------------------------------ */
/*  Custom Recharts tooltip                                             */
/* ------------------------------------------------------------------ */
const TierTooltip = ({ active, payload }: any) => {
  if (!active || !payload?.length) return null;
  const d = payload[0];
  return (
    <div className="rounded-md border bg-popover px-2 py-1 shadow text-[11px]">
      <p className="font-semibold">{d.name}</p>
      <p className="text-muted-foreground">{d.value}% of attendees</p>
    </div>
  );
};

/* ------------------------------------------------------------------ */
/*  Main component                                                      */
/* ------------------------------------------------------------------ */
const AudienceSnapshot = () => {
  // Animate the progress bars on mount
  const [mounted, setMounted] = useState(false);
  useEffect(() => { const t = setTimeout(() => setMounted(true), 100); return () => clearTimeout(t); }, []);

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
      {/* ── Tier split donut ── */}
      <Card className="border-border/60 bg-card/60 backdrop-blur-sm">
        <CardHeader className="pb-2 pt-4 px-5">
          <CardTitle className="text-sm font-semibold flex items-center gap-2">
            <Users className="h-4 w-4 text-violet-500" />
            Ticket Tier Split
          </CardTitle>
        </CardHeader>
        <CardContent className="flex flex-col items-center gap-4 pb-5 px-5">
          <div className="relative w-full" style={{ height: 180 }}>
            <ResponsiveContainer width="100%" height={180}>
              <PieChart>
                <Pie
                  data={TIER_DATA}
                  dataKey="value"
                  nameKey="name"
                  cx="50%" cy="50%"
                  innerRadius={54} outerRadius={74}
                  paddingAngle={3}
                  startAngle={90} endAngle={450}
                  strokeWidth={0}
                >
                  {TIER_DATA.map((entry) => (
                    <Cell key={entry.name} fill={entry.color} />
                  ))}
                </Pie>
                <Tooltip content={<TierTooltip />} />
              </PieChart>
            </ResponsiveContainer>
            {/* Centre label */}
            <div className="absolute inset-0 flex flex-col items-center justify-center pointer-events-none">
              <span className="text-2xl font-bold">1,455</span>
              <span className="text-[10px] text-muted-foreground uppercase tracking-wider">attendees</span>
            </div>
          </div>

          {/* Legend */}
          <div className="flex flex-wrap justify-center gap-x-5 gap-y-1.5">
            {TIER_DATA.map((t) => (
              <div key={t.name} className="flex items-center gap-1.5 text-xs">
                <div className="h-2.5 w-2.5 rounded-full shrink-0" style={{ background: t.color }} />
                <span>{t.short}</span>
                <span className="font-semibold text-foreground">{t.value}%</span>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* ── Referral sources ── */}
      <Card className="border-border/60 bg-card/60 backdrop-blur-sm">
        <CardHeader className="pb-2 pt-4 px-5">
          <CardTitle className="text-sm font-semibold flex items-center gap-2">
            <Globe className="h-4 w-4 text-blue-500" />
            Top Referral Sources
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4 pb-5 px-5">
          {REFERRAL_DATA.map(({ source, pct, Icon }) => (
            <div key={source} className="space-y-1.5">
              <div className="flex items-center justify-between text-xs">
                <div className="flex items-center gap-1.5 text-muted-foreground">
                  <Icon className="h-3.5 w-3.5 shrink-0" />
                  <span>{source}</span>
                </div>
                <span className="font-semibold text-foreground">{pct}%</span>
              </div>
              <div className="h-2 w-full rounded-full bg-muted overflow-hidden">
                <div
                  className="h-full rounded-full bg-primary transition-all duration-700 ease-out"
                  style={{ width: mounted ? `${pct}%` : "0%" }}
                />
              </div>
            </div>
          ))}
          <p className="text-[11px] text-muted-foreground pt-1">
            Based on UTM parameters and share activity across all events.
          </p>
        </CardContent>
      </Card>
    </div>
  );
};

export default AudienceSnapshot;
