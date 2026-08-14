
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Label } from "@/components/ui/label";

interface CurrencySelectorProps {
  value: string;
  onChange: (value: string) => void;
}

const CurrencySelector = ({ value, onChange }: CurrencySelectorProps) => {
  const currencies = [
    { code: 'USD', name: 'US Dollar (Primary)', symbol: '$' },
    { code: 'EUR', name: 'Euro', symbol: '€' },
    { code: 'GBP', name: 'British Pound', symbol: '£' },
    { code: 'CAD', name: 'Canadian Dollar', symbol: 'C$' },
    { code: 'AUD', name: 'Australian Dollar', symbol: 'A$' }
  ];

  return (
    <div className="space-y-2">
      <Label htmlFor="currency" className="text-sm font-medium">Primary Currency *</Label>
      <Select value={value || 'USD'} onValueChange={onChange}>
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
  );
};

export default CurrencySelector;
