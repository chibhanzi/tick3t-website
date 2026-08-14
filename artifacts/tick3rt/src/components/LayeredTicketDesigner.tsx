
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Plus, Trash2, Eye, EyeOff, ChevronUp, ChevronDown } from "lucide-react";
import { TicketLayer, TicketTemplate } from "./TicketTemplates";

interface LayeredTicketDesignerProps {
  eventTitle: string;
  eventDate: string;
  eventLocation: string;
  template?: TicketTemplate;
  onDesignChange: (layers: TicketLayer[]) => void;
}

const LayeredTicketDesigner = ({ 
  eventTitle, 
  eventDate, 
  eventLocation, 
  template,
  onDesignChange 
}: LayeredTicketDesignerProps) => {
  const [layers, setLayers] = useState<TicketLayer[]>(template?.layers || [
    {
      id: "background",
      type: "background",
      content: "#ffffff",
      position: { x: 0, y: 0 },
      size: { width: 100, height: 100 },
      style: { opacity: 1 },
      zIndex: 1
    }
  ]);
  const [selectedLayer, setSelectedLayer] = useState<string>(layers[0]?.id || "");

  const addLayer = (type: TicketLayer['type']) => {
    const newLayer: TicketLayer = {
      id: `layer-${Date.now()}`,
      type,
      content: type === 'text' ? 'New Text' : type === 'background' ? '#f3f4f6' : '',
      position: { x: 20, y: 20 },
      size: { width: 50, height: 20 },
      style: { 
        color: type === 'text' ? '#000000' : '#3b82f6',
        fontSize: 16,
        fontWeight: 'normal',
        opacity: 1,
        rotation: 0
      },
      zIndex: layers.length + 1
    };
    
    const updatedLayers = [...layers, newLayer];
    setLayers(updatedLayers);
    setSelectedLayer(newLayer.id);
    onDesignChange(updatedLayers);
  };

  const updateLayer = (layerId: string, updates: Partial<TicketLayer>) => {
    const updatedLayers = layers.map(layer => 
      layer.id === layerId ? { ...layer, ...updates } : layer
    );
    setLayers(updatedLayers);
    onDesignChange(updatedLayers);
  };

  const deleteLayer = (layerId: string) => {
    if (layers.length <= 1) return; // Keep at least one layer
    const updatedLayers = layers.filter(layer => layer.id !== layerId);
    setLayers(updatedLayers);
    setSelectedLayer(updatedLayers[0]?.id || "");
    onDesignChange(updatedLayers);
  };

  const moveLayer = (layerId: string, direction: 'up' | 'down') => {
    const layerIndex = layers.findIndex(l => l.id === layerId);
    if (
      (direction === 'up' && layerIndex === layers.length - 1) ||
      (direction === 'down' && layerIndex === 0)
    ) return;

    const newLayers = [...layers];
    const targetIndex = direction === 'up' ? layerIndex + 1 : layerIndex - 1;
    [newLayers[layerIndex], newLayers[targetIndex]] = [newLayers[targetIndex], newLayers[layerIndex]];
    
    setLayers(newLayers);
    onDesignChange(newLayers);
  };

  const selectedLayerData = layers.find(l => l.id === selectedLayer);

  const renderTicketPreview = () => {
    const sortedLayers = [...layers].sort((a, b) => a.zIndex - b.zIndex);
    
    return (
      <div className="relative w-full h-48 border-2 border-dashed border-gray-300 rounded-lg overflow-hidden bg-white">
        {sortedLayers.map(layer => {
          if (layer.type === 'background') {
            return (
              <div
                key={layer.id}
                className="absolute inset-0"
                style={{
                  background: layer.content,
                  opacity: layer.style.opacity
                }}
              />
            );
          }
          
          if (layer.type === 'text') {
            return (
              <div
                key={layer.id}
                className="absolute"
                style={{
                  left: `${layer.position.x}%`,
                  top: `${layer.position.y}%`,
                  width: `${layer.size.width}%`,
                  height: `${layer.size.height}%`,
                  color: layer.style.color,
                  fontSize: `${layer.style.fontSize}px`,
                  fontWeight: layer.style.fontWeight,
                  opacity: layer.style.opacity,
                  transform: `rotate(${layer.style.rotation || 0}deg)`,
                  zIndex: layer.zIndex
                }}
              >
                {layer.content}
              </div>
            );
          }
          
          if (layer.type === 'shape') {
            return (
              <div
                key={layer.id}
                className="absolute"
                style={{
                  left: `${layer.position.x}%`,
                  top: `${layer.position.y}%`,
                  width: `${layer.size.width}%`,
                  height: `${layer.size.height}%`,
                  backgroundColor: layer.style.color,
                  opacity: layer.style.opacity,
                  transform: `rotate(${layer.style.rotation || 0}deg)`,
                  zIndex: layer.zIndex
                }}
              />
            );
          }
          
          return null;
        })}
        
        {/* Event Info Overlay */}
        <div className="absolute bottom-4 left-4 right-4 text-sm">
          <div className="font-bold">{eventTitle || "Event Title"}</div>
          <div className="text-xs opacity-75">{eventDate}</div>
          <div className="text-xs opacity-75">{eventLocation}</div>
        </div>
      </div>
    );
  };

  return (
    <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
      {/* Preview */}
      <Card>
        <CardHeader>
          <CardTitle>Ticket Preview</CardTitle>
        </CardHeader>
        <CardContent>
          {renderTicketPreview()}
        </CardContent>
      </Card>

      {/* Designer */}
      <Card>
        <CardHeader>
          <CardTitle>Layer Designer</CardTitle>
        </CardHeader>
        <CardContent>
          <Tabs defaultValue="layers" className="w-full">
            <TabsList className="grid w-full grid-cols-2">
              <TabsTrigger value="layers">Layers</TabsTrigger>
              <TabsTrigger value="properties">Properties</TabsTrigger>
            </TabsList>
            
            <TabsContent value="layers" className="space-y-4">
              <div className="flex gap-2 flex-wrap">
                <Button size="sm" onClick={() => addLayer('text')} className="flex items-center gap-1">
                  <Plus className="h-3 w-3" />
                  Text
                </Button>
                <Button size="sm" onClick={() => addLayer('shape')} className="flex items-center gap-1">
                  <Plus className="h-3 w-3" />
                  Shape
                </Button>
                <Button size="sm" onClick={() => addLayer('pattern')} className="flex items-center gap-1">
                  <Plus className="h-3 w-3" />
                  Pattern
                </Button>
              </div>
              
              <div className="space-y-2 max-h-64 overflow-y-auto">
                {layers.map((layer, index) => (
                  <div
                    key={layer.id}
                    className={`p-3 border rounded-lg cursor-pointer transition-colors ${
                      selectedLayer === layer.id ? 'border-blue-500 bg-blue-50' : 'border-gray-200'
                    }`}
                    onClick={() => setSelectedLayer(layer.id)}
                  >
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-2">
                        <span className="text-sm font-medium capitalize">{layer.type}</span>
                        <span className="text-xs text-gray-500">#{layer.id.slice(-4)}</span>
                      </div>
                      <div className="flex items-center gap-1">
                        <Button size="sm" variant="ghost" onClick={() => moveLayer(layer.id, 'up')}>
                          <ChevronUp className="h-3 w-3" />
                        </Button>
                        <Button size="sm" variant="ghost" onClick={() => moveLayer(layer.id, 'down')}>
                          <ChevronDown className="h-3 w-3" />
                        </Button>
                        {layers.length > 1 && (
                          <Button size="sm" variant="ghost" onClick={() => deleteLayer(layer.id)}>
                            <Trash2 className="h-3 w-3" />
                          </Button>
                        )}
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </TabsContent>
            
            <TabsContent value="properties" className="space-y-4">
              {selectedLayerData && (
                <div className="space-y-4">
                  <div>
                    <Label>Content</Label>
                    <Input
                      value={selectedLayerData.content}
                      onChange={(e) => updateLayer(selectedLayer, { content: e.target.value })}
                    />
                  </div>
                  
                  <div className="grid grid-cols-2 gap-2">
                    <div>
                      <Label>X Position (%)</Label>
                      <Input
                        type="number"
                        value={selectedLayerData.position.x}
                        onChange={(e) => updateLayer(selectedLayer, { 
                          position: { ...selectedLayerData.position, x: Number(e.target.value) }
                        })}
                      />
                    </div>
                    <div>
                      <Label>Y Position (%)</Label>
                      <Input
                        type="number"
                        value={selectedLayerData.position.y}
                        onChange={(e) => updateLayer(selectedLayer, { 
                          position: { ...selectedLayerData.position, y: Number(e.target.value) }
                        })}
                      />
                    </div>
                  </div>
                  
                  <div className="grid grid-cols-2 gap-2">
                    <div>
                      <Label>Width (%)</Label>
                      <Input
                        type="number"
                        value={selectedLayerData.size.width}
                        onChange={(e) => updateLayer(selectedLayer, { 
                          size: { ...selectedLayerData.size, width: Number(e.target.value) }
                        })}
                      />
                    </div>
                    <div>
                      <Label>Height (%)</Label>
                      <Input
                        type="number"
                        value={selectedLayerData.size.height}
                        onChange={(e) => updateLayer(selectedLayer, { 
                          size: { ...selectedLayerData.size, height: Number(e.target.value) }
                        })}
                      />
                    </div>
                  </div>
                  
                  {(selectedLayerData.type === 'text' || selectedLayerData.type === 'shape') && (
                    <div>
                      <Label>Color</Label>
                      <Input
                        type="color"
                        value={selectedLayerData.style.color || '#000000'}
                        onChange={(e) => updateLayer(selectedLayer, { 
                          style: { ...selectedLayerData.style, color: e.target.value }
                        })}
                      />
                    </div>
                  )}
                  
                  <div>
                    <Label>Opacity</Label>
                    <Input
                      type="range"
                      min="0"
                      max="1"
                      step="0.1"
                      value={selectedLayerData.style.opacity || 1}
                      onChange={(e) => updateLayer(selectedLayer, { 
                        style: { ...selectedLayerData.style, opacity: Number(e.target.value) }
                      })}
                    />
                  </div>
                </div>
              )}
            </TabsContent>
          </Tabs>
        </CardContent>
      </Card>
    </div>
  );
};

export default LayeredTicketDesigner;
