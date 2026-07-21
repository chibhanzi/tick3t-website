import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Palette, Wand2, Layers, Image, Plus, Eye, Edit, Copy } from "lucide-react";
import TicketDesignStep from "@/components/TicketDesignStep";

interface TicketTemplate {
  id: string;
  name: string;
  event: string;
  style: string;
  colors: string[];
  usedCount: number;
  createdAt: string;
}

const mockTemplates: TicketTemplate[] = [
  { id: "1", name: "Neon Nights", event: "Afrobeats Night Live", style: "Gradient", colors: ["#7c3aed", "#ec4899"], usedCount: 800, createdAt: "2024-03-01" },
  { id: "2", name: "Tech Minimal", event: "Tech Innovation Summit", style: "Minimal", colors: ["#1e40af", "#ffffff"], usedCount: 450, createdAt: "2024-02-15" },
  { id: "3", name: "Gold Premium", event: "VIP Gala Dinner", style: "Premium", colors: ["#b45309", "#fbbf24"], usedCount: 120, createdAt: "2024-03-10" },
];

const TicketDesignManager = () => {
  const [showDesigner, setShowDesigner] = useState(false);
  const [templates] = useState<TicketTemplate[]>(mockTemplates);

  if (showDesigner) {
    return (
      <div className="space-y-4">
        <Button variant="outline" onClick={() => setShowDesigner(false)}>
          ← Back to Templates
        </Button>
        <TicketDesignStep
          eventData={{ title: "New Event", date: "2024-06-01", location: "Lagos" }}
          design={{}}
          onDesignChange={() => {}}
        />
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3">
        <div>
          <h3 className="text-lg font-semibold">Ticket Templates</h3>
          <p className="text-sm text-muted-foreground">Design and manage your ticket templates</p>
        </div>
        <Button onClick={() => setShowDesigner(true)}>
          <Plus className="h-4 w-4 mr-2" />
          New Design
        </Button>
      </div>

      {/* Design Modes Info */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
        {[
          { icon: Wand2, label: "Advanced", desc: "Full control" },
          { icon: Palette, label: "Smart", desc: "AI-assisted" },
          { icon: Layers, label: "Layers", desc: "Layer editor" },
          { icon: Image, label: "Custom", desc: "Upload images" },
        ].map(({ icon: Icon, label, desc }) => (
          <Card key={label} className="cursor-pointer hover:shadow-md transition-shadow" onClick={() => setShowDesigner(true)}>
            <CardContent className="p-4 text-center">
              <Icon className="h-6 w-6 mx-auto mb-2 text-primary" />
              <p className="text-sm font-medium">{label}</p>
              <p className="text-xs text-muted-foreground">{desc}</p>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Saved Templates */}
      <div className="space-y-3">
        <h4 className="font-medium">Saved Templates</h4>
        {templates.map((template) => (
          <Card key={template.id} className="hover:shadow-md transition-shadow">
            <CardContent className="p-4">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-4">
                  {/* Color Preview */}
                  <div
                    className="w-16 h-10 rounded-lg shadow-sm shrink-0"
                    style={{
                      background: `linear-gradient(135deg, ${template.colors[0]}, ${template.colors[1]})`
                    }}
                  />
                  <div>
                    <h4 className="font-medium">{template.name}</h4>
                    <p className="text-sm text-muted-foreground">{template.event}</p>
                    <div className="flex items-center gap-2 mt-1">
                      <Badge variant="outline" className="text-xs">{template.style}</Badge>
                      <span className="text-xs text-muted-foreground">{template.usedCount} tickets issued</span>
                    </div>
                  </div>
                </div>
                <div className="flex items-center gap-1">
                  <Button variant="ghost" size="icon"><Eye className="h-4 w-4" /></Button>
                  <Button variant="ghost" size="icon"><Edit className="h-4 w-4" /></Button>
                  <Button variant="ghost" size="icon"><Copy className="h-4 w-4" /></Button>
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
};

export default TicketDesignManager;
