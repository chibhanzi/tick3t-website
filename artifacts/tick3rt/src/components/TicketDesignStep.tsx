import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Palette, Wand2, Layers, Image, Zap, LayoutTemplate } from "lucide-react";
import AdvancedTicketDesigner from "./AdvancedTicketDesigner";
import EnhancedTicketDesigner from "./EnhancedTicketDesigner";
import LayeredTicketDesigner from "./LayeredTicketDesigner";
import BackgroundImageUploader from "./BackgroundImageUploader";
import TicketTemplateGallery, { EventTemplate } from "./TicketTemplateGallery";

interface TicketDesignStepProps {
  eventData: any;
  design: any;
  onDesignChange: (design: any) => void;
}

const TicketDesignStep = ({ eventData, design, onDesignChange }: TicketDesignStepProps) => {
  const [designMode, setDesignMode] = useState<'templates' | 'advanced' | 'enhanced' | 'layered' | 'background'>('templates');
  const [backgroundImage, setBackgroundImage] = useState<string>('');
  const [selectedTemplateId, setSelectedTemplateId] = useState<string | undefined>(design?.templateId);

  const handleDesignChange = (newDesign: any) => {
    onDesignChange({
      ...newDesign,
      backgroundImage,
      templateId: selectedTemplateId,
    });
  };

  const handleSelectTemplate = (template: EventTemplate) => {
    setSelectedTemplateId(template.id);
    // Apply the template's colours into the design state, then drop the user
    // into the Advanced Designer so they can keep customising
    const applied = {
      ...design,
      templateId: template.id,
      templateName: template.name,
      primaryColor: template.primaryColor,
      secondaryColor: template.secondaryColor,
      textColor: template.textColor,
      gradient: template.gradient,
      accentColor: template.accentColor,
      backgroundImage,
    };
    onDesignChange(applied);
    setDesignMode('advanced');
  };

  const tabs = [
    { id: 'templates' as const, label: 'Templates',           shortLabel: 'Templates', icon: LayoutTemplate },
    { id: 'advanced'  as const, label: 'Advanced Designer',   shortLabel: 'Advanced',  icon: Zap },
    { id: 'enhanced'  as const, label: 'Smart Designer',      shortLabel: 'Smart',     icon: Wand2 },
    { id: 'layered'   as const, label: 'Layer Editor',        shortLabel: 'Layers',    icon: Layers },
    { id: 'background'as const, label: 'Background Images',   shortLabel: 'Images',    icon: Image },
  ];

  return (
    <div className="space-y-4">
      <Card className="border-slate-200 dark:border-slate-700">
        <CardHeader className="pb-4">
          <CardTitle className="flex items-center gap-2 text-lg">
            <Palette className="h-5 w-5 text-purple-500" />
            Ticket Designer
          </CardTitle>

          {/* Tab bar */}
          <div className="flex flex-wrap gap-2 mt-4">
            {tabs.map((tab) => (
              <Button
                key={tab.id}
                variant={designMode === tab.id ? 'default' : 'outline'}
                size="sm"
                onClick={() => setDesignMode(tab.id)}
                className="flex items-center gap-1 text-xs"
              >
                <tab.icon className="h-3 w-3" />
                <span className="hidden sm:inline">{tab.label}</span>
                <span className="sm:hidden">{tab.shortLabel}</span>
                {/* Show a dot when a template has been chosen and we're on the Templates tab */}
                {tab.id === 'templates' && selectedTemplateId && designMode !== 'templates' && (
                  <span className="ml-1 h-1.5 w-1.5 rounded-full bg-primary inline-block" />
                )}
              </Button>
            ))}
          </div>

          {/* Context hint when a template is active */}
          {selectedTemplateId && designMode !== 'templates' && (
            <p className="mt-2 text-xs text-muted-foreground">
              Using template <strong>{design?.templateName}</strong> — customise further below or{" "}
              <button
                className="underline underline-offset-2 hover:text-foreground transition-colors"
                onClick={() => setDesignMode('templates')}
              >
                change template
              </button>
              .
            </p>
          )}
        </CardHeader>

        <CardContent className="p-2 sm:p-6">
          {designMode === 'templates' && (
            <TicketTemplateGallery
              onSelectTemplate={handleSelectTemplate}
              selectedTemplateId={selectedTemplateId}
            />
          )}

          {designMode === 'advanced' && (
            <AdvancedTicketDesigner
              eventTitle={eventData.title}
              eventDate={eventData.date}
              eventLocation={eventData.location}
              design={design}
              onDesignChange={handleDesignChange}
            />
          )}

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
                onImageChange={setBackgroundImage}
                currentImage={backgroundImage}
              />
              {backgroundImage && (
                <div className="mt-4">
                  <h4 className="font-medium mb-2">Preview with Background</h4>
                  <div
                    className="relative p-4 sm:p-6 h-40 sm:h-48 rounded-xl shadow-lg overflow-hidden"
                    style={{
                      backgroundImage: `url(${backgroundImage})`,
                      backgroundSize: 'cover',
                      backgroundPosition: 'center',
                    }}
                  >
                    <div className="absolute inset-0 bg-black bg-opacity-40" />
                    <div className="relative z-10 text-white">
                      <h3 className="text-lg sm:text-xl font-bold mb-1">{eventData.title || "Event Title"}</h3>
                      <p className="text-xs sm:text-sm opacity-90">{eventData.date || "Event Date"}</p>
                      <p className="text-xs sm:text-sm opacity-90">{eventData.location || "Event Location"}</p>
                      <div className="absolute bottom-2 sm:bottom-4 right-2 sm:right-4 flex items-center gap-2">
                        <Palette className="h-3 w-3 sm:h-4 sm:w-4" />
                        <span className="text-xs sm:text-sm">Tick3t</span>
                      </div>
                    </div>
                  </div>
                </div>
              )}
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
};

export default TicketDesignStep;
