import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Search, Crown, Check } from "lucide-react";
import { cn } from "@/lib/utils";

// ─────────────────────────────────────────────
// Data model
// ─────────────────────────────────────────────
export interface EventTemplate {
  id: string;
  name: string;
  category: string;
  description: string;
  isPremium: boolean;
  tags: string[];
  /** Design tokens passed to the ticket designer */
  primaryColor: string;
  secondaryColor: string;
  accentColor: string;
  textColor: string;
  gradient: string;
  editableObjects?: Array<"category" | "overlay">;
}

export interface PreviewProps {
  title?: string;
  date?: string;
  location?: string;
}

// ─────────────────────────────────────────────
// Individual ticket preview renderers
// Every template has a completely unique shape,
// layout, and visual structure.
// ─────────────────────────────────────────────

/** 1 · Classic Stub — horizontal, right perforated stub, neon glow */
const ElectricStagePreview = ({
  title = "Electric Stage",
  date = "Sat, Dec 20 · 8:00 PM",
  location = "City Arena, Main Stage",
}: PreviewProps) => (
  <div className="relative w-full overflow-hidden rounded-lg select-none" style={{ aspectRatio: "7/3", background: "linear-gradient(135deg, #0f0c29 0%, #302b63 55%, #24243e 100%)", fontFamily: "system-ui, sans-serif" }}>
    {/* Glow orb */}
    <div className="absolute top-[-20%] left-[15%] w-24 h-24 rounded-full opacity-30" style={{ background: "radial-gradient(circle, #a855f7, transparent)" }} />
    {/* Perforation */}
    <div className="absolute inset-y-0 right-[27%]">
      <div className="w-px h-full" style={{ background: "repeating-linear-gradient(to bottom, rgba(168,85,247,0.4) 0px, rgba(168,85,247,0.4) 5px, transparent 5px, transparent 10px)" }} />
      <div className="absolute -left-1.5 top-0 w-3 h-3 rounded-full" style={{ background: "#0f0c29", transform: "translateY(-50%)" }} />
      <div className="absolute -left-1.5 bottom-0 w-3 h-3 rounded-full" style={{ background: "#0f0c29", transform: "translateY(50%)" }} />
    </div>
    {/* Main body */}
    <div className="absolute inset-0 right-[27%] flex flex-col justify-between p-3">
      <div>
        <div className="text-[8px] tracking-[0.2em] uppercase font-semibold" style={{ color: "#a855f7" }}>Concert &amp; Music</div>
        <div className="text-sm font-bold mt-0.5 leading-tight text-white truncate" style={{ textShadow: "0 0 12px rgba(168,85,247,0.8)" }}>{title}</div>
        <div className="text-[9px] mt-0.5" style={{ color: "rgba(255,255,255,0.4)" }}>{date}</div>
      </div>
      <div>
        <div className="text-[8px] uppercase tracking-widest mb-0.5" style={{ color: "rgba(255,255,255,0.35)" }}>Venue</div>
        <div className="text-[10px] font-medium text-white truncate">{location}</div>
      </div>
    </div>
    {/* Stub */}
    <div className="absolute top-0 bottom-0 right-0 flex flex-col items-center justify-center gap-1" style={{ width: "27%" }}>
      <div className="w-8 h-8 rounded grid grid-cols-3 grid-rows-3 gap-px p-0.5" style={{ background: "#a855f7" }}>
        {[1,1,0,1,0,1,0,1,1].map((f,i) => <div key={i} className="rounded-[1px]" style={{ background: f ? "#fff" : "#302b63" }} />)}
      </div>
      <div className="text-[7px]" style={{ color: "rgba(255,255,255,0.3)" }}>#TK-001</div>
      <div className="text-[7px] font-bold uppercase" style={{ color: "#a855f7", writingMode: "vertical-rl", letterSpacing: "0.1em" }}>ADMIT ONE</div>
    </div>
    {/* Bottom neon line */}
    <div className="absolute bottom-0 left-0 right-0 h-0.5" style={{ background: "linear-gradient(90deg, transparent, #a855f7, transparent)" }} />
  </div>
);

/** 2 · Golden Mic — diagonal split, gold triangle, luxury */
const GoldenMicPreview = ({
  title = "Golden Mic",
  date = "Dec 20 · 8 PM",
  location = "City Arena",
}: PreviewProps) => (
  <div className="relative w-full overflow-hidden rounded-lg select-none" style={{ aspectRatio: "7/3", background: "#0a0800", fontFamily: "system-ui, sans-serif" }}>
    {/* Gold diagonal triangle */}
    <div className="absolute inset-0" style={{ clipPath: "polygon(55% 0%, 100% 0%, 100% 100%, 35% 100%)", background: "linear-gradient(160deg, #d4af37, #ffd700, #b8860b)" }} />
    {/* Left text area */}
    <div className="absolute inset-0 flex flex-col justify-between p-3" style={{ right: "45%" }}>
      <div>
        <div className="text-[8px] tracking-widest uppercase" style={{ color: "rgba(212,175,55,0.7)" }}>Concert &amp; Music</div>
        <div className="text-sm font-bold text-white leading-tight mt-0.5 truncate" style={{ fontFamily: "Georgia, serif" }}>{title}</div>
        <div className="text-[9px] mt-0.5" style={{ color: "rgba(255,255,255,0.4)" }}>{date}</div>
      </div>
      <div className="text-[9px] text-white/60 truncate">{location}</div>
    </div>
    {/* Right stub area */}
    <div className="absolute top-0 bottom-0 right-0 flex flex-col items-center justify-center gap-1 px-2" style={{ width: "25%", background: "rgba(0,0,0,0.3)" }}>
      <div className="w-8 h-8 rounded grid grid-cols-3 grid-rows-3 gap-px p-0.5" style={{ background: "#0a0800" }}>
        {[1,1,0,1,0,1,0,1,1].map((f,i) => <div key={i} className="rounded-[1px]" style={{ background: f ? "#d4af37" : "#0a0800" }} />)}
      </div>
      <div className="text-[7px]" style={{ color: "rgba(212,175,55,0.6)" }}>#TK-002</div>
    </div>
    {/* Gold bottom border */}
    <div className="absolute bottom-0 left-0 right-0 h-0.5" style={{ background: "#d4af37" }} />
  </div>
);

/** 3 · Indie Wave — retro scalloped border, stamp aesthetic */
const IndieWavePreview = ({
  title = "Indie Wave",
  date = "Dec 20 · 8:00 PM",
  location = "City Arena",
}: PreviewProps) => (
  <div className="relative w-full overflow-hidden rounded-lg select-none" style={{ aspectRatio: "7/3", background: "linear-gradient(135deg, #f093fb 0%, #f5576c 55%, #fda085 100%)", fontFamily: "system-ui, sans-serif" }}>
    {/* Retro stamp inner border */}
    <div className="absolute inset-[4px] rounded-md border-2 border-dashed border-white/40" />
    {/* Center layout */}
    <div className="absolute inset-0 flex items-center px-5 gap-3">
      <div className="flex-1 min-w-0">
        <div className="text-[8px] tracking-[0.25em] uppercase font-bold text-white/70">Concert &amp; Music</div>
        <div className="text-sm font-black text-white leading-tight mt-0.5 truncate" style={{ letterSpacing: "-0.02em" }}>{title}</div>
        <div className="mt-1 text-[9px] text-white/60 truncate">{date} · {location}</div>
      </div>
      {/* Retro circle stamp */}
      <div className="flex-shrink-0 w-14 h-14 rounded-full border-2 border-white/50 flex flex-col items-center justify-center text-center" style={{ background: "rgba(255,255,255,0.15)" }}>
        <div className="text-[7px] font-black uppercase text-white">ADMIT</div>
        <div className="text-base font-black text-white leading-none">1</div>
        <div className="text-[6px] font-black uppercase text-white">ONE</div>
      </div>
    </div>
    {/* Wave decoration at bottom */}
    <svg className="absolute bottom-0 left-0 w-full" height="12" viewBox="0 0 400 12" preserveAspectRatio="none">
      <path d="M0,6 C50,0 100,12 150,6 C200,0 250,12 300,6 C350,0 400,12 400,6 L400,12 L0,12 Z" fill="rgba(255,255,255,0.25)" />
    </svg>
  </div>
);

/** 4 · Game Day — dark card, bold score display, accent stripe top */
const GameDayPreview = ({
  title = "Game Day",
  date = "Dec 20 · 8:00 PM",
  location = "City Arena, Main Stage",
}: PreviewProps) => (
  <div className="relative w-full overflow-hidden rounded-lg select-none" style={{ aspectRatio: "7/3", background: "#111", fontFamily: "system-ui, sans-serif" }}>
    {/* Top green stripe */}
    <div className="absolute top-0 left-0 right-0 h-1" style={{ background: "#22c55e" }} />
    {/* Diagonal slash accent */}
    <div className="absolute top-0 right-[28%] bottom-0 w-10" style={{ background: "linear-gradient(160deg, transparent 48%, #22c55e22 48%, #22c55e22 52%, transparent 52%)" }} />
    {/* Left: event info */}
    <div className="absolute inset-0 right-[30%] flex flex-col justify-between p-3 pt-3.5">
      <div>
        <div className="text-[8px] tracking-widest uppercase font-bold" style={{ color: "#22c55e" }}>Sports</div>
        <div className="text-sm font-black text-white mt-0.5 truncate" style={{ letterSpacing: "-0.01em" }}>{title}</div>
        <div className="text-[9px] mt-0.5" style={{ color: "rgba(255,255,255,0.4)" }}>{date}</div>
      </div>
      <div className="text-[10px] text-white/50 truncate">{location}</div>
    </div>
    {/* Right: scoreboard-style stub */}
    <div className="absolute top-0 right-0 bottom-0 flex flex-col items-center justify-center gap-0.5 border-l" style={{ width: "30%", borderColor: "#22c55e33" }}>
      <div className="text-[8px] uppercase tracking-widest" style={{ color: "#22c55e" }}>Section</div>
      <div className="text-xl font-black text-white">A3</div>
      <div className="text-[8px] text-white/40">Row 12 · Seat 7</div>
      <div className="mt-1 w-10 h-0.5" style={{ background: "#22c55e" }} />
      <div className="text-[7px] text-white/30 mt-1">#TK-003</div>
    </div>
  </div>
);

/** 5 · Podium — carbon fibre pattern, red racing diagonal stripe */
const PodiumPreview = ({
  title = "Podium",
  date = "Dec 20 · 8:00 PM",
  location = "City Arena",
}: PreviewProps) => (
  <div className="relative w-full overflow-hidden rounded-lg select-none" style={{ aspectRatio: "7/3", fontFamily: "system-ui, sans-serif", background: "#1a1a1a" }}>
    {/* Carbon fibre CSS pattern */}
    <div className="absolute inset-0" style={{ backgroundImage: "repeating-linear-gradient(45deg, #222 0px, #222 2px, transparent 2px, transparent 8px), repeating-linear-gradient(-45deg, #222 0px, #222 2px, transparent 2px, transparent 8px)", opacity: 0.8 }} />
    {/* Red racing stripe diagonal */}
    <div className="absolute inset-0" style={{ background: "linear-gradient(160deg, transparent 40%, #ef4444 40%, #ef4444 52%, transparent 52%)" }} />
    {/* Left info */}
    <div className="absolute inset-0 right-[35%] flex flex-col justify-between p-3">
      <div>
        <div className="text-[8px] tracking-widest uppercase font-semibold" style={{ color: "#ef4444" }}>Sports</div>
        <div className="text-sm font-black text-white mt-0.5 truncate">{title}</div>
        <div className="text-[9px] mt-0.5" style={{ color: "rgba(255,255,255,0.45)" }}>{date}</div>
      </div>
      <div className="text-[9px] truncate" style={{ color: "rgba(255,255,255,0.4)" }}>{location}</div>
    </div>
    {/* Right stub */}
    <div className="absolute top-0 right-0 bottom-0 flex flex-col items-center justify-center gap-1 px-2" style={{ width: "25%", background: "rgba(0,0,0,0.5)", borderLeft: "1px solid #ef444433" }}>
      <div className="text-[8px] uppercase tracking-widest text-white/40">Gate</div>
      <div className="text-lg font-black text-white">P1</div>
      <div className="text-[7px]" style={{ color: "#ef4444" }}>#TK-004</div>
    </div>
  </div>
);

/** 6 · Solstice — full-bleed radial, concentric ring decoration */
const SolsticePreview = ({
  title = "Solstice",
  date = "Dec 20 · 8:00 PM",
  location = "City Arena",
}: PreviewProps) => (
  <div className="relative w-full overflow-hidden rounded-lg select-none" style={{ aspectRatio: "7/3", background: "radial-gradient(ellipse at 30% 50%, #ff6b6b 0%, #feca57 40%, #48dbfb 75%, #1dd1a1 100%)", fontFamily: "system-ui, sans-serif" }}>
    {/* Concentric rings */}
    <div className="absolute" style={{ right: "18%", top: "50%", transform: "translate(50%,-50%)", width: 80, height: 80, borderRadius: "50%", border: "1px solid rgba(255,255,255,0.3)" }} />
    <div className="absolute" style={{ right: "18%", top: "50%", transform: "translate(50%,-50%)", width: 56, height: 56, borderRadius: "50%", border: "1px solid rgba(255,255,255,0.4)" }} />
    <div className="absolute" style={{ right: "18%", top: "50%", transform: "translate(50%,-50%)", width: 32, height: 32, borderRadius: "50%", background: "rgba(255,255,255,0.2)", border: "1px solid rgba(255,255,255,0.5)" }} />
    {/* Left info */}
    <div className="absolute inset-0 flex flex-col justify-between p-3" style={{ right: "35%" }}>
      <div>
        <div className="text-[8px] tracking-widest uppercase font-bold" style={{ color: "rgba(26,26,26,0.7)" }}>Festival</div>
        <div className="text-sm font-black leading-tight mt-0.5 truncate" style={{ color: "#1a1a1a" }}>{title}</div>
        <div className="text-[9px] mt-0.5" style={{ color: "rgba(26,26,26,0.5)" }}>{date}</div>
      </div>
      <div className="text-[9px] truncate" style={{ color: "rgba(26,26,26,0.5)" }}>{location}</div>
    </div>
    {/* Right info with white pill */}
    <div className="absolute top-0 right-0 bottom-0 flex flex-col items-center justify-center gap-0.5" style={{ width: "22%" }}>
      <div className="rounded-full px-2 py-0.5 text-[7px] font-bold" style={{ background: "rgba(255,255,255,0.4)", color: "#1a1a1a" }}>ADMIT ONE</div>
      <div className="text-[7px]" style={{ color: "rgba(26,26,26,0.4)" }}>#TK-005</div>
    </div>
  </div>
);

/** 7 · Neon Carnival — dark, scan-line overlay, cyan glow grid */
const NeonCarnivalPreview = ({
  title = "Neon Carnival",
  date = "Dec 20 · 20:00",
  location = "City Arena",
}: PreviewProps) => (
  <div className="relative w-full overflow-hidden rounded-lg select-none" style={{ aspectRatio: "7/3", background: "#050510", fontFamily: "monospace" }}>
    {/* Grid lines */}
    <div className="absolute inset-0" style={{ backgroundImage: "linear-gradient(rgba(0,245,255,0.06) 1px, transparent 1px), linear-gradient(90deg, rgba(0,245,255,0.06) 1px, transparent 1px)", backgroundSize: "20px 20px" }} />
    {/* Scan lines overlay */}
    <div className="absolute inset-0" style={{ backgroundImage: "repeating-linear-gradient(0deg, rgba(0,0,0,0.15) 0px, rgba(0,0,0,0.15) 1px, transparent 1px, transparent 4px)" }} />
    {/* Horizontal neon accent */}
    <div className="absolute left-0 right-0" style={{ top: "35%", height: 1, background: "linear-gradient(90deg, transparent, #00f5ff44, transparent)" }} />
    {/* Info */}
    <div className="absolute inset-0 right-[30%] flex flex-col justify-between p-3">
      <div>
        <div className="text-[8px] tracking-[0.2em] uppercase" style={{ color: "#00f5ff88" }}>Festival</div>
        <div className="text-sm font-bold mt-0.5 truncate" style={{ color: "#00f5ff", textShadow: "0 0 10px #00f5ff" }}>{title}</div>
        <div className="text-[9px] mt-0.5" style={{ color: "rgba(0,245,255,0.35)" }}>{date}</div>
      </div>
      <div className="text-[9px] truncate" style={{ color: "rgba(0,245,255,0.3)" }}>{location}</div>
    </div>
    {/* Right stub - terminal style */}
    <div className="absolute top-0 right-0 bottom-0 flex flex-col items-center justify-center gap-0.5 px-2" style={{ width: "30%", borderLeft: "1px solid #00f5ff22" }}>
      <div className="text-[7px] font-mono uppercase" style={{ color: "#00f5ff55" }}>TOKEN</div>
      <div className="text-[10px] font-bold font-mono" style={{ color: "#00f5ff", textShadow: "0 0 6px #00f5ff" }}>TK-007</div>
      <div className="mt-1 grid grid-cols-4 gap-px">
        {Array.from({length: 16}).map((_,i) => (
          <div key={i} className="w-1.5 h-1.5 rounded-[1px]" style={{ background: i % 3 === 0 ? "#00f5ff" : "rgba(0,245,255,0.15)" }} />
        ))}
      </div>
    </div>
  </div>
);

/** 8 · Slate Pro — split: navy left / white right, ultra clean */
const SlateProPreview = ({
  title = "Slate Pro",
  date = "Dec 20 · 8:00 PM",
  location = "City Arena",
}: PreviewProps) => (
  <div className="relative w-full overflow-hidden rounded-lg select-none" style={{ aspectRatio: "7/3", fontFamily: "system-ui, sans-serif" }}>
    {/* Left navy panel */}
    <div className="absolute inset-0 right-[38%]" style={{ background: "linear-gradient(135deg, #1e293b 0%, #334155 100%)" }} />
    {/* Right white panel */}
    <div className="absolute inset-0 left-[62%] bg-white" />
    {/* Blue accent bar */}
    <div className="absolute left-0 top-0 bottom-0 w-1" style={{ background: "#3b82f6" }} />
    {/* Left text */}
    <div className="absolute inset-0 right-[38%] flex flex-col justify-between p-3 pl-4">
      <div>
        <div className="text-[8px] tracking-widest uppercase" style={{ color: "rgba(59,130,246,0.8)" }}>Corporate</div>
        <div className="text-sm font-bold text-white mt-0.5 truncate">{title}</div>
        <div className="text-[9px] mt-0.5 text-white/40">{date}</div>
      </div>
      <div className="text-[9px] text-white/40 truncate">{location}</div>
    </div>
    {/* Right stub */}
    <div className="absolute inset-0 left-[62%] flex flex-col items-center justify-center gap-1 px-2" style={{ borderLeft: "1px dashed #cbd5e1" }}>
      <div className="w-9 h-9 rounded grid grid-cols-3 grid-rows-3 gap-px p-0.5 border border-slate-200">
        {[1,1,0,1,0,1,0,1,1].map((f,i) => <div key={i} className="rounded-[1px]" style={{ background: f ? "#1e293b" : "#fff" }} />)}
      </div>
      <div className="text-[7px] text-slate-400 mt-0.5">#TK-008</div>
      <div className="text-[7px] font-semibold tracking-widest uppercase" style={{ color: "#3b82f6" }}>ADMIT 1</div>
    </div>
  </div>
);

/** 9 · Executive — full black, art deco gold corner ornaments */
const ExecutivePreview = ({
  title = "Executive",
  date = "Dec 20 · 20:00",
  location = "City Arena",
}: PreviewProps) => (
  <div className="relative w-full overflow-hidden rounded-lg select-none" style={{ aspectRatio: "7/3", background: "#0a0a0a", fontFamily: "Georgia, serif" }}>
    {/* Art deco corner ornaments */}
    {["top-1.5 left-1.5", "top-1.5 right-1.5", "bottom-1.5 left-1.5", "bottom-1.5 right-1.5"].map((pos, i) => (
      <div key={i} className={`absolute ${pos}`} style={{ width: 16, height: 16, borderColor: "#c0a060", borderStyle: "solid", borderWidth: i === 0 ? "2px 0 0 2px" : i === 1 ? "2px 2px 0 0" : i === 2 ? "0 0 2px 2px" : "0 2px 2px 0" }} />
    ))}
    {/* Fine horizontal lines */}
    <div className="absolute left-4 right-[30%] top-4" style={{ height: 1, background: "linear-gradient(90deg, #c0a06033, #c0a060, #c0a06033)" }} />
    <div className="absolute left-4 right-[30%] bottom-4" style={{ height: 1, background: "linear-gradient(90deg, #c0a06033, #c0a060, #c0a06033)" }} />
    {/* Center divider */}
    <div className="absolute top-4 bottom-4 right-[29%] w-px" style={{ background: "repeating-linear-gradient(to bottom, #c0a060 0px, #c0a060 4px, transparent 4px, transparent 8px)" }} />
    {/* Left text */}
    <div className="absolute inset-0 right-[30%] flex flex-col justify-center gap-1 px-5">
      <div className="text-[7px] tracking-[0.3em] uppercase" style={{ color: "#c0a06077" }}>Corporate · VIP</div>
      <div className="text-sm font-bold text-white truncate">{title}</div>
      <div className="text-[9px] truncate" style={{ color: "rgba(192,160,96,0.5)" }}>{date} · {location}</div>
    </div>
    {/* Right stub */}
    <div className="absolute top-0 right-0 bottom-0 flex flex-col items-center justify-center gap-1" style={{ width: "29%" }}>
      <div className="text-[7px] tracking-widest uppercase" style={{ color: "#c0a06077" }}>Admit</div>
      <div className="text-xl font-bold" style={{ color: "#c0a060" }}>I</div>
      <div className="text-[7px]" style={{ color: "#c0a06055" }}>#TK-009</div>
    </div>
  </div>
);

/** 10 · Summit — diagonal band, overlapping geometric shapes */
const SummitPreview = ({
  title = "Summit",
  date = "Dec 20 · 8:00 PM",
  location = "City Arena",
}: PreviewProps) => (
  <div className="relative w-full overflow-hidden rounded-lg select-none" style={{ aspectRatio: "7/3", background: "linear-gradient(135deg, #667eea 0%, #764ba2 100%)", fontFamily: "system-ui, sans-serif" }}>
    {/* Big translucent circle */}
    <div data-ticket-template-object="overlay" className="absolute" style={{ right: "-5%", top: "-30%", width: 120, height: 120, borderRadius: "50%", background: "rgba(255,255,255,0.08)", border: "1px solid rgba(255,255,255,0.15)" }} />
    {/* Diagonal band */}
    <div className="absolute inset-0" style={{ background: "linear-gradient(160deg, transparent 45%, rgba(255,255,255,0.07) 45%, rgba(255,255,255,0.07) 55%, transparent 55%)" }} />
    {/* Left info */}
    <div className="absolute inset-0 right-[30%] flex flex-col justify-between p-3">
      <div>
        <div className="text-[8px] tracking-widest uppercase" style={{ color: "rgba(255,255,255,0.6)" }}>Conference</div>
        <div className="text-sm font-bold text-white mt-0.5 truncate">{title}</div>
        <div className="text-[9px] mt-0.5" style={{ color: "rgba(255,255,255,0.45)" }}>{date}</div>
      </div>
      <div className="text-[9px] truncate" style={{ color: "rgba(255,255,255,0.4)" }}>{location}</div>
    </div>
    {/* Right: semi-transparent stub */}
    <div className="absolute top-0 right-0 bottom-0 flex flex-col items-center justify-center gap-1 px-2" style={{ width: "30%", background: "rgba(0,0,0,0.2)", borderLeft: "1px solid rgba(255,255,255,0.15)" }}>
      <div className="w-9 h-9 rounded grid grid-cols-3 grid-rows-3 gap-px p-0.5" style={{ background: "rgba(255,255,255,0.9)" }}>
        {[1,1,0,1,0,1,0,1,1].map((f,i) => <div key={i} className="rounded-[1px]" style={{ background: f ? "#667eea" : "#fff" }} />)}
      </div>
      <div className="text-[7px]" style={{ color: "rgba(255,255,255,0.4)" }}>#TK-010</div>
    </div>
  </div>
);

/** 11 · Keynote — bold blue, large typography-driven layout */
const KeynotePreview = ({
  title = "Keynote",
  date = "Dec 20 · 8:00 PM",
  location = "City Arena",
}: PreviewProps) => (
  <div className="relative w-full overflow-hidden rounded-lg select-none" style={{ aspectRatio: "7/3", background: "linear-gradient(160deg, #005c97 0%, #003f6b 100%)", fontFamily: "system-ui, sans-serif" }}>
    {/* Large BG number for visual texture */}
    <div className="absolute right-4 top-1/2 -translate-y-1/2 text-[72px] font-black leading-none select-none pointer-events-none" style={{ color: "rgba(255,255,255,0.04)", fontVariantNumeric: "tabular-nums" }}>01</div>
    {/* Top label bar */}
    <div className="absolute top-0 left-0 right-0 h-5 flex items-center px-3 gap-2" style={{ background: "rgba(0,0,0,0.3)" }}>
      <div className="text-[8px] uppercase tracking-widest text-white/50">Conference</div>
      <div className="flex-1 h-px" style={{ background: "rgba(255,255,255,0.1)" }} />
      <div className="text-[8px] text-white/40">2025 SEASON</div>
    </div>
    {/* Main content */}
    <div className="absolute inset-0 top-5 right-[30%] flex flex-col justify-between p-3">
      <div>
        <div className="text-sm font-black text-white leading-tight truncate">{title}</div>
        <div className="text-[9px] mt-0.5" style={{ color: "rgba(96,165,250,0.8)" }}>{date}</div>
      </div>
      <div className="text-[9px] text-white/40 truncate">{location}</div>
    </div>
    {/* Stub */}
    <div className="absolute top-5 right-0 bottom-0 flex flex-col items-center justify-center gap-1" style={{ width: "30%", borderLeft: "1px solid rgba(255,255,255,0.1)" }}>
      <div className="text-[8px] uppercase tracking-widest" style={{ color: "#60a5fa" }}>Gate</div>
      <div className="text-2xl font-black text-white">K</div>
      <div className="text-[7px] text-white/30">#TK-011</div>
    </div>
  </div>
);

/** 12 · Gallery Opening — minimal white, single left border, serif feel */
const GalleryOpeningPreview = ({
  title = "Gallery Opening",
  date = "Dec 20 · 8:00 PM",
  location = "City Arena",
}: PreviewProps) => (
  <div className="relative w-full overflow-hidden rounded-lg select-none border border-gray-200" style={{ aspectRatio: "7/3", background: "#fafaf9", fontFamily: "Georgia, serif" }}>
    {/* Thick left black stripe */}
    <div className="absolute left-0 top-0 bottom-0 w-2" style={{ background: "#1a1a1a" }} />
    {/* Top hairline */}
    <div className="absolute top-4 left-6 right-6 h-px bg-gray-200" />
    {/* Bottom hairline */}
    <div className="absolute bottom-4 left-6 right-6 h-px bg-gray-200" />
    {/* Dashed vertical divider */}
    <div className="absolute top-4 bottom-4 right-[28%]" style={{ width: 1, background: "repeating-linear-gradient(to bottom, #ccc 0px, #ccc 4px, transparent 4px, transparent 8px)" }} />
    {/* Main content */}
    <div className="absolute inset-0 left-6 right-[30%] flex flex-col justify-center gap-1">
      <div className="text-[8px] tracking-[0.25em] uppercase" style={{ color: "#999" }}>Art &amp; Culture</div>
      <div className="text-sm font-bold truncate" style={{ color: "#1a1a1a" }}>{title}</div>
      <div className="text-[9px] truncate" style={{ color: "#aaa" }}>{date} · {location}</div>
    </div>
    {/* Right stub */}
    <div className="absolute top-4 right-0 bottom-4 flex flex-col items-center justify-center gap-1" style={{ width: "28%" }}>
      <div className="w-9 h-9 rounded-sm border border-gray-300 grid grid-cols-3 grid-rows-3 gap-px p-0.5">
        {[1,1,0,1,0,1,0,1,1].map((f,i) => <div key={i} className="rounded-[1px]" style={{ background: f ? "#1a1a1a" : "#f5f5f5" }} />)}
      </div>
      <div className="text-[7px]" style={{ color: "#bbb" }}>#TK-012</div>
    </div>
  </div>
);

/** 13 · Aurora — flowing multi-colour, curved overlay panel */
const AuroraPreview = ({
  title = "Aurora",
  date = "Dec 20 · 8:00 PM",
  location = "City Arena",
}: PreviewProps) => (
  <div className="relative w-full overflow-hidden rounded-lg select-none" style={{ aspectRatio: "7/3", background: "linear-gradient(135deg, #43cea2 0%, #185a9d 50%, #8b5cf6 100%)", fontFamily: "system-ui, sans-serif" }}>
    {/* Curved translucent overlay */}
    <div data-ticket-template-object="overlay" className="absolute" style={{ bottom: "-20%", left: "-10%", width: "60%", height: "140%", borderRadius: "50%", background: "rgba(255,255,255,0.08)" }} />
    {/* Flow curves */}
    <svg className="absolute inset-0 w-full h-full" viewBox="0 0 280 120" preserveAspectRatio="none">
      <path d="M0,40 Q70,80 140,40 Q210,0 280,40" fill="none" stroke="rgba(255,255,255,0.12)" strokeWidth="1.5" />
      <path d="M0,70 Q70,110 140,70 Q210,30 280,70" fill="none" stroke="rgba(255,255,255,0.08)" strokeWidth="1" />
    </svg>
    {/* Info */}
    <div className="absolute inset-0 right-[30%] flex flex-col justify-between p-3">
      <div>
        <div className="text-[8px] tracking-widest uppercase" style={{ color: "rgba(255,255,255,0.6)" }}>Art &amp; Culture</div>
        <div className="text-sm font-bold text-white mt-0.5 truncate" style={{ fontStyle: "italic" }}>{title}</div>
        <div className="text-[9px] mt-0.5" style={{ color: "rgba(255,255,255,0.45)" }}>{date}</div>
      </div>
      <div className="text-[9px] truncate" style={{ color: "rgba(255,255,255,0.4)" }}>{location}</div>
    </div>
    {/* Stub */}
    <div className="absolute top-0 right-0 bottom-0 flex flex-col items-center justify-center gap-1 px-2" style={{ width: "30%", background: "rgba(0,0,0,0.18)", backdropFilter: "blur(4px)", borderLeft: "1px solid rgba(255,255,255,0.15)" }}>
      <div className="w-9 h-9 rounded-full border-2 border-white/40 flex items-center justify-center">
        <div className="w-4 h-4 rounded-full" style={{ background: "rgba(255,255,255,0.5)" }} />
      </div>
      <div className="text-[7px] text-white/40">#TK-013</div>
    </div>
  </div>
);

/** 14 · Gala Noir — full black, vertical gold lines (art deco pattern) */
const GalaNoirPreview = ({
  title = "Gala Noir",
  date = "Dec 20 · 20:00",
  location = "City Arena",
}: PreviewProps) => (
  <div className="relative w-full overflow-hidden rounded-lg select-none" style={{ aspectRatio: "7/3", background: "#080808", fontFamily: "system-ui, sans-serif" }}>
    {/* Vertical gold line pattern */}
    <div className="absolute inset-0" style={{ backgroundImage: "repeating-linear-gradient(90deg, transparent 0px, transparent 18px, rgba(192,160,96,0.12) 18px, rgba(192,160,96,0.12) 19px)", backgroundSize: "19px 100%" }} />
    {/* Gold border frame */}
    <div className="absolute inset-[3px] rounded pointer-events-none" style={{ border: "1px solid rgba(192,160,96,0.3)" }} />
    <div className="absolute inset-[6px] rounded pointer-events-none" style={{ border: "1px solid rgba(192,160,96,0.1)" }} />
    {/* Divider */}
    <div className="absolute top-3 bottom-3 right-[28%]" style={{ width: 1, background: "linear-gradient(to bottom, transparent, #c0a060, transparent)" }} />
    {/* Content */}
    <div className="absolute inset-0 right-[29%] flex flex-col justify-center gap-1.5 px-5">
      <div className="text-[7px] tracking-[0.3em] uppercase" style={{ color: "rgba(192,160,96,0.5)" }}>Charity &amp; Gala</div>
      <div className="text-sm font-bold text-white truncate" style={{ fontFamily: "Georgia, serif" }}>{title}</div>
      <div className="text-[9px] truncate" style={{ color: "rgba(192,160,96,0.4)" }}>{date} · {location}</div>
    </div>
    {/* Stub */}
    <div className="absolute top-3 right-0 bottom-3 flex flex-col items-center justify-center gap-1" style={{ width: "28%" }}>
      <div className="text-[8px] tracking-widest uppercase" style={{ color: "rgba(192,160,96,0.5)" }}>Black Tie</div>
      <div className="w-6 h-px" style={{ background: "#c0a060" }} />
      <div className="text-[8px] tracking-widest uppercase" style={{ color: "rgba(192,160,96,0.5)" }}>Admit 1</div>
      <div className="text-[7px] mt-1" style={{ color: "rgba(255,255,255,0.2)" }}>#TK-014</div>
    </div>
  </div>
);

/** 15 · Blossom — soft pastel, circular floral decoration, gentle */
const BlossomPreview = ({
  title = "Blossom",
  date = "Dec 20 · 8:00 PM",
  location = "City Arena",
}: PreviewProps) => (
  <div className="relative w-full overflow-hidden rounded-lg select-none" style={{ aspectRatio: "7/3", background: "linear-gradient(135deg, #ffecd2 0%, #fcb69f 50%, #fbc2eb 100%)", fontFamily: "system-ui, sans-serif" }}>
    {/* Decorative flower circles */}
    {[
      { s: 60, r: 30, t: "50%", l: "68%", o: 0.15 },
      { s: 40, r: 20, t: "20%", l: "75%", o: 0.12 },
      { s: 24, r: 12, t: "70%", l: "60%", o: 0.18 },
    ].map((c, i) => (
      <div key={i} className="absolute rounded-full" style={{ width: c.s, height: c.s, top: c.t, left: c.l, transform: "translate(-50%,-50%)", background: `rgba(236,72,153,${c.o})`, border: `1px solid rgba(236,72,153,${c.o * 1.5})` }} />
    ))}
    {/* Wavy bottom edge SVG */}
    <svg className="absolute bottom-0 left-0 w-full" height="10" viewBox="0 0 300 10" preserveAspectRatio="none">
      <path d="M0,5 C30,0 60,10 90,5 C120,0 150,10 180,5 C210,0 240,10 270,5 C290,1 300,5 300,5 L300,10 L0,10 Z" fill="rgba(255,255,255,0.35)" />
    </svg>
    {/* Dashed right stub line */}
    <div className="absolute top-2 bottom-2 right-[28%]" style={{ width: 1, background: "repeating-linear-gradient(to bottom, rgba(236,72,153,0.4) 0px, rgba(236,72,153,0.4) 4px, transparent 4px, transparent 8px)" }} />
    {/* Content */}
    <div className="absolute inset-0 right-[29%] flex flex-col justify-between p-3">
      <div>
        <div className="text-[8px] tracking-widest uppercase" style={{ color: "rgba(74,25,66,0.5)" }}>Charity &amp; Gala</div>
        <div className="text-sm font-bold mt-0.5 truncate" style={{ color: "#4a1942" }}>{title}</div>
        <div className="text-[9px] mt-0.5 truncate" style={{ color: "rgba(74,25,66,0.45)" }}>{date}</div>
      </div>
      <div className="text-[9px] truncate" style={{ color: "rgba(74,25,66,0.4)" }}>{location}</div>
    </div>
    {/* Stub */}
    <div className="absolute top-0 right-0 bottom-0 flex flex-col items-center justify-center gap-1 px-1" style={{ width: "28%" }}>
      <div className="w-8 h-8 rounded-full border-2 flex items-center justify-center" style={{ borderColor: "rgba(236,72,153,0.4)", background: "rgba(255,255,255,0.3)" }}>
        <div className="text-[8px] font-bold" style={{ color: "#ec4899" }}>1</div>
      </div>
      <div className="text-[7px]" style={{ color: "rgba(74,25,66,0.35)" }}>#TK-015</div>
    </div>
  </div>
);

/** 16 · Cybercore — dark, green hex pattern, esports/gaming */
const CybercorePreview = ({
  title = "Cybercore",
  date = "2025.12.20 / 20:00",
  location = "City Arena",
}: PreviewProps) => (
  <div className="relative w-full overflow-hidden rounded-lg select-none" style={{ aspectRatio: "7/3", background: "#030a03", fontFamily: "monospace" }}>
    {/* Hex dot pattern */}
    <div className="absolute inset-0" style={{ backgroundImage: "radial-gradient(circle, rgba(0,255,136,0.12) 1px, transparent 1px)", backgroundSize: "12px 12px" }} />
    {/* Horizontal scan bar */}
    <div className="absolute left-0 right-0" style={{ top: "45%", height: 2, background: "linear-gradient(90deg, transparent, rgba(0,255,136,0.3), transparent)" }} />
    {/* Corner bracket - top left */}
    <div className="absolute top-2 left-2" style={{ width: 12, height: 12, borderTop: "2px solid #00ff88", borderLeft: "2px solid #00ff88" }} />
    {/* Corner bracket - bottom right (excluding stub area) */}
    <div className="absolute bottom-2 left-2" style={{ width: 12, height: 12, borderBottom: "2px solid #00ff88", borderLeft: "2px solid #00ff88" }} />
    {/* Info */}
    <div className="absolute inset-0 right-[30%] flex flex-col justify-between p-3 pt-4">
      <div>
        <div className="text-[8px] tracking-[0.2em] uppercase" style={{ color: "rgba(0,255,136,0.6)" }}>Tech &amp; Gaming</div>
        <div className="text-sm font-bold mt-0.5 truncate" style={{ color: "#00ff88", textShadow: "0 0 8px rgba(0,255,136,0.5)" }}>{title}</div>
        <div className="text-[9px] mt-0.5" style={{ color: "rgba(0,255,136,0.3)" }}>{date}</div>
      </div>
      <div className="text-[9px] truncate" style={{ color: "rgba(0,255,136,0.25)" }}>&gt; {location.toUpperCase().replace(/\s/g, "_")}</div>
    </div>
    {/* Right digital stub */}
    <div className="absolute top-0 right-0 bottom-0 flex flex-col items-center justify-center gap-0.5 px-2" style={{ width: "30%", borderLeft: "1px solid rgba(0,255,136,0.15)" }}>
      <div className="text-[7px] font-mono" style={{ color: "rgba(0,255,136,0.4)" }}>ACCESS</div>
      <div className="grid grid-cols-5 gap-0.5 my-0.5">
        {Array.from({length: 15}).map((_,i) => (
          <div key={i} className="w-1.5 h-1.5" style={{ background: i % 4 === 0 || i % 7 === 0 ? "#00ff88" : "rgba(0,255,136,0.15)" }} />
        ))}
      </div>
      <div className="text-[7px] font-mono" style={{ color: "rgba(0,255,136,0.3)" }}>#TK-016</div>
    </div>
  </div>
);

/** 17 · Holographic — rainbow gradient, iridescent shimmer effect */
const HolographicPreview = ({
  title = "Holographic",
  date = "Dec 20 · 8:00 PM",
  location = "City Arena, Main Stage",
}: PreviewProps) => (
  <div className="relative w-full overflow-hidden rounded-lg select-none" style={{ aspectRatio: "7/3", background: "linear-gradient(135deg, #ff0080, #ff8c00, #ffff00, #40e0d0, #ee82ee, #9acd32)", fontFamily: "system-ui, sans-serif" }}>
    {/* Shimmer overlay */}
    <div className="absolute inset-0" style={{ background: "repeating-linear-gradient(60deg, rgba(255,255,255,0) 0%, rgba(255,255,255,0.15) 10%, rgba(255,255,255,0) 20%)", backgroundSize: "200% 200%" }} />
    {/* White glassmorphism info panel */}
    <div data-ticket-template-object="overlay" className="absolute inset-2 right-[30%] rounded-lg flex flex-col justify-between p-2.5" style={{ background: "rgba(255,255,255,0.25)", backdropFilter: "blur(6px)", border: "1px solid rgba(255,255,255,0.5)" }}>
      <div>
        <div className="text-[8px] tracking-widest uppercase text-white font-semibold" style={{ textShadow: "0 1px 2px rgba(0,0,0,0.2)" }}>Tech &amp; Gaming</div>
        <div className="text-sm font-black text-white mt-0.5 truncate" style={{ textShadow: "0 1px 3px rgba(0,0,0,0.3)" }}>{title}</div>
        <div className="text-[9px] mt-0.5 text-white/70">{date}</div>
      </div>
      <div className="text-[9px] text-white/60 truncate">{location}</div>
    </div>
    {/* Stub */}
    <div className="absolute inset-y-2 right-2 rounded-lg flex flex-col items-center justify-center gap-1 px-2" style={{ width: "26%", background: "rgba(255,255,255,0.3)", backdropFilter: "blur(8px)", border: "1px solid rgba(255,255,255,0.5)" }}>
      <div className="w-9 h-9 rounded grid grid-cols-3 grid-rows-3 gap-px p-0.5" style={{ background: "rgba(255,255,255,0.8)" }}>
        {[1,1,0,1,0,1,0,1,1].map((f,i) => <div key={i} className="rounded-[1px]" style={{ background: f ? "rgba(0,0,0,0.6)" : "transparent" }} />)}
      </div>
      <div className="text-[7px] font-bold text-white" style={{ textShadow: "0 1px 2px rgba(0,0,0,0.3)" }}>#TK-017</div>
    </div>
  </div>
);

// ─────────────────────────────────────────────
// Template registry — data + renderer together
// ─────────────────────────────────────────────
export const TICKET_TEMPLATES: (EventTemplate & { Preview: React.FC<PreviewProps> })[] = [
  { id: "electric-stage",   name: "Electric Stage",    category: "Concert & Music",  description: "Neon-glow horizontal with purple stub and scan accents.",     isPremium: false, tags: ["music","concert","neon"],       primaryColor: "#a855f7", secondaryColor: "#0f0c29", accentColor: "#a855f7", textColor: "#ffffff", gradient: "linear-gradient(135deg, #0f0c29, #302b63)",  Preview: ElectricStagePreview },
  { id: "golden-mic",       name: "Golden Mic",        category: "Concert & Music",  description: "Diagonal gold triangle split on a black base, serif luxury.",  isPremium: true,  tags: ["music","jazz","gold"],           primaryColor: "#d4af37", secondaryColor: "#1a1200", accentColor: "#ffd700", textColor: "#ffffff", gradient: "linear-gradient(135deg, #1a1200, #d4af37)",  Preview: GoldenMicPreview },
  { id: "indie-wave",       name: "Indie Wave",        category: "Concert & Music",  description: "Wavy SVG bottom edge and retro stamp circle — festival poster vibe.", isPremium: false, tags: ["music","indie","retro"],   primaryColor: "#f5576c", secondaryColor: "#f093fb", accentColor: "#fda085", textColor: "#ffffff", gradient: "linear-gradient(135deg, #f093fb, #f5576c)",  Preview: IndieWavePreview },
  { id: "game-day",         name: "Game Day",          category: "Sports",           description: "Dark stadium card with section/row/seat scoreboard stub.",      isPremium: false, tags: ["sports","match","stadium"],     primaryColor: "#22c55e", secondaryColor: "#111111", accentColor: "#22c55e", textColor: "#ffffff", gradient: "linear-gradient(135deg, #111, #1a2a1a)",     Preview: GameDayPreview },
  { id: "podium",           name: "Podium",            category: "Sports",           description: "Carbon-fibre weave background slashed by a red racing stripe.", isPremium: true,  tags: ["sports","racing","carbon"],     primaryColor: "#ef4444", secondaryColor: "#1a1a1a", accentColor: "#ef4444", textColor: "#ffffff", gradient: "linear-gradient(135deg, #232526, #414345)",  Preview: PodiumPreview },
  { id: "solstice",         name: "Solstice",          category: "Festival",         description: "Radial rainbow gradient with concentric ring decoration.",       isPremium: false, tags: ["festival","outdoor","summer"],  primaryColor: "#feca57", secondaryColor: "#ff6b6b", accentColor: "#1dd1a1", textColor: "#1a1a1a", gradient: "radial-gradient(ellipse, #ff6b6b, #feca57, #48dbfb)", Preview: SolsticePreview },
  { id: "neon-carnival",    name: "Neon Carnival",     category: "Festival",         description: "Dark grid + scan-line overlay with a cyan pixel-art stub.",     isPremium: true,  tags: ["festival","rave","cyber"],      primaryColor: "#00f5ff", secondaryColor: "#050510", accentColor: "#00f5ff", textColor: "#ffffff", gradient: "linear-gradient(135deg, #050510, #0d0d2a)",  Preview: NeonCarnivalPreview },
  { id: "slate-pro",        name: "Slate Pro",         category: "Corporate",        description: "Navy/white split panel with blue accent bar — clean and sharp.", isPremium: false, tags: ["corporate","clean","split"],    primaryColor: "#3b82f6", secondaryColor: "#1e293b", accentColor: "#3b82f6", textColor: "#ffffff", gradient: "linear-gradient(135deg, #1e293b, #334155)",  Preview: SlateProPreview },
  { id: "executive",        name: "Executive",         category: "Corporate",        description: "Full black with art-deco gold corner ornaments and fine rules.", isPremium: true,  tags: ["corporate","luxury","deco"],    primaryColor: "#c0a060", secondaryColor: "#0a0a0a", accentColor: "#c0a060", textColor: "#ffffff", gradient: "linear-gradient(135deg, #0a0a0a, #1c1c1c)",  Preview: ExecutivePreview },
  { id: "summit",           name: "Summit",            category: "Conference",       description: "Purple gradient with translucent circle and diagonal band.",    isPremium: false, tags: ["conference","tech","modern"],   primaryColor: "#667eea", secondaryColor: "#764ba2", accentColor: "#a78bfa", textColor: "#ffffff", gradient: "linear-gradient(135deg, #667eea, #764ba2)", editableObjects: ["category", "overlay"], Preview: SummitPreview },
  { id: "keynote",          name: "Keynote",           category: "Conference",       description: "Bold blue with oversized ghost numeral and labelled gate stub.", isPremium: false, tags: ["conference","keynote","bold"],  primaryColor: "#005c97", secondaryColor: "#003f6b", accentColor: "#60a5fa", textColor: "#ffffff", gradient: "linear-gradient(160deg, #005c97, #003f6b)",  Preview: KeynotePreview },
  { id: "gallery-opening",  name: "Gallery Opening",  category: "Art & Culture",    description: "Bright white with a thick left stripe — gallery card minimalism.", isPremium: false, tags: ["art","gallery","minimal"],   primaryColor: "#1a1a1a", secondaryColor: "#fafaf9", accentColor: "#1a1a1a", textColor: "#1a1a1a", gradient: "linear-gradient(135deg, #fafaf9, #f0ede8)",  Preview: GalleryOpeningPreview },
  { id: "aurora",           name: "Aurora",            category: "Art & Culture",    description: "Teal-to-purple gradient with flowing SVG curves and glass stub.", isPremium: true, tags: ["art","theatre","flowing"],     primaryColor: "#43cea2", secondaryColor: "#185a9d", accentColor: "#43cea2", textColor: "#ffffff", gradient: "linear-gradient(135deg, #43cea2, #185a9d, #8b5cf6)", editableObjects: ["category", "overlay"], Preview: AuroraPreview },
  { id: "gala-noir",        name: "Gala Noir",         category: "Charity & Gala",   description: "Black with vertical gold art-deco lines and a double-frame border.", isPremium: true, tags: ["gala","charity","deco"],  primaryColor: "#c0a060", secondaryColor: "#080808", accentColor: "#c0a060", textColor: "#ffffff", gradient: "linear-gradient(135deg, #0a0a0a, #1a1a1a)",  Preview: GalaNoirPreview },
  { id: "blossom",          name: "Blossom",           category: "Charity & Gala",   description: "Soft peach gradient with floral circles and wavy SVG hem.",      isPremium: false, tags: ["gala","garden","delicate"],  primaryColor: "#ec4899", secondaryColor: "#ffecd2", accentColor: "#ec4899", textColor: "#4a1942", gradient: "linear-gradient(135deg, #ffecd2, #fcb69f, #fbc2eb)", Preview: BlossomPreview },
  { id: "cybercore",        name: "Cybercore",         category: "Tech & Gaming",    description: "Black with hex dot grid, green scan-line and corner brackets.",  isPremium: false, tags: ["gaming","esports","hex"],       primaryColor: "#00ff88", secondaryColor: "#030a03", accentColor: "#00ff88", textColor: "#ffffff", gradient: "linear-gradient(135deg, #030a03, #001a0a)",  Preview: CybercorePreview },
  { id: "holographic",      name: "Holographic",       category: "Tech & Gaming",    description: "Rainbow iridescent with glassmorphism info card floating above.", isPremium: true, tags: ["tech","rainbow","glass"],      primaryColor: "#ff0080", secondaryColor: "#40e0d0", accentColor: "#40e0d0", textColor: "#ffffff", gradient: "linear-gradient(135deg, #ff0080, #ff8c00, #40e0d0, #ee82ee)", editableObjects: ["category", "overlay"], Preview: HolographicPreview },
];

// ─────────────────────────────────────────────
// Gallery component
// ─────────────────────────────────────────────
const ALL_CATEGORIES = ["All", ...Array.from(new Set(TICKET_TEMPLATES.map((t) => t.category)))];

interface TicketTemplateGalleryProps {
  onSelectTemplate: (template: EventTemplate) => void;
  selectedTemplateId?: string;
}

const TicketTemplateGallery = ({ onSelectTemplate, selectedTemplateId }: TicketTemplateGalleryProps) => {
  const [activeCategory, setActiveCategory] = useState("All");
  const [search, setSearch] = useState("");

  const filtered = TICKET_TEMPLATES.filter((t) => {
    const matchCat = activeCategory === "All" || t.category === activeCategory;
    const q = search.toLowerCase();
    const matchSearch = !q || t.name.toLowerCase().includes(q) || t.category.toLowerCase().includes(q) || t.tags.some((tag) => tag.includes(q));
    return matchCat && matchSearch;
  });

  return (
    <div className="space-y-4">
      {/* Search */}
      <div className="relative max-w-sm">
        <Search className="pointer-events-none absolute left-3 top-1/2 -translate-y-1/2 h-3.5 w-3.5 text-muted-foreground" />
        <Input placeholder="Search templates…" value={search} onChange={(e) => setSearch(e.target.value)} className="pl-9 h-9 text-sm" />
      </div>

      {/* Category pills */}
      <div className="flex flex-wrap gap-1.5">
        {ALL_CATEGORIES.map((cat) => (
          <button
            key={cat}
            onClick={() => setActiveCategory(cat)}
            className={cn(
              "rounded-full px-3 py-1 text-xs font-medium transition-all",
              activeCategory === cat
                ? "bg-primary text-primary-foreground shadow-sm"
                : "bg-muted text-muted-foreground hover:bg-muted/70 hover:text-foreground"
            )}
          >
            {cat}
          </button>
        ))}
      </div>

      {/* Template grid */}
      {filtered.length === 0 ? (
        <div className="py-12 text-center text-sm text-muted-foreground">No templates match "{search}"</div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 max-h-[560px] overflow-y-auto pr-1">
          {filtered.map((template) => {
            const { Preview } = template;
            const isSelected = selectedTemplateId === template.id;
            return (
              <div
                key={template.id}
                className={cn(
                  "relative flex flex-col rounded-xl border bg-card shadow-sm transition-all duration-150 cursor-pointer",
                  isSelected
                    ? "border-primary ring-2 ring-primary/30 shadow-md"
                    : "hover:border-border/80 hover:shadow-md hover:-translate-y-0.5"
                )}
                onClick={() => onSelectTemplate(template)}
              >
                {/* Selected indicator */}
                {isSelected && (
                  <div className="absolute top-2 left-2 z-10 flex h-5 w-5 items-center justify-center rounded-full bg-primary shadow">
                    <Check className="h-3 w-3 text-primary-foreground" />
                  </div>
                )}

                {/* Premium badge */}
                {template.isPremium && (
                  <div className="absolute top-2 right-2 z-10 flex items-center gap-1 rounded-full bg-gradient-to-r from-amber-500 to-yellow-400 px-2 py-0.5 text-[10px] font-semibold text-white shadow">
                    <Crown className="h-2.5 w-2.5" />Premium
                  </div>
                )}

                {/* Unique CSS ticket preview — no props → defaults to placeholder text */}
                <div className="p-2.5 pb-0">
                  <Preview />
                </div>

                {/* Info */}
                <div className="flex flex-col p-3 pt-2 gap-2">
                  <div>
                    <div className="font-semibold text-sm leading-tight">{template.name}</div>
                    <div className="text-[11px] text-muted-foreground mt-0.5 leading-snug">{template.description}</div>
                  </div>
                  <div className="flex flex-wrap gap-1">
                    {template.tags.slice(0, 3).map((tag) => (
                      <span key={tag} className="rounded-full bg-muted px-1.5 py-0.5 text-[10px] text-muted-foreground">#{tag}</span>
                    ))}
                  </div>
                  <Button
                    size="sm"
                    variant={isSelected ? "default" : "outline"}
                    className="w-full h-7 text-xs gap-1.5"
                    onClick={(e) => { e.stopPropagation(); onSelectTemplate(template); }}
                  >
                    {isSelected ? <><Check className="h-3 w-3" /> Selected</> : "Use this template"}
                  </Button>
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
};

export default TicketTemplateGallery;
