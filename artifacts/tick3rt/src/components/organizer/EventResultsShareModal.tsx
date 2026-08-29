import { useRef, useState } from "react";
import { toPng } from "html-to-image";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import {
  Download,
  Copy,
  Check,
  Share2,
  Calendar,
  MapPin,
  Ticket,
  DollarSign,
  TrendingUp,
  Users,
} from "lucide-react";
import { tierSplit } from "@/hooks/useOrganizerAnalytics";

interface EventResultsShareModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  event: {
    id: string;
    title: string;
    date: string;
    location: string;
    ticketsSold: number;
    totalTickets: number;
    revenue: number;
    category: string;
  };
}

const TIER_LABELS = ["General", "VIP", "Backstage"] as const;

export function EventResultsShareModal({
  open,
  onOpenChange,
  event,
}: EventResultsShareModalProps) {
  const cardRef = useRef<HTMLDivElement>(null);
  const [downloading, setDownloading] = useState(false);
  const [copied, setCopied] = useState(false);
  const [linkCopied, setLinkCopied] = useState(false);

  const sellPct =
    event.totalTickets > 0
      ? Math.round((event.ticketsSold / event.totalTickets) * 100)
      : 0;

  const fmtRevenue = (v: number) =>
    v >= 1_000_000
      ? `$${(v / 1_000_000).toFixed(1)}M`
      : v >= 1_000
      ? `$${(v / 1_000).toFixed(1)}k`
      : `$${v}`;

  const formattedDate = new Date(event.date).toLocaleDateString("en-US", {
    month: "long",
    day: "numeric",
    year: "numeric",
    timeZone: "UTC",
  });

  const [generalPct, vipPct, backstagePct] = tierSplit(event.id);
  const tierData = [generalPct, vipPct, backstagePct];

  const handleDownload = async () => {
    if (!cardRef.current) return;
    setDownloading(true);
    try {
      const dataUrl = await toPng(cardRef.current, {
        cacheBust: true,
        pixelRatio: 2,
        backgroundColor: "#0f0f1a",
      });
      const link = document.createElement("a");
      link.download = `${event.title.replace(/\s+/g, "-")}-results.png`;
      link.href = dataUrl;
      link.click();
    } catch (err) {
      console.error("Failed to capture card:", err);
    } finally {
      setDownloading(false);
    }
  };

  const handleCopyImage = async () => {
    if (!cardRef.current) return;
    try {
      const dataUrl = await toPng(cardRef.current, {
        cacheBust: true,
        pixelRatio: 2,
        backgroundColor: "#0f0f1a",
      });
      const blob = await (await fetch(dataUrl)).blob();
      await navigator.clipboard.write([
        new ClipboardItem({ "image/png": blob }),
      ]);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch {
      // Fallback: just download
      handleDownload();
    }
  };

  const handleCopyLink = async () => {
    // Deep-links to the organiser dashboard with the event analytics accordion pre-expanded
    const link = `${window.location.origin}/organizer-dashboard?event=${event.id}&tab=events`;
    await navigator.clipboard.writeText(link);
    setLinkCopied(true);
    setTimeout(() => setLinkCopied(false), 2000);
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-lg">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <Share2 className="h-4 w-4 text-primary" />
            Share Event Results
          </DialogTitle>
        </DialogHeader>

        <p className="text-sm text-muted-foreground -mt-1">
          Download or copy the success card to share on social media.
        </p>

        {/* ── Success Card (the div that gets captured) ── */}
        <div
          ref={cardRef}
          className="rounded-2xl overflow-hidden"
          style={{
            background: "linear-gradient(135deg, #0f0f1a 0%, #1a1035 50%, #0f1a2a 100%)",
            fontFamily: "'Inter', 'Segoe UI', sans-serif",
            padding: "32px",
            position: "relative",
          }}
        >
          {/* Background accent blobs */}
          <div
            style={{
              position: "absolute",
              top: -40,
              right: -40,
              width: 180,
              height: 180,
              borderRadius: "50%",
              background: "radial-gradient(circle, rgba(139,92,246,0.25) 0%, transparent 70%)",
              pointerEvents: "none",
            }}
          />
          <div
            style={{
              position: "absolute",
              bottom: -30,
              left: -30,
              width: 140,
              height: 140,
              borderRadius: "50%",
              background: "radial-gradient(circle, rgba(59,130,246,0.2) 0%, transparent 70%)",
              pointerEvents: "none",
            }}
          />

          {/* Header: logo + badge */}
          <div
            style={{
              display: "flex",
              alignItems: "center",
              justifyContent: "space-between",
              marginBottom: 24,
            }}
          >
            <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
              <div
                style={{
                  width: 32,
                  height: 32,
                  borderRadius: 8,
                  background: "linear-gradient(135deg, #8b5cf6, #3b82f6)",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  fontSize: 16,
                  fontWeight: 700,
                  color: "#fff",
                }}
              >
                T
              </div>
              <span
                style={{
                  fontSize: 15,
                  fontWeight: 700,
                  color: "#fff",
                  letterSpacing: "-0.3px",
                }}
              >
                Tick3t
              </span>
            </div>
            <span
              style={{
                background: "rgba(139,92,246,0.25)",
                border: "1px solid rgba(139,92,246,0.5)",
                borderRadius: 20,
                padding: "3px 10px",
                fontSize: 11,
                fontWeight: 600,
                color: "#c4b5fd",
                letterSpacing: "0.5px",
                textTransform: "uppercase",
              }}
            >
              Event Complete
            </span>
          </div>

          {/* Event title */}
          <h2
            style={{
              fontSize: 22,
              fontWeight: 800,
              color: "#ffffff",
              margin: "0 0 8px 0",
              lineHeight: 1.2,
              letterSpacing: "-0.5px",
            }}
          >
            {event.title}
          </h2>

          {/* Date & location */}
          <div
            style={{
              display: "flex",
              gap: 16,
              marginBottom: 28,
              flexWrap: "wrap",
            }}
          >
            <span
              style={{
                fontSize: 12,
                color: "rgba(255,255,255,0.55)",
                display: "flex",
                alignItems: "center",
                gap: 4,
              }}
            >
              📅 {formattedDate}
            </span>
            <span
              style={{
                fontSize: 12,
                color: "rgba(255,255,255,0.55)",
                display: "flex",
                alignItems: "center",
                gap: 4,
              }}
            >
              📍 {event.location}
            </span>
          </div>

          {/* Key metrics grid */}
          <div
            style={{
              display: "grid",
              gridTemplateColumns: "repeat(3, 1fr)",
              gap: 12,
              marginBottom: 24,
            }}
          >
            {/* Tickets Sold */}
            <div
              style={{
                background: "rgba(59,130,246,0.12)",
                border: "1px solid rgba(59,130,246,0.25)",
                borderRadius: 12,
                padding: "14px 10px",
                textAlign: "center",
              }}
            >
              <div
                style={{
                  fontSize: 10,
                  color: "rgba(255,255,255,0.5)",
                  textTransform: "uppercase",
                  letterSpacing: "0.8px",
                  marginBottom: 6,
                }}
              >
                Tickets Sold
              </div>
              <div
                style={{
                  fontSize: 24,
                  fontWeight: 800,
                  color: "#93c5fd",
                  lineHeight: 1,
                }}
              >
                {event.ticketsSold.toLocaleString()}
              </div>
            </div>

            {/* Revenue */}
            <div
              style={{
                background: "rgba(16,185,129,0.12)",
                border: "1px solid rgba(16,185,129,0.25)",
                borderRadius: 12,
                padding: "14px 10px",
                textAlign: "center",
              }}
            >
              <div
                style={{
                  fontSize: 10,
                  color: "rgba(255,255,255,0.5)",
                  textTransform: "uppercase",
                  letterSpacing: "0.8px",
                  marginBottom: 6,
                }}
              >
                Revenue
              </div>
              <div
                style={{
                  fontSize: 24,
                  fontWeight: 800,
                  color: "#6ee7b7",
                  lineHeight: 1,
                }}
              >
                {fmtRevenue(event.revenue)}
              </div>
            </div>

            {/* Sell-through */}
            <div
              style={{
                background: "rgba(249,115,22,0.12)",
                border: "1px solid rgba(249,115,22,0.25)",
                borderRadius: 12,
                padding: "14px 10px",
                textAlign: "center",
              }}
            >
              <div
                style={{
                  fontSize: 10,
                  color: "rgba(255,255,255,0.5)",
                  textTransform: "uppercase",
                  letterSpacing: "0.8px",
                  marginBottom: 6,
                }}
              >
                Sell-Through
              </div>
              <div
                style={{
                  fontSize: 24,
                  fontWeight: 800,
                  color: "#fdba74",
                  lineHeight: 1,
                }}
              >
                {sellPct}%
              </div>
            </div>
          </div>

          {/* Tier breakdown bar */}
          <div style={{ marginBottom: 20 }}>
            <div
              style={{
                fontSize: 10,
                color: "rgba(255,255,255,0.4)",
                textTransform: "uppercase",
                letterSpacing: "0.8px",
                marginBottom: 8,
              }}
            >
              Ticket Tier Split
            </div>
            <div
              style={{
                display: "flex",
                height: 8,
                borderRadius: 4,
                overflow: "hidden",
                gap: 2,
              }}
            >
              {tierData.map((pct, i) => {
                const colors = ["#6366f1", "#a855f7", "#ec4899"];
                return (
                  <div
                    key={i}
                    style={{
                      width: `${pct}%`,
                      background: colors[i],
                      borderRadius: i === 0 ? "4px 0 0 4px" : i === 2 ? "0 4px 4px 0" : 0,
                    }}
                  />
                );
              })}
            </div>
            <div
              style={{
                display: "flex",
                gap: 16,
                marginTop: 8,
                flexWrap: "wrap",
              }}
            >
              {TIER_LABELS.map((label, i) => {
                const dotColors = ["#6366f1", "#a855f7", "#ec4899"];
                return (
                  <div
                    key={label}
                    style={{
                      display: "flex",
                      alignItems: "center",
                      gap: 5,
                      fontSize: 11,
                      color: "rgba(255,255,255,0.55)",
                    }}
                  >
                    <div
                      style={{
                        width: 7,
                        height: 7,
                        borderRadius: "50%",
                        background: dotColors[i],
                        flexShrink: 0,
                      }}
                    />
                    {label}{" "}
                    <span style={{ color: "#fff", fontWeight: 600 }}>
                      {tierData[i]}%
                    </span>
                  </div>
                );
              })}
            </div>
          </div>

          {/* Footer tagline */}
          <div
            style={{
              borderTop: "1px solid rgba(255,255,255,0.08)",
              paddingTop: 16,
              display: "flex",
              alignItems: "center",
              justifyContent: "space-between",
            }}
          >
            <span
              style={{
                fontSize: 11,
                color: "rgba(255,255,255,0.35)",
                fontStyle: "italic",
              }}
            >
              Powered by Tick3t
            </span>
            <span
              style={{
                fontSize: 11,
                color: "rgba(255,255,255,0.35)",
              }}
            >
              tick3t.app
            </span>
          </div>
        </div>

        {/* ── Action Buttons ── */}
        <div className="flex flex-col sm:flex-row gap-2 mt-1">
          <Button
            variant="default"
            className="flex-1 gap-2"
            onClick={handleDownload}
            disabled={downloading}
          >
            <Download className="h-4 w-4" />
            {downloading ? "Generating…" : "Download PNG"}
          </Button>
          <Button
            variant="outline"
            className="flex-1 gap-2"
            onClick={handleCopyImage}
          >
            {copied ? (
              <>
                <Check className="h-4 w-4 text-emerald-500" /> Copied!
              </>
            ) : (
              <>
                <Copy className="h-4 w-4" /> Copy Image
              </>
            )}
          </Button>
          <Button
            variant="ghost"
            className="flex-1 gap-2 text-muted-foreground"
            onClick={handleCopyLink}
          >
            {linkCopied ? (
              <>
                <Check className="h-4 w-4 text-emerald-500" /> Link Copied!
              </>
            ) : (
              <>
                <Share2 className="h-4 w-4" /> Copy Link
              </>
            )}
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
}
