/**
 * CustomTicketPreview — renders a ticket built from scratch (no template).
 * Driven entirely by the `design` object rather than a fixed template shape.
 */

interface CustomTicketPreviewProps {
  design: any;
  title?: string;
  date?: string;
  location?: string;
}

function buildGradient(design: any): string {
  const p = design?.primaryColor   || "#6366f1";
  const s = design?.secondaryColor || "#4338ca";
  const dir = design?.gradientDirection;
  if (dir === "radial")
    return `radial-gradient(ellipse at center, ${p}, ${s})`;
  return `linear-gradient(${dir || "135deg"}, ${p}, ${s})`;
}

function fontFamily(design: any): string {
  switch (design?.fontFamily) {
    case "serif":      return "Georgia, serif";
    case "mono":       return "monospace";
    case "rounded":    return "'Trebuchet MS', sans-serif";
    default:           return "system-ui, sans-serif";
  }
}

// ── Layout 1 · Classic Stub ────────────────────────────────────────────────
export const ClassicStubPreview = ({ design, title = "Event Title", date = "Event Date", location = "Venue" }: CustomTicketPreviewProps) => {
  const bg      = buildGradient(design);
  const text    = design?.textColor    || "#ffffff";
  const accent  = design?.accentColor  || design?.primaryColor || "#a855f7";
  const ff      = fontFamily(design);
  return (
    <div className="relative w-full overflow-hidden rounded-xl select-none" style={{ aspectRatio: "7/3", background: bg, fontFamily: ff }}>
      {/* Perforated divider */}
      <div className="absolute inset-y-0 right-[27%]">
        <div className="w-px h-full" style={{ background: `repeating-linear-gradient(to bottom, ${text}44 0px, ${text}44 5px, transparent 5px, transparent 10px)` }} />
        <div className="absolute -left-1.5 -top-1.5 w-3 h-3 rounded-full bg-background" />
        <div className="absolute -left-1.5 -bottom-1.5 w-3 h-3 rounded-full bg-background" />
      </div>
      {/* Main body */}
      <div className="absolute inset-0 right-[27%] flex flex-col justify-between p-4">
        <div>
          <div className="text-[9px] tracking-widest uppercase font-semibold mb-1" style={{ color: `${text}99` }}>Event Ticket</div>
          <div className="text-base font-black leading-tight truncate" style={{ color: text }}>{title}</div>
          <div className="text-[10px] mt-1" style={{ color: `${text}bb` }}>{date}</div>
        </div>
        <div className="text-[10px] truncate" style={{ color: `${text}88` }}>{location}</div>
      </div>
      {/* Stub */}
      <div className="absolute top-0 bottom-0 right-0 flex flex-col items-center justify-center gap-1.5 px-2" style={{ width: "27%" }}>
        <div className="w-10 h-10 rounded-lg grid grid-cols-3 grid-rows-3 gap-px p-0.5" style={{ background: `${text}22`, border: `1px solid ${text}44` }}>
          {[1,1,0,1,0,1,0,1,1].map((f, i) => (
            <div key={i} className="rounded-[1px]" style={{ background: f ? text : "transparent" }} />
          ))}
        </div>
        <div className="text-[7px] font-bold tracking-widest uppercase" style={{ color: accent, writingMode: "vertical-rl" }}>ADMIT ONE</div>
      </div>
      {/* Accent line */}
      <div className="absolute bottom-0 left-0 right-0 h-0.5" style={{ background: `linear-gradient(90deg, transparent, ${accent}, transparent)` }} />
    </div>
  );
};

// ── Layout 2 · Full Bleed ──────────────────────────────────────────────────
export const FullBleedPreview = ({ design, title = "Event Title", date = "Event Date", location = "Venue" }: CustomTicketPreviewProps) => {
  const bg   = buildGradient(design);
  const text = design?.textColor || "#ffffff";
  const ff   = fontFamily(design);
  return (
    <div className="relative w-full overflow-hidden rounded-xl select-none" style={{ aspectRatio: "7/3", background: bg, fontFamily: ff }}>
      {/* Large decorative circle */}
      <div className="absolute -right-8 -top-8 w-36 h-36 rounded-full" style={{ background: `${text}08`, border: `1px solid ${text}15` }} />
      <div className="absolute -left-4 -bottom-8 w-24 h-24 rounded-full" style={{ background: `${text}08`, border: `1px solid ${text}15` }} />
      {/* Centered content */}
      <div className="absolute inset-0 flex flex-col items-center justify-center gap-1 text-center px-6">
        <div className="text-[9px] tracking-[0.3em] uppercase" style={{ color: `${text}77` }}>Event Ticket</div>
        <div className="text-lg font-black leading-tight" style={{ color: text }}>{title}</div>
        <div className="text-[10px]" style={{ color: `${text}cc` }}>{date} &nbsp;·&nbsp; {location}</div>
        <div className="mt-2 px-3 py-0.5 rounded-full text-[8px] font-bold tracking-widest uppercase" style={{ background: `${text}20`, color: text }}>ADMIT ONE</div>
      </div>
    </div>
  );
};

// ── Layout 3 · Split Panel ─────────────────────────────────────────────────
export const SplitPanelPreview = ({ design, title = "Event Title", date = "Event Date", location = "Venue" }: CustomTicketPreviewProps) => {
  const primary   = design?.primaryColor   || "#6366f1";
  const secondary = design?.secondaryColor || "#f8fafc";
  const text      = design?.textColor      || "#ffffff";
  const accent    = design?.accentColor    || primary;
  const ff        = fontFamily(design);
  // Detect whether secondary is dark or light
  const rightText = "#1e293b";
  return (
    <div className="relative w-full overflow-hidden rounded-xl select-none" style={{ aspectRatio: "7/3", fontFamily: ff }}>
      {/* Left panel */}
      <div className="absolute inset-0 right-[40%]" style={{ background: primary }} />
      {/* Right panel */}
      <div className="absolute inset-0 left-[60%]" style={{ background: secondary === primary ? "#f8fafc" : secondary }} />
      {/* Left accent bar */}
      <div className="absolute left-0 top-0 bottom-0 w-1" style={{ background: accent }} />
      {/* Dashed divider */}
      <div className="absolute top-3 bottom-3 right-[39.5%] w-px" style={{ background: `repeating-linear-gradient(to bottom, #94a3b833 0, #94a3b833 4px, transparent 4px, transparent 8px)` }} />
      {/* Left content */}
      <div className="absolute inset-0 right-[40%] flex flex-col justify-between p-3 pl-4">
        <div>
          <div className="text-[8px] tracking-widest uppercase" style={{ color: `${text}88` }}>Event Ticket</div>
          <div className="text-sm font-black mt-0.5 leading-tight truncate" style={{ color: text }}>{title}</div>
          <div className="text-[9px] mt-1" style={{ color: `${text}aa` }}>{date}</div>
        </div>
        <div className="text-[9px] truncate" style={{ color: `${text}77` }}>{location}</div>
      </div>
      {/* Right stub */}
      <div className="absolute inset-0 left-[60%] flex flex-col items-center justify-center gap-1">
        <div className="w-9 h-9 rounded-lg grid grid-cols-3 grid-rows-3 gap-px p-0.5" style={{ background: primary + "22", border: `1px solid ${primary}44` }}>
          {[1,1,0,1,0,1,0,1,1].map((f, i) => (
            <div key={i} className="rounded-[1px]" style={{ background: f ? primary : "transparent" }} />
          ))}
        </div>
        <div className="text-[7px] font-bold tracking-widest uppercase" style={{ color: primary }}>ADMIT 1</div>
        <div className="text-[6px]" style={{ color: rightText + "66" }}>#TK-001</div>
      </div>
    </div>
  );
};

// ── Layout 4 · Minimal ─────────────────────────────────────────────────────
export const MinimalPreview = ({ design, title = "Event Title", date = "Event Date", location = "Venue" }: CustomTicketPreviewProps) => {
  const accent = design?.primaryColor || "#6366f1";
  const ff     = fontFamily(design);
  return (
    <div className="relative w-full overflow-hidden rounded-xl select-none border border-slate-200 dark:border-slate-700" style={{ aspectRatio: "7/3", background: "#ffffff", fontFamily: ff }}>
      {/* Thick left accent bar */}
      <div className="absolute left-0 top-0 bottom-0 w-2" style={{ background: accent }} />
      {/* Top hairline */}
      <div className="absolute top-5 left-6 right-6 h-px" style={{ background: "#e2e8f0" }} />
      {/* Bottom hairline */}
      <div className="absolute bottom-5 left-6 right-6 h-px" style={{ background: "#e2e8f0" }} />
      {/* Dashed right divider */}
      <div className="absolute top-5 bottom-5 right-[30%] w-px" style={{ background: `repeating-linear-gradient(to bottom, #cbd5e1 0, #cbd5e1 4px, transparent 4px, transparent 8px)` }} />
      {/* Main content */}
      <div className="absolute inset-0 left-6 right-[32%] flex flex-col justify-center gap-1">
        <div className="text-[8px] tracking-[0.25em] uppercase" style={{ color: "#94a3b8" }}>Event Ticket</div>
        <div className="text-sm font-bold leading-tight truncate" style={{ color: "#0f172a" }}>{title}</div>
        <div className="text-[9px]" style={{ color: "#94a3b8" }}>{date} · {location}</div>
      </div>
      {/* Right stub */}
      <div className="absolute top-5 right-0 bottom-5 flex flex-col items-center justify-center gap-1" style={{ width: "30%" }}>
        <div className="w-9 h-9 rounded-sm border border-slate-200 grid grid-cols-3 grid-rows-3 gap-px p-0.5">
          {[1,1,0,1,0,1,0,1,1].map((f, i) => (
            <div key={i} className="rounded-[1px]" style={{ background: f ? "#0f172a" : "#f8fafc" }} />
          ))}
        </div>
        <div className="text-[7px] font-semibold tracking-widest uppercase" style={{ color: accent }}>ADMIT 1</div>
      </div>
    </div>
  );
};

// ── Registry ───────────────────────────────────────────────────────────────
export const CUSTOM_LAYOUTS = [
  {
    id: "classic-stub",
    name: "Classic Stub",
    description: "Horizontal layout with a perforated ticket stub on the right",
    Preview: ClassicStubPreview,
  },
  {
    id: "full-bleed",
    name: "Full Bleed",
    description: "Full gradient background with centered event details",
    Preview: FullBleedPreview,
  },
  {
    id: "split-panel",
    name: "Split Panel",
    description: "Two-tone panel — solid left half, lighter stub on the right",
    Preview: SplitPanelPreview,
  },
  {
    id: "minimal",
    name: "Minimal",
    description: "Clean white card with a bold left accent stripe",
    Preview: MinimalPreview,
  },
];

export type CustomLayoutId = "classic-stub" | "full-bleed" | "split-panel" | "minimal";

/** Returns the Preview component for a given custom layout ID */
export function getCustomPreview(layoutId: string) {
  return CUSTOM_LAYOUTS.find((l) => l.id === layoutId)?.Preview ?? ClassicStubPreview;
}
