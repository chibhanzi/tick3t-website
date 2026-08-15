import { useEffect, useRef, useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Ticket, DollarSign, Users, TrendingUp, Activity } from "lucide-react";
import { AreaChart, Area, XAxis, Tooltip, ResponsiveContainer } from "recharts";
import { useOrganizerAnalytics } from "@/hooks/useOrganizerAnalytics";

/* ------------------------------------------------------------------ */
/*  Count-up hook                                                       */
/* ------------------------------------------------------------------ */
function useCountUp(target: number, duration = 1300) {
  const [val, setVal] = useState(0);
  const raf = useRef<number>(0);
  useEffect(() => {
    let start: number | null = null;
    const tick = (ts: number) => {
      if (start === null) start = ts;
      const elapsed = ts - start;
      const t = Math.min(elapsed / duration, 1);
      const ease = 1 - Math.pow(1 - t, 3); // cubic ease-out
      setVal(Math.round(target * ease));
      if (t < 1) raf.current = requestAnimationFrame(tick);
    };
    raf.current = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(raf.current);
  }, [target, duration]);
  return val;
}

/* ------------------------------------------------------------------ */
/*  Single stat card                                                    */
/* ------------------------------------------------------------------ */
interface StatCardProps {
  label: string;
  target: number;
  icon: React.ElementType;
  iconBg: string;
  iconColor: string;
  formatter: (v: number) => string;
}

const StatCard = ({ label, target, icon: Icon, iconBg, iconColor, formatter }: StatCardProps) => {
  const animated = useCountUp(target);
  return (
    <div className="flex flex-col items-center justify-center gap-2 p-5">
      <div className={`flex h-9 w-9 items-center justify-center rounded-full ${iconBg}`}>
        <Icon className={`h-4 w-4 ${iconColor}`} />
      </div>
      <div className="text-2xl font-bold tracking-tight tabular-nums">{formatter(animated)}</div>
      <div className="text-[11px] uppercase tracking-wider text-muted-foreground text-center">{label}</div>
    </div>
  );
};

/* ------------------------------------------------------------------ */
/*  Tooltip renderer for Recharts (avoids TS any warnings)             */
/* ------------------------------------------------------------------ */
const SparkTooltip = ({ active, payload, label }: any) => {
  if (!active || !payload?.length) return null;
  return (
    <div className="rounded-md border bg-popover px-2 py-1 shadow text-[11px]">
      <p className="text-muted-foreground">{label}</p>
      <p className="font-semibold">{payload[0].value} tickets</p>
    </div>
  );
};

/* ------------------------------------------------------------------ */
/*  Main component                                                      */
/* ------------------------------------------------------------------ */
const AnalyticsSummaryStats = () => {
  const { totalSold, grossRevenue, uniqueAttendees, avgSellThrough, sparklineData } =
    useOrganizerAnalytics();

  const fmtRevenue = (v: number) =>
    v >= 1_000_000 ? `$${(v / 1_000_000).toFixed(1)}M`
    : v >= 1_000   ? `$${(v / 1_000).toFixed(0)}k`
    : `$${v}`;

  const fmtPct = (v: number) => `${v}%`;
  const fmtNum = (v: number) => v.toLocaleString();

  return (
    <div className="space-y-4">
      {/* ── 4-card animated stat row ── */}
      <div className="rounded-2xl border border-border/60 bg-card/60 backdrop-blur-sm overflow-hidden">
        <div className="grid grid-cols-2 sm:grid-cols-4 divide-y sm:divide-y-0 divide-x-0 sm:divide-x divide-border/60">
          <StatCard
            label="Tickets Sold"       target={totalSold}
            icon={Ticket}    iconBg="bg-blue-500/10"    iconColor="text-blue-500"
            formatter={fmtNum}
          />
          <StatCard
            label="Gross Revenue"      target={grossRevenue}
            icon={DollarSign} iconBg="bg-emerald-500/10" iconColor="text-emerald-500"
            formatter={fmtRevenue}
          />
          <StatCard
            label="Unique Attendees"   target={uniqueAttendees}
            icon={Users}     iconBg="bg-violet-500/10"  iconColor="text-violet-500"
            formatter={fmtNum}
          />
          <StatCard
            label="Avg Sell-Through"   target={Math.round(avgSellThrough * 100)}
            icon={TrendingUp} iconBg="bg-orange-500/10" iconColor="text-orange-500"
            formatter={fmtPct}
          />
        </div>
      </div>

      {/* ── 30-day sparkline ── */}
      <Card className="border-border/60 bg-card/60 backdrop-blur-sm">
        <CardHeader className="pb-2 pt-4 px-5">
          <CardTitle className="text-sm font-semibold flex items-center gap-2">
            <Activity className="h-4 w-4 text-primary" />
            Ticket Sales — Last 30 Days
          </CardTitle>
        </CardHeader>
        <CardContent className="px-2 pb-4">
          <ResponsiveContainer width="100%" height={90}>
            <AreaChart data={sparklineData} margin={{ top: 5, right: 10, bottom: 0, left: 10 }}>
              <defs>
                <linearGradient id="salesGrad" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%"  stopColor="hsl(var(--primary))" stopOpacity={0.3} />
                  <stop offset="95%" stopColor="hsl(var(--primary))" stopOpacity={0.02} />
                </linearGradient>
              </defs>
              <XAxis dataKey="day" hide />
              <Tooltip content={<SparkTooltip />} />
              <Area
                type="monotone"
                dataKey="sales"
                stroke="hsl(var(--primary))"
                strokeWidth={2}
                fill="url(#salesGrad)"
                dot={false}
                activeDot={{ r: 4, strokeWidth: 0 }}
              />
            </AreaChart>
          </ResponsiveContainer>
          {/* X-axis labels — first and last */}
          <div className="flex justify-between px-2 mt-1">
            <span className="text-[10px] text-muted-foreground">{sparklineData[0]?.day}</span>
            <span className="text-[10px] text-muted-foreground">{sparklineData[sparklineData.length - 1]?.day}</span>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default AnalyticsSummaryStats;
