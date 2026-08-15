import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Slider } from "@/components/ui/slider";
import { Card, CardContent } from "@/components/ui/card";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import {
  Palette, LayoutTemplate, ImagePlus, ChevronDown, ChevronUp,
  Check, X, Upload, Wand2, Layers, Sparkles, Plus, Trash2,
} from "lucide-react";
import TicketTemplateGallery, { EventTemplate, TICKET_TEMPLATES } from "./TicketTemplateGallery";
import TicketLivePreview from "./TicketLivePreview";
import { CUSTOM_LAYOUTS, getCustomPreview } from "./CustomTicketPreview";
import { cn } from "@/lib/utils";

interface TicketDesignStepProps {
  eventData: any;
  design: any;
  onDesignChange: (design: any) => void;
}

// ── Accordion section ─────────────────────────────────────────────────────────
function Section({
  id, title, icon: Icon, badge, open, onToggle, children,
}: {
  id: string; title: string; icon: React.ElementType;
  badge?: string; open: boolean; onToggle: (id: string) => void;
  children: React.ReactNode;
}) {
  return (
    <div className="rounded-xl border bg-card shadow-sm overflow-hidden">
      <button
        type="button"
        onClick={() => onToggle(id)}
        className="w-full flex items-center gap-3 px-4 py-3 text-left hover:bg-muted/40 transition-colors"
      >
        <div className="flex h-7 w-7 items-center justify-center rounded-md bg-primary/10">
          <Icon className="h-4 w-4 text-primary" />
        </div>
        <span className="flex-1 font-medium text-sm">{title}</span>
        {badge && (
          <span className="rounded-full bg-primary/10 px-2 py-0.5 text-[10px] font-semibold text-primary shrink-0">
            {badge}
          </span>
        )}
        {open ? <ChevronUp className="h-4 w-4 text-muted-foreground" /> : <ChevronDown className="h-4 w-4 text-muted-foreground" />}
      </button>
      {open && <div className="px-4 pb-4 pt-1">{children}</div>}
    </div>
  );
}

// ── Colour picker row ─────────────────────────────────────────────────────────
function ColourRow({ label, value, onChange }: { label: string; value: string; onChange: (v: string) => void }) {
  return (
    <div className="flex items-center gap-3">
      <Label className="w-20 text-xs shrink-0">{label}</Label>
      <input type="color" value={value} onChange={(e) => onChange(e.target.value)}
        className="h-8 w-8 cursor-pointer rounded border border-input p-0.5 shrink-0" />
      <Input type="text" value={value} onChange={(e) => onChange(e.target.value)}
        className="h-8 text-xs font-mono" placeholder="#000000" />
    </div>
  );
}

// ─────────────────────────────────────────────────────────────────────────────

const TicketDesignStep = ({ eventData, design, onDesignChange }: TicketDesignStepProps) => {
  const [openSections, setOpenSections] = useState<Set<string>>(new Set(["design"]));
  const [designTab, setDesignTab] = useState<"templates" | "custom">(
    design?.customLayout ? "custom" : "templates"
  );
  const [fontSize, setFontSize]       = useState<number[]>([design?.fontSize     || 16]);
  const [borderRadius, setBorderRadius] = useState<number[]>([design?.borderRadius || 8]);

  // Layer editor state (lifted from LayeredTicketDesigner)
  const [layers, setLayers] = useState<any[]>(design?.layers || [
    { id: "bg", type: "background", content: design?.primaryColor || "#6366f1", zIndex: 1,
      position: { x: 0, y: 0 }, size: { width: 100, height: 100 }, style: { opacity: 1 } },
  ]);
  const [selectedLayer, setSelectedLayer] = useState<string>(layers[0]?.id || "");

  const toggle = (id: string) =>
    setOpenSections((prev) => { const n = new Set(prev); n.has(id) ? n.delete(id) : n.add(id); return n; });

  const patch = (updates: Record<string, unknown>) => onDesignChange({ ...design, ...updates });

  // ── Template selection ──────────────────────────────────────────────────────
  const handleSelectTemplate = (template: EventTemplate) => {
    patch({
      templateId: template.id, templateName: template.name,
      primaryColor: template.primaryColor, secondaryColor: template.secondaryColor,
      textColor: template.textColor, gradient: template.gradient,
      accentColor: template.accentColor,
      customLayout: undefined, // clear custom mode
    });
    setOpenSections(new Set(["colours", "effects", "background"]));
  };

  // ── Custom layout selection ────────────────────────────────────────────────
  const handleSelectCustomLayout = (layoutId: string) => {
    patch({ customLayout: layoutId, templateId: undefined, templateName: undefined });
  };

  // ── Background image ────────────────────────────────────────────────────────
  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = (ev) => patch({ backgroundImage: ev.target?.result as string });
    reader.readAsDataURL(file);
  };

  // ── Layer editor helpers ───────────────────────────────────────────────────
  const syncLayers = (next: any[]) => {
    setLayers(next);
    patch({ layers: next });
  };
  const addLayer = (type: string) => {
    const id = `layer-${Date.now()}`;
    const newLayer = {
      id, type,
      content: type === "text" ? "New Text" : type === "background" ? "#3b82f6" : "",
      position: { x: 10, y: 10 }, size: { width: 50, height: 20 }, zIndex: layers.length + 1,
      style: { color: "#ffffff", fontSize: 16, opacity: 1, rotation: 0 },
    };
    const next = [...layers, newLayer];
    setSelectedLayer(id);
    syncLayers(next);
  };
  const updateLayer = (layerId: string, updates: any) =>
    syncLayers(layers.map((l) => l.id === layerId ? { ...l, ...updates } : l));
  const deleteLayer = (layerId: string) => {
    if (layers.length <= 1) return;
    const next = layers.filter((l) => l.id !== layerId);
    setSelectedLayer(next[0]?.id || "");
    syncLayers(next);
  };
  const moveLayer = (layerId: string, dir: "up" | "down") => {
    const idx = layers.findIndex((l) => l.id === layerId);
    if ((dir === "up" && idx === layers.length - 1) || (dir === "down" && idx === 0)) return;
    const next = [...layers];
    const ti = dir === "up" ? idx + 1 : idx - 1;
    [next[idx], next[ti]] = [next[ti], next[idx]];
    syncLayers(next);
  };

  // Derived
  const primaryColor   = design?.primaryColor   || "#6366f1";
  const secondaryColor = design?.secondaryColor || "#4338ca";
  const accentColor    = design?.accentColor    || primaryColor;
  const textColor      = design?.textColor      || "#ffffff";
  const backgroundImage: string = design?.backgroundImage || "";
  const selectedTemplate = design?.templateId
    ? TICKET_TEMPLATES.find((t) => t.id === design.templateId) : undefined;
  const selectedCustomLayout = design?.customLayout
    ? CUSTOM_LAYOUTS.find((l) => l.id === design.customLayout) : undefined;
  const activeBase = selectedTemplate?.name || selectedCustomLayout?.name;

  const selectedLayerData = layers.find((l) => l.id === selectedLayer);

  return (
    <div className="grid grid-cols-1 lg:grid-cols-[1fr_340px] gap-6">
      {/* ── Left column: all controls ────────────────────────────────────────── */}
      <div className="space-y-3">

        {/* ① Ticket Design — Templates OR Custom Builder */}
        <Section
          id="design" title="Ticket Design" icon={LayoutTemplate}
          badge={activeBase} open={openSections.has("design")} onToggle={toggle}
        >
          {/* Inner toggle */}
          <div className="flex rounded-lg border p-0.5 mb-4 bg-muted/40">
            {(["templates", "custom"] as const).map((tab) => (
              <button
                key={tab}
                type="button"
                onClick={() => setDesignTab(tab)}
                className={cn(
                  "flex-1 rounded-md py-1.5 text-xs font-medium transition-all",
                  designTab === tab
                    ? "bg-background shadow-sm text-foreground"
                    : "text-muted-foreground hover:text-foreground"
                )}
              >
                {tab === "templates" ? "Template Gallery" : "Custom Builder"}
              </button>
            ))}
          </div>

          {/* Template gallery */}
          {designTab === "templates" && (
            <TicketTemplateGallery
              onSelectTemplate={handleSelectTemplate}
              selectedTemplateId={design?.templateId}
            />
          )}

          {/* Custom Builder */}
          {designTab === "custom" && (
            <div className="space-y-4">
              <p className="text-xs text-muted-foreground">
                Pick a base layout then customise colours, effects, and layers below.
              </p>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                {CUSTOM_LAYOUTS.map((layout) => {
                  const isSelected = design?.customLayout === layout.id;
                  const PreviewComp = layout.Preview;
                  return (
                    <div
                      key={layout.id}
                      onClick={() => handleSelectCustomLayout(layout.id)}
                      className={cn(
                        "relative flex flex-col rounded-xl border bg-card cursor-pointer shadow-sm transition-all duration-150",
                        isSelected
                          ? "border-primary ring-2 ring-primary/30 shadow-md"
                          : "hover:border-border/80 hover:shadow-md hover:-translate-y-0.5"
                      )}
                    >
                      {isSelected && (
                        <div className="absolute top-2 left-2 z-10 flex h-5 w-5 items-center justify-center rounded-full bg-primary shadow">
                          <Check className="h-3 w-3 text-primary-foreground" />
                        </div>
                      )}
                      <div className="p-2.5 pb-0">
                        <PreviewComp design={design} />
                      </div>
                      <div className="p-3 pt-2">
                        <div className="font-semibold text-sm">{layout.name}</div>
                        <div className="text-[11px] text-muted-foreground mt-0.5 leading-snug">{layout.description}</div>
                      </div>
                    </div>
                  );
                })}
              </div>

              {/* Gradient direction (custom-only extra control) */}
              {design?.customLayout && (
                <div className="pt-2 border-t space-y-2">
                  <Label className="text-xs">Gradient Direction</Label>
                  <Select
                    value={design?.gradientDirection || "135deg"}
                    onValueChange={(v) => patch({ gradientDirection: v })}
                  >
                    <SelectTrigger className="h-9 text-xs">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="0deg">Horizontal →</SelectItem>
                      <SelectItem value="90deg">Vertical ↓</SelectItem>
                      <SelectItem value="45deg">Diagonal ↗</SelectItem>
                      <SelectItem value="135deg">Diagonal ↘</SelectItem>
                      <SelectItem value="radial">Radial</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              )}
            </div>
          )}
        </Section>

        {/* ② Colour & Style */}
        <Section
          id="colours" title="Colour & Style" icon={Palette}
          open={openSections.has("colours")} onToggle={toggle}
        >
          <div className="space-y-4">
            <p className="text-xs text-muted-foreground">
              {design?.templateId
                ? "Override any of the template colours to personalise your ticket."
                : "Set the colours for your custom ticket design."}
            </p>
            <div className="space-y-3">
              <ColourRow label="Primary"   value={primaryColor}   onChange={(v) => patch({ primaryColor: v })} />
              <ColourRow label="Secondary" value={secondaryColor} onChange={(v) => patch({ secondaryColor: v })} />
              <ColourRow label="Accent"    value={accentColor}    onChange={(v) => patch({ accentColor: v })} />
              <ColourRow label="Text"      value={textColor}      onChange={(v) => patch({ textColor: v })} />
            </div>
            <div className="space-y-3 pt-3 border-t">
              <div className="space-y-1.5">
                <Label className="text-xs">Font size: {fontSize[0]}px</Label>
                <Slider value={fontSize} onValueChange={(v) => { setFontSize(v); patch({ fontSize: v[0] }); }} min={12} max={24} step={1} />
              </div>
              <div className="space-y-1.5">
                <Label className="text-xs">Corner radius: {borderRadius[0]}px</Label>
                <Slider value={borderRadius} onValueChange={(v) => { setBorderRadius(v); patch({ borderRadius: v[0] }); }} min={0} max={20} step={1} />
              </div>
              <div className="space-y-1.5">
                <Label className="text-xs">Font family</Label>
                <Select value={design?.fontFamily || "sans"} onValueChange={(v) => patch({ fontFamily: v })}>
                  <SelectTrigger className="h-9 text-xs"><SelectValue /></SelectTrigger>
                  <SelectContent>
                    <SelectItem value="sans">System Sans</SelectItem>
                    <SelectItem value="serif">Serif (elegant)</SelectItem>
                    <SelectItem value="mono">Monospace (techy)</SelectItem>
                    <SelectItem value="rounded">Rounded</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>
          </div>
        </Section>

        {/* ③ Background Image */}
        <Section
          id="background" title="Background Image" icon={ImagePlus}
          badge={backgroundImage ? "Applied" : undefined}
          open={openSections.has("background")} onToggle={toggle}
        >
          {backgroundImage ? (
            <div className="space-y-3">
              <div className="relative rounded-lg overflow-hidden border">
                <img src={backgroundImage} alt="Background" className="w-full h-28 object-cover" />
                <button
                  type="button"
                  onClick={() => patch({ backgroundImage: "" })}
                  className="absolute top-2 right-2 rounded-full bg-black/60 p-1 text-white hover:bg-black/80 transition-colors"
                >
                  <X className="h-3.5 w-3.5" />
                </button>
              </div>
              <p className="text-xs text-muted-foreground">
                Photo blended into your ticket design.{" "}
                <label className="underline cursor-pointer hover:text-foreground transition-colors">
                  Replace
                  <input type="file" accept="image/*" className="hidden" onChange={handleFileUpload} />
                </label>
              </p>
            </div>
          ) : (
            <label className="flex flex-col items-center gap-3 rounded-xl border-2 border-dashed border-muted-foreground/25 p-6 text-center cursor-pointer hover:border-primary/40 hover:bg-muted/30 transition-all">
              <Upload className="h-8 w-8 text-muted-foreground/50" />
              <div>
                <p className="text-sm font-medium">Upload a background photo</p>
                <p className="text-xs text-muted-foreground mt-0.5">PNG, JPG, WEBP — blended into your ticket</p>
              </div>
              <input type="file" accept="image/*" className="hidden" onChange={handleFileUpload} />
            </label>
          )}
        </Section>

        {/* ④ Effects & Patterns (restored from EnhancedTicketDesigner) */}
        <Section
          id="effects" title="Effects & Patterns" icon={Sparkles}
          open={openSections.has("effects")} onToggle={toggle}
        >
          <div className="space-y-4">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              {/* Background pattern */}
              <div className="space-y-1.5">
                <Label className="text-xs">Background Pattern</Label>
                <Select value={design?.backgroundPattern || "none"} onValueChange={(v) => patch({ backgroundPattern: v })}>
                  <SelectTrigger className="h-9 text-xs"><SelectValue /></SelectTrigger>
                  <SelectContent>
                    <SelectItem value="none">None</SelectItem>
                    <SelectItem value="dots">Polka Dots</SelectItem>
                    <SelectItem value="geometric">Geometric</SelectItem>
                    <SelectItem value="waves">Waves</SelectItem>
                    <SelectItem value="hexagon">Hexagon</SelectItem>
                    <SelectItem value="circuit">Circuit Board</SelectItem>
                    <SelectItem value="marble">Marble</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              {/* Animation effect */}
              <div className="space-y-1.5">
                <Label className="text-xs">Animation</Label>
                <Select value={design?.animationEffect || "none"} onValueChange={(v) => patch({ animationEffect: v })}>
                  <SelectTrigger className="h-9 text-xs"><SelectValue /></SelectTrigger>
                  <SelectContent>
                    <SelectItem value="none">None</SelectItem>
                    <SelectItem value="pulse">Pulse</SelectItem>
                    <SelectItem value="glow">Glow</SelectItem>
                    <SelectItem value="bounce">Bounce</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              {/* Border style */}
              <div className="space-y-1.5">
                <Label className="text-xs">Border Style</Label>
                <Select value={design?.borderStyle || "none"} onValueChange={(v) => patch({ borderStyle: v })}>
                  <SelectTrigger className="h-9 text-xs"><SelectValue /></SelectTrigger>
                  <SelectContent>
                    <SelectItem value="none">None</SelectItem>
                    <SelectItem value="solid">Solid</SelectItem>
                    <SelectItem value="double">Double</SelectItem>
                    <SelectItem value="dashed">Dashed</SelectItem>
                    <SelectItem value="neon">Neon Glow</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              {/* Shadow depth */}
              <div className="space-y-1.5">
                <Label className="text-xs">Shadow</Label>
                <Select value={design?.shadow || "none"} onValueChange={(v) => patch({ shadow: v })}>
                  <SelectTrigger className="h-9 text-xs"><SelectValue /></SelectTrigger>
                  <SelectContent>
                    <SelectItem value="none">None</SelectItem>
                    <SelectItem value="soft">Soft</SelectItem>
                    <SelectItem value="deep">Deep</SelectItem>
                    <SelectItem value="luxury">Luxury</SelectItem>
                    <SelectItem value="glass">Glass</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>

            {/* Toggle effects */}
            <div className="flex flex-wrap gap-3 pt-2 border-t">
              {[
                { key: "holographicEffect", label: "Holographic Shimmer" },
                { key: "metallic",          label: "Metallic Sheen" },
              ].map(({ key, label }) => (
                <button
                  key={key}
                  type="button"
                  onClick={() => patch({ [key]: !design?.[key] })}
                  className={cn(
                    "flex items-center gap-2 rounded-full px-3 py-1.5 text-xs font-medium border transition-all",
                    design?.[key]
                      ? "bg-primary text-primary-foreground border-primary shadow-sm"
                      : "bg-muted text-muted-foreground border-transparent hover:border-border"
                  )}
                >
                  <Sparkles className="h-3 w-3" />
                  {label}
                  {design?.[key] && <Check className="h-3 w-3" />}
                </button>
              ))}
            </div>
          </div>
        </Section>

        {/* ⑤ Layer Editor (restored from LayeredTicketDesigner) */}
        <Section
          id="layers" title="Layer Editor" icon={Layers}
          badge={layers.length > 1 ? `${layers.length} layers` : undefined}
          open={openSections.has("layers")} onToggle={toggle}
        >
          <div className="space-y-4">
            <p className="text-xs text-muted-foreground">
              Add text, shapes, and patterns on top of your ticket design.
            </p>

            {/* Toolbar */}
            <div className="flex gap-2 flex-wrap">
              {[
                { type: "text",    label: "+ Text"    },
                { type: "shape",   label: "+ Shape"   },
                { type: "pattern", label: "+ Pattern" },
              ].map(({ type, label }) => (
                <Button key={type} size="sm" variant="outline" className="text-xs h-7"
                  onClick={() => addLayer(type)}>
                  {label}
                </Button>
              ))}
            </div>

            {/* Layer list */}
            <div className="space-y-1.5 max-h-48 overflow-y-auto">
              {layers.map((layer) => (
                <div
                  key={layer.id}
                  onClick={() => setSelectedLayer(layer.id)}
                  className={cn(
                    "flex items-center gap-2 rounded-lg border px-3 py-2 cursor-pointer text-xs transition-colors",
                    selectedLayer === layer.id
                      ? "border-primary bg-primary/5"
                      : "border-transparent bg-muted/40 hover:bg-muted"
                  )}
                >
                  <span className="flex-1 font-medium capitalize">{layer.type}</span>
                  <span className="text-muted-foreground truncate max-w-[80px]">{layer.content}</span>
                  <div className="flex gap-1">
                    <button type="button" onClick={(e) => { e.stopPropagation(); moveLayer(layer.id, "up"); }}
                      className="rounded p-0.5 hover:bg-muted transition-colors"><ChevronUp className="h-3 w-3" /></button>
                    <button type="button" onClick={(e) => { e.stopPropagation(); moveLayer(layer.id, "down"); }}
                      className="rounded p-0.5 hover:bg-muted transition-colors"><ChevronDown className="h-3 w-3" /></button>
                    {layers.length > 1 && (
                      <button type="button" onClick={(e) => { e.stopPropagation(); deleteLayer(layer.id); }}
                        className="rounded p-0.5 hover:bg-red-100 text-red-500 transition-colors">
                        <Trash2 className="h-3 w-3" />
                      </button>
                    )}
                  </div>
                </div>
              ))}
            </div>

            {/* Selected layer properties */}
            {selectedLayerData && (
              <div className="rounded-xl border bg-muted/30 p-3 space-y-3">
                <div className="text-xs font-semibold text-muted-foreground uppercase tracking-wide">
                  Layer Properties — {selectedLayerData.type}
                </div>

                {/* Content */}
                <div className="space-y-1">
                  <Label className="text-xs">Content</Label>
                  <Input
                    value={selectedLayerData.content}
                    onChange={(e) => updateLayer(selectedLayer, { content: e.target.value })}
                    className="h-8 text-xs"
                    placeholder="Colour, text, or URL…"
                  />
                </div>

                {/* Position */}
                <div className="grid grid-cols-2 gap-2">
                  {[
                    { label: "X %", key: "x", val: selectedLayerData.position.x,
                      set: (v: number) => updateLayer(selectedLayer, { position: { ...selectedLayerData.position, x: v } }) },
                    { label: "Y %", key: "y", val: selectedLayerData.position.y,
                      set: (v: number) => updateLayer(selectedLayer, { position: { ...selectedLayerData.position, y: v } }) },
                    { label: "W %", key: "w", val: selectedLayerData.size.width,
                      set: (v: number) => updateLayer(selectedLayer, { size: { ...selectedLayerData.size, width: v } }) },
                    { label: "H %", key: "h", val: selectedLayerData.size.height,
                      set: (v: number) => updateLayer(selectedLayer, { size: { ...selectedLayerData.size, height: v } }) },
                  ].map(({ label, key, val, set }) => (
                    <div key={key} className="space-y-1">
                      <Label className="text-[10px]">{label}</Label>
                      <Input type="number" value={val} onChange={(e) => set(Number(e.target.value))} className="h-7 text-xs" />
                    </div>
                  ))}
                </div>

                {/* Colour + opacity */}
                <div className="grid grid-cols-2 gap-2">
                  {(selectedLayerData.type === "text" || selectedLayerData.type === "shape") && (
                    <div className="space-y-1">
                      <Label className="text-xs">Colour</Label>
                      <div className="flex gap-1">
                        <input type="color" value={selectedLayerData.style.color || "#ffffff"}
                          onChange={(e) => updateLayer(selectedLayer, { style: { ...selectedLayerData.style, color: e.target.value } })}
                          className="h-7 w-7 rounded border border-input p-0.5" />
                        <Input type="text" value={selectedLayerData.style.color || "#ffffff"}
                          onChange={(e) => updateLayer(selectedLayer, { style: { ...selectedLayerData.style, color: e.target.value } })}
                          className="h-7 text-xs font-mono" />
                      </div>
                    </div>
                  )}
                  <div className="space-y-1">
                    <Label className="text-xs">Opacity: {Math.round((selectedLayerData.style.opacity ?? 1) * 100)}%</Label>
                    <Slider
                      value={[selectedLayerData.style.opacity ?? 1]}
                      onValueChange={([v]) => updateLayer(selectedLayer, { style: { ...selectedLayerData.style, opacity: v } })}
                      min={0} max={1} step={0.05}
                    />
                  </div>
                </div>
              </div>
            )}
          </div>
        </Section>
      </div>

      {/* ── Right column: persistent live preview ────────────────────────────── */}
      <div className="lg:sticky lg:top-6 space-y-3 self-start">
        <Card className="overflow-hidden border-slate-200 dark:border-slate-700">
          <div className="bg-muted/40 px-4 py-2.5 border-b flex items-center justify-between">
            <span className="text-xs font-semibold uppercase tracking-wide text-muted-foreground">Live Preview</span>
            {activeBase && (
              <span className="flex items-center gap-1.5 text-xs text-muted-foreground">
                <Check className="h-3 w-3 text-primary" />
                {activeBase}
              </span>
            )}
          </div>
          <CardContent className="p-4">
            <TicketLivePreview
              design={design}
              eventTitle={eventData?.title}
              eventDate={eventData?.date}
              eventLocation={eventData?.location}
            />

            {/* Layer preview overlay for active layers */}
            {layers.length > 1 && (
              <div className="mt-2 text-[10px] text-muted-foreground text-center">
                {layers.length} layer{layers.length > 1 ? "s" : ""} applied
              </div>
            )}
          </CardContent>
        </Card>

        {/* Active design info */}
        {(selectedTemplate || selectedCustomLayout) && (
          <Card className="border-slate-200 dark:border-slate-700">
            <CardContent className="p-4 space-y-2">
              <div className="flex items-center justify-between">
                <span className="text-sm font-semibold">
                  {selectedTemplate?.name || selectedCustomLayout?.name}
                </span>
                <button
                  type="button"
                  onClick={() => {
                    setOpenSections((prev) => new Set([...prev, "design"]));
                  }}
                  className="text-xs text-primary underline underline-offset-2 hover:opacity-80 transition-opacity"
                >
                  Change
                </button>
              </div>
              <p className="text-xs text-muted-foreground leading-snug">
                {selectedTemplate?.description || selectedCustomLayout?.description}
              </p>
              {selectedTemplate && (
                <div className="flex flex-wrap gap-1 pt-1">
                  {selectedTemplate.tags.map((tag) => (
                    <span key={tag} className="rounded-full bg-muted px-2 py-0.5 text-[10px] text-muted-foreground">
                      #{tag}
                    </span>
                  ))}
                </div>
              )}

              {/* Quick colour swatches */}
              <div className="flex gap-1.5 pt-1">
                {[primaryColor, secondaryColor, accentColor, textColor].map((c, i) => (
                  <div key={i} className="h-4 w-4 rounded-full border border-white/20 shadow-sm" style={{ background: c }} title={c} />
                ))}
                <span className="text-[10px] text-muted-foreground self-center ml-1">Current palette</span>
              </div>
            </CardContent>
          </Card>
        )}
      </div>
    </div>
  );
};

export default TicketDesignStep;
