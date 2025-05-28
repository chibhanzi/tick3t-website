
import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Clock, Users, Zap, Info } from "lucide-react";

export interface TicketGenerationConfig {
  method: 'batch' | 'realtime' | 'limited';
  batchSize?: number;
  realtimeBuffer?: number;
  limitedQuantity?: number;
}

interface TicketGenerationMethodsProps {
  config: TicketGenerationConfig;
  onConfigChange: (config: TicketGenerationConfig) => void;
}

const TicketGenerationMethods = ({ config, onConfigChange }: TicketGenerationMethodsProps) => {
  const updateConfig = (updates: Partial<TicketGenerationConfig>) => {
    onConfigChange({ ...config, ...updates });
  };

  const methods = [
    {
      id: 'batch',
      title: 'Batch Generation',
      description: 'Generate all tickets at once when event is created',
      icon: Users,
      pros: ['Faster sales', 'Immediate availability', 'Lower gas costs'],
      cons: ['Fixed supply', 'Storage costs'],
      recommended: 'Known attendee count'
    },
    {
      id: 'realtime',
      title: 'Real-time Generation',
      description: 'Generate tickets as they are purchased',
      icon: Zap,
      pros: ['Flexible supply', 'Lower upfront costs', 'Dynamic pricing'],
      cons: ['Higher gas per ticket', 'Potential delays'],
      recommended: 'Unknown attendee count'
    },
    {
      id: 'limited',
      title: 'Limited Release',
      description: 'Generate tickets in small batches as demand grows',
      icon: Clock,
      pros: ['Scarcity marketing', 'Demand testing', 'Controlled supply'],
      cons: ['Complex management', 'Potential sellouts'],
      recommended: 'Exclusive events'
    }
  ];

  return (
    <Card className="border-slate-200 dark:border-slate-700">
      <CardHeader>
        <CardTitle className="flex items-center gap-2 text-lg">
          <Zap className="h-5 w-5 text-blue-500" />
          🎫 Ticket Generation Method
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-6">
        <RadioGroup 
          value={config.method} 
          onValueChange={(value) => updateConfig({ method: value as any })}
          className="space-y-4"
        >
          {methods.map((method) => {
            const IconComponent = method.icon;
            return (
              <div key={method.id} className="space-y-3">
                <div className="flex items-start space-x-3 p-4 border rounded-lg hover:bg-slate-50 dark:hover:bg-slate-800 transition-colors">
                  <RadioGroupItem value={method.id} id={method.id} className="mt-1" />
                  <div className="flex-1 space-y-2">
                    <div className="flex items-center gap-2">
                      <IconComponent className="h-5 w-5 text-blue-500" />
                      <Label htmlFor={method.id} className="text-base font-semibold cursor-pointer">
                        {method.title}
                      </Label>
                      <Badge variant="outline" className="text-xs">
                        {method.recommended}
                      </Badge>
                    </div>
                    <p className="text-sm text-muted-foreground">{method.description}</p>
                    
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-3 mt-3">
                      <div>
                        <div className="text-xs font-medium text-green-600 dark:text-green-400 mb-1">✅ Pros</div>
                        <ul className="text-xs text-muted-foreground space-y-1">
                          {method.pros.map((pro, index) => (
                            <li key={index}>• {pro}</li>
                          ))}
                        </ul>
                      </div>
                      <div>
                        <div className="text-xs font-medium text-orange-600 dark:text-orange-400 mb-1">⚠️ Cons</div>
                        <ul className="text-xs text-muted-foreground space-y-1">
                          {method.cons.map((con, index) => (
                            <li key={index}>• {con}</li>
                          ))}
                        </ul>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Method-specific configuration */}
                {config.method === method.id && (
                  <div className="ml-7 space-y-3 p-4 bg-blue-50 dark:bg-slate-800 rounded-lg">
                    {method.id === 'batch' && (
                      <div>
                        <Label htmlFor="batchSize" className="text-sm font-medium">Batch Size (optional)</Label>
                        <Input
                          id="batchSize"
                          type="number"
                          placeholder="Leave empty for all tickets"
                          value={config.batchSize || ''}
                          onChange={(e) => updateConfig({ batchSize: parseInt(e.target.value) || undefined })}
                          className="mt-1 h-9"
                        />
                        <p className="text-xs text-muted-foreground mt-1">
                          Generate tickets in batches of this size. Leave empty to generate all at once.
                        </p>
                      </div>
                    )}

                    {method.id === 'realtime' && (
                      <div>
                        <Label htmlFor="realtimeBuffer" className="text-sm font-medium">Buffer Size</Label>
                        <Input
                          id="realtimeBuffer"
                          type="number"
                          placeholder="5"
                          value={config.realtimeBuffer || 5}
                          onChange={(e) => updateConfig({ realtimeBuffer: parseInt(e.target.value) || 5 })}
                          className="mt-1 h-9"
                        />
                        <p className="text-xs text-muted-foreground mt-1">
                          Number of tickets to pre-generate for faster sales.
                        </p>
                      </div>
                    )}

                    {method.id === 'limited' && (
                      <div>
                        <Label htmlFor="limitedQuantity" className="text-sm font-medium">Initial Release Quantity</Label>
                        <Input
                          id="limitedQuantity"
                          type="number"
                          placeholder="50"
                          value={config.limitedQuantity || 50}
                          onChange={(e) => updateConfig({ limitedQuantity: parseInt(e.target.value) || 50 })}
                          className="mt-1 h-9"
                        />
                        <p className="text-xs text-muted-foreground mt-1">
                          Number of tickets in the first release. More can be added later.
                        </p>
                      </div>
                    )}
                  </div>
                )}
              </div>
            );
          })}
        </RadioGroup>

        <div className="bg-gradient-to-r from-blue-50 to-indigo-50 dark:from-slate-800 dark:to-slate-700 p-4 rounded-lg">
          <div className="flex items-start gap-2">
            <Info className="h-4 w-4 text-blue-500 mt-0.5 flex-shrink-0" />
            <div className="text-sm">
              <div className="font-medium mb-1">💡 Smart Recommendation</div>
              <div className="text-muted-foreground">
                {config.method === 'batch' && "Best for events with known capacity. Tickets are immediately available and gas costs are optimized."}
                {config.method === 'realtime' && "Perfect for events where you're unsure about demand. Tickets are minted as needed."}
                {config.method === 'limited' && "Great for building hype and testing demand. Release tickets in waves to create urgency."}
              </div>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export default TicketGenerationMethods;
