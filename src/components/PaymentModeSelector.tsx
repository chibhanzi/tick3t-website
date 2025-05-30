
import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Switch } from "@/components/ui/switch";
import { Label } from "@/components/ui/label";
import { CreditCard, Wallet, Globe, Zap, Shield, Star } from "lucide-react";

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
      id: 'hybrid',
      name: 'Hybrid Payment (Recommended)',
      description: 'Accept both traditional payments and crypto for maximum reach',
      icon: <Globe className="h-6 w-6" />,
      fees: '2.9% + $0.30 (Card) | 1% (Crypto)',
      processing: 'Instant',
      features: ['Credit/Debit Cards', 'PayPal', 'Apple Pay', 'ETH', 'USDC', 'Polygon'],
      recommended: true
    },
    {
      id: 'web2',
      name: 'Traditional Payments',
      description: 'Standard payment methods for mainstream users',
      icon: <CreditCard className="h-6 w-6" />,
      fees: '2.9% + $0.30',
      processing: '1-3 business days',
      features: ['Credit/Debit Cards', 'PayPal', 'Apple Pay', 'Google Pay', 'Bank Transfer']
    },
    {
      id: 'web3',
      name: 'Crypto Only',
      description: 'Pure blockchain experience with lower fees',
      icon: <Wallet className="h-6 w-6" />,
      fees: '1% + Gas fees',
      processing: '1-10 minutes',
      features: ['ETH', 'USDC', 'USDT', 'Polygon', 'BSC', 'True NFT ownership']
    }
  ];

  const handleModeToggle = (modeId: string) => {
    if (modeId === 'hybrid') {
      // Hybrid mode replaces all others
      onSelectionChange(['hybrid']);
    } else {
      // For individual modes, remove hybrid if present
      let newModes = selectedModes.filter(id => id !== 'hybrid');
      
      if (newModes.includes(modeId)) {
        newModes = newModes.filter(id => id !== modeId);
      } else {
        newModes = [...newModes, modeId];
      }
      
      onSelectionChange(newModes);
    }
  };

  const isSelected = (modeId: string) => {
    if (modeId === 'hybrid') {
      return selectedModes.includes('hybrid');
    }
    return selectedModes.includes(modeId) && !selectedModes.includes('hybrid');
  };

  const getUserFriendlyExperience = () => {
    if (selectedModes.includes('hybrid')) {
      return {
        title: "Smart Payment Experience",
        description: "Users see familiar payment options first, with crypto as an advanced option",
        userFlow: [
          "Credit/debit card forms (default)",
          "PayPal, Apple Pay buttons",
          "'Pay with Crypto' toggle for Web3 users",
          "Automatic wallet detection"
        ]
      };
    } else if (selectedModes.includes('web2') && selectedModes.includes('web3')) {
      return {
        title: "Dual Payment Rails",
        description: "Two separate payment flows for different user types",
        userFlow: [
          "Payment method selection screen",
          "Traditional payment form OR wallet connect",
          "Separate checkout flows"
        ]
      };
    } else if (selectedModes.includes('web2')) {
      return {
        title: "Traditional Payment Experience",
        description: "Standard e-commerce checkout experience",
        userFlow: [
          "Credit/debit card form",
          "PayPal and digital wallet options",
          "Email receipt delivery"
        ]
      };
    } else if (selectedModes.includes('web3')) {
      return {
        title: "Pure Web3 Experience",
        description: "Crypto-native payment experience",
        userFlow: [
          "Connect wallet prompt",
          "Select preferred token",
          "Blockchain transaction confirmation",
          "NFT ticket minting"
        ]
      };
    }
    return null;
  };

  const experience = getUserFriendlyExperience();

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Zap className="h-5 w-5 text-yellow-500" />
            Payment Integration Setup
          </CardTitle>
          <p className="text-sm text-muted-foreground">
            Choose how your customers will pay for tickets. You can always change this later.
          </p>
        </CardHeader>
        <CardContent className="space-y-4">
          {paymentModes.map((mode) => (
            <Card 
              key={mode.id}
              className={`cursor-pointer transition-all ${
                isSelected(mode.id) 
                  ? 'border-blue-500 bg-blue-50 dark:bg-blue-950' 
                  : 'hover:border-gray-300'
              }`}
              onClick={() => handleModeToggle(mode.id)}
            >
              <CardContent className="p-4">
                <div className="flex items-start justify-between">
                  <div className="flex items-start gap-3 flex-1">
                    <div className="mt-1">{mode.icon}</div>
                    <div className="flex-1">
                      <div className="flex items-center gap-2 mb-1">
                        <h3 className="font-semibold">{mode.name}</h3>
                        {mode.recommended && (
                          <Badge variant="default" className="bg-green-500">
                            <Star className="h-3 w-3 mr-1" />
                            Recommended
                          </Badge>
                        )}
                      </div>
                      <p className="text-sm text-muted-foreground mb-3">{mode.description}</p>
                      
                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs">
                        <div>
                          <span className="font-medium">Fees:</span> {mode.fees}
                        </div>
                        <div>
                          <span className="font-medium">Processing:</span> {mode.processing}
                        </div>
                      </div>
                      
                      <div className="mt-3">
                        <div className="flex flex-wrap gap-1">
                          {mode.features.map((feature, index) => (
                            <Badge key={index} variant="secondary" className="text-xs">
                              {feature}
                            </Badge>
                          ))}
                        </div>
                      </div>
                    </div>
                  </div>
                  
                  <div className="ml-3 mt-1">
                    <div className={`w-5 h-5 rounded-full border-2 ${
                      isSelected(mode.id) 
                        ? 'border-blue-500 bg-blue-500' 
                        : 'border-gray-300'
                    }`}>
                      {isSelected(mode.id) && (
                        <div className="w-full h-full rounded-full bg-white scale-50" />
                      )}
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </CardContent>
      </Card>

      {/* User Experience Preview */}
      {experience && (
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Shield className="h-5 w-5 text-green-500" />
              {experience.title}
            </CardTitle>
            <p className="text-sm text-muted-foreground">{experience.description}</p>
          </CardHeader>
          <CardContent>
            <div className="space-y-2">
              <h4 className="font-medium text-sm">Customer checkout flow:</h4>
              <ol className="space-y-2">
                {experience.userFlow.map((step, index) => (
                  <li key={index} className="flex items-center gap-2 text-sm">
                    <span className="flex items-center justify-center w-5 h-5 rounded-full bg-blue-100 text-blue-600 text-xs font-medium">
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

      {/* Advanced Settings */}
      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <CardTitle className="text-lg">Advanced Settings</CardTitle>
            <div className="flex items-center space-x-2">
              <Switch
                id="advanced-mode"
                checked={showAdvanced}
                onCheckedChange={setShowAdvanced}
              />
              <Label htmlFor="advanced-mode" className="text-sm">
                Show advanced options
              </Label>
            </div>
          </div>
        </CardHeader>
        {showAdvanced && (
          <CardContent className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label className="text-sm font-medium">Gas Fee Management</Label>
                <div className="space-y-1">
                  <label className="flex items-center space-x-2 text-sm">
                    <input type="checkbox" defaultChecked />
                    <span>Cover gas fees for users</span>
                  </label>
                  <label className="flex items-center space-x-2 text-sm">
                    <input type="checkbox" />
                    <span>Allow users to pay gas fees</span>
                  </label>
                </div>
              </div>
              
              <div className="space-y-2">
                <Label className="text-sm font-medium">Currency Options</Label>
                <div className="space-y-1">
                  <label className="flex items-center space-x-2 text-sm">
                    <input type="checkbox" defaultChecked />
                    <span>USD (default)</span>
                  </label>
                  <label className="flex items-center space-x-2 text-sm">
                    <input type="checkbox" />
                    <span>EUR</span>
                  </label>
                  <label className="flex items-center space-x-2 text-sm">
                    <input type="checkbox" />
                    <span>GBP</span>
                  </label>
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
