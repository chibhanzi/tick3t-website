import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Slider } from "@/components/ui/slider";
import { Palette, Type, Eye, Download, LayoutTemplate } from "lucide-react";
import { TICKET_TEMPLATES } from "./TicketTemplateGallery";

interface AdvancedTicketDesignerProps {
  eventTitle: string;
  eventDate: string;
  eventLocation: string;
  design: any;
  onDesignChange: (design: any) => void;
}

/** Format an ISO date string into a short human-readable form */
function formatDate(raw: string): string {
  if (!raw) return "";
  try {
    return new Date(raw).toLocaleDateString("en-US", {
      month: "short",
      day: "numeric",
      year: "numeric",
    });
  } catch {
    return raw;
  }
}

const AdvancedTicketDesigner = ({
  eventTitle,
  eventDate,
  eventLocation,
  design = {},
  onDesignChange,
}: AdvancedTicketDesignerProps) => {
  const [primaryColor, setPrimaryColor] = useState(design.primaryColor || "#3B82F6");
  const [secondaryColor, setSecondaryColor] = useState(design.secondaryColor || "#1E40AF");
  const [textColor, setTextColor] = useState(design.textColor || "#FFFFFF");
  const [fontSize, setFontSize] = useState<number[]>([design.fontSize || 16]);
  const [borderRadius, setBorderRadius] = useState<number[]>([design.borderRadius || 8]);

  // Look up the template that was selected in the gallery
  const selectedTemplate = design.templateId
    ? TICKET_TEMPLATES.find((t) => t.id === design.templateId) ?? null
    : null;

  const updateDesign = (updates: any) => {
    onDesignChange({ ...design, ...updates });
  };

  const handleColorChange = (colorType: string, color: string) => {
    if (colorType === "primary") {
      setPrimaryColor(color);
      updateDesign({ primaryColor: color });
    } else if (colorType === "secondary") {
      setSecondaryColor(color);
      updateDesign({ secondaryColor: color });
    } else if (colorType === "text") {
      setTextColor(color);
      updateDesign({ textColor: color });
    }
  };

  const handleFontSizeChange = (value: number[]) => {
    setFontSize(value);
    updateDesign({ fontSize: value[0] });
  };

  const handleBorderRadiusChange = (value: number[]) => {
    setBorderRadius(value);
    updateDesign({ borderRadius: value[0] });
  };

  // Props to forward into the template preview
  const previewProps = {
    title: eventTitle || "Event Title",
    date: formatDate(eventDate) || "Event Date",
    location: eventLocation || "Venue",
  };

  return (
    <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
      {/* ── Design Controls ── */}
      <div className="space-y-6">
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-lg">
              <Palette className="h-4 w-4" />
              Colour Overrides
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <p className="text-xs text-muted-foreground">
              Fine-tune the template colours, or leave them as-is to keep the original palette.
            </p>
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
              <div className="space-y-2">
                <Label className="text-sm">Primary</Label>
                <div className="flex items-center gap-2">
                  <Input
                    type="color"
                    value={primaryColor}
                    onChange={(e) => handleColorChange("primary", e.target.value)}
                    className="w-12 h-8 p-1 border-0"
                  />
                  <Input
                    type="text"
                    value={primaryColor}
                    onChange={(e) => handleColorChange("primary", e.target.value)}
                    className="text-xs"
                    placeholder="#3B82F6"
                  />
                </div>
              </div>

              <div className="space-y-2">
                <Label className="text-sm">Secondary</Label>
                <div className="flex items-center gap-2">
                  <Input
                    type="color"
                    value={secondaryColor}
                    onChange={(e) => handleColorChange("secondary", e.target.value)}
                    className="w-12 h-8 p-1 border-0"
                  />
                  <Input
                    type="text"
                    value={secondaryColor}
                    onChange={(e) => handleColorChange("secondary", e.target.value)}
                    className="text-xs"
                    placeholder="#1E40AF"
                  />
                </div>
              </div>

              <div className="space-y-2">
                <Label className="text-sm">Text</Label>
                <div className="flex items-center gap-2">
                  <Input
                    type="color"
                    value={textColor}
                    onChange={(e) => handleColorChange("text", e.target.value)}
                    className="w-12 h-8 p-1 border-0"
                  />
                  <Input
                    type="text"
                    value={textColor}
                    onChange={(e) => handleColorChange("text", e.target.value)}
                    className="text-xs"
                    placeholder="#FFFFFF"
                  />
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-lg">
              <Type className="h-4 w-4" />
              Typography &amp; Sizing
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-2">
              <Label className="text-sm">Font Size: {fontSize[0]}px</Label>
              <Slider
                value={fontSize}
                onValueChange={handleFontSizeChange}
                max={24}
                min={12}
                step={1}
                className="w-full"
              />
            </div>

            <div className="space-y-2">
              <Label className="text-sm">Border Radius: {borderRadius[0]}px</Label>
              <Slider
                value={borderRadius}
                onValueChange={handleBorderRadiusChange}
                max={20}
                min={0}
                step={1}
                className="w-full"
              />
            </div>
          </CardContent>
        </Card>
      </div>

      {/* ── Live Preview ── */}
      <div className="space-y-4">
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-lg">
              <Eye className="h-4 w-4" />
              Live Preview
              {selectedTemplate && (
                <span className="ml-auto text-xs font-normal text-muted-foreground flex items-center gap-1">
                  <LayoutTemplate className="h-3 w-3" />
                  {selectedTemplate.name}
                </span>
              )}
            </CardTitle>
          </CardHeader>
          <CardContent>
            {selectedTemplate ? (
              /* Render the template's own unique Preview component with real event data */
              <div className="max-w-lg mx-auto">
                <selectedTemplate.Preview {...previewProps} />
              </div>
            ) : (
              /* No template selected yet — simple placeholder */
              <div
                className="relative p-6 rounded-lg shadow-lg overflow-hidden max-w-lg mx-auto"
                style={{
                  background: `linear-gradient(135deg, ${primaryColor}, ${secondaryColor})`,
                  borderRadius: `${borderRadius[0]}px`,
                  color: textColor,
                  fontSize: `${fontSize[0]}px`,
                }}
              >
                <div className="space-y-3">
                  <div className="flex justify-between items-start">
                    <div>
                      <h3 className="font-bold text-lg leading-tight">
                        {eventTitle || "Event Title"}
                      </h3>
                      <p className="text-sm opacity-90">
                        {eventDate ? formatDate(eventDate) : "Event Date"}
                      </p>
                      <p className="text-sm opacity-90">
                        {eventLocation || "Event Location"}
                      </p>
                    </div>
                  </div>
                  <div className="border-t border-white/20 pt-3">
                    <div className="flex justify-between text-xs">
                      <span>Ticket #001</span>
                      <span>Tick3t</span>
                    </div>
                  </div>
                </div>
                <p className="mt-4 text-center text-xs opacity-60">
                  ← Pick a template from the Templates tab to see its full design here
                </p>
              </div>
            )}
          </CardContent>
        </Card>

        <Button className="w-full" variant="outline">
          <Download className="h-4 w-4 mr-2" />
          Export Design
        </Button>
      </div>
    </div>
  );
};

export default AdvancedTicketDesigner;
