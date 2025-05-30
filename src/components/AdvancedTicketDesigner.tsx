
import { useState, useRef } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Badge } from "@/components/ui/badge";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Slider } from "@/components/ui/slider";
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
  Star,
  Upload,
  Trash2,
  Copy,
  RotateCcw,
  Save,
  Plus,
  Move,
  MousePointer
} from "lucide-react";

interface TicketElement {
  id: string;
  type: 'text' | 'image' | 'shape' | 'qr' | 'logo';
  content: string;
  x: number;
  y: number;
  width: number;
  height: number;
  rotation: number;
  fontSize?: number;
  fontFamily?: string;
  fontWeight?: string;
  color?: string;
  backgroundColor?: string;
  borderRadius?: number;
  opacity: number;
  zIndex: number;
}

interface TicketDesign {
  elements: TicketElement[];
  background: {
    type: 'color' | 'gradient' | 'image';
    value: string;
    secondaryColor?: string;
    gradientDirection?: number;
  };
  dimensions: {
    width: number;
    height: number;
  };
  template: string;
}

interface AdvancedTicketDesignerProps {
  eventTitle: string;
  eventDate: string;
  eventLocation: string;
  design: TicketDesign;
  onDesignChange: (design: TicketDesign) => void;
}

const AdvancedTicketDesigner = ({ 
  eventTitle, 
  eventDate, 
  eventLocation, 
  design, 
  onDesignChange 
}: AdvancedTicketDesignerProps) => {
  const [selectedElement, setSelectedElement] = useState<string | null>(null);
  const [tool, setTool] = useState<'select' | 'text' | 'shape' | 'image'>('select');
  const canvasRef = useRef<HTMLDivElement>(null);

  // Professional templates
  const templates = [
    {
      id: 'modern-minimal',
      name: 'Modern Minimal',
      category: 'Professional',
      background: { type: 'gradient' as const, value: '#ffffff', secondaryColor: '#f8fafc', gradientDirection: 135 },
      elements: [
        {
          id: 'title',
          type: 'text' as const,
          content: eventTitle || 'Event Title',
          x: 20,
          y: 30,
          width: 300,
          height: 40,
          rotation: 0,
          fontSize: 24,
          fontFamily: 'Inter',
          fontWeight: 'bold',
          color: '#1a1a1a',
          opacity: 1,
          zIndex: 2
        }
      ]
    },
    {
      id: 'concert-vibes',
      name: 'Concert Vibes',
      category: 'Entertainment',
      background: { type: 'gradient' as const, value: '#7c3aed', secondaryColor: '#ec4899', gradientDirection: 45 },
      elements: []
    },
    {
      id: 'corporate-elegant',
      name: 'Corporate Elegant',
      category: 'Business',
      background: { type: 'color' as const, value: '#1e293b' },
      elements: []
    }
  ];

  const addElement = (type: TicketElement['type']) => {
    const newElement: TicketElement = {
      id: `element-${Date.now()}`,
      type,
      content: type === 'text' ? 'New Text' : '',
      x: 50,
      y: 50,
      width: type === 'text' ? 200 : 100,
      height: type === 'text' ? 30 : 100,
      rotation: 0,
      fontSize: type === 'text' ? 16 : undefined,
      fontFamily: type === 'text' ? 'Inter' : undefined,
      fontWeight: type === 'text' ? 'normal' : undefined,
      color: type === 'text' ? '#000000' : undefined,
      backgroundColor: type === 'shape' ? '#3b82f6' : undefined,
      borderRadius: type === 'shape' ? 8 : undefined,
      opacity: 1,
      zIndex: design.elements.length + 1
    };

    const updatedDesign = {
      ...design,
      elements: [...design.elements, newElement]
    };
    onDesignChange(updatedDesign);
    setSelectedElement(newElement.id);
  };

  const updateElement = (elementId: string, updates: Partial<TicketElement>) => {
    const updatedElements = design.elements.map(el =>
      el.id === elementId ? { ...el, ...updates } : el
    );
    onDesignChange({ ...design, elements: updatedElements });
  };

  const deleteElement = (elementId: string) => {
    const updatedElements = design.elements.filter(el => el.id !== elementId);
    onDesignChange({ ...design, elements: updatedElements });
    setSelectedElement(null);
  };

  const duplicateElement = (elementId: string) => {
    const element = design.elements.find(el => el.id === elementId);
    if (element) {
      const newElement = {
        ...element,
        id: `element-${Date.now()}`,
        x: element.x + 20,
        y: element.y + 20,
        zIndex: design.elements.length + 1
      };
      onDesignChange({ ...design, elements: [...design.elements, newElement] });
    }
  };

  const applyTemplate = (template: any) => {
    onDesignChange({
      ...design,
      background: template.background,
      elements: template.elements
    });
  };

  const selectedElementData = design.elements.find(el => el.id === selectedElement);

  const renderTicketPreview = () => {
    const { background, dimensions } = design;
    
    let backgroundStyle: React.CSSProperties = {};
    
    if (background.type === 'color') {
      backgroundStyle.backgroundColor = background.value;
    } else if (background.type === 'gradient') {
      backgroundStyle.background = `linear-gradient(${background.gradientDirection || 135}deg, ${background.value}, ${background.secondaryColor})`;
    } else if (background.type === 'image') {
      backgroundStyle.backgroundImage = `url(${background.value})`;
      backgroundStyle.backgroundSize = 'cover';
      backgroundStyle.backgroundPosition = 'center';
    }

    return (
      <div className="relative w-full bg-gray-100 p-4 rounded-lg overflow-hidden">
        <div 
          ref={canvasRef}
          className="relative mx-auto border-2 border-gray-300 rounded-lg overflow-hidden cursor-crosshair"
          style={{
            width: '400px',
            height: '240px',
            ...backgroundStyle
          }}
          onClick={(e) => {
            if (tool !== 'select') {
              const rect = e.currentTarget.getBoundingClientRect();
              const x = ((e.clientX - rect.left) / rect.width) * 100;
              const y = ((e.clientY - rect.top) / rect.height) * 100;
              
              if (tool === 'text') {
                addElement('text');
              } else if (tool === 'shape') {
                addElement('shape');
              }
            }
          }}
        >
          {/* Render elements */}
          {design.elements
            .sort((a, b) => a.zIndex - b.zIndex)
            .map((element) => (
              <div
                key={element.id}
                className={`absolute cursor-move transition-all duration-200 ${
                  selectedElement === element.id ? 'ring-2 ring-blue-500 ring-opacity-75' : ''
                }`}
                style={{
                  left: `${element.x}%`,
                  top: `${element.y}%`,
                  width: `${element.width}px`,
                  height: `${element.height}px`,
                  transform: `rotate(${element.rotation}deg)`,
                  opacity: element.opacity,
                  zIndex: element.zIndex
                }}
                onClick={(e) => {
                  e.stopPropagation();
                  setSelectedElement(element.id);
                  setTool('select');
                }}
              >
                {element.type === 'text' && (
                  <div
                    style={{
                      fontSize: `${element.fontSize}px`,
                      fontFamily: element.fontFamily,
                      fontWeight: element.fontWeight,
                      color: element.color,
                      width: '100%',
                      height: '100%',
                      display: 'flex',
                      alignItems: 'center'
                    }}
                  >
                    {element.content}
                  </div>
                )}
                
                {element.type === 'shape' && (
                  <div
                    style={{
                      width: '100%',
                      height: '100%',
                      backgroundColor: element.backgroundColor,
                      borderRadius: `${element.borderRadius}px`
                    }}
                  />
                )}
                
                {element.type === 'qr' && (
                  <div className="w-full h-full bg-black flex items-center justify-center text-white text-xs">
                    QR Code
                  </div>
                )}
              </div>
            ))}
          
          {/* Default event info if no elements */}
          {design.elements.length === 0 && (
            <div className="absolute bottom-4 left-4 right-4 text-sm text-white">
              <div className="font-bold">{eventTitle || "Event Title"}</div>
              <div className="text-xs opacity-75">{eventDate}</div>
              <div className="text-xs opacity-75">{eventLocation}</div>
            </div>
          )}
        </div>
        
        {/* Zoom and grid controls */}
        <div className="flex justify-between items-center mt-4">
          <div className="flex gap-2">
            <Button
              size="sm"
              variant={tool === 'select' ? 'default' : 'outline'}
              onClick={() => setTool('select')}
            >
              <MousePointer className="h-3 w-3" />
            </Button>
            <Button
              size="sm"
              variant={tool === 'text' ? 'default' : 'outline'}
              onClick={() => setTool('text')}
            >
              <Type className="h-3 w-3" />
            </Button>
            <Button
              size="sm"
              variant={tool === 'shape' ? 'default' : 'outline'}
              onClick={() => setTool('shape')}
            >
              <Shapes className="h-3 w-3" />
            </Button>
          </div>
          
          <div className="flex gap-2">
            <Button size="sm" variant="outline">
              <Save className="h-3 w-3" />
            </Button>
            <Button size="sm" variant="outline">
              <Download className="h-3 w-3" />
            </Button>
          </div>
        </div>
      </div>
    );
  };

  return (
    <div className="grid grid-cols-1 lg:grid-cols-3 gap-4 h-[800px]">
      {/* Left Panel - Tools & Templates */}
      <Card className="lg:col-span-1">
        <CardHeader className="pb-4">
          <CardTitle className="text-lg">Design Tools</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <Tabs defaultValue="templates">
            <TabsList className="grid w-full grid-cols-3">
              <TabsTrigger value="templates">Templates</TabsTrigger>
              <TabsTrigger value="elements">Elements</TabsTrigger>
              <TabsTrigger value="background">Background</TabsTrigger>
            </TabsList>
            
            <TabsContent value="templates" className="space-y-3">
              {templates.map((template) => (
                <Card 
                  key={template.id}
                  className="cursor-pointer hover:shadow-md transition-shadow"
                  onClick={() => applyTemplate(template)}
                >
                  <CardContent className="p-3">
                    <div className="flex items-center justify-between">
                      <div>
                        <h4 className="font-medium text-sm">{template.name}</h4>
                        <p className="text-xs text-muted-foreground">{template.category}</p>
                      </div>
                      <div 
                        className="w-8 h-8 rounded border"
                        style={{
                          background: template.background.type === 'gradient' 
                            ? `linear-gradient(${template.background.gradientDirection}deg, ${template.background.value}, ${template.background.secondaryColor})`
                            : template.background.value
                        }}
                      />
                    </div>
                  </CardContent>
                </Card>
              ))}
            </TabsContent>
            
            <TabsContent value="elements" className="space-y-3">
              <div className="grid grid-cols-2 gap-2">
                <Button onClick={() => addElement('text')} variant="outline" className="flex flex-col h-20">
                  <Type className="h-6 w-6 mb-1" />
                  <span className="text-xs">Text</span>
                </Button>
                <Button onClick={() => addElement('shape')} variant="outline" className="flex flex-col h-20">
                  <Shapes className="h-6 w-6 mb-1" />
                  <span className="text-xs">Shape</span>
                </Button>
                <Button onClick={() => addElement('image')} variant="outline" className="flex flex-col h-20">
                  <Image className="h-6 w-6 mb-1" />
                  <span className="text-xs">Image</span>
                </Button>
                <Button onClick={() => addElement('qr')} variant="outline" className="flex flex-col h-20">
                  <Sparkles className="h-6 w-6 mb-1" />
                  <span className="text-xs">QR Code</span>
                </Button>
              </div>
            </TabsContent>
            
            <TabsContent value="background" className="space-y-3">
              <div>
                <Label className="text-sm">Background Type</Label>
                <Select 
                  value={design.background.type}
                  onValueChange={(value: 'color' | 'gradient' | 'image') => 
                    onDesignChange({ 
                      ...design, 
                      background: { ...design.background, type: value }
                    })
                  }
                >
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="color">Solid Color</SelectItem>
                    <SelectItem value="gradient">Gradient</SelectItem>
                    <SelectItem value="image">Image</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              
              <div>
                <Label className="text-sm">Primary Color</Label>
                <Input
                  type="color"
                  value={design.background.value}
                  onChange={(e) => onDesignChange({
                    ...design,
                    background: { ...design.background, value: e.target.value }
                  })}
                />
              </div>
              
              {design.background.type === 'gradient' && (
                <div>
                  <Label className="text-sm">Secondary Color</Label>
                  <Input
                    type="color"
                    value={design.background.secondaryColor || '#ffffff'}
                    onChange={(e) => onDesignChange({
                      ...design,
                      background: { ...design.background, secondaryColor: e.target.value }
                    })}
                  />
                </div>
              )}
            </TabsContent>
          </Tabs>
        </CardContent>
      </Card>
      
      {/* Center Panel - Canvas */}
      <Card className="lg:col-span-1">
        <CardHeader className="pb-4">
          <CardTitle className="text-lg flex items-center gap-2">
            <Eye className="h-5 w-5" />
            Ticket Preview
          </CardTitle>
        </CardHeader>
        <CardContent>
          {renderTicketPreview()}
        </CardContent>
      </Card>
      
      {/* Right Panel - Properties */}
      <Card className="lg:col-span-1">
        <CardHeader className="pb-4">
          <CardTitle className="text-lg">Properties</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          {selectedElementData ? (
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <h4 className="font-medium capitalize">{selectedElementData.type}</h4>
                <div className="flex gap-1">
                  <Button 
                    size="sm" 
                    variant="outline"
                    onClick={() => duplicateElement(selectedElementData.id)}
                  >
                    <Copy className="h-3 w-3" />
                  </Button>
                  <Button 
                    size="sm" 
                    variant="outline"
                    onClick={() => deleteElement(selectedElementData.id)}
                  >
                    <Trash2 className="h-3 w-3" />
                  </Button>
                </div>
              </div>
              
              {selectedElementData.type === 'text' && (
                <>
                  <div>
                    <Label className="text-sm">Content</Label>
                    <Input
                      value={selectedElementData.content}
                      onChange={(e) => updateElement(selectedElementData.id, { content: e.target.value })}
                    />
                  </div>
                  
                  <div>
                    <Label className="text-sm">Font Size</Label>
                    <Slider
                      value={[selectedElementData.fontSize || 16]}
                      onValueChange={([value]) => updateElement(selectedElementData.id, { fontSize: value })}
                      min={8}
                      max={72}
                      step={1}
                    />
                  </div>
                  
                  <div>
                    <Label className="text-sm">Color</Label>
                    <Input
                      type="color"
                      value={selectedElementData.color || '#000000'}
                      onChange={(e) => updateElement(selectedElementData.id, { color: e.target.value })}
                    />
                  </div>
                </>
              )}
              
              {selectedElementData.type === 'shape' && (
                <>
                  <div>
                    <Label className="text-sm">Background Color</Label>
                    <Input
                      type="color"
                      value={selectedElementData.backgroundColor || '#3b82f6'}
                      onChange={(e) => updateElement(selectedElementData.id, { backgroundColor: e.target.value })}
                    />
                  </div>
                  
                  <div>
                    <Label className="text-sm">Border Radius</Label>
                    <Slider
                      value={[selectedElementData.borderRadius || 0]}
                      onValueChange={([value]) => updateElement(selectedElementData.id, { borderRadius: value })}
                      min={0}
                      max={50}
                      step={1}
                    />
                  </div>
                </>
              )}
              
              <div>
                <Label className="text-sm">Opacity</Label>
                <Slider
                  value={[selectedElementData.opacity * 100]}
                  onValueChange={([value]) => updateElement(selectedElementData.id, { opacity: value / 100 })}
                  min={0}
                  max={100}
                  step={1}
                />
              </div>
              
              <div>
                <Label className="text-sm">Rotation</Label>
                <Slider
                  value={[selectedElementData.rotation]}
                  onValueChange={([value]) => updateElement(selectedElementData.id, { rotation: value })}
                  min={-180}
                  max={180}
                  step={1}
                />
              </div>
            </div>
          ) : (
            <div className="text-center text-muted-foreground py-8">
              <MousePointer className="h-12 w-12 mx-auto mb-4 opacity-50" />
              <p>Select an element to edit its properties</p>
              <p className="text-sm mt-2">Or use the tools on the left to add new elements</p>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
};

export default AdvancedTicketDesigner;
