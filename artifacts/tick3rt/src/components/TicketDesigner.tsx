
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { QrCode, Sparkles } from "lucide-react";

interface TicketDesign {
  backgroundColor: string;
  textColor: string;
  borderColor: string;
  pattern: string;
}

interface TicketDesignerProps {
  eventTitle: string;
  eventDate: string;
  eventLocation: string;
  design: TicketDesign;
  onDesignChange: (design: TicketDesign) => void;
}

const TicketDesigner = ({ 
  eventTitle, 
  eventDate, 
  eventLocation, 
  design, 
  onDesignChange 
}: TicketDesignerProps) => {
  const presetDesigns = [
    { name: "Purple Vibes", backgroundColor: "#7c3aed", textColor: "#ffffff", borderColor: "#ec4899", pattern: "gradient" },
    { name: "Ocean Breeze", backgroundColor: "#0ea5e9", textColor: "#ffffff", borderColor: "#22c55e", pattern: "waves" },
    { name: "Sunset Party", backgroundColor: "#f97316", textColor: "#ffffff", borderColor: "#eab308", pattern: "dots" },
    { name: "Neon Night", backgroundColor: "#000000", textColor: "#22c55e", borderColor: "#ec4899", pattern: "neon" },
  ];

  const handleColorChange = (field: keyof TicketDesign, value: string) => {
    onDesignChange({ ...design, [field]: value });
  };

  const applyPreset = (preset: any) => {
    onDesignChange(preset);
  };

  const getTicketStyle = () => {
    let backgroundStyle = `background-color: ${design.backgroundColor};`;
    
    if (design.pattern === "gradient") {
      backgroundStyle = `background: linear-gradient(135deg, ${design.backgroundColor}, ${design.borderColor});`;
    } else if (design.pattern === "waves") {
      backgroundStyle = `background: ${design.backgroundColor}; background-image: url("data:image/svg+xml,%3Csvg width='60' height='60' viewBox='0 0 60 60' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='none' fill-rule='evenodd'%3E%3Cg fill='%23ffffff' fill-opacity='0.1'%3E%3Cpath d='M36 34v-4h-2v4h-4v2h4v4h2v-4h4v-2h-4zm0-30V0h-2v4h-4v2h4v4h2V6h4V4h-4zM6 34v-4H4v4H0v2h4v4h2v-4h4v-2H6zM6 4V0H4v4H0v2h4v4h2V6h4V4H6z'/%3E%3C/g%3E%3C/g%3E%3C/svg%3E");`;
    }

    return {
      background: backgroundStyle,
      color: design.textColor,
      border: `2px solid ${design.borderColor}`,
    };
  };

  return (
    <div className="space-y-6">
      {/* Ticket Preview */}
      <div className="relative">
        <div 
          className="w-full p-6 rounded-xl shadow-lg transform rotate-1 hover:rotate-0 transition-transform duration-300"
          style={getTicketStyle()}
        >
          <div className="flex justify-between items-start mb-4">
            <div>
              <h3 className="text-xl font-bold mb-1">{eventTitle}</h3>
              <p className="text-sm opacity-90">{eventDate}</p>
              <p className="text-sm opacity-90">{eventLocation}</p>
            </div>
            <div className="text-right">
              <QrCode className="h-16 w-16 opacity-80" />
              <p className="text-xs mt-1 opacity-70">NFT #001</p>
            </div>
          </div>
          
          <div className="flex justify-between items-end">
            <div className="flex items-center space-x-2">
              <Sparkles className="h-4 w-4" />
              <span className="text-sm font-medium">Tick3rt</span>
            </div>
            <div className="text-right">
              <p className="text-lg font-bold">$89.00</p>
              <p className="text-xs opacity-70">Blockchain Verified</p>
            </div>
          </div>
        </div>
      </div>

      {/* Design Controls */}
      <div className="space-y-4">
        <h4 className="font-semibold text-gray-700">🎨 Customize Your Design</h4>
        
        {/* Preset Designs */}
        <div>
          <Label className="text-sm font-medium text-gray-600 mb-2 block">Quick Presets</Label>
          <div className="grid grid-cols-2 gap-2">
            {presetDesigns.map((preset) => (
              <Button
                key={preset.name}
                variant="outline"
                size="sm"
                onClick={() => applyPreset(preset)}
                className="justify-start border-purple-200 hover:bg-purple-50"
              >
                <div 
                  className="w-4 h-4 rounded mr-2" 
                  style={{ backgroundColor: preset.backgroundColor, border: `1px solid ${preset.borderColor}` }}
                />
                {preset.name}
              </Button>
            ))}
          </div>
        </div>

        {/* Color Controls */}
        <div className="grid grid-cols-3 gap-4">
          <div>
            <Label htmlFor="bg-color" className="text-sm font-medium text-gray-600">Background</Label>
            <input
              id="bg-color"
              type="color"
              value={design.backgroundColor}
              onChange={(e) => handleColorChange("backgroundColor", e.target.value)}
              className="w-full h-10 rounded border border-purple-200 cursor-pointer"
            />
          </div>
          <div>
            <Label htmlFor="text-color" className="text-sm font-medium text-gray-600">Text</Label>
            <input
              id="text-color"
              type="color"
              value={design.textColor}
              onChange={(e) => handleColorChange("textColor", e.target.value)}
              className="w-full h-10 rounded border border-purple-200 cursor-pointer"
            />
          </div>
          <div>
            <Label htmlFor="border-color" className="text-sm font-medium text-gray-600">Accent</Label>
            <input
              id="border-color"
              type="color"
              value={design.borderColor}
              onChange={(e) => handleColorChange("borderColor", e.target.value)}
              className="w-full h-10 rounded border border-purple-200 cursor-pointer"
            />
          </div>
        </div>

        {/* Pattern Selection */}
        <div>
          <Label className="text-sm font-medium text-gray-600 mb-2 block">Pattern Style</Label>
          <div className="grid grid-cols-2 gap-2">
            {["gradient", "waves", "dots", "neon"].map((pattern) => (
              <Button
                key={pattern}
                variant={design.pattern === pattern ? "default" : "outline"}
                size="sm"
                onClick={() => handleColorChange("pattern", pattern)}
                className={design.pattern === pattern 
                  ? "bg-gradient-to-r from-purple-500 to-pink-500 text-white" 
                  : "border-purple-200 hover:bg-purple-50"
                }
              >
                {pattern.charAt(0).toUpperCase() + pattern.slice(1)}
              </Button>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default TicketDesigner;
