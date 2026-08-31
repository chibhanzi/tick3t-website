import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Switch } from "@/components/ui/switch";
import { Button } from "@/components/ui/button";
import { AlertTriangle, Check, Clock, ExternalLink, Fingerprint, Info, Lightbulb, QrCode, Shield, Users, Zap } from "lucide-react";
import { useTheme } from "next-themes";
import Tick3tMark from "./Tick3tMark";
import vouchLight from "@/assets/vouch_light.png";
import vouchDark from "@/assets/vouch_dark.png";
import { VOUCH_PLAY_STORE_URL } from "@/lib/vouch";

export interface TicketGenerationConfig {
  method: 'batch' | 'realtime' | 'limited';
  batchSize?: number;
  realtimeBuffer?: number;
  limitedQuantity?: number;
  vouchIntegration: {
    enabled: boolean;
    validatorWallets: string[];
    multiSigRequired: boolean;
    biometricAuth: boolean;
    qrCodeValidation: boolean;
    offlineValidation: boolean;
  };
  blockchainSecurity: {
    smartContractValidation: boolean;
    merkleTreeProof: boolean;
    timestampValidation: boolean;
    walletSignatureRequired: boolean;
  };
}

interface TicketGenerationMethodsProps {
  config: TicketGenerationConfig;
  onConfigChange: (config: TicketGenerationConfig) => void;
}

const TicketGenerationMethods = ({ config, onConfigChange }: TicketGenerationMethodsProps) => {
  const { theme } = useTheme();
  const updateConfig = (updates: Partial<TicketGenerationConfig>) => {
    onConfigChange({ ...config, ...updates });
  };

  const updateVouchConfig = (updates: Partial<TicketGenerationConfig['vouchIntegration']>) => {
    onConfigChange({
      ...config,
      vouchIntegration: { ...config.vouchIntegration, ...updates }
    });
  };

  const updateBlockchainConfig = (updates: Partial<TicketGenerationConfig['blockchainSecurity']>) => {
    onConfigChange({
      ...config,
      blockchainSecurity: { ...config.blockchainSecurity, ...updates }
    });
  };

  const methods = [
    {
      id: 'batch',
      title: 'Batch Generation',
      description: 'Generate all tickets at once when event is created',
      icon: Users,
      pros: ['Faster sales', 'Immediate availability', 'Lower gas costs', 'Better for Vouch validation'],
      cons: ['Fixed supply', 'Storage costs'],
      recommended: 'Known attendee count'
    },
    {
      id: 'realtime',
      title: 'Real-time Generation',
      description: 'Generate tickets as they are purchased',
      icon: Zap,
      pros: ['Flexible supply', 'Lower upfront costs', 'Dynamic pricing', 'Live blockchain validation'],
      cons: ['Higher gas per ticket', 'Potential delays'],
      recommended: 'Unknown attendee count'
    },
    {
      id: 'limited',
      title: 'Limited Release',
      description: 'Generate tickets in small batches as demand grows',
      icon: Clock,
      pros: ['Scarcity marketing', 'Demand testing', 'Controlled supply', 'Enhanced security'],
      cons: ['Complex management', 'Potential sellouts'],
      recommended: 'Exclusive events'
    }
  ];
  const vouchLogo = theme === "dark" ? vouchDark : vouchLight;

  return (
    <div className="space-y-6">
      <Card className="border-slate-200 dark:border-slate-700">
        <CardHeader>
          <CardTitle className="flex items-center gap-2 text-lg">
            <Tick3tMark className="h-5 w-5" />
            Ticket Generation Method
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
                          <div className="mb-1 flex items-center gap-1 text-xs font-medium text-green-600 dark:text-green-400">
                            <Check className="h-3.5 w-3.5" />
                            Pros
                          </div>
                          <ul className="text-xs text-muted-foreground space-y-1">
                            {method.pros.map((pro, index) => (
                              <li key={index} className="flex items-start gap-1.5">
                                <Check className="mt-0.5 h-3 w-3 shrink-0 text-green-600 dark:text-green-400" />
                                <span>{pro}</span>
                              </li>
                            ))}
                          </ul>
                        </div>
                        <div>
                          <div className="mb-1 flex items-center gap-1 text-xs font-medium text-orange-600 dark:text-orange-400">
                            <AlertTriangle className="h-3.5 w-3.5" />
                            Cons
                          </div>
                          <ul className="text-xs text-muted-foreground space-y-1">
                            {method.cons.map((con, index) => (
                              <li key={index} className="flex items-start gap-1.5">
                                <AlertTriangle className="mt-0.5 h-3 w-3 shrink-0 text-orange-600 dark:text-orange-400" />
                                <span>{con}</span>
                              </li>
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
        </CardContent>
      </Card>

      {/* Vouch Integration Configuration */}
      <Card className="border-blue-200 dark:border-blue-700 bg-gradient-to-r from-blue-50 to-indigo-50 dark:from-blue-950 dark:to-indigo-950">
        <CardHeader>
          <CardTitle className="flex items-center gap-2 text-lg">
            <Shield className="h-5 w-5 text-blue-500" />
            Vouch Scanner Integration
          </CardTitle>
          <p className="text-sm text-muted-foreground">
            Configure advanced ticket validation with your Vouch scanner system
          </p>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="flex flex-col gap-3 rounded-lg border border-blue-200 bg-white/70 p-3 dark:border-blue-800 dark:bg-slate-900/50 sm:flex-row sm:items-center sm:justify-between">
            <div className="flex min-w-0 items-center gap-3">
              <img src={vouchLogo} alt="Vouch" className="h-8 w-auto max-w-[7rem] shrink-0" />
              <div className="min-w-0">
                <p className="text-sm font-medium">Secure event check-in with Vouch</p>
                <p className="text-xs text-muted-foreground">
                  Scan and validate tickets quickly, even when your venue is offline.
                </p>
              </div>
            </div>
            <Button asChild variant="outline" size="sm" className="shrink-0 self-start sm:self-auto">
              <a
                href={VOUCH_PLAY_STORE_URL}
                target="_blank"
                rel="noopener noreferrer"
                aria-label="Get Vouch on Google Play"
              >
                <ExternalLink className="mr-1 h-3 w-3" />
                Get Vouch on Google Play
              </a>
            </Button>
          </div>

          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <Label htmlFor="vouch-enabled" className="font-medium">Enable Vouch Integration</Label>
              <Badge variant="secondary" className="bg-blue-100 text-blue-700 dark:bg-blue-900 dark:text-blue-300">
                Recommended
              </Badge>
            </div>
            <Switch
              id="vouch-enabled"
              checked={config.vouchIntegration.enabled}
              onCheckedChange={(checked) => updateVouchConfig({ enabled: checked })}
            />
          </div>

          {config.vouchIntegration.enabled && (
            <div className="space-y-4 p-4 bg-white dark:bg-slate-800 rounded-lg border">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <QrCode className="h-4 w-4 text-green-500" />
                    <Label className="text-sm">QR Code Validation</Label>
                  </div>
                  <Switch
                    checked={config.vouchIntegration.qrCodeValidation}
                    onCheckedChange={(checked) => updateVouchConfig({ qrCodeValidation: checked })}
                  />
                </div>

                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <Fingerprint className="h-4 w-4 text-purple-500" />
                    <Label className="text-sm">Biometric Authentication</Label>
                  </div>
                  <Switch
                    checked={config.vouchIntegration.biometricAuth}
                    onCheckedChange={(checked) => updateVouchConfig({ biometricAuth: checked })}
                  />
                </div>

                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <Shield className="h-4 w-4 text-orange-500" />
                    <Label className="text-sm">Multi-Signature Required</Label>
                  </div>
                  <Switch
                    checked={config.vouchIntegration.multiSigRequired}
                    onCheckedChange={(checked) => updateVouchConfig({ multiSigRequired: checked })}
                  />
                </div>

                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <Zap className="h-4 w-4 text-red-500" />
                    <Label className="text-sm">Offline Validation</Label>
                  </div>
                  <Switch
                    checked={config.vouchIntegration.offlineValidation}
                    onCheckedChange={(checked) => updateVouchConfig({ offlineValidation: checked })}
                  />
                </div>
              </div>

              <div>
                <Label className="text-sm font-medium mb-2 block">Validator Wallet Addresses</Label>
                <Input
                  placeholder="0x... (comma separated for multiple validators)"
                  value={config.vouchIntegration.validatorWallets.join(', ')}
                  onChange={(e) => updateVouchConfig({ 
                    validatorWallets: e.target.value.split(',').map(addr => addr.trim()).filter(Boolean) 
                  })}
                  className="h-9"
                />
                <p className="text-xs text-muted-foreground mt-1">
                  Add wallet addresses of authorized validators for this event
                </p>
              </div>
            </div>
          )}
        </CardContent>
      </Card>

      {/* Blockchain Security Configuration */}
      <Card className="border-green-200 dark:border-green-700">
        <CardHeader>
          <CardTitle className="flex items-center gap-2 text-lg">
            <Shield className="h-5 w-5 text-green-500" />
            Advanced Blockchain Security
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="flex items-center justify-between">
              <Label className="text-sm">Smart Contract Validation</Label>
              <Switch
                checked={config.blockchainSecurity.smartContractValidation}
                onCheckedChange={(checked) => updateBlockchainConfig({ smartContractValidation: checked })}
              />
            </div>

            <div className="flex items-center justify-between">
              <Label className="text-sm">Merkle Tree Proof</Label>
              <Switch
                checked={config.blockchainSecurity.merkleTreeProof}
                onCheckedChange={(checked) => updateBlockchainConfig({ merkleTreeProof: checked })}
              />
            </div>

            <div className="flex items-center justify-between">
              <Label className="text-sm">Timestamp Validation</Label>
              <Switch
                checked={config.blockchainSecurity.timestampValidation}
                onCheckedChange={(checked) => updateBlockchainConfig({ timestampValidation: checked })}
              />
            </div>

            <div className="flex items-center justify-between">
              <Label className="text-sm">Wallet Signature Required</Label>
              <Switch
                checked={config.blockchainSecurity.walletSignatureRequired}
                onCheckedChange={(checked) => updateBlockchainConfig({ walletSignatureRequired: checked })}
              />
            </div>
          </div>
        </CardContent>
      </Card>

      <div className="bg-gradient-to-r from-blue-50 to-indigo-50 dark:from-slate-800 dark:to-slate-700 p-4 rounded-lg">
        <div className="flex items-start gap-2">
          <Info className="h-4 w-4 text-blue-500 mt-0.5 flex-shrink-0" />
          <div className="text-sm">
            <div className="mb-1 flex items-center gap-2 font-medium">
              <Lightbulb className="h-4 w-4 text-blue-500" />
              Vouch Integration Benefits
            </div>
            <div className="text-muted-foreground">
              {config.vouchIntegration.enabled ? (
                "Your tickets will be fully compatible with Vouch scanners, providing secure blockchain validation, anti-fraud protection, and seamless entry management."
              ) : (
                "Enable Vouch integration for advanced ticket validation, fraud prevention, and professional event management capabilities."
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default TicketGenerationMethods;
