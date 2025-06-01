import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Checkbox } from "@/components/ui/checkbox";
import { Badge } from "@/components/ui/badge";
import { DollarSign, CreditCard, Coins, Calendar, Info } from "lucide-react";
import { TicketGenerationConfig } from "./TicketGenerationMethods";

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

  const handlePaymentToggle = (payment: string, checked: boolean) => {
    const current = pricingData.acceptedPayments;
    if (checked) {
      handleChange('acceptedPayments', [...current, payment]);
    } else {
      handleChange('acceptedPayments', current.filter(p => p !== payment));
    }
  };

  const currencies = [
    { code: 'USD', name: 'US Dollar (Primary)', symbol: '$' },
    { code: 'EUR', name: 'Euro', symbol: '€' },
    { code: 'GBP', name: 'British Pound', symbol: '£' },
    { code: 'CAD', name: 'Canadian Dollar', symbol: 'C$' },
    { code: 'AUD', name: 'Australian Dollar', symbol: 'A$' }
  ];

  const paymentMethods = [
    { id: 'Credit Card', name: 'Credit/Debit Card', icon: '💳' },
    { id: 'PayPal', name: 'PayPal', icon: '🅿️' },
    { id: 'Apple Pay', name: 'Apple Pay', icon: '🍎' },
    { id: 'Google Pay', name: 'Google Pay', icon: '🔍' },
    { id: 'Bank Transfer', name: 'Bank Transfer', icon: '🏦' },
    { id: 'ETH', name: 'Ethereum (Crypto)', icon: '⟐' },
    { id: 'USDC', name: 'USDC (Crypto)', icon: '💰' }
  ];

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
          <div className="space-y-2">
            <Label htmlFor="currency" className="text-sm font-medium">Primary Currency *</Label>
            <Select value={pricingData.currency || 'USD'} onValueChange={(value) => handleChange('currency', value)}>
              <SelectTrigger className="h-11">
                <SelectValue placeholder="Select currency" />
              </SelectTrigger>
              <SelectContent>
                {currencies.map(currency => (
                  <SelectItem key={currency.code} value={currency.code}>
                    <div className="flex items-center gap-2">
                      <span className="font-mono">{currency.symbol}</span>
                      {currency.name} ({currency.code})
                    </div>
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
            <p className="text-xs text-muted-foreground">
              USD is recommended for international events. Crypto options are available as payment methods.
            </p>
          </div>
          
          <div className="space-y-2">
            <Label htmlFor="price" className="text-sm font-medium">Ticket Price *</Label>
            <div className="relative">
              <span className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground">
                {currencies.find(c => c.code === (pricingData.currency || 'USD'))?.symbol || '$'}
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
                {currencies.find(c => c.code === (pricingData.currency || 'USD'))?.symbol || '$'}
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

        <div className="space-y-4">
          <Label className="text-sm font-medium">Accepted Payment Methods *</Label>
          <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
            {paymentMethods.map(method => (
              <div key={method.id} className="flex items-center space-x-2 p-3 border rounded-lg hover:bg-muted/50 transition-colors">
                <Checkbox
                  id={method.id}
                  checked={pricingData.acceptedPayments.includes(method.id)}
                  onCheckedChange={(checked) => handlePaymentToggle(method.id, checked as boolean)}
                />
                <Label htmlFor={method.id} className="flex items-center gap-2 cursor-pointer text-sm">
                  <span className="text-lg">{method.icon}</span>
                  {method.name}
                </Label>
              </div>
            ))}
          </div>
          <p className="text-xs text-muted-foreground">
            Crypto payments are processed at current exchange rates and converted to your primary currency.
          </p>
        </div>

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
            <div className="font-medium mb-2">💰 Revenue Summary</div>
            <div className="space-y-1 text-muted-foreground">
              <div>Base price: {currencies.find(c => c.code === (pricingData.currency || 'USD'))?.symbol}{pricingData.price || '0.00'}</div>
              {pricingData.earlyBirdPrice && (
                <div>Early bird: {currencies.find(c => c.code === (pricingData.currency || 'USD'))?.symbol}{pricingData.earlyBirdPrice}</div>
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
