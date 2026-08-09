
import { useRef, useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Slider } from "@/components/ui/slider";
import { Badge } from "@/components/ui/badge";
import {
  Plus,
  Trash2,
  ChevronUp,
  ChevronDown,
  Type,
  Square,
  Image as ImageIcon,
  Sparkles,
  Upload,
  Copy,
} from "lucide-react";
import { TicketLayer, TicketTemplate } from "./TicketTemplates";

interface LayeredTicketDesignerProps {
  eventTitle: string;
  eventDate: string;
  eventLocation: string;
  template?: TicketTemplate;
  backgroundImage?: string;
  onDesignChange: (design: { layers: TicketLayer[]; backgroundImage?: string }) => void;
}

const layerIcon = (type: TicketLayer["type"]) => {
  switch (type) {
    case "text":
      return Type;
    case "shape":
      return Square;
    case "image":
      return ImageIcon;
    case "pattern":
      return Sparkles;
    default:
      return Square;
  }
};

const LayeredTicketDesigner = ({
  eventTitle,
  eventDate,
  eventLocation,
  template,
  backgroundImage,
  onDesignChange,
}: LayeredTicketDesignerProps) => {
  const [layers, setLayers] = useState<TicketLayer[]>(
    template?.layers || [
      {
        id: "background",
        type: "background",
        content: "linear-gradient(135deg, hsl(258 90% 66%), hsl(330 81% 60%))",
        position: { x: 0, y: 0 },
        size: { width: 100, height: 100 },
        style: { opacity: 1, overlay: 0 },
        zIndex: 1,
      },
    ]
  );
  const [selectedLayer, setSelectedLayer] = useState<string>(layers[0]?.id || "");
  const fileInputRef = useRef<HTMLInputElement | null>(null);
  const pendingImageLayer = useRef<string | null>(null);

  const commit = (updated: TicketLayer[]) => {
    setLayers(updated);
    onDesignChange({ layers: updated, backgroundImage });
  };

  const addLayer = (type: TicketLayer["type"]) => {
    const newLayer: TicketLayer = {
      id: `layer-${Date.now()}`,
      type,
      content:
        type === "text"
          ? "New Text"
          : type === "background"
          ? "#f3f4f6"
          : type === "pattern"
          ? "repeating-linear-gradient(45deg, rgba(255,255,255,.25) 0 8px, transparent 8px 16px)"
          : "",
      position: { x: 20, y: 20 },
      size: { width: 50, height: 20 },
      style: {
        color: type === "text" ? "#ffffff" : "#3b82f6",
        fontSize: 16,
        fontWeight: "normal",
        opacity: 1,
        rotation: 0,
        borderRadius: 8,
        objectFit: "cover",
        blendMode: "normal",
        blur: 0,
      },
      zIndex: layers.length + 1,
    };

    commit([...layers, newLayer]);
    setSelectedLayer(newLayer.id);

    if (type === "image") {
      pendingImageLayer.current = newLayer.id;
      fileInputRef.current?.click();
    }
  };

  const updateLayer = (layerId: string, updates: Partial<TicketLayer>) => {
    commit(layers.map((layer) => (layer.id === layerId ? { ...layer, ...updates } : layer)));
  };

  const updateStyle = (layerId: string, style: Partial<TicketLayer["style"]>) => {
    commit(
      layers.map((layer) =>
        layer.id === layerId ? { ...layer, style: { ...layer.style, ...style } } : layer
      )
    );
  };

  const duplicateLayer = (layerId: string) => {
    const layer = layers.find((l) => l.id === layerId);
    if (!layer) return;
    const copy: TicketLayer = {
      ...layer,
      id: `layer-${Date.now()}`,
      position: { x: Math.min(layer.position.x + 5, 90), y: Math.min(layer.position.y + 5, 90) },
      zIndex: layers.length + 1,
    };
    commit([...layers, copy]);
    setSelectedLayer(copy.id);
  };

  const deleteLayer = (layerId: string) => {
    if (layers.length <= 1) return;
    const updated = layers.filter((layer) => layer.id !== layerId);
    commit(updated);
    setSelectedLayer(updated[0]?.id || "");
  };

  const moveLayer = (layerId: string, direction: "up" | "down") => {
    const layerIndex = layers.findIndex((l) => l.id === layerId);
    if (
      (direction === "up" && layerIndex === layers.length - 1) ||
      (direction === "down" && layerIndex === 0)
    )
      return;

    const newLayers = [...layers];
    const targetIndex = direction === "up" ? layerIndex + 1 : layerIndex - 1;
    [newLayers[layerIndex], newLayers[targetIndex]] = [newLayers[targetIndex], newLayers[layerIndex]];
    commit(newLayers.map((l, i) => ({ ...l, zIndex: i + 1 })));
  };

  const handleImageFile = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    const targetId = pendingImageLayer.current;
    if (!file || !targetId) return;
    const reader = new FileReader();
    reader.onload = (e) => {
      updateLayer(targetId, { content: (e.target?.result as string) || "" });
      pendingImageLayer.current = null;
    };
    reader.readAsDataURL(file);
    event.target.value = "";
  };

  const pickImageFor = (layerId: string) => {
    pendingImageLayer.current = layerId;
    fileInputRef.current?.click();
  };

  const selectedLayerData = layers.find((l) => l.id === selectedLayer);

  const renderTicketPreview = () => {
    const sortedLayers = [...layers].sort((a, b) => a.zIndex - b.zIndex);

    return (
      <div className="relative w-full h-52 rounded-xl overflow-hidden border border-border bg-card">
        {backgroundImage && (
          <div
            className="absolute inset-0"
            style={{
              backgroundImage: `url(${backgroundImage})`,
              backgroundSize: "cover",
              backgroundPosition: "center",
            }}
          />
        )}

        {sortedLayers.map((layer) => {
          const common = {
            left: `${layer.position.x}%`,
            top: `${layer.position.y}%`,
            width: `${layer.size.width}%`,
            height: `${layer.size.height}%`,
            opacity: layer.style.opacity ?? 1,
            transform: `rotate(${layer.style.rotation || 0}deg)`,
            zIndex: layer.zIndex,
            mixBlendMode: (layer.style.blendMode as never) || undefined,
            filter: layer.style.blur ? `blur(${layer.style.blur}px)` : undefined,
            borderRadius: `${layer.style.borderRadius ?? 0}px`,
          };

          if (layer.type === "background") {
            return (
              <div
                key={layer.id}
                className="absolute inset-0"
                style={{
                  background: layer.content,
                  opacity: layer.style.opacity ?? 1,
                  zIndex: layer.zIndex,
                  mixBlendMode: (layer.style.blendMode as never) || undefined,
                }}
              />
            );
          }

          if (layer.type === "text") {
            return (
              <div
                key={layer.id}
                className="absolute flex items-center"
                style={{
                  ...common,
                  color: layer.style.color,
                  fontSize: `${layer.style.fontSize}px`,
                  fontWeight: layer.style.fontWeight,
                }}
              >
                {layer.content}
              </div>
            );
          }

          if (layer.type === "shape") {
            return (
              <div
                key={layer.id}
                className="absolute"
                style={{ ...common, backgroundColor: layer.style.color }}
              />
            );
          }

          if (layer.type === "pattern") {
            return (
              <div key={layer.id} className="absolute" style={{ ...common, background: layer.content }} />
            );
          }

          if (layer.type === "image") {
            return layer.content ? (
              <img
                key={layer.id}
                src={layer.content}
                alt="Ticket design layer"
                className="absolute"
                style={{ ...common, objectFit: layer.style.objectFit || "cover" }}
              />
            ) : (
              <div
                key={layer.id}
                className="absolute flex items-center justify-center border border-dashed border-muted-foreground/50 text-[10px] text-muted-foreground"
                style={common}
              >
                No image
              </div>
            );
          }

          return null;
        })}

        {/* Event info overlay */}
        <div className="absolute bottom-3 left-3 right-3 text-sm z-[999] text-white drop-shadow">
          <div className="font-bold">{eventTitle || "Event Title"}</div>
          <div className="text-xs opacity-80">{eventDate}</div>
          <div className="text-xs opacity-80">{eventLocation}</div>
        </div>
      </div>
    );
  };

  return (
    <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
      <input
        ref={fileInputRef}
        type="file"
        accept="image/*"
        className="hidden"
        onChange={handleImageFile}
      />

      <Card>
        <CardHeader className="pb-3">
          <CardTitle className="text-base">Ticket Preview</CardTitle>
        </CardHeader>
        <CardContent>{renderTicketPreview()}</CardContent>
      </Card>

      <Card>
        <CardHeader className="pb-3">
          <CardTitle className="text-base">Layer Designer</CardTitle>
        </CardHeader>
        <CardContent>
          <Tabs defaultValue="layers" className="w-full">
            <TabsList className="grid w-full grid-cols-2">
              <TabsTrigger value="layers">Layers</TabsTrigger>
              <TabsTrigger value="properties">Properties</TabsTrigger>
            </TabsList>

            <TabsContent value="layers" className="space-y-4">
              <div className="flex gap-2 flex-wrap">
                <Button size="sm" variant="outline" onClick={() => addLayer("text")} className="gap-1">
                  <Type className="h-3 w-3" /> Text
                </Button>
                <Button size="sm" variant="outline" onClick={() => addLayer("shape")} className="gap-1">
                  <Square className="h-3 w-3" /> Shape
                </Button>
                <Button size="sm" variant="outline" onClick={() => addLayer("image")} className="gap-1">
                  <ImageIcon className="h-3 w-3" /> Image
                </Button>
                <Button size="sm" variant="outline" onClick={() => addLayer("pattern")} className="gap-1">
                  <Sparkles className="h-3 w-3" /> Pattern
                </Button>
              </div>

              <div className="space-y-2 max-h-72 overflow-y-auto pr-1">
                {[...layers]
                  .slice()
                  .reverse()
                  .map((layer) => {
                    const Icon = layerIcon(layer.type);
                    return (
                      <div
                        key={layer.id}
                        className={`p-3 border rounded-lg cursor-pointer transition-colors ${
                          selectedLayer === layer.id
                            ? "border-primary bg-primary/5"
                            : "border-border hover:bg-muted/50"
                        }`}
                        onClick={() => setSelectedLayer(layer.id)}
                      >
                        <div className="flex items-center justify-between gap-2">
                          <div className="flex items-center gap-2 min-w-0">
                            <Icon className="h-4 w-4 text-muted-foreground shrink-0" />
                            <span className="text-sm font-medium capitalize truncate">{layer.type}</span>
                            <Badge variant="secondary" className="text-[10px]">
                              z{layer.zIndex}
                            </Badge>
                          </div>
                          <div className="flex items-center gap-0.5">
                            <Button
                              size="icon"
                              variant="ghost"
                              className="h-7 w-7"
                              onClick={(e) => {
                                e.stopPropagation();
                                moveLayer(layer.id, "up");
                              }}
                            >
                              <ChevronUp className="h-3 w-3" />
                            </Button>
                            <Button
                              size="icon"
                              variant="ghost"
                              className="h-7 w-7"
                              onClick={(e) => {
                                e.stopPropagation();
                                moveLayer(layer.id, "down");
                              }}
                            >
                              <ChevronDown className="h-3 w-3" />
                            </Button>
                            <Button
                              size="icon"
                              variant="ghost"
                              className="h-7 w-7"
                              onClick={(e) => {
                                e.stopPropagation();
                                duplicateLayer(layer.id);
                              }}
                            >
                              <Copy className="h-3 w-3" />
                            </Button>
                            {layers.length > 1 && (
                              <Button
                                size="icon"
                                variant="ghost"
                                className="h-7 w-7"
                                onClick={(e) => {
                                  e.stopPropagation();
                                  deleteLayer(layer.id);
                                }}
                              >
                                <Trash2 className="h-3 w-3" />
                              </Button>
                            )}
                          </div>
                        </div>
                      </div>
                    );
                  })}
              </div>
            </TabsContent>

            <TabsContent value="properties" className="space-y-4">
              {selectedLayerData && (
                <div className="space-y-4">
                  {selectedLayerData.type === "image" ? (
                    <div className="space-y-2">
                      <Label>Image</Label>
                      <div className="flex items-center gap-2">
                        <Button
                          size="sm"
                          variant="outline"
                          onClick={() => pickImageFor(selectedLayerData.id)}
                          className="gap-1"
                        >
                          <Upload className="h-3 w-3" />
                          {selectedLayerData.content ? "Replace" : "Upload"}
                        </Button>
                        {selectedLayerData.content && (
                          <img
                            src={selectedLayerData.content}
                            alt="Layer thumbnail"
                            className="h-10 w-16 object-cover rounded border border-border"
                          />
                        )}
                      </div>
                      <div>
                        <Label className="text-xs">Fit</Label>
                        <div className="flex gap-2 mt-1">
                          {(["cover", "contain"] as const).map((fit) => (
                            <Button
                              key={fit}
                              size="sm"
                              variant={selectedLayerData.style.objectFit === fit ? "default" : "outline"}
                              onClick={() => updateStyle(selectedLayerData.id, { objectFit: fit })}
                              className="capitalize"
                            >
                              {fit}
                            </Button>
                          ))}
                        </div>
                      </div>
                    </div>
                  ) : (
                    <div>
                      <Label>Content</Label>
                      <Input
                        value={selectedLayerData.content}
                        onChange={(e) => updateLayer(selectedLayer, { content: e.target.value })}
                      />
                    </div>
                  )}

                  {selectedLayerData.type !== "background" && (
                    <>
                      <div className="grid grid-cols-2 gap-2">
                        <div>
                          <Label>X (%)</Label>
                          <Input
                            type="number"
                            value={selectedLayerData.position.x}
                            onChange={(e) =>
                              updateLayer(selectedLayer, {
                                position: { ...selectedLayerData.position, x: Number(e.target.value) },
                              })
                            }
                          />
                        </div>
                        <div>
                          <Label>Y (%)</Label>
                          <Input
                            type="number"
                            value={selectedLayerData.position.y}
                            onChange={(e) =>
                              updateLayer(selectedLayer, {
                                position: { ...selectedLayerData.position, y: Number(e.target.value) },
                              })
                            }
                          />
                        </div>
                      </div>

                      <div className="grid grid-cols-2 gap-2">
                        <div>
                          <Label>Width (%)</Label>
                          <Input
                            type="number"
                            value={selectedLayerData.size.width}
                            onChange={(e) =>
                              updateLayer(selectedLayer, {
                                size: { ...selectedLayerData.size, width: Number(e.target.value) },
                              })
                            }
                          />
                        </div>
                        <div>
                          <Label>Height (%)</Label>
                          <Input
                            type="number"
                            value={selectedLayerData.size.height}
                            onChange={(e) =>
                              updateLayer(selectedLayer, {
                                size: { ...selectedLayerData.size, height: Number(e.target.value) },
                              })
                            }
                          />
                        </div>
                      </div>
                    </>
                  )}

                  {(selectedLayerData.type === "text" || selectedLayerData.type === "shape") && (
                    <div>
                      <Label>Color</Label>
                      <Input
                        type="color"
                        value={selectedLayerData.style.color || "#000000"}
                        onChange={(e) => updateStyle(selectedLayer, { color: e.target.value })}
                      />
                    </div>
                  )}

                  <div className="space-y-2">
                    <Label className="text-xs">
                      Opacity ({Math.round((selectedLayerData.style.opacity ?? 1) * 100)}%)
                    </Label>
                    <Slider
                      value={[(selectedLayerData.style.opacity ?? 1) * 100]}
                      min={0}
                      max={100}
                      step={5}
                      onValueChange={([v]) => updateStyle(selectedLayer, { opacity: v / 100 })}
                    />
                  </div>

                  {selectedLayerData.type !== "background" && (
                    <div className="space-y-2">
                      <Label className="text-xs">
                        Rotation ({selectedLayerData.style.rotation || 0}°)
                      </Label>
                      <Slider
                        value={[selectedLayerData.style.rotation || 0]}
                        min={-180}
                        max={180}
                        step={1}
                        onValueChange={([v]) => updateStyle(selectedLayer, { rotation: v })}
                      />
                    </div>
                  )}

                  <div className="space-y-2">
                    <Label className="text-xs">Blur ({selectedLayerData.style.blur || 0}px)</Label>
                    <Slider
                      value={[selectedLayerData.style.blur || 0]}
                      min={0}
                      max={20}
                      step={1}
                      onValueChange={([v]) => updateStyle(selectedLayer, { blur: v })}
                    />
                  </div>

                  <div>
                    <Label className="text-xs">Blend mode</Label>
                    <div className="flex gap-2 mt-1 flex-wrap">
                      {["normal", "multiply", "screen", "overlay", "soft-light"].map((mode) => (
                        <Button
                          key={mode}
                          size="sm"
                          variant={
                            (selectedLayerData.style.blendMode || "normal") === mode ? "default" : "outline"
                          }
                          onClick={() => updateStyle(selectedLayer, { blendMode: mode })}
                          className="text-xs capitalize"
                        >
                          {mode}
                        </Button>
                      ))}
                    </div>
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
