import { useState } from "react";
import { useNavigate } from "react-router-dom";
import Header from "@/components/Header";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Search, Sparkles, Crown, ArrowRight, Check } from "lucide-react";
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
  // Design tokens passed to CreateEvent
  primaryColor: string;
  secondaryColor: string;
}

const TEMPLATES: EventTemplate[] = [
  // --- Concert / Music ---
  {
    id: "electric-stage",
    name: "Electric Stage",
    category: "Concert & Music",
    description: "Bold neon gradients for live music events that demand attention.",
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
    description: "Warm gold tones for acoustic sessions, jazz nights, and singer-songwriter shows.",
    gradient: "linear-gradient(135deg, #1a1200 0%, #d4af37 60%, #ffd700 100%)",
    accentColor: "#ffd700",
    textColor: "#ffffff",
    isPremium: true,
    tags: ["music", "jazz", "acoustic", "gold"],
    primaryColor: "#d4af37",
    secondaryColor: "#1a1200",
  },
  {
    id: "indie-wave",
    name: "Indie Wave",
    category: "Concert & Music",
    description: "Retro-inspired pastels for indie, folk, and alternative gigs.",
    gradient: "linear-gradient(135deg, #f093fb 0%, #f5576c 50%, #fda085 100%)",
    accentColor: "#f5576c",
    textColor: "#ffffff",
    isPremium: false,
    tags: ["music", "indie", "retro"],
    primaryColor: "#f5576c",
    secondaryColor: "#f093fb",
  },

  // --- Sports ---
  {
    id: "game-day",
    name: "Game Day",
    category: "Sports",
    description: "High-contrast stadium energy for matches, tournaments, and championships.",
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
    description: "Sleek metallic finish for racing, cycling, and motorsport events.",
    gradient: "linear-gradient(135deg, #232526 0%, #414345 100%)",
    accentColor: "#ef4444",
    textColor: "#ffffff",
    isPremium: true,
    tags: ["sports", "racing", "motorsport"],
    primaryColor: "#ef4444",
    secondaryColor: "#232526",
  },

  // --- Festival ---
  {
    id: "solstice",
    name: "Solstice",
    category: "Festival",
    description: "Vibrant multicolor gradients for outdoor music and art festivals.",
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
    tags: ["festival", "rave", "neon", "nightlife"],
    primaryColor: "#00f5ff",
    secondaryColor: "#0a0a0a",
  },

  // --- Corporate ---
  {
    id: "slate-pro",
    name: "Slate Pro",
    category: "Corporate",
    description: "Clean, professional design for corporate meetings and seminars.",
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
    description: "Understated luxury for board events, VIP dinners, and AGMs.",
    gradient: "linear-gradient(135deg, #0f0f0f 0%, #1c1c1c 50%, #111 100%)",
    accentColor: "#d4af37",
    textColor: "#ffffff",
    isPremium: true,
    tags: ["corporate", "luxury", "vip"],
    primaryColor: "#d4af37",
    secondaryColor: "#0f0f0f",
  },

  // --- Conference ---
  {
    id: "summit",
    name: "Summit",
    category: "Conference",
    description: "Modern gradients for tech summits, product launches, and developer conferences.",
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
    description: "Bold blue energy for keynote talks, panels, and thought-leadership events.",
    gradient: "linear-gradient(135deg, #005c97 0%, #363795 100%)",
    accentColor: "#60a5fa",
    textColor: "#ffffff",
    isPremium: false,
    tags: ["conference", "keynote", "panel"],
    primaryColor: "#005c97",
    secondaryColor: "#363795",
  },

  // --- Art & Culture ---
  {
    id: "gallery-opening",
    name: "Gallery Opening",
    category: "Art & Culture",
    description: "Minimalist elegance for art shows, gallery openings, and museum events.",
    gradient: "linear-gradient(135deg, #fafaf9 0%, #f5f0eb 100%)",
    accentColor: "#1a1a1a",
    textColor: "#1a1a1a",
    isPremium: false,
    tags: ["art", "gallery", "culture", "minimalist"],
    primaryColor: "#1a1a1a",
    secondaryColor: "#fafaf9",
  },
  {
    id: "aurora",
    name: "Aurora",
    category: "Art & Culture",
    description: "Dreamy iridescent tones for theatre, ballet, and performing arts.",
    gradient: "linear-gradient(135deg, #43cea2 0%, #185a9d 50%, #8b5cf6 100%)",
    accentColor: "#43cea2",
    textColor: "#ffffff",
    isPremium: true,
    tags: ["art", "theatre", "ballet", "culture"],
    primaryColor: "#43cea2",
    secondaryColor: "#185a9d",
  },

  // --- Charity & Gala ---
  {
    id: "gala-noir",
    name: "Gala Noir",
    category: "Charity & Gala",
    description: "Black-tie sophistication for galas, charity balls, and fundraising dinners.",
    gradient: "linear-gradient(135deg, #0a0a0a 0%, #1a1a1a 50%, #0a0a0a 100%)",
    accentColor: "#c0a060",
    textColor: "#ffffff",
    isPremium: true,
    tags: ["gala", "charity", "formal", "blacktie"],
    primaryColor: "#c0a060",
    secondaryColor: "#0a0a0a",
  },
  {
    id: "blossom",
    name: "Blossom",
    category: "Charity & Gala",
    description: "Soft florals for garden parties, charity luncheons, and daytime galas.",
    gradient: "linear-gradient(135deg, #ffecd2 0%, #fcb69f 50%, #fbc2eb 100%)",
    accentColor: "#ec4899",
    textColor: "#4a1942",
    isPremium: false,
    tags: ["gala", "garden", "charity", "soft"],
    primaryColor: "#ec4899",
    secondaryColor: "#ffecd2",
  },

  // --- Tech & Gaming ---
  {
    id: "cybercore",
    name: "Cybercore",
    category: "Tech & Gaming",
    description: "Futuristic neon grid for gaming tournaments, esports, and tech expos.",
    gradient: "linear-gradient(135deg, #000000 0%, #001a1a 50%, #000000 100%)",
    accentColor: "#00ff88",
    textColor: "#ffffff",
    isPremium: false,
    tags: ["gaming", "esports", "tech", "futuristic"],
    primaryColor: "#00ff88",
    secondaryColor: "#000000",
  },
  {
    id: "holographic",
    name: "Holographic",
    category: "Tech & Gaming",
    description: "Rainbow holographic shimmer for product launches and immersive tech events.",
    gradient: "linear-gradient(135deg, #ff0080 0%, #ff8c00 25%, #40e0d0 50%, #ee82ee 75%, #9acd32 100%)",
    accentColor: "#40e0d0",
    textColor: "#ffffff",
    isPremium: true,
    tags: ["tech", "launch", "holographic", "premium"],
    primaryColor: "#ff0080",
    secondaryColor: "#40e0d0",
  },
];

const ALL_CATEGORIES = ["All", ...Array.from(new Set(TEMPLATES.map((t) => t.category)))];

// A realistic ticket-shaped preview rendered entirely with CSS
const TicketPreview = ({ template }: { template: EventTemplate }) => {
  const isLight = template.id === "gallery-opening" || template.id === "blossom";
  const mutedText = isLight ? "rgba(0,0,0,0.45)" : "rgba(255,255,255,0.45)";
  const dividerColor = isLight ? "rgba(0,0,0,0.12)" : "rgba(255,255,255,0.12)";

  return (
    <div
      className="relative w-full overflow-hidden rounded-lg select-none"
      style={{
        background: template.gradient,
        aspectRatio: "7 / 3",
        fontFamily: "system-ui, sans-serif",
      }}
    >
      {/* Ticket stub perforation line */}
      <div
        className="absolute inset-y-0 right-[28%] flex flex-col items-center justify-between py-2 pointer-events-none"
        style={{ gap: 0 }}
      >
        <div
          className="w-px flex-1"
          style={{
            background: `repeating-linear-gradient(to bottom, ${dividerColor} 0px, ${dividerColor} 5px, transparent 5px, transparent 10px)`,
          }}
        />
        {/* Notch circles */}
        <div
          className="absolute -left-2 top-0 w-4 h-4 rounded-full"
          style={{ background: "hsl(var(--background))", transform: "translateY(-50%)" }}
        />
        <div
          className="absolute -left-2 bottom-0 w-4 h-4 rounded-full"
          style={{ background: "hsl(var(--background))", transform: "translateY(50%)" }}
        />
      </div>

      {/* Left: main content */}
      <div className="absolute inset-0 right-[28%] flex flex-col justify-between p-4">
        <div>
          <div
            className="text-[10px] font-semibold uppercase tracking-[0.15em] mb-1"
            style={{ color: template.accentColor }}
          >
            {template.category.toUpperCase()}
          </div>
          <div
            className="text-base font-bold leading-tight"
            style={{ color: template.textColor }}
          >
            {template.name}
          </div>
          <div className="text-[10px] mt-0.5" style={{ color: mutedText }}>
            Saturday, Dec 20 · 8:00 PM
          </div>
        </div>
        <div>
          <div className="text-[9px] uppercase tracking-widest mb-0.5" style={{ color: mutedText }}>
            Venue
          </div>
          <div className="text-[11px] font-medium" style={{ color: template.textColor }}>
            City Arena, Main Stage
          </div>
        </div>
      </div>

      {/* Right: stub */}
      <div
        className="absolute top-0 bottom-0 right-0 flex flex-col items-center justify-center gap-1.5 px-2"
        style={{ width: "28%" }}
      >
        {/* Simulated QR */}
        <div
          className="w-12 h-12 rounded grid grid-cols-3 grid-rows-3 gap-px p-0.5"
          style={{ background: template.textColor }}
        >
          {[1,1,0,1,0,1,0,1,1].map((filled, i) => (
            <div
              key={i}
              className="rounded-sm"
              style={{
                background: filled
                  ? (isLight ? "#1a1a1a" : template.accentColor)
                  : (isLight ? "#f9f9f9" : template.secondaryColor),
              }}
            />
          ))}
        </div>
        <div className="text-[8px] font-mono tracking-tight" style={{ color: mutedText }}>
          #TK-2025
        </div>
        <div
          className="text-[9px] font-bold uppercase"
          style={{ color: template.accentColor, writingMode: "vertical-rl", letterSpacing: "0.12em" }}
        >
          ADMIT ONE
        </div>
      </div>

      {/* Accent bar at bottom */}
      <div
        className="absolute bottom-0 left-0 right-0 h-0.5"
        style={{ background: template.accentColor, opacity: 0.6 }}
      />
    </div>
  );
};

const Templates = () => {
  const navigate = useNavigate();
  const [activeCategory, setActiveCategory] = useState("All");
  const [search, setSearch] = useState("");
  const [hoveredId, setHoveredId] = useState<string | null>(null);

  const filtered = TEMPLATES.filter((t) => {
    const matchCat = activeCategory === "All" || t.category === activeCategory;
    const q = search.toLowerCase();
    const matchSearch =
      !q ||
      t.name.toLowerCase().includes(q) ||
      t.category.toLowerCase().includes(q) ||
      t.tags.some((tag) => tag.includes(q));
    return matchCat && matchSearch;
  });

  const handleUseTemplate = (template: EventTemplate) => {
    // Pass the template id via sessionStorage so CreateEvent can pick it up
    sessionStorage.setItem("selectedTemplate", JSON.stringify(template));
    navigate("/create-event");
  };

  return (
    <div className="min-h-screen bg-background">
      <Header />

      {/* Hero */}
      <section className="relative border-b bg-gradient-to-b from-primary/5 to-background py-14 px-4">
        <div className="mx-auto max-w-4xl text-center">
          <div className="mb-3 inline-flex items-center gap-2 rounded-full border border-primary/20 bg-primary/10 px-4 py-1.5 text-sm font-medium text-primary">
            <Sparkles className="h-3.5 w-3.5" />
            {TEMPLATES.length} professionally designed templates
          </div>
          <h1 className="mb-4 text-4xl font-bold tracking-tight sm:text-5xl">
            Start with a template
          </h1>
          <p className="mx-auto max-w-2xl text-lg text-muted-foreground">
            Pick a design that fits your event's vibe. Every template is fully customisable once you're in the event creator.
          </p>

          {/* Search */}
          <div className="mt-8 relative mx-auto max-w-md">
            <Search className="pointer-events-none absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
            <Input
              placeholder="Search templates…"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="pl-10 h-11 text-sm"
            />
          </div>
        </div>
      </section>

      {/* Category filters */}
      <div className="sticky top-16 z-30 border-b bg-background/90 backdrop-blur">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="flex items-center gap-2 overflow-x-auto py-3 scrollbar-none">
            {ALL_CATEGORIES.map((cat) => (
              <button
                key={cat}
                onClick={() => setActiveCategory(cat)}
                className={cn(
                  "flex-shrink-0 rounded-full px-4 py-1.5 text-sm font-medium transition-all",
                  activeCategory === cat
                    ? "bg-primary text-primary-foreground shadow-sm"
                    : "bg-muted text-muted-foreground hover:bg-muted/80 hover:text-foreground"
                )}
              >
                {cat}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Grid */}
      <main className="mx-auto max-w-7xl px-4 py-10 sm:px-6 lg:px-8">
        {filtered.length === 0 ? (
          <div className="py-24 text-center text-muted-foreground">
            No templates match <strong>"{search}"</strong>. Try a different search.
          </div>
        ) : (
          <>
            {/* Group by category if "All" is selected */}
            {activeCategory === "All" ? (
              ALL_CATEGORIES.filter((c) => c !== "All").map((cat) => {
                const group = filtered.filter((t) => t.category === cat);
                if (!group.length) return null;
                return (
                  <section key={cat} className="mb-14">
                    <div className="mb-5 flex items-center gap-3">
                      <h2 className="text-xl font-semibold tracking-tight">{cat}</h2>
                      <div className="h-px flex-1 bg-border" />
                      <span className="text-sm text-muted-foreground">{group.length} templates</span>
                    </div>
                    <TemplateGrid
                      templates={group}
                      hoveredId={hoveredId}
                      setHoveredId={setHoveredId}
                      onUse={handleUseTemplate}
                    />
                  </section>
                );
              })
            ) : (
              <TemplateGrid
                templates={filtered}
                hoveredId={hoveredId}
                setHoveredId={setHoveredId}
                onUse={handleUseTemplate}
              />
            )}
          </>
        )}
      </main>

      {/* CTA footer */}
      <section className="border-t bg-muted/30 py-14 px-4 text-center">
        <h2 className="mb-2 text-2xl font-semibold">Want something totally custom?</h2>
        <p className="mb-6 text-muted-foreground">
          Skip the templates and build your ticket design from scratch in our full editor.
        </p>
        <Button size="lg" onClick={() => navigate("/create-event")} className="gap-2">
          Start from scratch <ArrowRight className="h-4 w-4" />
        </Button>
      </section>
    </div>
  );
};

interface TemplateGridProps {
  templates: EventTemplate[];
  hoveredId: string | null;
  setHoveredId: (id: string | null) => void;
  onUse: (t: EventTemplate) => void;
}

const TemplateGrid = ({ templates, hoveredId, setHoveredId, onUse }: TemplateGridProps) => (
  <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
    {templates.map((template) => {
      const isHovered = hoveredId === template.id;
      return (
        <div
          key={template.id}
          className={cn(
            "group relative flex flex-col rounded-xl border bg-card text-card-foreground shadow-sm transition-all duration-200",
            isHovered && "shadow-lg -translate-y-1 border-primary/40"
          )}
          onMouseEnter={() => setHoveredId(template.id)}
          onMouseLeave={() => setHoveredId(null)}
        >
          {/* Premium badge */}
          {template.isPremium && (
            <div className="absolute right-3 top-3 z-10 flex items-center gap-1 rounded-full bg-gradient-to-r from-amber-500 to-yellow-400 px-2.5 py-1 text-[10px] font-semibold text-white shadow">
              <Crown className="h-2.5 w-2.5" />
              Premium
            </div>
          )}

          {/* Ticket preview */}
          <div className="p-3 pb-0">
            <TicketPreview template={template} />
          </div>

          {/* Info */}
          <div className="flex flex-1 flex-col p-4 pt-3">
            <div className="mb-1 flex items-start justify-between gap-2">
              <h3 className="font-semibold leading-tight">{template.name}</h3>
            </div>
            <p className="mb-3 flex-1 text-xs text-muted-foreground leading-relaxed">
              {template.description}
            </p>

            {/* Tags */}
            <div className="mb-4 flex flex-wrap gap-1">
              {template.tags.slice(0, 3).map((tag) => (
                <span
                  key={tag}
                  className="rounded-full bg-muted px-2 py-0.5 text-[10px] text-muted-foreground"
                >
                  #{tag}
                </span>
              ))}
            </div>

            <Button
              size="sm"
              className={cn(
                "w-full gap-2 transition-all",
                isHovered ? "opacity-100" : "opacity-80 group-hover:opacity-100"
              )}
              onClick={() => onUse(template)}
            >
              <Check className="h-3.5 w-3.5" />
              Use Template
            </Button>
          </div>
        </div>
      );
    })}
  </div>
);

export default Templates;
