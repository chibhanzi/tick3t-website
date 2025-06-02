
import { Label } from "@/components/ui/label";
import { Checkbox } from "@/components/ui/checkbox";

interface PaymentMethodsSelectorProps {
  selectedMethods: string[];
  onChange: (methods: string[]) => void;
}

const PaymentMethodsSelector = ({ selectedMethods, onChange }: PaymentMethodsSelectorProps) => {
  const paymentMethods = [
    { id: 'Credit Card', name: 'Credit/Debit Card', icon: '💳' },
    { id: 'PayPal', name: 'PayPal', icon: '🅿️' },
    { id: 'Apple Pay', name: 'Apple Pay', icon: '🍎' },
    { id: 'Google Pay', name: 'Google Pay', icon: '🔍' },
    { id: 'Bank Transfer', name: 'Bank Transfer', icon: '🏦' },
    { id: 'ETH', name: 'Ethereum (Crypto)', icon: '⟐' },
    { id: 'USDC', name: 'USDC (Crypto)', icon: '💰' }
  ];

  const handleToggle = (methodId: string, checked: boolean) => {
    if (checked) {
      onChange([...selectedMethods, methodId]);
    } else {
      onChange(selectedMethods.filter(id => id !== methodId));
    }
  };

  return (
    <div className="space-y-4">
      <Label className="text-sm font-medium">Accepted Payment Methods *</Label>
      <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
        {paymentMethods.map(method => (
          <div key={method.id} className="flex items-center space-x-2 p-3 border rounded-lg hover:bg-muted/50 transition-colors">
            <Checkbox
              id={method.id}
              checked={selectedMethods.includes(method.id)}
              onCheckedChange={(checked) => handleToggle(method.id, checked as boolean)}
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
  );
};

export default PaymentMethodsSelector;
