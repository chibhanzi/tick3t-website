import { useMemo } from "react";

/* ------------------------------------------------------------------ */
/*  Shared mock events — IDs match EventManagement's internal data     */
/* ------------------------------------------------------------------ */
export interface OrganizerEvent {
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

export const ORGANIZER_EVENTS: OrganizerEvent[] = [
  { id: "1", title: "Tech Innovation Summit 2024", date: "2024-03-25", location: "Lagos Convention Center", ticketsSold: 450, totalTickets: 500, revenue: 22500, status: "active", category: "Technology" },
  { id: "2", title: "Digital Marketing Workshop",  date: "2024-04-15", location: "Hub One, Lekki",         ticketsSold: 120, totalTickets: 150, revenue: 6000,  status: "draft",     category: "Business"    },
  { id: "3", title: "Afrobeats Night Live",         date: "2024-05-20", location: "Eko Hotel",              ticketsSold: 800, totalTickets: 800, revenue: 48000, status: "completed", category: "Music"       },
  { id: "4", title: "Web3 Builders Meetup",         date: "2024-06-10", location: "Zone Tech Park",         ticketsSold: 85,  totalTickets: 100, revenue: 4250,  status: "active",    category: "Technology"  },
  { id: "5", title: "Food & Culture Festival",      date: "2024-07-01", location: "Tafawa Balewa Square",   ticketsSold: 0,   totalTickets: 2000, revenue: 0,    status: "draft",     category: "Food"        },
];

/* ------------------------------------------------------------------ */
/*  Deterministic helpers (seeded by event id)                         */
/* ------------------------------------------------------------------ */
const hashId = (id: string): number => {
  let h = 0;
  for (let i = 0; i < id.length; i++) h = (h * 31 + id.charCodeAt(i)) & 0x7fff;
  return h;
};

/** Returns [generalPct, vipPct, backstagePct] that sum to 100 */
export const tierSplit = (id: string): [number, number, number] => {
  const h = hashId(id);
  const general   = 45 + (h % 25);          // 45-69%
  const vip       = 20 + ((h >> 4) % 15);   // 20-34%
  const backstage = Math.max(100 - general - vip, 5);
  return [general, vip, backstage];
};

/** Followers gained since the event was published */
export const followersGained = (id: string): number => 10 + (hashId(id) % 80);

/** 30 data-points of daily ticket sales, summing to ~totalSold */
export const generateSparkline = (totalSold: number): Array<{ day: string; sales: number }> => {
  let seed = totalSold || 1;
  const lcg = () => {
    seed = (seed * 1664525 + 1013904223) & 0x7fffffff;
    return seed / 0x7fffffff;
  };

  const weights = Array.from({ length: 30 }, (_, i) => {
    const x = i / 29;
    const bell = Math.exp(-Math.pow((x - 0.65) * 3.5, 2));
    return Math.max(0.05, bell + lcg() * 0.25);
  });

  const totalW = weights.reduce((a, b) => a + b, 0);
  // Fixed reference date for determinism across renders
  const base = new Date("2024-03-15T00:00:00Z");

  return weights.map((w, i) => {
    const d = new Date(base);
    d.setUTCDate(d.getUTCDate() - (29 - i));
    return {
      day: d.toLocaleDateString("en-US", { month: "short", day: "numeric" }),
      sales: Math.round((w / totalW) * totalSold),
    };
  });
};

/* ------------------------------------------------------------------ */
/*  Hook                                                                */
/* ------------------------------------------------------------------ */
export interface OrganizerAnalytics {
  totalSold: number;
  grossRevenue: number;
  uniqueAttendees: number;
  avgSellThrough: number; // 0-1
  sparklineData: Array<{ day: string; sales: number }>;
}

export const useOrganizerAnalytics = (): OrganizerAnalytics =>
  useMemo(() => {
    const events = ORGANIZER_EVENTS;
    const totalSold     = events.reduce((s, e) => s + e.ticketsSold, 0);
    const grossRevenue  = events.reduce((s, e) => s + e.revenue, 0);
    const uniqueAttendees = totalSold;
    const nonZero = events.filter(e => e.totalTickets > 0);
    const avgSellThrough = nonZero.length
      ? nonZero.reduce((s, e) => s + e.ticketsSold / e.totalTickets, 0) / nonZero.length
      : 0;
    return { totalSold, grossRevenue, uniqueAttendees, avgSellThrough, sparklineData: generateSparkline(totalSold) };
  }, []);
