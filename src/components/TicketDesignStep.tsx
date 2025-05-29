
import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Button } from "@/components/ui/button";
import { Palette, Image, Sparkles, Layers, Wand2 } from "lucide-react";
import EnhancedTicketDesigner from "./EnhancedTicketDesigner";
import LayeredTicketDesigner from "./LayeredTicketDesigner";
import BackgroundImageUploader from "./BackgroundImageUploader";

interface TicketDesignStepProps {
  eventData: any;
  design: any;
  onDesignChange: (design: any) => void;
}

const TicketDesignStep = ({ eventData, design, onDesignChange }: TicketDesignStepProps) => {
  const [designMode, setDesignMode] = useState<'enhanced' | 'layered' | 'background'>('enhanced');
  const [backgroundImage, setBackgroundImage] = useState<string>('');

  const handleDesignChange = (newDesign: any) => {
    onDesignChange({
      ...newDesign,
      backgroundImage: backgroundImage
    });
  };

  return (
    <Card className="border-slate-200 dark:border-slate-700">
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Palette className="h-5 w-5 text-purple-500" />
          Professional Ticket Designer
        </CardTitle>
        <div className="flex gap-2 mt-4">
          <Button
            variant={designMode === 'enhanced' ? 'default' : 'outline'}
            size="sm"
            onClick={() => setDesignMode('enhanced')}
            className="flex items-center gap-1"
          >
            <Wand2 className="h-3 w-3" />
            Smart Designer
          </Button>
          <Button
            variant={designMode === 'layered' ? 'default' : 'outline'}
            size="sm"
            onClick={() => setDesignMode('layered')}
            className="flex items-center gap-1"
          >
            <Layers className="h-3 w-3" />
            Layer Editor
          </Button>
          <Button
            variant={designMode === 'background' ? 'default' : 'outline'}
            size="sm"
            onClick={() => setDesignMode('background')}
            className="flex items-center gap-1"
          >
            <Image className="h-3 w-3" />
            Background Images
          </Button>
        </div>
      </CardHeader>
      <CardContent>
        {designMode === 'enhanced' && (
          <EnhancedTicketDesigner
            eventTitle={eventData.title}
            eventDate={eventData.date}
            eventLocation={eventData.location}
            design={design}
            onDesignChange={handleDesignChange}
          />
        )}
        
        {designMode === 'layered' && (
          <LayeredTicketDesigner
            eventTitle={eventData.title}
            eventDate={eventData.date}
            eventLocation={eventData.location}
            onDesignChange={handleDesignChange}
          />
        )}
        
        {designMode === 'background' && (
          <div className="space-y-6">
            <BackgroundImageUploader
              onImageUploaded={setBackgroundImage}
              currentImage={backgroundImage}
            />
            {backgroundImage && (
              <div className="mt-4">
                <h4 className="font-medium mb-2">Preview with Background</h4>
                <div 
                  className="relative p-6 h-48 rounded-xl shadow-lg overflow-hidden"
                  style={{
                    backgroundImage: `url(${backgroundImage})`,
                    backgroundSize: 'cover',
                    backgroundPosition: 'center'
                  }}
                >
                  <div className="absolute inset-0 bg-black bg-opacity-40" />
                  <div className="relative z-10 text-white">
                    <h3 className="text-xl font-bold mb-1">{eventData.title || "Event Title"}</h3>
                    <p className="text-sm opacity-90">{eventData.date || "Event Date"}</p>
                    <p className="text-sm opacity-90">{eventData.location || "Event Location"}</p>
                    <div className="absolute bottom-4 right-4 flex items-center gap-2">
                      <Sparkles className="h-4 w-4" />
                      <span className="text-sm">Tick3rt</span>
                    </div>
                  </div>
                </div>
              </div>
            )}
          </div>
        )}
      </CardContent>
    </Card>
  );
};

export default TicketDesignStep;
