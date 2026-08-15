import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Slider } from "@/components/ui/slider";
import { Palette, Type, Download } from "lucide-react";
import TicketLivePreview from "./TicketLivePreview";

interface AdvancedTicketDesignerProps {
  eventTitle: string;
  eventDate: string;
  eventLocation: string;
  design: any;
  onDesignChange: (design: any) => void;
}

function formatDate(raw: string): string {
  if (!raw) return "";
  try {
    return new Date(raw).toLocaleDateString("en-US", { month: "short", day: "numeric", year: "numeric" });
  } catch { return raw; }
}

const AdvancedTicketDesigner = ({
  eventTitle, eventDate, eventLocation, design = {}, onDesignChange,
}: AdvancedTicketDesignerProps) => {
  const [primaryColor, setPrimaryColor]     = useState(design.primaryColor   || "#3B82F6");
  const [secondaryColor, setSecondaryColor] = useState(design.secondaryColor || "#1E40AF");
  const [textColor, setTextColor]           = useState(design.textColor      || "#FFFFFF");
  const [fontSize, setFontSize]             = useState<number[]>([design.fontSize     || 16]);
  const [borderRadius, setBorderRadius]     = useState<number[]>([design.borderRadius || 8]);

  const patch = (updates: any) => onDesignChange({ ...design, ...updates });

  const handleColor = (key: string, color: string) => {
    if (key === "primary")   { setPrimaryColor(color);   patch({ primaryColor: color });   }
    if (key === "secondary") { setSecondaryColor(color); patch({ secondaryColor: color }); }
    if (key === "text")      { setTextColor(color);      patch({ textColor: color });      }
  };

  return (
    <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
      {/* Controls */}
      <div className="space-y-6">
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-lg">
              <Palette className="h-4 w-4" /> Colour Overrides
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <p className="text-xs text-muted-foreground">
              Fine-tune the template colours, or leave them to keep the original palette.
            </p>
            {[
              { label: "Primary",   key: "primary",   value: primaryColor,   set: setPrimaryColor   },
              { label: "Secondary", key: "secondary", value: secondaryColor, set: setSecondaryColor },
              { label: "Text",      key: "text",      value: textColor,      set: setTextColor      },
            ].map(({ label, key, value }) => (
              <div key={key} className="space-y-1.5">
                <Label className="text-sm">{label}</Label>
                <div className="flex items-center gap-2">
                  <Input type="color" value={value} onChange={(e) => handleColor(key, e.target.value)} className="w-12 h-8 p-1 border-0" />
                  <Input type="text"  value={value} onChange={(e) => handleColor(key, e.target.value)} className="text-xs" placeholder="#000000" />
                </div>
              </div>
            ))}
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-lg">
              <Type className="h-4 w-4" /> Typography &amp; Sizing
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-2">
              <Label className="text-sm">Font size: {fontSize[0]}px</Label>
              <Slider value={fontSize} onValueChange={(v) => { setFontSize(v); patch({ fontSize: v[0] }); }} min={12} max={24} step={1} />
            </div>
            <div className="space-y-2">
              <Label className="text-sm">Corner radius: {borderRadius[0]}px</Label>
              <Slider value={borderRadius} onValueChange={(v) => { setBorderRadius(v); patch({ borderRadius: v[0] }); }} min={0} max={20} step={1} />
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Live Preview — uses the same shared component as the main designer */}
      <div className="space-y-4">
        <Card>
          <CardHeader>
            <CardTitle className="text-lg">Live Preview</CardTitle>
          </CardHeader>
          <CardContent>
            <TicketLivePreview
              design={design}
              eventTitle={eventTitle}
              eventDate={formatDate(eventDate)}
              eventLocation={eventLocation}
            />
          </CardContent>
        </Card>
        <Button className="w-full" variant="outline">
          <Download className="h-4 w-4 mr-2" /> Export Design
        </Button>
      </div>
    </div>
  );
};

export default AdvancedTicketDesigner;
