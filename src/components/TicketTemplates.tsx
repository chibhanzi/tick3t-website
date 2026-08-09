
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";

export interface TicketLayer {
  id: string;
  type: 'background' | 'text' | 'image' | 'pattern' | 'shape';
  content: string;
  position: { x: number; y: number };
  size: { width: number; height: number };
  style: {
    color?: string;
    fontSize?: number;
    fontWeight?: string;
    opacity?: number;
    rotation?: number;
    blur?: number;
    borderRadius?: number;
    objectFit?: 'cover' | 'contain';
    blendMode?: string;
    overlay?: number;
  };
  zIndex: number;
}

export interface TicketTemplate {
  id: string;
  name: string;
  category: string;
  preview: string;
  layers: TicketLayer[];
  isPremium: boolean;
}

interface TicketTemplatesProps {
  onSelectTemplate: (template: TicketTemplate) => void;
}

const TicketTemplates = ({ onSelectTemplate }: TicketTemplatesProps) => {
  const templates: TicketTemplate[] = [
    {
      id: "modern-gradient",
      name: "Modern Gradient",
      category: "Professional",
      preview: "/api/placeholder/300/180",
      isPremium: false,
      layers: [
        {
          id: "bg",
          type: "background",
          content: "linear-gradient(135deg, #667eea 0%, #764ba2 100%)",
          position: { x: 0, y: 0 },
          size: { width: 100, height: 100 },
          style: { opacity: 1 },
          zIndex: 1
        },
        {
          id: "title",
          type: "text",
          content: "Event Title",
          position: { x: 20, y: 20 },
          size: { width: 60, height: 15 },
          style: { color: "#ffffff", fontSize: 24, fontWeight: "bold" },
          zIndex: 3
        }
      ]
    },
    {
      id: "minimalist",
      name: "Minimalist",
      category: "Professional",
      preview: "/api/placeholder/300/180",
      isPremium: false,
      layers: [
        {
          id: "bg",
          type: "background",
          content: "#ffffff",
          position: { x: 0, y: 0 },
          size: { width: 100, height: 100 },
          style: { opacity: 1 },
          zIndex: 1
        },
        {
          id: "accent",
          type: "shape",
          content: "rectangle",
          position: { x: 0, y: 0 },
          size: { width: 5, height: 100 },
          style: { color: "#2563eb", opacity: 1 },
          zIndex: 2
        }
      ]
    },
    {
      id: "festival-vibe",
      name: "Festival Vibe",
      category: "Entertainment",
      preview: "/api/placeholder/300/180",
      isPremium: true,
      layers: [
        {
          id: "bg",
          type: "background",
          content: "radial-gradient(circle, #ff6b6b, #feca57, #48dbfb)",
          position: { x: 0, y: 0 },
          size: { width: 100, height: 100 },
          style: { opacity: 0.9 },
          zIndex: 1
        },
        {
          id: "pattern",
          type: "pattern",
          content: "waves",
          position: { x: 0, y: 0 },
          size: { width: 100, height: 100 },
          style: { opacity: 0.3 },
          zIndex: 2
        }
      ]
    },
    {
      id: "corporate",
      name: "Corporate",
      category: "Business",
      preview: "/api/placeholder/300/180",
      isPremium: false,
      layers: [
        {
          id: "bg",
          type: "background",
          content: "#1f2937",
          position: { x: 0, y: 0 },
          size: { width: 100, height: 100 },
          style: { opacity: 1 },
          zIndex: 1
        },
        {
          id: "accent-line",
          type: "shape",
          content: "rectangle",
          position: { x: 0, y: 90 },
          size: { width: 100, height: 2 },
          style: { color: "#3b82f6", opacity: 1 },
          zIndex: 2
        }
      ]
    }
  ];

  const categories = [...new Set(templates.map(t => t.category))];

  return (
    <div className="space-y-6">
      <div>
        <h3 className="text-lg font-semibold mb-4">Choose a Template</h3>
        {categories.map(category => (
          <div key={category} className="mb-6">
            <h4 className="text-md font-medium text-gray-600 mb-3">{category}</h4>
            <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
              {templates.filter(t => t.category === category).map(template => (
                <Card key={template.id} className="cursor-pointer hover:shadow-lg transition-all duration-300 hover:scale-105">
                  <CardContent className="p-4">
                    <div className="aspect-video bg-gray-100 rounded-lg mb-3 relative overflow-hidden">
                      <div 
                        className="w-full h-full"
                        style={{ 
                          background: template.layers.find(l => l.type === 'background')?.content || '#f3f4f6'
                        }}
                      />
                      {template.isPremium && (
                        <div className="absolute top-2 right-2 bg-yellow-500 text-white text-xs px-2 py-1 rounded">
                          Premium
                        </div>
                      )}
                    </div>
                    <h5 className="font-medium text-sm">{template.name}</h5>
                    <Button 
                      size="sm" 
                      className="w-full mt-2"
                      onClick={() => onSelectTemplate(template)}
                    >
                      Use Template
                    </Button>
                  </CardContent>
                </Card>
              ))}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default TicketTemplates;
