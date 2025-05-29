import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Badge } from "@/components/ui/badge";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { 
  Palette, 
  Image, 
  Type, 
  Shapes, 
  Sparkles,
  Download,
  Eye,
  Zap,
  Crown,
  Star
} from "lucide-react";

interface EnhancedTicketDesign {
  template: string;
  primaryColor: string;
  secondaryColor: string;
  accentColor: string;
  gradientDirection: string;
  fontFamily: string;
  fontSize: number;
  backgroundPattern: string;
  borderStyle: string;
  cornerRadius: number;
  shadow: string;
  holographicEffect: boolean;
  metallic: boolean;
  texture: string;
  animation: string;
}

interface EnhancedTicketDesignerProps {
  eventTitle: string;
  eventDate: string;
  eventLocation: string;
  design: EnhancedTicketDesign;
  onDesignChange: (design: EnhancedTicketDesign) => void;
}

const EnhancedTicketDesigner = ({ 
  eventTitle, 
  eventDate, 
  eventLocation, 
  design, 
  onDesignChange 
}: EnhancedTicketDesignerProps) => {
  const [activeTab, setActiveTab] = useState("templates");

  const premiumTemplates = [
    {
      id: "luxury-gold",
      name: "Luxury Gold",
      category: "Premium",
      preview: "linear-gradient(135deg, #d4af37 0%, #ffd700 50%, #ffed4e 100%)",
      isPremium: true,
      design: {
        primaryColor: "#d4af37",
        secondaryColor: "#000000",
        accentColor: "#ffd700",
        gradientDirection: "135deg",
        borderStyle: "double",
        shadow: "luxury",
        metallic: true
      }
    },
    {
      id: "holographic",
      name: "Holographic",
      category: "Premium",
      preview: "linear-gradient(45deg, #ff0080, #ff8c00, #40e0d0, #ee82ee, #9acd32)",
      isPremium: true,
      design: {
        primaryColor: "#ff0080",
        secondaryColor: "#ffffff",
        accentColor: "#40e0d0",
        gradientDirection: "45deg",
        holographicEffect: true,
        animation: "shimmer"
      }
    },
    {
      id: "carbon-fiber",
      name: "Carbon Fiber",
      category: "Professional",
      preview: "linear-gradient(135deg, #1a1a1a 0%, #2d2d2d 50%, #1a1a1a 100%)",
      isPremium: true,
      design: {
        primaryColor: "#1a1a1a",
        secondaryColor: "#ffffff",
        accentColor: "#0099ff",
        texture: "carbon-fiber",
        shadow: "deep"
      }
    },
    {
      id: "crystal-clear",
      name: "Crystal Clear",
      category: "Modern",
      preview: "linear-gradient(135deg, rgba(255,255,255,0.1) 0%, rgba(255,255,255,0.3) 100%)",
      isPremium: true,
      design: {
        primaryColor: "rgba(255,255,255,0.2)",
        secondaryColor: "#000000",
        accentColor: "#6366f1",
        borderStyle: "glass",
        shadow: "glass"
      }
    },
    {
      id: "neon-cyber",
      name: "Neon Cyber",
      category: "Futuristic",
      preview: "linear-gradient(135deg, #0a0a0a 0%, #1a1a2e 50%, #16213e 100%)",
      isPremium: true,
      design: {
        primaryColor: "#0a0a0a",
        secondaryColor: "#00ff41",
        accentColor: "#ff073a",
        animation: "neon-pulse",
        borderStyle: "neon"
      }
    },
    {
      id: "vintage-elegance",
      name: "Vintage Elegance",
      category: "Classic",
      preview: "linear-gradient(135deg, #8b4513 0%, #deb887 50%, #f5deb3 100%)",
      isPremium: false,
      design: {
        primaryColor: "#8b4513",
        secondaryColor: "#f5deb3",
        accentColor: "#cd853f",
        fontFamily: "serif",
        borderStyle: "ornate"
      }
    }
  ];

  const fontFamilies = [
    { value: "inter", label: "Inter (Modern)", style: "font-sans" },
    { value: "playfair", label: "Playfair Display (Elegant)", style: "font-serif" },
    { value: "roboto", label: "Roboto (Clean)", style: "font-sans" },
    { value: "merriweather", label: "Merriweather (Classic)", style: "font-serif" },
    { value: "oswald", label: "Oswald (Bold)", style: "font-sans" },
    { value: "dancing", label: "Dancing Script (Playful)", style: "font-cursive" }
  ];

  const backgroundPatterns = [
    { value: "none", label: "None" },
    { value: "dots", label: "Polka Dots" },
    { value: "geometric", label: "Geometric" },
    { value: "waves", label: "Waves" },
    { value: "hexagon", label: "Hexagon" },
    { value: "circuit", label: "Circuit Board" },
    { value: "marble", label: "Marble" },
    { value: "wood", label: "Wood Grain" }
  ];

  const animations = [
    { value: "none", label: "None" },
    { value: "shimmer", label: "Shimmer" },
    { value: "pulse", label: "Pulse" },
    { value: "glow", label: "Glow" },
    { value: "neon-pulse", label: "Neon Pulse" },
    { value: "rainbow", label: "Rainbow" }
  ];

  const applyTemplate = (template: any) => {
    onDesignChange({
      ...design,
      template: template.id,
      ...template.design
    });
  };

  const getTicketPreviewStyle = () => {
    let baseStyle = {
      background: design.primaryColor,
      color: design.secondaryColor,
      borderRadius: `${design.cornerRadius || 12}px`,
      border: `2px solid ${design.accentColor}`,
      position: 'relative' as const,
      overflow: 'hidden' as const
    };

    // Add gradient if specified
    if (design.gradientDirection && design.accentColor) {
      baseStyle.background = `linear-gradient(${design.gradientDirection}, ${design.primaryColor}, ${design.accentColor})`;
    }

    // Add shadow effects
    if (design.shadow === 'luxury') {
      Object.assign(baseStyle, {
        boxShadow: '0 20px 40px rgba(212, 175, 55, 0.3), 0 8px 16px rgba(0, 0, 0, 0.2)'
      });
    } else if (design.shadow === 'glass') {
      Object.assign(baseStyle, {
        backdropFilter: 'blur(10px)',
        boxShadow: '0 8px 32px rgba(0, 0, 0, 0.1)'
      });
    } else if (design.shadow === 'deep') {
      Object.assign(baseStyle, {
        boxShadow: '0 25px 50px rgba(0, 0, 0, 0.5)'
      });
    }

    return baseStyle;
  };

  const renderTicketPreview = () => (
    <div className="relative p-6 h-64 rounded-xl shadow-2xl transform hover:scale-105 transition-transform duration-300">
      <div 
        className="absolute inset-0 rounded-xl"
        style={getTicketPreviewStyle()}
      >
        {/* Background Pattern Overlay */}
        {design.backgroundPattern && design.backgroundPattern !== 'none' && (
          <div 
            className="absolute inset-0 opacity-10"
            style={{
              backgroundImage: `url("data:image/svg+xml,%3Csvg width='60' height='60' viewBox='0 0 60 60' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='none' fill-rule='evenodd'%3E%3Cg fill='%23ffffff'%3E%3Ccircle cx='30' cy='30' r='4'/%3E%3C/g%3E%3C/g%3E%3C/svg%3E")`,
              backgroundSize: '30px 30px'
            }}
          />
        )}

        {/* Holographic Effect */}
        {design.holographicEffect && (
          <div className="absolute inset-0 bg-gradient-to-r from-pink-500 via-purple-500 to-cyan-500 opacity-20 animate-pulse" />
        )}

        {/* Content */}
        <div className="relative z-10 p-6 h-full flex flex-col justify-between">
          <div>
            <div className="flex justify-between items-start mb-4">
              <div>
                <h3 className={`text-xl font-bold mb-1 ${design.fontFamily === 'serif' ? 'font-serif' : 'font-sans'}`}>
                  {eventTitle || "Amazing Event"}
                </h3>
                <p className="text-sm opacity-90">{eventDate || "Dec 25, 2024"}</p>
                <p className="text-sm opacity-90">{eventLocation || "Paradise Venue"}</p>
              </div>
              <div className="text-right">
                <div className="w-16 h-16 bg-white bg-opacity-20 rounded-lg flex items-center justify-center">
                  <div className="text-xs">QR</div>
                </div>
                <p className="text-xs mt-1 opacity-70">NFT #001</p>
              </div>
            </div>
          </div>
          
          <div className="flex justify-between items-end">
            <div className="flex items-center space-x-2">
              <Sparkles className="h-4 w-4" />
              <span className="text-sm font-medium">Tick3rt</span>
            </div>
            <div className="text-right">
              <p className="text-lg font-bold">0.05 ETH</p>
              <p className="text-xs opacity-70">Blockchain Verified</p>
            </div>
          </div>
        </div>

        {/* Decorative Elements */}
        {design.borderStyle === 'ornate' && (
          <>
            <div className="absolute top-4 left-4 w-8 h-8 border-2 border-current opacity-30 transform rotate-45" />
            <div className="absolute bottom-4 right-4 w-8 h-8 border-2 border-current opacity-30 transform rotate-45" />
          </>
        )}
        
        {design.borderStyle === 'neon' && (
          <div className="absolute inset-0 rounded-xl border-2 border-current shadow-[0_0_20px_currentColor] opacity-50" />
        )}
      </div>
    </div>
  );

  return (
    <div className="space-y-6">
      {/* Enhanced Preview */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Eye className="h-5 w-5 text-purple-500" />
            Premium Ticket Preview
          </CardTitle>
        </CardHeader>
        <CardContent>
          {renderTicketPreview()}
          <div className="flex gap-2 mt-4">
            <Button size="sm" variant="outline" className="flex items-center gap-1">
              <Download className="h-3 w-3" />
              Export
            </Button>
            <Button size="sm" variant="outline" className="flex items-center gap-1">
              <Zap className="h-3 w-3" />
              Preview 3D
            </Button>
          </div>
        </CardContent>
      </Card>

      {/* Design Controls */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Palette className="h-5 w-5 text-purple-500" />
            Professional Design Studio
          </CardTitle>
        </CardHeader>
        <CardContent>
          <Tabs value={activeTab} onValueChange={setActiveTab}>
            <TabsList className="grid w-full grid-cols-5">
              <TabsTrigger value="templates" className="text-xs">Templates</TabsTrigger>
              <TabsTrigger value="colors" className="text-xs">Colors</TabsTrigger>
              <TabsTrigger value="typography" className="text-xs">Typography</TabsTrigger>
              <TabsTrigger value="effects" className="text-xs">Effects</TabsTrigger>
              <TabsTrigger value="advanced" className="text-xs">Advanced</TabsTrigger>
            </TabsList>

            <TabsContent value="templates" className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                {premiumTemplates.map((template) => (
                  <Card 
                    key={template.id} 
                    className="cursor-pointer hover:shadow-lg transition-all duration-300 hover:scale-105"
                    onClick={() => applyTemplate(template)}
                  >
                    <CardContent className="p-3">
                      <div 
                        className="h-20 rounded-lg mb-2 relative overflow-hidden"
                        style={{ background: template.preview }}
                      >
                        {template.isPremium && (
                          <Badge className="absolute top-1 right-1 bg-yellow-500 text-black text-xs">
                            <Crown className="h-2 w-2 mr-1" />
                            Premium
                          </Badge>
                        )}
                      </div>
                      <h5 className="font-medium text-sm">{template.name}</h5>
                      <p className="text-xs text-muted-foreground">{template.category}</p>
                    </CardContent>
                  </Card>
                ))}
              </div>
            </TabsContent>

            <TabsContent value="colors" className="space-y-4">
              <div className="grid grid-cols-3 gap-4">
                <div>
                  <Label className="text-sm font-medium">Primary Color</Label>
                  <Input
                    type="color"
                    value={design.primaryColor}
                    onChange={(e) => onDesignChange({ ...design, primaryColor: e.target.value })}
                    className="h-12 w-full"
                  />
                </div>
                <div>
                  <Label className="text-sm font-medium">Secondary Color</Label>
                  <Input
                    type="color"
                    value={design.secondaryColor}
                    onChange={(e) => onDesignChange({ ...design, secondaryColor: e.target.value })}
                    className="h-12 w-full"
                  />
                </div>
                <div>
                  <Label className="text-sm font-medium">Accent Color</Label>
                  <Input
                    type="color"
                    value={design.accentColor}
                    onChange={(e) => onDesignChange({ ...design, accentColor: e.target.value })}
                    className="h-12 w-full"
                  />
                </div>
              </div>
              
              <div>
                <Label className="text-sm font-medium mb-2 block">Gradient Direction</Label>
                <Select 
                  value={design.gradientDirection} 
                  onValueChange={(value) => onDesignChange({ ...design, gradientDirection: value })}
                >
                  <SelectTrigger>
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
            </TabsContent>

            <TabsContent value="typography" className="space-y-4">
              <div>
                <Label className="text-sm font-medium mb-2 block">Font Family</Label>
                <Select 
                  value={design.fontFamily} 
                  onValueChange={(value) => onDesignChange({ ...design, fontFamily: value })}
                >
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    {fontFamilies.map(font => (
                      <SelectItem key={font.value} value={font.value}>
                        <span className={font.style}>{font.label}</span>
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              
              <div>
                <Label className="text-sm font-medium">Font Size: {design.fontSize}px</Label>
                <input
                  type="range"
                  min="12"
                  max="36"
                  value={design.fontSize}
                  onChange={(e) => onDesignChange({ ...design, fontSize: parseInt(e.target.value) })}
                  className="w-full mt-1"
                />
              </div>
            </TabsContent>

            <TabsContent value="effects" className="space-y-4">
              <div>
                <Label className="text-sm font-medium mb-2 block">Background Pattern</Label>
                <Select 
                  value={design.backgroundPattern} 
                  onValueChange={(value) => onDesignChange({ ...design, backgroundPattern: value })}
                >
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    {backgroundPatterns.map(pattern => (
                      <SelectItem key={pattern.value} value={pattern.value}>
                        {pattern.label}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              <div>
                <Label className="text-sm font-medium mb-2 block">Animation</Label>
                <Select 
                  value={design.animation} 
                  onValueChange={(value) => onDesignChange({ ...design, animation: value })}
                >
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    {animations.map(animation => (
                      <SelectItem key={animation.value} value={animation.value}>
                        {animation.label}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-3">
                <div className="flex items-center justify-between">
                  <Label className="text-sm font-medium">Holographic Effect</Label>
                  <input
                    type="checkbox"
                    checked={design.holographicEffect}
                    onChange={(e) => onDesignChange({ ...design, holographicEffect: e.target.checked })}
                    className="w-4 h-4"
                  />
                </div>
                <div className="flex items-center justify-between">
                  <Label className="text-sm font-medium">Metallic Finish</Label>
                  <input
                    type="checkbox"
                    checked={design.metallic}
                    onChange={(e) => onDesignChange({ ...design, metallic: e.target.checked })}
                    className="w-4 h-4"
                  />
                </div>
              </div>
            </TabsContent>

            <TabsContent value="advanced" className="space-y-4">
              <div>
                <Label className="text-sm font-medium">Corner Radius: {design.cornerRadius}px</Label>
                <input
                  type="range"
                  min="0"
                  max="30"
                  value={design.cornerRadius}
                  onChange={(e) => onDesignChange({ ...design, cornerRadius: parseInt(e.target.value) })}
                  className="w-full mt-1"
                />
              </div>

              <div>
                <Label className="text-sm font-medium mb-2 block">Border Style</Label>
                <Select 
                  value={design.borderStyle} 
                  onValueChange={(value) => onDesignChange({ ...design, borderStyle: value })}
                >
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="solid">Solid</SelectItem>
                    <SelectItem value="double">Double</SelectItem>
                    <SelectItem value="dashed">Dashed</SelectItem>
                    <SelectItem value="ornate">Ornate</SelectItem>
                    <SelectItem value="neon">Neon Glow</SelectItem>
                    <SelectItem value="glass">Glass</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div>
                <Label className="text-sm font-medium mb-2 block">Shadow Effect</Label>
                <Select 
                  value={design.shadow} 
                  onValueChange={(value) => onDesignChange({ ...design, shadow: value })}
                >
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="none">None</SelectItem>
                    <SelectItem value="soft">Soft</SelectItem>
                    <SelectItem value="luxury">Luxury Gold</SelectItem>
                    <SelectItem value="glass">Glass Blur</SelectItem>
                    <SelectItem value="deep">Deep Shadow</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </TabsContent>
          </Tabs>
        </CardContent>
      </Card>
    </div>
  );
};

export default EnhancedTicketDesigner;
