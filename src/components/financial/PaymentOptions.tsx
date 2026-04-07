import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Label } from "@/components/ui/label";
import { CreditCard, DollarSign, Landmark, ShieldCheck, Smartphone, Wallet } from "lucide-react";
import { useToast } from "@/hooks/use-toast";

interface PaymentOptionsProps {
  eventPrice: number;
  eventTitle: string;
  onConfirm?: (method: string) => void;
}

const rails = [
  {
    id: "paynow",
    title: "Paynow",
    description: "Best for most buyers using EcoCash, OneMoney, or bank-linked local checkout.",
    eta: "Fast local confirmation",
    tags: ["EcoCash", "OneMoney", "Bank"],
    icon: Smartphone,
    recommended: true,
  },
  {
    id: "bank",
    title: "Bank Transfer",
    description: "Direct bank payment with a clear reference flow.",
    eta: "Useful for larger orders",
    tags: ["Bank", "Reference code"],
    icon: Landmark,
  },
  {
    id: "card",
    title: "Card & Wallets",
    description: "Simple card checkout for buyers who prefer a familiar payment form.",
    eta: "Instant confirmation",
    tags: ["Visa", "Mastercard", "Wallets"],
    icon: CreditCard,
  },
  {
    id: "ton",
    title: "TON",
    description: "Optional crypto checkout for buyers who want to pay with TON.",
    eta: "Fast on-chain confirmation",
    tags: ["TON", "Crypto optional"],
    icon: Wallet,
  },
] as const;

const stepMap: Record<string, string[]> = {
  paynow: [
    "Choose Paynow at checkout.",
    "Approve with EcoCash, OneMoney, or a supported bank option.",
    "Your ticket appears in your dashboard right after confirmation.",
  ],
  bank: [
    "Generate your transfer reference.",
    "Complete the payment from your bank.",
    "Your ticket unlocks once the transfer reflects.",
  ],
  card: [
    "Enter your card or wallet details.",
    "Approve the payment securely.",
    "Receive the ticket instantly after success.",
  ],
  ton: [
    "Connect your TON wallet.",
    "Approve the amount in TON.",
    "Your ticket is confirmed after the transaction completes.",
  ],
};

const PaymentOptions = ({ eventPrice, eventTitle, onConfirm }: PaymentOptionsProps) => {
  const { toast } = useToast();
  const [paymentMethod, setPaymentMethod] = useState<(typeof rails)[number]["id"]>("paynow");

  const selectedRail = rails.find((rail) => rail.id === paymentMethod) ?? rails[0];

  const handleConfirm = () => {
    onConfirm?.(selectedRail.title);
    toast({
      title: `${selectedRail.title} selected`,
      description: `You are ready to pay $${eventPrice.toFixed(2)} for ${eventTitle}.`,
    });
  };

  return (
    <Card className="border-border/60">
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <DollarSign className="h-5 w-5" />
          Choose how you want to pay
        </CardTitle>
        <p className="text-sm text-muted-foreground">
          Local payment methods come first, while TON stays available as an optional crypto method.
        </p>
      </CardHeader>
      <CardContent className="space-y-6">
        <div className="grid gap-3">
          {rails.map((rail) => (
            <button
              key={rail.id}
              type="button"
              onClick={() => setPaymentMethod(rail.id)}
              className={`rounded-xl border p-4 text-left transition-all ${paymentMethod === rail.id ? "border-primary bg-primary/5" : "border-border/60 hover:border-primary/40"}`}
            >
              <div className="flex items-start justify-between gap-3">
                <div className="flex gap-3">
                  <div className="rounded-full bg-primary/10 p-3 text-primary">
                    <rail.icon className="h-5 w-5" />
                  </div>
                  <div>
                    <div className="flex flex-wrap items-center gap-2">
                      <p className="font-semibold">{rail.title}</p>
                      {rail.recommended && <Badge>Best for most buyers</Badge>}
                    </div>
                    <p className="mt-1 text-sm text-muted-foreground">{rail.description}</p>
                    <p className="mt-2 text-xs text-muted-foreground">{rail.eta}</p>
                  </div>
                </div>
                <div className={`mt-1 h-4 w-4 rounded-full border ${paymentMethod === rail.id ? "border-primary bg-primary" : "border-border"}`} />
              </div>
              <div className="mt-3 flex flex-wrap gap-2">
                {rail.tags.map((tag) => (
                  <Badge key={tag} variant="secondary">{tag}</Badge>
                ))}
              </div>
            </button>
          ))}
        </div>

        <div className="rounded-xl border border-border/60 bg-muted/40 p-4">
          <div className="flex items-center gap-2">
            <ShieldCheck className="h-4 w-4 text-primary" />
            <Label className="font-medium">How {selectedRail.title} works</Label>
          </div>
          <div className="mt-3 space-y-3">
            {stepMap[paymentMethod].map((step, index) => (
              <div key={step} className="flex gap-3 text-sm">
                <div className="flex h-6 w-6 shrink-0 items-center justify-center rounded-full bg-primary/10 text-primary">
                  {index + 1}
                </div>
                <p className="text-muted-foreground">{step}</p>
              </div>
            ))}
          </div>
        </div>

        <div className="flex items-center justify-between rounded-xl border border-border/60 p-4">
          <div>
            <p className="text-sm font-medium">Amount due now</p>
            <p className="text-xs text-muted-foreground">Secure checkout and ticket delivery after payment confirmation.</p>
          </div>
          <p className="text-2xl font-bold">${eventPrice.toFixed(2)}</p>
        </div>

        <Button className="w-full" onClick={handleConfirm}>
          Continue with {selectedRail.title}
        </Button>
      </CardContent>
    </Card>
  );
};

export default PaymentOptions;
