
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { DollarSign, Calendar, Info } from "lucide-react";
import { TicketGenerationConfig } from "./TicketGenerationMethods";
import CurrencySelector from "./pricing/CurrencySelector";
import PaymentMethodsSelector from "./pricing/PaymentMethodsSelector";

interface PricingData {
  currency: string;
  price: string;
  earlyBirdPrice: string;
  earlyBirdDeadline: string;
  acceptedPayments: string[];
}

interface EventPricingStepProps {
  pricingData: PricingData;
  onPricingChange: (data: PricingData) => void;
  generationConfig: TicketGenerationConfig;
}

const EventPricingStep = ({ pricingData, onPricingChange, generationConfig }: EventPricingStepProps) => {
  const handleChange = (field: keyof PricingData, value: string | string[]) => {
    onPricingChange({
      ...pricingData,
      [field]: value
    });
  };

  const currencies = [
    { code: 'USD', symbol: '$' },
    { code: 'EUR', symbol: '€' },
    { code: 'GBP', symbol: '£' },
    { code: 'CAD', symbol: 'C$' },
    { code: 'AUD', symbol: 'A$' }
  ];

  const getCurrencySymbol = (code: string) => {
    return currencies.find(c => c.code === code)?.symbol || '$';
  };

  return (
    <Card className="border-slate-200 dark:border-slate-700">
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <DollarSign className="h-5 w-5 text-green-500" />
          Pricing & Payment Options
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-6">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <CurrencySelector 
            value={pricingData.currency}
            onChange={(value) => handleChange('currency', value)}
          />
          
          <div className="space-y-2">
            <Label htmlFor="price" className="text-sm font-medium">Ticket Price *</Label>
            <div className="relative">
              <span className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground">
                {getCurrencySymbol(pricingData.currency || 'USD')}
              </span>
              <Input
                id="price"
                type="number"
                placeholder="99.00"
                value={pricingData.price}
                onChange={(e) => handleChange('price', e.target.value)}
                className="h-11 pl-8"
                step="0.01"
              />
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="space-y-2">
            <Label htmlFor="earlyBirdPrice" className="text-sm font-medium flex items-center gap-1">
              <Calendar className="h-3 w-3" />
              Early Bird Price (Optional)
            </Label>
            <div className="relative">
              <span className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground">
                {getCurrencySymbol(pricingData.currency || 'USD')}
              </span>
              <Input
                id="earlyBirdPrice"
                type="number"
                placeholder="79.00"
                value={pricingData.earlyBirdPrice}
                onChange={(e) => handleChange('earlyBirdPrice', e.target.value)}
                className="h-11 pl-8"
                step="0.01"
              />
            </div>
          </div>
          
          <div className="space-y-2">
            <Label htmlFor="earlyBirdDeadline" className="text-sm font-medium">Early Bird Deadline</Label>
            <Input
              id="earlyBirdDeadline"
              type="datetime-local"
              value={pricingData.earlyBirdDeadline}
              onChange={(e) => handleChange('earlyBirdDeadline', e.target.value)}
              className="h-11"
            />
          </div>
        </div>

        <PaymentMethodsSelector
          selectedMethods={pricingData.acceptedPayments}
          onChange={(methods) => handleChange('acceptedPayments', methods)}
        />

        {generationConfig.method === 'realtime' && (
          <div className="bg-gradient-to-r from-orange-50 to-yellow-50 dark:from-orange-900/20 dark:to-yellow-900/20 p-4 rounded-lg">
            <div className="flex items-start gap-2">
              <Info className="h-4 w-4 text-orange-500 mt-0.5 flex-shrink-0" />
              <div className="text-sm">
                <div className="font-medium mb-1">Real-time Generation Pricing</div>
                <div className="text-muted-foreground">
                  With real-time generation, you don't need to set a fixed ticket limit. Tickets will be created as customers purchase them, allowing for flexible pricing and unlimited sales potential.
                </div>
              </div>
            </div>
          </div>
        )}

        <div className="bg-gradient-to-r from-green-50 to-emerald-50 dark:from-green-900/20 dark:to-emerald-900/20 p-4 rounded-lg">
          <div className="text-sm">
            <div className="mb-2 flex items-center gap-2 font-medium">
              <DollarSign className="h-4 w-4 text-green-600 dark:text-green-400" />
              Revenue Summary
            </div>
            <div className="space-y-1 text-muted-foreground">
              <div>Base price: {getCurrencySymbol(pricingData.currency || 'USD')}{pricingData.price || '0.00'}</div>
              {pricingData.earlyBirdPrice && (
                <div>Early bird: {getCurrencySymbol(pricingData.currency || 'USD')}{pricingData.earlyBirdPrice}</div>
              )}
              <div className="pt-2 border-t">
                <Badge variant="outline" className="text-xs">
                  {pricingData.acceptedPayments.length} payment method{pricingData.acceptedPayments.length !== 1 ? 's' : ''} accepted
                </Badge>
              </div>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export default EventPricingStep;
