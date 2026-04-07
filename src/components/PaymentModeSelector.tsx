import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Switch } from "@/components/ui/switch";
import { Label } from "@/components/ui/label";
import { CreditCard, Wallet, Smartphone, Zap, Shield, Star } from "lucide-react";

interface PaymentMode {
  id: string;
  name: string;
  description: string;
  icon: React.ReactNode;
  fees: string;
  processing: string;
  features: string[];
  recommended?: boolean;
}

interface PaymentModeSelectorProps {
  selectedModes: string[];
  onSelectionChange: (modes: string[]) => void;
}

const PaymentModeSelector = ({ selectedModes, onSelectionChange }: PaymentModeSelectorProps) => {
  const [showAdvanced, setShowAdvanced] = useState(false);

  const paymentModes: PaymentMode[] = [
    {
      id: "local-first",
      name: "Local-first Checkout",
      description: "Lead with Paynow and everyday payment methods, with TON quietly available as an extra option.",
      icon: <Smartphone className="h-6 w-6" />,
      fees: "Varies by rail",
      processing: "Fast",
      features: ["Paynow", "EcoCash", "OneMoney", "Bank Transfer", "TON"],
      recommended: true,
    },
    {
      id: "standard",
      name: "Standard Payments",
      description: "Cards, wallets, and bank-friendly checkout for mainstream buyers.",
      icon: <CreditCard className="h-6 w-6" />,
      fees: "Processor fees apply",
      processing: "1-3 business days",
      features: ["Cards", "Wallets", "Bank Transfer"],
    },
    {
      id: "ton",
      name: "TON Checkout",
      description: "Optional TON payment path for buyers who prefer crypto.",
      icon: <Wallet className="h-6 w-6" />,
      fees: "TON network fees apply",
      processing: "1-10 minutes",
      features: ["TON", "Fast settlement", "Digital tickets"],
    },
  ];

  const handleModeToggle = (modeId: string) => {
    if (modeId === "local-first") {
      onSelectionChange(["local-first"]);
      return;
    }

    let newModes = selectedModes.filter((id) => id !== "local-first");
    if (newModes.includes(modeId)) {
      newModes = newModes.filter((id) => id !== modeId);
    } else {
      newModes = [...newModes, modeId];
    }

    onSelectionChange(newModes);
  };

  const isSelected = (modeId: string) => {
    if (modeId === "local-first") return selectedModes.includes("local-first");
    return selectedModes.includes(modeId) && !selectedModes.includes("local-first");
  };

  const getUserFriendlyExperience = () => {
    if (selectedModes.includes("local-first")) {
      return {
        title: "Smart Payment Experience",
        description: "Buyers see local methods first, while TON stays available without dominating checkout.",
        userFlow: [
          "Paynow appears first for local buyers",
          "Cards and bank methods stay available",
          "TON appears as an optional crypto route",
          "Tickets are delivered after confirmation",
        ],
      };
    }

    if (selectedModes.includes("standard") && selectedModes.includes("ton")) {
      return {
        title: "Dual Payment Rails",
        description: "Standard checkout and TON checkout can coexist cleanly.",
        userFlow: [
          "Payment method selection",
          "Standard payment form or TON wallet connect",
          "Separate payment confirmations",
        ],
      };
    }

    if (selectedModes.includes("standard")) {
      return {
        title: "Traditional Payment Experience",
        description: "A familiar e-commerce flow focused on mainstream buyers.",
        userFlow: [
          "Card or bank payment form",
          "Paynow and wallet support where enabled",
          "Receipt and ticket delivery",
        ],
      };
    }

    if (selectedModes.includes("ton")) {
      return {
        title: "TON Payment Experience",
        description: "An optional TON-native payment flow.",
        userFlow: [
          "Connect TON wallet",
          "Approve payment",
          "Receive ticket after confirmation",
        ],
      };
    }

    return null;
  };

  const experience = getUserFriendlyExperience();

  return (
    <div className="space-y-6">
      <Card className="border-border/60">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Zap className="h-5 w-5 text-primary" />
            Payment Integration Setup
          </CardTitle>
          <p className="text-sm text-muted-foreground">
            Set up payment options so buyers see the simplest flow first.
          </p>
        </CardHeader>
        <CardContent className="space-y-4">
          {paymentModes.map((mode) => (
            <Card
              key={mode.id}
              className={`cursor-pointer transition-all ${isSelected(mode.id) ? "border-primary bg-primary/5" : "hover:border-primary/40"}`}
              onClick={() => handleModeToggle(mode.id)}
            >
              <CardContent className="p-4">
                <div className="flex items-start justify-between">
                  <div className="flex flex-1 items-start gap-3">
                    <div className="mt-1">{mode.icon}</div>
                    <div className="flex-1">
                      <div className="mb-1 flex items-center gap-2">
                        <h3 className="font-semibold">{mode.name}</h3>
                        {mode.recommended && (
                          <Badge>
                            <Star className="mr-1 h-3 w-3" />
                            Recommended
                          </Badge>
                        )}
                      </div>
                      <p className="mb-3 text-sm text-muted-foreground">{mode.description}</p>

                      <div className="grid grid-cols-1 gap-4 text-xs sm:grid-cols-2">
                        <div><span className="font-medium">Fees:</span> {mode.fees}</div>
                        <div><span className="font-medium">Processing:</span> {mode.processing}</div>
                      </div>

                      <div className="mt-3 flex flex-wrap gap-1">
                        {mode.features.map((feature) => (
                          <Badge key={feature} variant="secondary" className="text-xs">
                            {feature}
                          </Badge>
                        ))}
                      </div>
                    </div>
                  </div>

                  <div className="ml-3 mt-1">
                    <div className={`h-5 w-5 rounded-full border-2 ${isSelected(mode.id) ? "border-primary bg-primary" : "border-border"}`}>
                      {isSelected(mode.id) && <div className="h-full w-full scale-50 rounded-full bg-background" />}
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </CardContent>
      </Card>

      {experience && (
        <Card className="border-border/60">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Shield className="h-5 w-5 text-primary" />
              {experience.title}
            </CardTitle>
            <p className="text-sm text-muted-foreground">{experience.description}</p>
          </CardHeader>
          <CardContent>
            <div className="space-y-2">
              <h4 className="text-sm font-medium">Customer checkout flow:</h4>
              <ol className="space-y-2">
                {experience.userFlow.map((step, index) => (
                  <li key={step} className="flex items-center gap-2 text-sm">
                    <span className="flex h-5 w-5 items-center justify-center rounded-full bg-primary/10 text-xs font-medium text-primary">
                      {index + 1}
                    </span>
                    {step}
                  </li>
                ))}
              </ol>
            </div>
          </CardContent>
        </Card>
      )}

      <Card className="border-border/60">
        <CardHeader>
          <div className="flex items-center justify-between">
            <CardTitle className="text-lg">Advanced Settings</CardTitle>
            <div className="flex items-center space-x-2">
              <Switch id="advanced-mode" checked={showAdvanced} onCheckedChange={setShowAdvanced} />
              <Label htmlFor="advanced-mode" className="text-sm">Show advanced options</Label>
            </div>
          </div>
        </CardHeader>
        {showAdvanced && (
          <CardContent className="space-y-4">
            <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
              <div className="space-y-2">
                <Label className="text-sm font-medium">Buyer experience priorities</Label>
                <div className="space-y-1 text-sm">
                  <label className="flex items-center space-x-2"><input type="checkbox" defaultChecked /><span>Show local methods first</span></label>
                  <label className="flex items-center space-x-2"><input type="checkbox" defaultChecked /><span>Keep TON optional</span></label>
                </div>
              </div>
              <div className="space-y-2">
                <Label className="text-sm font-medium">Currency Options</Label>
                <div className="space-y-1 text-sm">
                  <label className="flex items-center space-x-2"><input type="checkbox" defaultChecked /><span>USD (default)</span></label>
                  <label className="flex items-center space-x-2"><input type="checkbox" /><span>ZWL</span></label>
                </div>
              </div>
            </div>
          </CardContent>
        )}
      </Card>
    </div>
  );
};

export default PaymentModeSelector;
