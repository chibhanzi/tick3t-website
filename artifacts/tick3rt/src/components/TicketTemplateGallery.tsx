import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Search, Crown, Check } from "lucide-react";
import { cn } from "@/lib/utils";

export interface EventTemplate {
  id: string;
  name: string;
  category: string;
  description: string;
  gradient: string;
  accentColor: string;
  textColor: string;
  isPremium: boolean;
  tags: string[];
  primaryColor: string;
  secondaryColor: string;
}

export const TICKET_TEMPLATES: EventTemplate[] = [
  // Concert & Music
  {
    id: "electric-stage",
    name: "Electric Stage",
    category: "Concert & Music",
    description: "Bold neon gradients for live music events.",
    gradient: "linear-gradient(135deg, #0f0c29 0%, #302b63 50%, #24243e 100%)",
    accentColor: "#a855f7",
    textColor: "#ffffff",
    isPremium: false,
    tags: ["music", "concert", "nightlife"],
    primaryColor: "#a855f7",
    secondaryColor: "#0f0c29",
  },
  {
    id: "golden-mic",
    name: "Golden Mic",
    category: "Concert & Music",
    description: "Warm gold for jazz nights and acoustic sessions.",
    gradient: "linear-gradient(135deg, #1a1200 0%, #d4af37 60%, #ffd700 100%)",
    accentColor: "#ffd700",
    textColor: "#ffffff",
    isPremium: true,
    tags: ["music", "jazz", "gold"],
    primaryColor: "#d4af37",
    secondaryColor: "#1a1200",
  },
  {
    id: "indie-wave",
    name: "Indie Wave",
    category: "Concert & Music",
    description: "Retro pastels for indie and alternative gigs.",
    gradient: "linear-gradient(135deg, #f093fb 0%, #f5576c 50%, #fda085 100%)",
    accentColor: "#f5576c",
    textColor: "#ffffff",
    isPremium: false,
    tags: ["music", "indie", "retro"],
    primaryColor: "#f5576c",
    secondaryColor: "#f093fb",
  },
  // Sports
  {
    id: "game-day",
    name: "Game Day",
    category: "Sports",
    description: "High-contrast stadium energy for matches and tournaments.",
    gradient: "linear-gradient(135deg, #1a1a1a 0%, #2d2d2d 40%, #1a1a1a 100%)",
    accentColor: "#22c55e",
    textColor: "#ffffff",
    isPremium: false,
    tags: ["sports", "match", "tournament"],
    primaryColor: "#22c55e",
    secondaryColor: "#1a1a1a",
  },
  {
    id: "podium",
    name: "Podium",
    category: "Sports",
    description: "Sleek metallic finish for racing and motorsport.",
    gradient: "linear-gradient(135deg, #232526 0%, #414345 100%)",
    accentColor: "#ef4444",
    textColor: "#ffffff",
    isPremium: true,
    tags: ["sports", "racing", "motorsport"],
    primaryColor: "#ef4444",
    secondaryColor: "#232526",
  },
  // Festival
  {
    id: "solstice",
    name: "Solstice",
    category: "Festival",
    description: "Vibrant multicolour for outdoor music and art festivals.",
    gradient: "radial-gradient(ellipse at top, #ff6b6b 0%, #feca57 40%, #48dbfb 80%, #1dd1a1 100%)",
    accentColor: "#feca57",
    textColor: "#1a1a1a",
    isPremium: false,
    tags: ["festival", "outdoor", "summer"],
    primaryColor: "#feca57",
    secondaryColor: "#ff6b6b",
  },
  {
    id: "neon-carnival",
    name: "Neon Carnival",
    category: "Festival",
    description: "Cyberpunk neon for underground raves and night festivals.",
    gradient: "linear-gradient(135deg, #0a0a0a 0%, #0d0d1a 50%, #0a0a0a 100%)",
    accentColor: "#00f5ff",
    textColor: "#ffffff",
    isPremium: true,
    tags: ["festival", "rave", "neon"],
    primaryColor: "#00f5ff",
    secondaryColor: "#0a0a0a",
  },
  // Corporate
  {
    id: "slate-pro",
    name: "Slate Pro",
    category: "Corporate",
    description: "Clean professional design for meetings and seminars.",
    gradient: "linear-gradient(135deg, #1e293b 0%, #334155 100%)",
    accentColor: "#3b82f6",
    textColor: "#ffffff",
    isPremium: false,
    tags: ["corporate", "professional", "business"],
    primaryColor: "#3b82f6",
    secondaryColor: "#1e293b",
  },
  {
    id: "executive",
    name: "Executive",
    category: "Corporate",
    description: "Understated luxury for VIP dinners and board events.",
    gradient: "linear-gradient(135deg, #0f0f0f 0%, #1c1c1c 50%, #111 100%)",
    accentColor: "#d4af37",
    textColor: "#ffffff",
    isPremium: true,
    tags: ["corporate", "luxury", "vip"],
    primaryColor: "#d4af37",
    secondaryColor: "#0f0f0f",
  },
  // Conference
  {
    id: "summit",
    name: "Summit",
    category: "Conference",
    description: "Modern gradients for tech summits and product launches.",
    gradient: "linear-gradient(135deg, #667eea 0%, #764ba2 100%)",
    accentColor: "#a78bfa",
    textColor: "#ffffff",
    isPremium: false,
    tags: ["conference", "tech", "summit"],
    primaryColor: "#667eea",
    secondaryColor: "#764ba2",
  },
  {
    id: "keynote",
    name: "Keynote",
    category: "Conference",
    description: "Bold blue energy for keynote talks and panel events.",
    gradient: "linear-gradient(135deg, #005c97 0%, #363795 100%)",
    accentColor: "#60a5fa",
    textColor: "#ffffff",
    isPremium: false,
    tags: ["conference", "keynote", "panel"],
    primaryColor: "#005c97",
    secondaryColor: "#363795",
  },
  // Art & Culture
  {
    id: "gallery-opening",
    name: "Gallery Opening",
    category: "Art & Culture",
    description: "Minimalist elegance for art shows and museum events.",
    gradient: "linear-gradient(135deg, #fafaf9 0%, #f5f0eb 100%)",
    accentColor: "#1a1a1a",
    textColor: "#1a1a1a",
    isPremium: false,
    tags: ["art", "gallery", "culture"],
    primaryColor: "#1a1a1a",
    secondaryColor: "#fafaf9",
  },
  {
    id: "aurora",
    name: "Aurora",
    category: "Art & Culture",
    description: "Dreamy iridescent tones for theatre and performing arts.",
    gradient: "linear-gradient(135deg, #43cea2 0%, #185a9d 50%, #8b5cf6 100%)",
    accentColor: "#43cea2",
    textColor: "#ffffff",
    isPremium: true,
    tags: ["art", "theatre", "ballet"],
    primaryColor: "#43cea2",
    secondaryColor: "#185a9d",
  },
  // Charity & Gala
  {
    id: "gala-noir",
    name: "Gala Noir",
    category: "Charity & Gala",
    description: "Black-tie sophistication for galas and fundraising dinners.",
    gradient: "linear-gradient(135deg, #0a0a0a 0%, #1a1a1a 50%, #0a0a0a 100%)",
    accentColor: "#c0a060",
    textColor: "#ffffff",
    isPremium: true,
    tags: ["gala", "charity", "formal"],
    primaryColor: "#c0a060",
    secondaryColor: "#0a0a0a",
  },
  {
    id: "blossom",
    name: "Blossom",
    category: "Charity & Gala",
    description: "Soft florals for garden parties and charity luncheons.",
    gradient: "linear-gradient(135deg, #ffecd2 0%, #fcb69f 50%, #fbc2eb 100%)",
    accentColor: "#ec4899",
    textColor: "#4a1942",
    isPremium: false,
    tags: ["gala", "garden", "charity"],
    primaryColor: "#ec4899",
    secondaryColor: "#ffecd2",
  },
  // Tech & Gaming
  {
    id: "cybercore",
    name: "Cybercore",
    category: "Tech & Gaming",
    description: "Futuristic neon grid for esports and tech expos.",
    gradient: "linear-gradient(135deg, #000000 0%, #001a1a 50%, #000000 100%)",
    accentColor: "#00ff88",
    textColor: "#ffffff",
    isPremium: false,
    tags: ["gaming", "esports", "tech"],
    primaryColor: "#00ff88",
    secondaryColor: "#000000",
  },
  {
    id: "holographic",
    name: "Holographic",
    category: "Tech & Gaming",
    description: "Rainbow shimmer for product launches and immersive tech events.",
    gradient: "linear-gradient(135deg, #ff0080 0%, #ff8c00 25%, #40e0d0 50%, #ee82ee 75%, #9acd32 100%)",
    accentColor: "#40e0d0",
    textColor: "#ffffff",
    isPremium: true,
    tags: ["tech", "launch", "holographic"],
    primaryColor: "#ff0080",
    secondaryColor: "#40e0d0",
  },
];

const ALL_CATEGORIES = ["All", ...Array.from(new Set(TICKET_TEMPLATES.map((t) => t.category)))];

// Realistic CSS-only ticket preview
export const TicketPreview = ({ template }: { template: EventTemplate }) => {
  const isLight = template.id === "gallery-opening" || template.id === "blossom";
  const mutedText = isLight ? "rgba(0,0,0,0.45)" : "rgba(255,255,255,0.45)";
  const dividerColor = isLight ? "rgba(0,0,0,0.12)" : "rgba(255,255,255,0.14)";

  return (
    <div
      className="relative w-full overflow-hidden rounded-lg select-none"
      style={{ background: template.gradient, aspectRatio: "7 / 3", fontFamily: "system-ui, sans-serif" }}
    >
      {/* Perforation line */}
      <div className="absolute inset-y-0 right-[28%] pointer-events-none">
        <div
          className="w-px h-full"
          style={{
            background: `repeating-linear-gradient(to bottom, ${dividerColor} 0px, ${dividerColor} 5px, transparent 5px, transparent 10px)`,
          }}
        />
        <div
          className="absolute -left-2 top-0 w-4 h-4 rounded-full"
          style={{ background: "hsl(var(--background))", transform: "translateY(-50%)" }}
        />
        <div
          className="absolute -left-2 bottom-0 w-4 h-4 rounded-full"
          style={{ background: "hsl(var(--background))", transform: "translateY(50%)" }}
        />
      </div>

      {/* Main body */}
      <div className="absolute inset-0 right-[28%] flex flex-col justify-between p-3">
        <div>
          <div className="text-[9px] font-semibold uppercase tracking-[0.15em] mb-0.5" style={{ color: template.accentColor }}>
            {template.category}
          </div>
          <div className="text-sm font-bold leading-tight" style={{ color: template.textColor }}>
            {template.name}
          </div>
          <div className="text-[9px] mt-0.5" style={{ color: mutedText }}>
            Saturday, Dec 20 · 8:00 PM
          </div>
        </div>
        <div>
          <div className="text-[8px] uppercase tracking-widest mb-0.5" style={{ color: mutedText }}>Venue</div>
          <div className="text-[10px] font-medium" style={{ color: template.textColor }}>City Arena, Main Stage</div>
        </div>
      </div>

      {/* Stub */}
      <div
        className="absolute top-0 bottom-0 right-0 flex flex-col items-center justify-center gap-1 px-1.5"
        style={{ width: "28%" }}
      >
        <div
          className="w-9 h-9 rounded grid grid-cols-3 grid-rows-3 gap-[1px] p-0.5"
          style={{ background: isLight ? "#1a1a1a" : template.textColor }}
        >
          {[1,1,0,1,0,1,0,1,1].map((filled, i) => (
            <div
              key={i}
              className="rounded-[1px]"
              style={{
                background: filled
                  ? (isLight ? "#f5f5f5" : template.accentColor)
                  : (isLight ? "#1a1a1a" : template.secondaryColor),
              }}
            />
          ))}
        </div>
        <div className="text-[7px] font-mono" style={{ color: mutedText }}>#TK-2025</div>
        <div
          className="text-[8px] font-bold uppercase"
          style={{ color: template.accentColor, writingMode: "vertical-rl", letterSpacing: "0.1em" }}
        >
          ADMIT ONE
        </div>
      </div>

      {/* Bottom accent */}
      <div className="absolute bottom-0 left-0 right-0 h-0.5" style={{ background: template.accentColor, opacity: 0.6 }} />
    </div>
  );
};

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
    const matchSearch =
      !q ||
      t.name.toLowerCase().includes(q) ||
      t.category.toLowerCase().includes(q) ||
      t.tags.some((tag) => tag.includes(q));
    return matchCat && matchSearch;
  });

  return (
    <div className="space-y-4">
      {/* Search + category filters */}
      <div className="flex flex-col sm:flex-row gap-3">
        <div className="relative flex-1">
          <Search className="pointer-events-none absolute left-3 top-1/2 -translate-y-1/2 h-3.5 w-3.5 text-muted-foreground" />
          <Input
            placeholder="Search templates…"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="pl-9 h-9 text-sm"
          />
        </div>
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
        <div className="py-12 text-center text-sm text-muted-foreground">
          No templates match <strong>"{search}"</strong>
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 max-h-[520px] overflow-y-auto pr-1">
          {filtered.map((template) => {
            const isSelected = selectedTemplateId === template.id;
            return (
              <div
                key={template.id}
                className={cn(
                  "relative flex flex-col rounded-xl border bg-card text-card-foreground shadow-sm transition-all duration-150 cursor-pointer",
                  isSelected
                    ? "border-primary ring-2 ring-primary/30 shadow-md"
                    : "hover:border-border/80 hover:shadow-md hover:-translate-y-0.5"
                )}
                onClick={() => onSelectTemplate(template)}
              >
                {/* Selected checkmark */}
                {isSelected && (
                  <div className="absolute top-2 left-2 z-10 flex h-5 w-5 items-center justify-center rounded-full bg-primary shadow">
                    <Check className="h-3 w-3 text-primary-foreground" />
                  </div>
                )}

                {/* Premium badge */}
                {template.isPremium && (
                  <div className="absolute top-2 right-2 z-10 flex items-center gap-1 rounded-full bg-gradient-to-r from-amber-500 to-yellow-400 px-2 py-0.5 text-[10px] font-semibold text-white shadow">
                    <Crown className="h-2.5 w-2.5" />
                    Premium
                  </div>
                )}

                {/* Ticket preview */}
                <div className="p-2.5 pb-0">
                  <TicketPreview template={template} />
                </div>

                {/* Info */}
                <div className="flex flex-col p-3 pt-2 gap-2">
                  <div>
                    <div className="font-semibold text-sm leading-tight">{template.name}</div>
                    <div className="text-[11px] text-muted-foreground mt-0.5 leading-snug">{template.description}</div>
                  </div>

                  <div className="flex flex-wrap gap-1">
                    {template.tags.slice(0, 3).map((tag) => (
                      <span key={tag} className="rounded-full bg-muted px-1.5 py-0.5 text-[10px] text-muted-foreground">
                        #{tag}
                      </span>
                    ))}
                  </div>

                  <Button
                    size="sm"
                    variant={isSelected ? "default" : "outline"}
                    className="w-full h-7 text-xs gap-1.5"
                    onClick={(e) => {
                      e.stopPropagation();
                      onSelectTemplate(template);
                    }}
                  >
                    {isSelected ? (
                      <><Check className="h-3 w-3" /> Selected</>
                    ) : (
                      "Use this template"
                    )}
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
