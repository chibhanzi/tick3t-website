import { useState } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Slider } from "@/components/ui/slider";
import {
  Palette,
  LayoutTemplate,
  ImagePlus,
  ChevronDown,
  ChevronUp,
  Check,
  X,
  Upload,
} from "lucide-react";
import TicketTemplateGallery, { EventTemplate, TICKET_TEMPLATES } from "./TicketTemplateGallery";
import TicketLivePreview from "./TicketLivePreview";
import { cn } from "@/lib/utils";

interface TicketDesignStepProps {
  eventData: any;
  design: any;
  onDesignChange: (design: any) => void;
}

// ── Simple accordion section ──────────────────────────────────────────────────
function Section({
  id,
  title,
  icon: Icon,
  badge,
  open,
  onToggle,
  children,
}: {
  id: string;
  title: string;
  icon: React.ElementType;
  badge?: string;
  open: boolean;
  onToggle: (id: string) => void;
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
          <span className="rounded-full bg-primary/10 px-2 py-0.5 text-[10px] font-semibold text-primary">
            {badge}
          </span>
        )}
        {open ? (
          <ChevronUp className="h-4 w-4 text-muted-foreground" />
        ) : (
          <ChevronDown className="h-4 w-4 text-muted-foreground" />
        )}
      </button>
      {open && <div className="px-4 pb-4 pt-1">{children}</div>}
    </div>
  );
}

// ── Colour picker row ─────────────────────────────────────────────────────────
function ColourRow({
  label,
  value,
  onChange,
}: {
  label: string;
  value: string;
  onChange: (v: string) => void;
}) {
  return (
    <div className="flex items-center gap-3">
      <Label className="w-20 text-xs shrink-0">{label}</Label>
      <input
        type="color"
        value={value}
        onChange={(e) => onChange(e.target.value)}
        className="h-8 w-8 cursor-pointer rounded border border-input p-0.5"
      />
      <Input
        type="text"
        value={value}
        onChange={(e) => onChange(e.target.value)}
        className="h-8 text-xs font-mono"
        placeholder="#000000"
      />
    </div>
  );
}

// ─────────────────────────────────────────────────────────────────────────────

const TicketDesignStep = ({ eventData, design, onDesignChange }: TicketDesignStepProps) => {
  const [openSections, setOpenSections] = useState<Set<string>>(new Set(["template"]));
  const [fontSize, setFontSize] = useState<number[]>([design?.fontSize || 16]);
  const [borderRadius, setBorderRadius] = useState<number[]>([design?.borderRadius || 8]);

  const toggleSection = (id: string) =>
    setOpenSections((prev) => {
      const next = new Set(prev);
      next.has(id) ? next.delete(id) : next.add(id);
      return next;
    });

  const patch = (updates: Record<string, unknown>) =>
    onDesignChange({ ...design, ...updates });

  // ── Template selection ──────────────────────────────────────────────────────
  const handleSelectTemplate = (template: EventTemplate) => {
    patch({
      templateId: template.id,
      templateName: template.name,
      primaryColor: template.primaryColor,
      secondaryColor: template.secondaryColor,
      textColor: template.textColor,
      gradient: template.gradient,
      accentColor: template.accentColor,
    });
    // Collapse template gallery, open customise sections
    setOpenSections(new Set(["colours", "background"]));
  };

  // ── Background image ────────────────────────────────────────────────────────
  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = (ev) => patch({ backgroundImage: ev.target?.result as string });
    reader.readAsDataURL(file);
  };

  // ── Colours ─────────────────────────────────────────────────────────────────
  const primaryColor = design?.primaryColor || "#6366f1";
  const secondaryColor = design?.secondaryColor || "#4338ca";
  const textColor = design?.textColor || "#ffffff";
  const backgroundImage: string = design?.backgroundImage || "";

  const selectedTemplate = design?.templateId
    ? TICKET_TEMPLATES.find((t) => t.id === design.templateId)
    : undefined;

  return (
    <div className="grid grid-cols-1 lg:grid-cols-[1fr_360px] gap-6">
      {/* ── Left column: controls ────────────────────────────────────────────── */}
      <div className="space-y-3">

        {/* 1 · Template */}
        <Section
          id="template"
          title="Choose Template"
          icon={LayoutTemplate}
          badge={selectedTemplate ? selectedTemplate.name : undefined}
          open={openSections.has("template")}
          onToggle={toggleSection}
        >
          <TicketTemplateGallery
            onSelectTemplate={handleSelectTemplate}
            selectedTemplateId={design?.templateId}
          />
        </Section>

        {/* 2 · Colours */}
        <Section
          id="colours"
          title="Colour & Style"
          icon={Palette}
          open={openSections.has("colours")}
          onToggle={toggleSection}
        >
          <div className="space-y-4">
            <p className="text-xs text-muted-foreground">
              Override any of the template's colours to personalise your ticket.
            </p>
            <div className="space-y-3">
              <ColourRow
                label="Primary"
                value={primaryColor}
                onChange={(v) => patch({ primaryColor: v })}
              />
              <ColourRow
                label="Secondary"
                value={secondaryColor}
                onChange={(v) => patch({ secondaryColor: v })}
              />
              <ColourRow
                label="Text"
                value={textColor}
                onChange={(v) => patch({ textColor: v })}
              />
            </div>
            <div className="space-y-3 pt-2 border-t">
              <div className="space-y-1.5">
                <Label className="text-xs">Font size: {fontSize[0]}px</Label>
                <Slider
                  value={fontSize}
                  onValueChange={(v) => {
                    setFontSize(v);
                    patch({ fontSize: v[0] });
                  }}
                  min={12}
                  max={24}
                  step={1}
                />
              </div>
              <div className="space-y-1.5">
                <Label className="text-xs">Corner radius: {borderRadius[0]}px</Label>
                <Slider
                  value={borderRadius}
                  onValueChange={(v) => {
                    setBorderRadius(v);
                    patch({ borderRadius: v[0] });
                  }}
                  min={0}
                  max={20}
                  step={1}
                />
              </div>
            </div>
          </div>
        </Section>

        {/* 3 · Background image */}
        <Section
          id="background"
          title="Background Image"
          icon={ImagePlus}
          badge={backgroundImage ? "Applied" : undefined}
          open={openSections.has("background")}
          onToggle={toggleSection}
        >
          {backgroundImage ? (
            <div className="space-y-3">
              <div className="relative rounded-lg overflow-hidden border">
                <img
                  src={backgroundImage}
                  alt="Background"
                  className="w-full h-28 object-cover"
                />
                <button
                  type="button"
                  onClick={() => patch({ backgroundImage: "" })}
                  className="absolute top-2 right-2 rounded-full bg-black/60 p-1 text-white hover:bg-black/80 transition-colors"
                >
                  <X className="h-3.5 w-3.5" />
                </button>
              </div>
              <p className="text-xs text-muted-foreground">
                The image is blended with your template in the preview.{" "}
                <label className="underline cursor-pointer hover:text-foreground transition-colors">
                  Replace image
                  <input
                    type="file"
                    accept="image/*"
                    className="hidden"
                    onChange={handleFileUpload}
                  />
                </label>
              </p>
            </div>
          ) : (
            <label className="flex flex-col items-center gap-3 rounded-xl border-2 border-dashed border-muted-foreground/25 p-6 text-center cursor-pointer hover:border-primary/40 hover:bg-muted/30 transition-all">
              <Upload className="h-8 w-8 text-muted-foreground/50" />
              <div>
                <p className="text-sm font-medium">Upload a background photo</p>
                <p className="text-xs text-muted-foreground mt-0.5">
                  PNG, JPG, WEBP — blended into your template
                </p>
              </div>
              <input
                type="file"
                accept="image/*"
                className="hidden"
                onChange={handleFileUpload}
              />
            </label>
          )}
        </Section>
      </div>

      {/* ── Right column: persistent live preview ────────────────────────────── */}
      <div className="lg:sticky lg:top-6 space-y-3 self-start">
        <Card className="overflow-hidden border-slate-200 dark:border-slate-700">
          <div className="bg-muted/40 px-4 py-2.5 border-b flex items-center justify-between">
            <span className="text-xs font-semibold uppercase tracking-wide text-muted-foreground">
              Live Preview
            </span>
            {selectedTemplate && (
              <span className="flex items-center gap-1.5 text-xs text-muted-foreground">
                <Check className="h-3 w-3 text-primary" />
                {selectedTemplate.name}
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

            {/* What-you-see context */}
            <div className="mt-3 space-y-1">
              {backgroundImage ? (
                <p className="text-[11px] text-muted-foreground text-center">
                  Background photo blended with template
                </p>
              ) : !selectedTemplate ? (
                <p className="text-[11px] text-muted-foreground text-center">
                  Select a template above to begin
                </p>
              ) : null}
            </div>
          </CardContent>
        </Card>

        {/* Selected template info card */}
        {selectedTemplate && (
          <Card className="border-slate-200 dark:border-slate-700">
            <CardContent className="p-4 space-y-2">
              <div className="flex items-center justify-between">
                <span className="text-sm font-semibold">{selectedTemplate.name}</span>
                <button
                  type="button"
                  onClick={() => {
                    toggleSection("template");
                    setOpenSections((prev) => new Set([...prev, "template"]));
                  }}
                  className="text-xs text-primary underline underline-offset-2 hover:opacity-80 transition-opacity"
                >
                  Change
                </button>
              </div>
              <p className="text-xs text-muted-foreground leading-snug">
                {selectedTemplate.description}
              </p>
              <div className="flex flex-wrap gap-1 pt-1">
                {selectedTemplate.tags.map((tag) => (
                  <span
                    key={tag}
                    className={cn(
                      "rounded-full px-2 py-0.5 text-[10px]",
                      "bg-muted text-muted-foreground"
                    )}
                  >
                    #{tag}
                  </span>
                ))}
              </div>
            </CardContent>
          </Card>
        )}
      </div>
    </div>
  );
};

export default TicketDesignStep;
