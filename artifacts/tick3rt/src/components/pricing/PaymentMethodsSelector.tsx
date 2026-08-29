import { Label } from "@/components/ui/label";
import { Checkbox } from "@/components/ui/checkbox";
import PaymentMethodMark from "./PaymentMethodMark";

interface PaymentMethodsSelectorProps {
  selectedMethods: string[];
  onChange: (methods: string[]) => void;
}

const PaymentMethodsSelector = ({ selectedMethods, onChange }: PaymentMethodsSelectorProps) => {
  const paymentMethods = [
    { id: "Paynow", name: "Paynow" },
    { id: "EcoCash", name: "EcoCash" },
    { id: "OneMoney", name: "OneMoney" },
    { id: "Credit Card", name: "Credit/Debit Card" },
    { id: "Bank Transfer", name: "Bank Transfer" },
    { id: "TON", name: "TON (Crypto)" },
  ];

  const handleToggle = (methodId: string, checked: boolean) => {
    if (checked) {
      onChange([...selectedMethods, methodId]);
    } else {
      onChange(selectedMethods.filter((id) => id !== methodId));
    }
  };

  return (
    <div className="space-y-4">
      <Label className="text-sm font-medium">Accepted Payment Methods *</Label>
      <div className="grid grid-cols-2 gap-3 md:grid-cols-3">
        {paymentMethods.map((method) => (
          <div key={method.id} className="flex items-center gap-2 rounded-lg border p-3 transition-colors hover:bg-muted/50">
            <Checkbox
              id={method.id}
              checked={selectedMethods.includes(method.id)}
              onCheckedChange={(checked) => handleToggle(method.id, checked as boolean)}
            />
            <Label htmlFor={method.id} className="flex min-w-0 cursor-pointer items-center gap-2 text-sm">
              <PaymentMethodMark methodId={method.id} />
              {method.name}
            </Label>
          </div>
        ))}
      </div>
      <p className="text-xs text-muted-foreground">
        Show familiar local methods first, with TON available as an optional crypto checkout path.
      </p>
    </div>
  );
};

export default PaymentMethodsSelector;
