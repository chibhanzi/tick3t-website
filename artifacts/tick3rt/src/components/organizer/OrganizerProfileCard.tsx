import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { BadgeCheck, Plus, Instagram, Twitter, Users, Calendar, Ticket } from "lucide-react";
import {
  fetchOrganizerProfile,
  loadOrganizerProfile,
  ORG_PROFILE_UPDATED_EVENT,
  saveOrganizerProfile,
  type OrganizerProfile,
} from "./OrganizerSettings";

interface OrganizerProfileCardProps {
  name: string;
  email: string;
  userId: string;
  stats: {
    totalFollowers: number;
    totalEvents: number;
    totalTicketsSold: number;
  };
}

const fmt = (n: number) =>
  n >= 1_000_000
    ? `${(n / 1_000_000).toFixed(1)}M`
    : n >= 1000
    ? `${(n / 1000).toFixed(n >= 10000 ? 0 : 1)}k`
    : n.toString();

const initials = (name: string) =>
  name
    .split(" ")
    .map((w) => w[0])
    .join("")
    .toUpperCase()
    .slice(0, 2);

// Deterministic hue from name so each organiser gets a unique accent colour
const accentFromName = (name: string) => {
  let hash = 0;
  for (let i = 0; i < name.length; i++) hash = name.charCodeAt(i) + ((hash << 5) - hash);
  const hue = Math.abs(hash) % 360;
  return `hsl(${hue},70%,55%)`;
};

export const OrganizerProfileCard = ({ name, email, userId, stats }: OrganizerProfileCardProps) => {
  const accent = accentFromName(name);
  const abbr = initials(name || "Organiser");

  const [profile, setProfile] = useState<OrganizerProfile>({ bio: "", instagram: "", twitter: "" });

  useEffect(() => {
    if (!userId) return;
    const saved = loadOrganizerProfile(userId);
    setProfile(saved);
    let cancelled = false;

    fetchOrganizerProfile(userId)
      .then((remoteProfile) => {
        if (cancelled) return;
        setProfile(remoteProfile);
        saveOrganizerProfile(userId, remoteProfile);
      })
      .catch(() => {
        // The local cache is the offline/loading fallback.
      });

    // Same-window updates (Settings tab saves in the same session)
    const onSameWindow = (e: Event) => {
      const detail = (e as CustomEvent<{ userId: string; profile: OrganizerProfile }>).detail;
      if (detail?.userId === userId) setProfile(detail.profile);
    };
    window.addEventListener(ORG_PROFILE_UPDATED_EVENT, onSameWindow);

    // Cross-tab updates (other tabs/windows)
    const onStorage = (e: StorageEvent) => {
      if (e.key === `tick3t.org-profile.${userId}`) {
        setProfile(loadOrganizerProfile(userId));
      }
    };
    window.addEventListener("storage", onStorage);

    return () => {
      cancelled = true;
      window.removeEventListener(ORG_PROFILE_UPDATED_EVENT, onSameWindow);
      window.removeEventListener("storage", onStorage);
    };
  }, [userId]);

  const handle = email?.split("@")[0]?.replace(/[^a-zA-Z0-9_]/g, "") || "organiser";
  const displayBio =
    profile.bio.trim() ||
    "Creating unforgettable experiences across Africa & beyond 🎶";

  return (
    <div className="rounded-2xl overflow-hidden border border-border/60 bg-card shadow-sm mb-6">

      {/* ── Cover banner ─────────────────────────────────────────────── */}
      <div
        className="relative w-full"
        style={{ height: "clamp(100px, 18vw, 160px)" }}
      >
        {/* Mesh gradient */}
        <div
          className="absolute inset-0"
          style={{
            background: `
              radial-gradient(ellipse at 20% 50%, ${accent}55 0%, transparent 60%),
              radial-gradient(ellipse at 80% 20%, #6366f155 0%, transparent 55%),
              radial-gradient(ellipse at 60% 80%, #ec489955 0%, transparent 50%),
              linear-gradient(135deg, #0f0c29, #302b63, #24243e)
            `,
          }}
        />
        {/* Subtle dot grid overlay */}
        <div
          className="absolute inset-0 opacity-[0.06]"
          style={{
            backgroundImage: "radial-gradient(circle, #fff 1px, transparent 1px)",
            backgroundSize: "24px 24px",
          }}
        />

        {/* Create Event — top right of banner */}
        <div className="absolute top-3 right-3 flex items-center gap-2">
          <Button
            asChild
            size="sm"
            className="h-8 gap-1.5 bg-white/10 hover:bg-white/20 text-white border border-white/20 backdrop-blur-sm shadow-sm text-xs"
          >
            <Link to="/create-event">
              <Plus className="h-3.5 w-3.5" />
              Create Event
            </Link>
          </Button>
        </div>
      </div>

      {/* ── Identity row ─────────────────────────────────────────────── */}
      <div className="px-5 pb-5">
        {/* Avatar — overlaps banner */}
        <div className="flex items-end justify-between -mt-8 mb-3">
          <div
            className="relative h-16 w-16 rounded-full flex items-center justify-center text-xl font-black ring-4 ring-card shadow-lg shrink-0"
            style={{ backgroundColor: accent + "22", color: accent, border: `2.5px solid ${accent}66` }}
          >
            {abbr}
            {/* Online dot */}
            <span className="absolute bottom-0.5 right-0.5 h-3 w-3 rounded-full bg-emerald-400 ring-2 ring-card" />
          </div>
        </div>

        {/* Name + badge + bio */}
        <div className="mb-3">
          <div className="flex items-center gap-1.5 flex-wrap">
            <h2 className="text-lg font-black leading-tight">{name || "Organiser"}</h2>
            <BadgeCheck className="h-4 w-4 text-primary shrink-0" />
            <Badge variant="outline" className="text-[10px] h-5 px-1.5">Verified Organiser</Badge>
          </div>
          <p className="text-xs text-muted-foreground mt-0.5">@{handle}</p>
          <p className="text-sm text-muted-foreground mt-1.5 leading-snug">{displayBio}</p>
        </div>

        {/* Stats strip */}
        <div className="flex items-center gap-4 mb-3 flex-wrap">
          {[
            { icon: Users, value: fmt(stats.totalFollowers), label: "followers" },
            { icon: Calendar, value: fmt(stats.totalEvents), label: "events" },
            { icon: Ticket, value: fmt(stats.totalTicketsSold), label: "tickets sold" },
          ].map(({ icon: Icon, value, label }, i) => (
            <div key={label} className="flex items-center gap-1.5">
              {i > 0 && <span className="text-border text-xs mr-2">·</span>}
              <Icon className="h-3.5 w-3.5 text-muted-foreground" />
              <span className="text-sm font-bold">{value}</span>
              <span className="text-xs text-muted-foreground">{label}</span>
            </div>
          ))}
        </div>

        {/* Social links — only shown when the organiser has set a handle */}
        {(profile.instagram.trim() || profile.twitter.trim()) && (
          <div className="flex items-center gap-2 flex-wrap">
            {profile.instagram.trim() && (
              <a
                href={`https://instagram.com/${profile.instagram.trim()}`}
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center gap-1.5 rounded-full border border-border/60 px-2.5 py-1 text-[11px] text-muted-foreground hover:text-foreground hover:border-border transition-colors"
              >
                <Instagram className="h-3 w-3" />
                @{profile.instagram.trim()}
              </a>
            )}
            {profile.twitter.trim() && (
              <a
                href={`https://x.com/${profile.twitter.trim()}`}
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center gap-1.5 rounded-full border border-border/60 px-2.5 py-1 text-[11px] text-muted-foreground hover:text-foreground hover:border-border transition-colors"
              >
                <Twitter className="h-3 w-3" />
                @{profile.twitter.trim()}
              </a>
            )}
          </div>
        )}
      </div>
    </div>
  );
};

export default OrganizerProfileCard;
