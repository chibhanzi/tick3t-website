
import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Slider } from "@/components/ui/slider";
import { Badge } from "@/components/ui/badge";
import { Palette, Type, Image, Layout, Download } from "lucide-react";

interface AdvancedTicketDesignerProps {
  eventTitle: string;
  eventDate: string;
  eventLocation: string;
  design: any;
  onDesignChange: (design: any) => void;
}

const AdvancedTicketDesigner = ({ 
  eventTitle, 
  eventDate, 
  eventLocation, 
  design = {}, 
  onDesignChange 
}: AdvancedTicketDesignerProps) => {
  const [selectedTemplate, setSelectedTemplate] = useState(design.template || 'modern');
  const [primaryColor, setPrimaryColor] = useState(design.primaryColor || '#3B82F6');
  const [secondaryColor, setSecondaryColor] = useState(design.secondaryColor || '#1E40AF');
  const [textColor, setTextColor] = useState(design.textColor || '#FFFFFF');
  const [fontSize, setFontSize] = useState(design.fontSize || [16]);
  const [borderRadius, setBorderRadius] = useState(design.borderRadius || [8]);

  const templates = [
    { id: 'modern', name: 'Modern', description: 'Clean and contemporary' },
    { id: 'classic', name: 'Classic', description: 'Traditional elegance' },
    { id: 'vibrant', name: 'Vibrant', description: 'Bold and colorful' },
    { id: 'minimal', name: 'Minimal', description: 'Simple and clean' }
  ];

  const updateDesign = (updates: any) => {
    const newDesign = { ...design, ...updates };
    onDesignChange(newDesign);
  };

  const handleTemplateChange = (templateId: string) => {
    setSelectedTemplate(templateId);
    updateDesign({ template: templateId });
  };

  const handleColorChange = (colorType: string, color: string) => {
    if (colorType === 'primary') {
      setPrimaryColor(color);
      updateDesign({ primaryColor: color });
    } else if (colorType === 'secondary') {
      setSecondaryColor(color);
      updateDesign({ secondaryColor: color });
    } else if (colorType === 'text') {
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

  return (
    <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
      {/* Design Controls */}
      <div className="space-y-6">
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-lg">
              <Layout className="h-4 w-4" />
              Template Selection
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid grid-cols-2 gap-3">
              {templates.map((template) => (
                <Card
                  key={template.id}
                  className={`cursor-pointer transition-all ${
                    selectedTemplate === template.id
                      ? 'border-blue-500 bg-blue-50 dark:bg-blue-950'
                      : 'hover:border-gray-300'
                  }`}
                  onClick={() => handleTemplateChange(template.id)}
                >
                  <CardContent className="p-4">
                    <h4 className="font-medium text-sm">{template.name}</h4>
                    <p className="text-xs text-muted-foreground">{template.description}</p>
                  </CardContent>
                </Card>
              ))}
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-lg">
              <Palette className="h-4 w-4" />
              Color Scheme
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
              <div className="space-y-2">
                <Label className="text-sm">Primary Color</Label>
                <div className="flex items-center gap-2">
                  <Input
                    type="color"
                    value={primaryColor}
                    onChange={(e) => handleColorChange('primary', e.target.value)}
                    className="w-12 h-8 p-1 border-0"
                  />
                  <Input
                    type="text"
                    value={primaryColor}
                    onChange={(e) => handleColorChange('primary', e.target.value)}
                    className="text-xs"
                    placeholder="#3B82F6"
                  />
                </div>
              </div>
              
              <div className="space-y-2">
                <Label className="text-sm">Secondary Color</Label>
                <div className="flex items-center gap-2">
                  <Input
                    type="color"
                    value={secondaryColor}
                    onChange={(e) => handleColorChange('secondary', e.target.value)}
                    className="w-12 h-8 p-1 border-0"
                  />
                  <Input
                    type="text"
                    value={secondaryColor}
                    onChange={(e) => handleColorChange('secondary', e.target.value)}
                    className="text-xs"
                    placeholder="#1E40AF"
                  />
                </div>
              </div>
              
              <div className="space-y-2">
                <Label className="text-sm">Text Color</Label>
                <div className="flex items-center gap-2">
                  <Input
                    type="color"
                    value={textColor}
                    onChange={(e) => handleColorChange('text', e.target.value)}
                    className="w-12 h-8 p-1 border-0"
                  />
                  <Input
                    type="text"
                    value={textColor}
                    onChange={(e) => handleColorChange('text', e.target.value)}
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
              Typography & Styling
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

      {/* Live Preview */}
      <div className="space-y-4">
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-lg">
              <Image className="h-4 w-4" />
              Live Preview
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div 
              className="relative p-6 rounded-lg shadow-lg overflow-hidden max-w-md mx-auto"
              style={{
                background: `linear-gradient(135deg, ${primaryColor}, ${secondaryColor})`,
                borderRadius: `${borderRadius[0]}px`,
                color: textColor,
                fontSize: `${fontSize[0]}px`
              }}
            >
              <div className="space-y-3">
                <div className="flex justify-between items-start">
                  <div>
                    <h3 className="font-bold text-lg leading-tight">
                      {eventTitle || "Event Title"}
                    </h3>
                    <p className="text-sm opacity-90">
                      {eventDate ? new Date(eventDate).toLocaleDateString() : "Event Date"}
                    </p>
                    <p className="text-sm opacity-90">
                      {eventLocation || "Event Location"}
                    </p>
                  </div>
                  <Badge variant="secondary" className="text-xs">
                    {selectedTemplate}
                  </Badge>
                </div>
                
                <div className="border-t border-white/20 pt-3">
                  <div className="flex justify-between text-xs">
                    <span>Ticket #001</span>
                    <span>Tick3rt</span>
                  </div>
                </div>
              </div>
            </div>
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
