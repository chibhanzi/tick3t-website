
import { useState, useRef } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Badge } from "@/components/ui/badge";
import { Upload, X, Image, Palette } from "lucide-react";

export interface BackgroundImageConfig {
  imageUrl?: string;
  imageFile?: File;
  opacity: number;
  blur: number;
  overlay: 'none' | 'dark' | 'light' | 'gradient';
}

interface BackgroundImageUploaderProps {
  config: BackgroundImageConfig;
  onConfigChange: (config: BackgroundImageConfig) => void;
}

const BackgroundImageUploader = ({ config, onConfigChange }: BackgroundImageUploaderProps) => {
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [dragOver, setDragOver] = useState(false);

  const handleFileSelect = (file: File) => {
    if (file && file.type.startsWith('image/')) {
      const imageUrl = URL.createObjectURL(file);
      onConfigChange({
        ...config,
        imageFile: file,
        imageUrl
      });
    }
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setDragOver(false);
    const files = Array.from(e.dataTransfer.files);
    if (files.length > 0) {
      handleFileSelect(files[0]);
    }
  };

  const handleFileInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = Array.from(e.target.files || []);
    if (files.length > 0) {
      handleFileSelect(files[0]);
    }
  };

  const removeImage = () => {
    if (config.imageUrl) {
      URL.revokeObjectURL(config.imageUrl);
    }
    onConfigChange({
      ...config,
      imageFile: undefined,
      imageUrl: undefined
    });
  };

  const presetImages = [
    { name: "Concert Stage", url: "/placeholder.svg?height=100&width=150&text=Concert" },
    { name: "Tech Conference", url: "/placeholder.svg?height=100&width=150&text=Tech" },
    { name: "Art Gallery", url: "/placeholder.svg?height=100&width=150&text=Art" },
    { name: "Sports Arena", url: "/placeholder.svg?height=100&width=150&text=Sports" },
    { name: "Food Festival", url: "/placeholder.svg?height=100&width=150&text=Food" },
    { name: "Abstract Pattern", url: "/placeholder.svg?height=100&width=150&text=Abstract" }
  ];

  return (
    <Card className="border-slate-200 dark:border-slate-700">
      <CardHeader>
        <CardTitle className="flex items-center gap-2 text-lg">
          <Image className="h-5 w-5 text-purple-500" />
          🖼️ Background Image
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-6">
        {/* Image Upload Area */}
        <div
          className={`relative border-2 border-dashed rounded-lg p-6 transition-colors ${
            dragOver 
              ? 'border-purple-400 bg-purple-50 dark:bg-purple-900/20' 
              : 'border-slate-300 dark:border-slate-600 hover:border-purple-300 dark:hover:border-purple-500'
          }`}
          onDrop={handleDrop}
          onDragOver={(e) => { e.preventDefault(); setDragOver(true); }}
          onDragLeave={() => setDragOver(false)}
        >
          {config.imageUrl ? (
            <div className="relative">
              <img 
                src={config.imageUrl} 
                alt="Background preview" 
                className="w-full h-32 object-cover rounded-lg"
              />
              <Button
                size="sm"
                variant="destructive"
                onClick={removeImage}
                className="absolute top-2 right-2"
              >
                <X className="h-4 w-4" />
              </Button>
              <div className="mt-2 text-center">
                <Badge variant="secondary">Background Image Selected</Badge>
              </div>
            </div>
          ) : (
            <div className="text-center space-y-3">
              <Upload className="h-12 w-12 text-muted-foreground mx-auto" />
              <div>
                <p className="text-sm font-medium">Drop your background image here</p>
                <p className="text-xs text-muted-foreground">or click to browse</p>
              </div>
              <Button 
                variant="outline" 
                onClick={() => fileInputRef.current?.click()}
                className="mt-2"
              >
                Choose Image
              </Button>
            </div>
          )}
          
          <input
            ref={fileInputRef}
            type="file"
            accept="image/*"
            onChange={handleFileInputChange}
            className="hidden"
          />
        </div>

        {/* Preset Images */}
        <div>
          <Label className="text-sm font-medium mb-3 block">📚 Preset Backgrounds</Label>
          <div className="grid grid-cols-3 gap-3">
            {presetImages.map((preset) => (
              <div
                key={preset.name}
                className="relative cursor-pointer group"
                onClick={() => onConfigChange({ ...config, imageUrl: preset.url })}
              >
                <img 
                  src={preset.url} 
                  alt={preset.name}
                  className="w-full h-20 object-cover rounded-lg border-2 border-transparent group-hover:border-purple-300 transition-colors"
                />
                <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity rounded-lg flex items-center justify-center">
                  <span className="text-white text-xs font-medium">{preset.name}</span>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Image Effects */}
        {config.imageUrl && (
          <div className="space-y-4">
            <Label className="text-sm font-medium">🎨 Image Effects</Label>
            
            <div>
              <Label htmlFor="opacity" className="text-xs text-muted-foreground">Opacity: {config.opacity}%</Label>
              <input
                id="opacity"
                type="range"
                min="10"
                max="100"
                value={config.opacity}
                onChange={(e) => onConfigChange({ ...config, opacity: parseInt(e.target.value) })}
                className="w-full h-2 bg-slate-200 dark:bg-slate-700 rounded-lg appearance-none cursor-pointer mt-1"
              />
            </div>

            <div>
              <Label htmlFor="blur" className="text-xs text-muted-foreground">Blur: {config.blur}px</Label>
              <input
                id="blur"
                type="range"
                min="0"
                max="10"
                value={config.blur}
                onChange={(e) => onConfigChange({ ...config, blur: parseInt(e.target.value) })}
                className="w-full h-2 bg-slate-200 dark:bg-slate-700 rounded-lg appearance-none cursor-pointer mt-1"
              />
            </div>

            <div>
              <Label className="text-xs text-muted-foreground mb-2 block">Overlay</Label>
              <div className="grid grid-cols-4 gap-2">
                {[
                  { value: 'none', label: 'None' },
                  { value: 'dark', label: 'Dark' },
                  { value: 'light', label: 'Light' },
                  { value: 'gradient', label: 'Gradient' }
                ].map((overlay) => (
                  <Button
                    key={overlay.value}
                    size="sm"
                    variant={config.overlay === overlay.value ? "default" : "outline"}
                    onClick={() => onConfigChange({ ...config, overlay: overlay.value as any })}
                    className="text-xs"
                  >
                    {overlay.label}
                  </Button>
                ))}
              </div>
            </div>
          </div>
        )}
      </CardContent>
    </Card>
  );
};

export default BackgroundImageUploader;
