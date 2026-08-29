
import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Switch } from "@/components/ui/switch";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Check, Clock, DollarSign, Gift, Lightbulb, MapPin, QrCode, Shield, Star, Users, Zap } from "lucide-react";
import Tick3tMark from "./Tick3tMark";

export interface TicketFeaturesConfig {
  hasQrCode: boolean;
  hasTransferProtection: boolean;
  hasTimelock: boolean;
  timelockHours: number;
  hasLocationVerification: boolean;
  hasCapacityLimit: boolean;
  capacityLimit: number;
  hasRoyalties: boolean;
  royaltyPercentage: number;
  hasBonusRewards: boolean;
  hasEarlyAccess: boolean;
  earlyAccessHours: number;
}

interface TicketFeaturesProps {
  features: TicketFeaturesConfig;
  onFeaturesChange: (features: TicketFeaturesConfig) => void;
}

const TicketFeatures = ({ features, onFeaturesChange }: TicketFeaturesProps) => {
  const updateFeature = (key: keyof TicketFeaturesConfig, value: any) => {
    onFeaturesChange({ ...features, [key]: value });
  };

  return (
    <Card className="border-slate-200 dark:border-slate-700">
      <CardHeader>
        <CardTitle className="flex items-center gap-2 text-lg">
          <Tick3tMark className="h-5 w-5" />
          Ticket Features & Security
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-6">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {/* QR Code Feature */}
          <div className="space-y-3">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <QrCode className="h-4 w-4 text-blue-500" />
                <Label htmlFor="qr-code">QR Code Verification</Label>
              </div>
              <Switch
                id="qr-code"
                checked={features.hasQrCode}
                onCheckedChange={(checked) => updateFeature('hasQrCode', checked)}
              />
            </div>
            {features.hasQrCode && (
              <Badge variant="secondary" className="bg-blue-100 text-blue-700 dark:bg-blue-900 dark:text-blue-300">
                <span className="inline-flex items-center gap-1">
                  <Check className="h-3 w-3" />
                  Unique QR codes for entry verification
                </span>
              </Badge>
            )}
          </div>

          {/* Transfer Protection */}
          <div className="space-y-3">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <Shield className="h-4 w-4 text-green-500" />
                <Label htmlFor="transfer-protection">Transfer Protection</Label>
              </div>
              <Switch
                id="transfer-protection"
                checked={features.hasTransferProtection}
                onCheckedChange={(checked) => updateFeature('hasTransferProtection', checked)}
              />
            </div>
            {features.hasTransferProtection && (
              <Badge variant="secondary" className="bg-green-100 text-green-700 dark:bg-green-900 dark:text-green-300">
                <span className="inline-flex items-center gap-1">
                  <Shield className="h-3 w-3" />
                  Prevents unauthorized transfers
                </span>
              </Badge>
            )}
          </div>

          {/* Time Lock */}
          <div className="space-y-3">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <Clock className="h-4 w-4 text-orange-500" />
                <Label htmlFor="timelock">Transfer Time Lock</Label>
              </div>
              <Switch
                id="timelock"
                checked={features.hasTimelock}
                onCheckedChange={(checked) => updateFeature('hasTimelock', checked)}
              />
            </div>
            {features.hasTimelock && (
              <div className="space-y-2">
                <Input
                  type="number"
                  placeholder="Hours"
                  value={features.timelockHours}
                  onChange={(e) => updateFeature('timelockHours', parseInt(e.target.value) || 0)}
                  className="h-8"
                />
                <Badge variant="secondary" className="bg-orange-100 text-orange-700 dark:bg-orange-900 dark:text-orange-300">
                  <span className="inline-flex items-center gap-1">
                    <Clock className="h-3 w-3" />
                    {features.timelockHours}h cooldown before transfers
                  </span>
                </Badge>
              </div>
            )}
          </div>

          {/* Location Verification */}
          <div className="space-y-3">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <MapPin className="h-4 w-4 text-purple-500" />
                <Label htmlFor="location-verification">Location Verification</Label>
              </div>
              <Switch
                id="location-verification"
                checked={features.hasLocationVerification}
                onCheckedChange={(checked) => updateFeature('hasLocationVerification', checked)}
              />
            </div>
            {features.hasLocationVerification && (
              <Badge variant="secondary" className="bg-purple-100 text-purple-700 dark:bg-purple-900 dark:text-purple-300">
                <span className="inline-flex items-center gap-1">
                  <MapPin className="h-3 w-3" />
                  GPS verification required for entry
                </span>
              </Badge>
            )}
          </div>

          {/* Capacity Limit */}
          <div className="space-y-3">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <Users className="h-4 w-4 text-indigo-500" />
                <Label htmlFor="capacity-limit">Capacity Limit Control</Label>
              </div>
              <Switch
                id="capacity-limit"
                checked={features.hasCapacityLimit}
                onCheckedChange={(checked) => updateFeature('hasCapacityLimit', checked)}
              />
            </div>
            {features.hasCapacityLimit && (
              <div className="space-y-2">
                <Input
                  type="number"
                  placeholder="Max tickets per wallet"
                  value={features.capacityLimit}
                  onChange={(e) => updateFeature('capacityLimit', parseInt(e.target.value) || 1)}
                  className="h-8"
                />
                <Badge variant="secondary" className="bg-indigo-100 text-indigo-700 dark:bg-indigo-900 dark:text-indigo-300">
                  <span className="inline-flex items-center gap-1">
                    <Users className="h-3 w-3" />
                    Max {features.capacityLimit} tickets per wallet
                  </span>
                </Badge>
              </div>
            )}
          </div>

          {/* Royalties */}
          <div className="space-y-3">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <Star className="h-4 w-4 text-yellow-500" />
                <Label htmlFor="royalties">Creator Royalties</Label>
              </div>
              <Switch
                id="royalties"
                checked={features.hasRoyalties}
                onCheckedChange={(checked) => updateFeature('hasRoyalties', checked)}
              />
            </div>
            {features.hasRoyalties && (
              <div className="space-y-2">
                <Input
                  type="number"
                  placeholder="Royalty %"
                  value={features.royaltyPercentage}
                  onChange={(e) => updateFeature('royaltyPercentage', parseFloat(e.target.value) || 0)}
                  className="h-8"
                  max="10"
                  step="0.5"
                />
                <Badge variant="secondary" className="bg-yellow-100 text-yellow-700 dark:bg-yellow-900 dark:text-yellow-300">
                  <span className="inline-flex items-center gap-1">
                    <DollarSign className="h-3 w-3" />
                    {features.royaltyPercentage}% royalty on resales
                  </span>
                </Badge>
              </div>
            )}
          </div>

          {/* Bonus Rewards */}
          <div className="space-y-3">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <Gift className="h-4 w-4 text-pink-500" />
                <Label htmlFor="bonus-rewards">Bonus Rewards Program</Label>
              </div>
              <Switch
                id="bonus-rewards"
                checked={features.hasBonusRewards}
                onCheckedChange={(checked) => updateFeature('hasBonusRewards', checked)}
              />
            </div>
            {features.hasBonusRewards && (
              <Badge variant="secondary" className="bg-pink-100 text-pink-700 dark:bg-pink-900 dark:text-pink-300">
                <span className="inline-flex items-center gap-1">
                  <Gift className="h-3 w-3" />
                  Loyalty rewards for attendees
                </span>
              </Badge>
            )}
          </div>

          {/* Early Access */}
          <div className="space-y-3">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <Zap className="h-4 w-4 text-red-500" />
                <Label htmlFor="early-access">Early Access Period</Label>
              </div>
              <Switch
                id="early-access"
                checked={features.hasEarlyAccess}
                onCheckedChange={(checked) => updateFeature('hasEarlyAccess', checked)}
              />
            </div>
            {features.hasEarlyAccess && (
              <div className="space-y-2">
                <Input
                  type="number"
                  placeholder="Hours before public sale"
                  value={features.earlyAccessHours}
                  onChange={(e) => updateFeature('earlyAccessHours', parseInt(e.target.value) || 0)}
                  className="h-8"
                />
                <Badge variant="secondary" className="bg-red-100 text-red-700 dark:bg-red-900 dark:text-red-300">
                  <span className="inline-flex items-center gap-1">
                    <Zap className="h-3 w-3" />
                    {features.earlyAccessHours}h early access for VIPs
                  </span>
                </Badge>
              </div>
            )}
          </div>
        </div>

        <div className="bg-gradient-to-r from-blue-50 to-indigo-50 dark:from-slate-800 dark:to-slate-700 p-4 rounded-lg">
          <h4 className="mb-2 flex items-center gap-2 font-semibold text-foreground">
            <Lightbulb className="h-4 w-4 text-blue-500" />
            Feature Summary
          </h4>
          <div className="flex flex-wrap gap-2">
            {Object.entries(features).map(([key, value]) => {
              if (typeof value === 'boolean' && value) {
                const labels = {
                  hasQrCode: { label: 'QR Verification', icon: QrCode },
                  hasTransferProtection: { label: 'Transfer Protection', icon: Shield },
                  hasTimelock: { label: 'Time Lock', icon: Clock },
                  hasLocationVerification: { label: 'Location Check', icon: MapPin },
                  hasCapacityLimit: { label: 'Capacity Control', icon: Users },
                  hasRoyalties: { label: 'Royalties', icon: DollarSign },
                  hasBonusRewards: { label: 'Rewards', icon: Gift },
                  hasEarlyAccess: { label: 'Early Access', icon: Zap }
                };
                const feature = labels[key as keyof typeof labels];
                const FeatureIcon = feature.icon;
                return (
                  <Badge key={key} variant="outline" className="text-xs">
                    <FeatureIcon className="mr-1 h-3 w-3" />
                    {feature.label}
                  </Badge>
                );
              }
              return null;
            })}
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export default TicketFeatures;
