import { useMemo, useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Crown, Sparkles, Check } from "lucide-react";

export interface TicketLayer {
  id: string;
  type: 'background' | 'text' | 'image' | 'pattern' | 'shape';
  content: string;
  position: { x: number; y: number };
  size: { width: number; height: number };
  style: {
    color?: string;
    fontSize?: number;
    fontWeight?: string;
    opacity?: number;
    rotation?: number;
    blur?: number;
    borderRadius?: number;
    objectFit?: 'cover' | 'contain';
    blendMode?: string;
    overlay?: number;
  };
  zIndex: number;
}

export interface TicketTemplate {
  id: string;
  name: string;
  category: string;
  description: string;
  preview: string;
  layers: TicketLayer[];
  isPremium: boolean;
}

const bg = (content: string, opacity = 1): TicketLayer => ({
  id: "bg",
  type: "background",
  content,
  position: { x: 0, y: 0 },
  size: { width: 100, height: 100 },
  style: { opacity },
  zIndex: 1,
});

const text = (
  id: string,
  content: string,
  x: number,
  y: number,
  fontSize: number,
  color: string,
  fontWeight = "bold",
  zIndex = 4,
  width = 70,
): TicketLayer => ({
  id,
  type: "text",
  content,
  position: { x, y },
  size: { width, height: 14 },
  style: { color, fontSize, fontWeight, opacity: 1, rotation: 0 },
  zIndex,
});

const shape = (
  id: string,
  x: number,
  y: number,
  w: number,
  h: number,
  color: string,
  opacity = 1,
  zIndex = 2,
  borderRadius = 0,
  rotation = 0,
): TicketLayer => ({
  id,
  type: "shape",
  content: "rectangle",
  position: { x, y },
  size: { width: w, height: h },
  style: { color, opacity, zIndex: undefined as never, borderRadius, rotation },
  zIndex,
});

const pattern = (
  id: string,
  content: string,
  opacity = 0.3,
  zIndex = 2,
): TicketLayer => ({
  id,
  type: "pattern",
  content,
  position: { x: 0, y: 0 },
  size: { width: 100, height: 100 },
  style: { opacity, rotation: 0 },
  zIndex,
});

export const TICKET_TEMPLATES: TicketTemplate[] = [
  {
    id: "modern-gradient",
    name: "Modern Gradient",
    category: "Professional",
    description: "Clean diagonal gradient with bold title block",
    preview: "",
    isPremium: false,
    layers: [
      bg("linear-gradient(135deg, #667eea 0%, #764ba2 100%)"),
      shape("glow", 55, -10, 60, 70, "#ffffff", 0.12, 2, 999),
      text("title", "Event Title", 8, 16, 24, "#ffffff"),
      text("sub", "Presented by Tick3rt", 8, 34, 11, "#ffffff", "normal"),
    ],
  },
  {
    id: "minimalist",
    name: "Minimal Stub",
    category: "Professional",
    description: "White canvas with a single accent spine",
    preview: "",
    isPremium: false,
    layers: [
      bg("#ffffff"),
      shape("accent", 0, 0, 4, 100, "#2563eb"),
      shape("rule", 10, 62, 45, 1, "#111827", 0.2, 3),
      text("title", "Event Title", 10, 24, 22, "#111827"),
      text("meta", "Doors 19:00", 10, 68, 11, "#6b7280", "normal"),
    ],
  },
  {
    id: "editorial-mono",
    name: "Editorial Mono",
    category: "Professional",
    description: "Type-led layout with generous negative space",
    preview: "",
    isPremium: false,
    layers: [
      bg("#f5f5f4"),
      shape("band", 0, 0, 100, 12, "#111827", 1, 2),
      text("kicker", "ADMIT ONE", 6, 2, 10, "#f5f5f4", "bold", 4, 40),
      text("title", "Event Title", 6, 30, 26, "#111827"),
      text("meta", "Seat • Row • Gate", 6, 70, 11, "#57534e", "normal"),
    ],
  },
  {
    id: "festival-vibe",
    name: "Festival Vibe",
    category: "Entertainment",
    description: "Sunset radial burst with wave texture",
    preview: "",
    isPremium: true,
    layers: [
      bg("radial-gradient(circle at 30% 20%, #ff6b6b, #feca57 55%, #48dbfb)", 0.95),
      pattern(
        "waves",
        "repeating-radial-gradient(circle at 20% 80%, rgba(255,255,255,.35) 0 2px, transparent 2px 14px)",
        0.35,
      ),
      text("title", "Event Title", 8, 20, 26, "#1f2937"),
      text("sub", "Main Stage", 8, 40, 12, "#1f2937", "normal"),
    ],
  },
  {
    id: "neon-nights",
    name: "Neon Nights",
    category: "Entertainment",
    description: "Club-ready dark base with electric glow",
    preview: "",
    isPremium: true,
    layers: [
      bg("linear-gradient(160deg, #0f0c29 0%, #302b63 50%, #24243e 100%)"),
      shape("glow1", -10, 55, 70, 70, "#ec4899", 0.35, 2, 999),
      shape("glow2", 60, -20, 60, 60, "#22d3ee", 0.3, 2, 999),
      pattern(
        "grid",
        "repeating-linear-gradient(0deg, rgba(255,255,255,.08) 0 1px, transparent 1px 14px), repeating-linear-gradient(90deg, rgba(255,255,255,.08) 0 1px, transparent 1px 14px)",
        0.6,
        3,
      ),
      text("title", "Event Title", 8, 18, 26, "#f8fafc"),
      text("sub", "22:00 — 04:00", 8, 38, 12, "#a5f3fc", "normal"),
    ],
  },
  {
    id: "afro-pattern",
    name: "Afro Geometric",
    category: "Entertainment",
    description: "Warm palette with diagonal geometric weave",
    preview: "",
    isPremium: false,
    layers: [
      bg("linear-gradient(135deg, #b45309 0%, #ea580c 60%, #facc15 100%)"),
      pattern(
        "weave",
        "repeating-linear-gradient(45deg, rgba(0,0,0,.18) 0 10px, transparent 10px 20px)",
        0.7,
      ),
      shape("stub", 74, 0, 1, 100, "#ffffff", 0.6, 3),
      text("title", "Event Title", 6, 22, 24, "#1c1917"),
      text("sub", "Live & Loud", 6, 42, 12, "#292524", "normal"),
    ],
  },
  {
    id: "corporate",
    name: "Corporate Dark",
    category: "Business",
    description: "Slate base with a precise accent rule",
    preview: "",
    isPremium: false,
    layers: [
      bg("#1f2937"),
      shape("accent-line", 0, 88, 100, 2, "#3b82f6"),
      shape("panel", 62, 12, 32, 40, "#ffffff", 0.06, 2, 12),
      text("title", "Event Title", 6, 20, 22, "#f9fafb"),
      text("sub", "Conference Pass", 6, 40, 11, "#93c5fd", "normal"),
    ],
  },
  {
    id: "summit-blue",
    name: "Summit Blue",
    category: "Business",
    description: "Layered blues for conferences and summits",
    preview: "",
    isPremium: false,
    layers: [
      bg("linear-gradient(120deg, #0b3a75 0%, #1e40af 55%, #38bdf8 100%)"),
      shape("fade", 0, 60, 100, 40, "#020617", 0.35, 2),
      text("title", "Event Title", 7, 18, 24, "#f8fafc"),
      text("sub", "Delegate Access", 7, 38, 11, "#dbeafe", "normal"),
    ],
  },
  {
    id: "gold-premium",
    name: "Gold Premium",
    category: "VIP",
    description: "Black-tie gala aesthetic with gold foil edge",
    preview: "",
    isPremium: true,
    layers: [
      bg("linear-gradient(135deg, #0b0b0b 0%, #1c1917 100%)"),
      shape("frame-top", 4, 6, 92, 1, "#fbbf24", 0.9, 2),
      shape("frame-bottom", 4, 90, 92, 1, "#fbbf24", 0.9, 2),
      pattern(
        "foil",
        "linear-gradient(115deg, transparent 40%, rgba(251,191,36,.28) 50%, transparent 60%)",
        0.9,
        3,
      ),
      text("kicker", "VIP", 6, 14, 12, "#fbbf24", "bold", 4, 20),
      text("title", "Event Title", 6, 30, 24, "#fef3c7"),
    ],
  },
  {
    id: "holo-pass",
    name: "Holographic Pass",
    category: "VIP",
    description: "Iridescent sheen for collectible passes",
    preview: "",
    isPremium: true,
    layers: [
      bg("linear-gradient(110deg, #a78bfa, #60a5fa 35%, #34d399 65%, #fbbf24)"),
      pattern(
        "sheen",
        "repeating-linear-gradient(75deg, rgba(255,255,255,.45) 0 6px, transparent 6px 18px)",
        0.5,
      ),
      shape("plate", 5, 55, 55, 30, "#0f172a", 0.55, 3, 14),
      text("title", "Event Title", 8, 60, 20, "#f8fafc", "bold", 5, 55),
      text("sub", "All Access", 8, 76, 11, "#e2e8f0", "normal", 5, 40),
    ],
  },
  {
    id: "membership-card",
    name: "Membership Card",
    category: "Passes",
    description: "Card-style pass for memberships and badges",
    preview: "",
    isPremium: false,
    layers: [
      bg("linear-gradient(135deg, #111827 0%, #374151 100%)"),
      shape("chip", 8, 55, 12, 18, "#fbbf24", 0.9, 3, 4),
      shape("stripe", 0, 26, 100, 12, "#000000", 0.45, 2),
      text("title", "Member Name", 8, 12, 18, "#f9fafb"),
      text("sub", "Valid through 2027", 26, 60, 11, "#d1d5db", "normal"),
    ],
  },
  {
    id: "gift-card",
    name: "Gift Voucher",
    category: "Passes",
    description: "Soft pastel voucher with value block",
    preview: "",
    isPremium: false,
    layers: [
      bg("linear-gradient(135deg, #fdf2f8 0%, #ede9fe 100%)"),
      shape("value", 60, 14, 32, 34, "#7c3aed", 0.95, 3, 12),
      text("amount", "$50", 66, 24, 22, "#ffffff", "bold", 5, 25),
      text("title", "Gift Voucher", 7, 20, 22, "#4c1d95"),
      text("sub", "Redeemable on any event", 7, 42, 11, "#6d28d9", "normal"),
    ],
  },
];

const layerStyle = (layer: TicketLayer): React.CSSProperties => ({
  left: `${layer.position.x}%`,
  top: `${layer.position.y}%`,
  width: `${layer.size.width}%`,
  height: `${layer.size.height}%`,
  opacity: layer.style.opacity ?? 1,
  transform: `rotate(${layer.style.rotation || 0}deg)`,
  zIndex: layer.zIndex,
  borderRadius: `${layer.style.borderRadius ?? 0}px`,
  filter: layer.style.blur ? `blur(${layer.style.blur}px)` : undefined,
  mixBlendMode: (layer.style.blendMode as never) || undefined,
});

export const TicketTemplatePreview = ({
  layers,
  scale = 1,
  className = "",
}: {
  layers: TicketLayer[];
  scale?: number;
  className?: string;
}) => {
  const sorted = [...layers].sort((a, b) => a.zIndex - b.zIndex);
  return (
    <div className={`relative w-full h-full overflow-hidden ${className}`}>
      {sorted.map((layer) => {
        if (layer.type === "background") {
          return (
            <div
              key={layer.id}
              className="absolute inset-0"
              style={{ background: layer.content, opacity: layer.style.opacity ?? 1, zIndex: layer.zIndex }}
            />
          );
        }
        if (layer.type === "text") {
          return (
            <div
              key={layer.id}
              className="absolute flex items-center whitespace-nowrap"
              style={{
                ...layerStyle(layer),
                color: layer.style.color,
                fontSize: `${(layer.style.fontSize || 14) * scale}px`,
                fontWeight: layer.style.fontWeight,
              }}
            >
              {layer.content}
            </div>
          );
        }
        if (layer.type === "shape") {
          return (
            <div
              key={layer.id}
              className="absolute"
              style={{ ...layerStyle(layer), backgroundColor: layer.style.color }}
            />
          );
        }
        if (layer.type === "pattern") {
          return <div key={layer.id} className="absolute" style={{ ...layerStyle(layer), background: layer.content }} />;
        }
        if (layer.type === "image" && layer.content) {
          return (
            <img
              key={layer.id}
              src={layer.content}
              alt="Ticket layer"
              className="absolute"
              style={{ ...layerStyle(layer), objectFit: layer.style.objectFit || "cover" }}
            />
          );
        }
        return null;
      })}
    </div>
  );
};

interface TicketTemplatesProps {
  onSelectTemplate: (template: TicketTemplate) => void;
  selectedTemplateId?: string;
}

const TicketTemplates = ({ onSelectTemplate, selectedTemplateId }: TicketTemplatesProps) => {
  const categories = useMemo(
    () => ["All", ...Array.from(new Set(TICKET_TEMPLATES.map((t) => t.category)))],
    [],
  );
  const [activeCategory, setActiveCategory] = useState("All");

  const visible =
    activeCategory === "All"
      ? TICKET_TEMPLATES
      : TICKET_TEMPLATES.filter((t) => t.category === activeCategory);

  return (
    <div className="space-y-5">
      <div className="flex items-start justify-between gap-3 flex-wrap">
        <div>
          <h3 className="text-base font-semibold flex items-center gap-2">
            <Sparkles className="h-4 w-4 text-primary" />
            Template Library
          </h3>
          <p className="text-sm text-muted-foreground">
            Start from a designed layer stack, then customise every layer.
          </p>
        </div>
        <Badge variant="secondary" className="text-xs">
          {TICKET_TEMPLATES.length} templates
        </Badge>
      </div>

      <div className="flex gap-2 overflow-x-auto pb-1 -mx-1 px-1">
        {categories.map((category) => (
          <Button
            key={category}
            size="sm"
            variant={activeCategory === category ? "default" : "outline"}
            onClick={() => setActiveCategory(category)}
            className="shrink-0 text-xs"
          >
            {category}
          </Button>
        ))}
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-4">
        {visible.map((template) => {
          const isSelected = selectedTemplateId === template.id;
          return (
            <Card
              key={template.id}
              onClick={() => onSelectTemplate(template)}
              className={`cursor-pointer overflow-hidden transition-all hover:shadow-lg ${
                isSelected ? "ring-2 ring-primary border-primary" : "hover:border-primary/40"
              }`}
            >
              <div className="relative aspect-[16/9] bg-muted">
                <TicketTemplatePreview layers={template.layers} scale={0.7} />
                <div className="absolute top-2 right-2 flex gap-1 z-[50]">
                  {template.isPremium && (
                    <Badge className="gap-1 text-[10px] bg-amber-500 text-amber-950 hover:bg-amber-500">
                      <Crown className="h-3 w-3" /> Premium
                    </Badge>
                  )}
                  {isSelected && (
                    <Badge className="gap-1 text-[10px]">
                      <Check className="h-3 w-3" /> In use
                    </Badge>
                  )}
                </div>
              </div>
              <CardContent className="p-3 space-y-2">
                <div className="flex items-center justify-between gap-2">
                  <h5 className="font-medium text-sm truncate">{template.name}</h5>
                  <Badge variant="outline" className="text-[10px] shrink-0">
                    {template.category}
                  </Badge>
                </div>
                <p className="text-xs text-muted-foreground line-clamp-2">{template.description}</p>
                <div className="flex items-center justify-between">
                  <span className="text-[11px] text-muted-foreground">
                    {template.layers.length} layers
                  </span>
                  <Button
                    size="sm"
                    variant={isSelected ? "secondary" : "default"}
                    onClick={(e) => {
                      e.stopPropagation();
                      onSelectTemplate(template);
                    }}
                  >
                    {isSelected ? "Edit layers" : "Use template"}
                  </Button>
                </div>
              </CardContent>
            </Card>
          );
        })}
      </div>
    </div>
  );
};

export default TicketTemplates;
