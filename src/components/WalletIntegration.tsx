
import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Wallet, Shield, DollarSign, AlertCircle, CheckCircle } from "lucide-react";

export interface WalletConfig {
  paymentWallet: string;
  mintingWallet: string;
  network: string;
  mintingFeePercentage: number;
  gasOptimization: boolean;
}

interface WalletIntegrationProps {
  config: WalletConfig;
  onConfigChange: (config: WalletConfig) => void;
}

const WalletIntegration = ({ config, onConfigChange }: WalletIntegrationProps) => {
  const [isValidating, setIsValidating] = useState(false);
  const [validationResults, setValidationResults] = useState({
    paymentWallet: false,
    mintingWallet: false
  });

  const updateConfig = (key: keyof WalletConfig, value: any) => {
    onConfigChange({ ...config, [key]: value });
  };

  const validateWallet = async (address: string, type: 'payment' | 'minting') => {
    setIsValidating(true);
    // Simulate wallet validation
    setTimeout(() => {
      const isValid = address.startsWith('0x') && address.length === 42;
      setValidationResults(prev => ({ ...prev, [`${type}Wallet`]: isValid }));
      setIsValidating(false);
    }, 1000);
  };

  const networks = [
    { value: 'ethereum', label: 'Ethereum Mainnet', fee: '~$15-50' },
    { value: 'polygon', label: 'Polygon', fee: '~$0.01-0.1' },
    { value: 'arbitrum', label: 'Arbitrum', fee: '~$1-5' },
    { value: 'optimism', label: 'Optimism', fee: '~$1-5' },
    { value: 'base', label: 'Base', fee: '~$0.1-1' }
  ];

  return (
    <Card className="border-slate-200 dark:border-slate-700">
      <CardHeader>
        <CardTitle className="flex items-center gap-2 text-lg">
          <Wallet className="h-5 w-5 text-green-500" />
          💰 Wallet & Payment Configuration
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-6">
        {/* Network Selection */}
        <div className="space-y-3">
          <Label htmlFor="network">Blockchain Network</Label>
          <Select value={config.network} onValueChange={(value) => updateConfig('network', value)}>
            <SelectTrigger>
              <SelectValue placeholder="Select blockchain network" />
            </SelectTrigger>
            <SelectContent>
              {networks.map((network) => (
                <SelectItem key={network.value} value={network.value}>
                  <div className="flex justify-between items-center w-full">
                    <span>{network.label}</span>
                    <Badge variant="outline" className="ml-2 text-xs">
                      {network.fee}
                    </Badge>
                  </div>
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        {/* Payment Wallet */}
        <div className="space-y-3">
          <div className="flex items-center gap-2">
            <DollarSign className="h-4 w-4 text-green-500" />
            <Label htmlFor="payment-wallet">Payment Reception Wallet</Label>
          </div>
          <div className="flex gap-2">
            <Input
              id="payment-wallet"
              placeholder="0x... (Your external wallet address)"
              value={config.paymentWallet}
              onChange={(e) => updateConfig('paymentWallet', e.target.value)}
              className="flex-1"
            />
            <Button
              variant="outline"
              onClick={() => validateWallet(config.paymentWallet, 'payment')}
              disabled={isValidating || !config.paymentWallet}
              size="sm"
            >
              {isValidating ? '⏳' : '✓'}
            </Button>
          </div>
          {config.paymentWallet && (
            <div className="flex items-center gap-2">
              {validationResults.paymentWallet ? (
                <Badge className="bg-green-100 text-green-700 dark:bg-green-900 dark:text-green-300">
                  <CheckCircle className="h-3 w-3 mr-1" />
                  Valid wallet address
                </Badge>
              ) : (
                <Badge variant="destructive">
                  <AlertCircle className="h-3 w-3 mr-1" />
                  Invalid wallet format
                </Badge>
              )}
            </div>
          )}
        </div>

        {/* Minting Wallet */}
        <div className="space-y-3">
          <div className="flex items-center gap-2">
            <Shield className="h-4 w-4 text-blue-500" />
            <Label htmlFor="minting-wallet">NFT Minting Wallet</Label>
          </div>
          <div className="flex gap-2">
            <Input
              id="minting-wallet"
              placeholder="0x... (Creator's minting wallet)"
              value={config.mintingWallet}
              onChange={(e) => updateConfig('mintingWallet', e.target.value)}
              className="flex-1"
            />
            <Button
              variant="outline"
              onClick={() => validateWallet(config.mintingWallet, 'minting')}
              disabled={isValidating || !config.mintingWallet}
              size="sm"
            >
              {isValidating ? '⏳' : '✓'}
            </Button>
          </div>
          {config.mintingWallet && (
            <div className="flex items-center gap-2">
              {validationResults.mintingWallet ? (
                <Badge className="bg-green-100 text-green-700 dark:bg-green-900 dark:text-green-300">
                  <CheckCircle className="h-3 w-3 mr-1" />
                  Valid wallet address
                </Badge>
              ) : (
                <Badge variant="destructive">
                  <AlertCircle className="h-3 w-3 mr-1" />
                  Invalid wallet format
                </Badge>
              )}
            </div>
          )}
        </div>

        {/* Minting Fee Configuration */}
        <div className="space-y-3">
          <Label htmlFor="minting-fee">Creator Minting Fee (%)</Label>
          <div className="flex items-center gap-4">
            <Input
              id="minting-fee"
              type="number"
              min="0"
              max="5"
              step="0.1"
              value={config.mintingFeePercentage}
              onChange={(e) => updateConfig('mintingFeePercentage', parseFloat(e.target.value) || 0)}
              className="w-32"
            />
            <Badge variant="secondary" className="bg-blue-100 text-blue-700 dark:bg-blue-900 dark:text-blue-300">
              {config.mintingFeePercentage}% of ticket price
            </Badge>
          </div>
          <p className="text-sm text-muted-foreground">
            This fee covers NFT minting costs and is paid by the creator from ticket sales
          </p>
        </div>

        {/* Configuration Summary */}
        <div className="bg-gradient-to-r from-green-50 to-blue-50 dark:from-slate-800 dark:to-slate-700 p-4 rounded-lg">
          <h4 className="font-semibold mb-3 text-foreground">🔧 Configuration Summary</h4>
          <div className="space-y-2 text-sm">
            <div className="flex justify-between">
              <span>Network:</span>
              <Badge variant="outline">{networks.find(n => n.value === config.network)?.label || 'Not selected'}</Badge>
            </div>
            <div className="flex justify-between">
              <span>Payment Wallet:</span>
              <span className="font-mono text-xs">
                {config.paymentWallet ? `${config.paymentWallet.slice(0, 6)}...${config.paymentWallet.slice(-4)}` : 'Not set'}
              </span>
            </div>
            <div className="flex justify-between">
              <span>Minting Wallet:</span>
              <span className="font-mono text-xs">
                {config.mintingWallet ? `${config.mintingWallet.slice(0, 6)}...${config.mintingWallet.slice(-4)}` : 'Not set'}
              </span>
            </div>
            <div className="flex justify-between">
              <span>Creator Fee:</span>
              <Badge className="bg-orange-100 text-orange-700 dark:bg-orange-900 dark:text-orange-300">
                {config.mintingFeePercentage}%
              </Badge>
            </div>
          </div>
        </div>

        {/* Important Notes */}
        <div className="bg-yellow-50 dark:bg-yellow-900/20 p-4 rounded-lg border border-yellow-200 dark:border-yellow-800">
          <div className="flex items-start gap-2">
            <AlertCircle className="h-5 w-5 text-yellow-600 dark:text-yellow-400 flex-shrink-0 mt-0.5" />
            <div className="space-y-2 text-sm">
              <p className="font-medium text-yellow-800 dark:text-yellow-200">Important Notes:</p>
              <ul className="list-disc list-inside space-y-1 text-yellow-700 dark:text-yellow-300">
                <li>NFTs will be minted from the creator's wallet ensuring authenticity</li>
                <li>Payments go directly to your external wallet (no platform custody)</li>
                <li>Minting fees are automatically deducted from ticket sales</li>
                <li>Gas fees for distribution are covered by the platform</li>
              </ul>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export default WalletIntegration;
