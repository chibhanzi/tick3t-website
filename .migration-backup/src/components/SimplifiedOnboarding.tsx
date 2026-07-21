
import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Badge } from "@/components/ui/badge";
import { CheckCircle, Circle, ArrowRight, Sparkles, Zap, Globe, Shield } from "lucide-react";

interface OnboardingStep {
  id: string;
  title: string;
  description: string;
  required: boolean;
  completed: boolean;
}

interface SimplifiedOnboardingProps {
  onComplete: (config: any) => void;
}

const SimplifiedOnboarding = ({ onComplete }: SimplifiedOnboardingProps) => {
  const [currentStep, setCurrentStep] = useState(0);
  const [config, setConfig] = useState({
    eventName: '',
    paymentMethod: 'hybrid',
    walletConnected: false,
    stripeConnected: false
  });

  const steps: OnboardingStep[] = [
    {
      id: 'welcome',
      title: 'Welcome to Tick3rt',
      description: 'Create professional NFT tickets in minutes',
      required: true,
      completed: false
    },
    {
      id: 'payment-setup',
      title: 'Payment Setup',
      description: 'Choose how customers will pay',
      required: true,
      completed: false
    },
    {
      id: 'wallet-connection',
      title: 'Wallet Connection',
      description: 'Connect your wallet for ticket minting',
      required: false,
      completed: config.walletConnected
    },
    {
      id: 'ready',
      title: 'You\'re Ready!',
      description: 'Start creating your first event',
      required: true,
      completed: false
    }
  ];

  const handleNext = () => {
    if (currentStep < steps.length - 1) {
      setCurrentStep(currentStep + 1);
    } else {
      onComplete(config);
    }
  };

  const handleSkip = () => {
    if (currentStep === 2) { // Wallet connection step
      setCurrentStep(currentStep + 1);
    }
  };

  const renderStepContent = () => {
    switch (currentStep) {
      case 0:
        return (
          <div className="text-center space-y-6">
            <div className="mx-auto w-20 h-20 bg-gradient-to-br from-blue-500 to-purple-600 rounded-full flex items-center justify-center">
              <Sparkles className="h-10 w-10 text-white" />
            </div>
            <div>
              <h2 className="text-2xl font-bold mb-2">Welcome to Tick3rt</h2>
              <p className="text-muted-foreground">
                The easiest way to create professional NFT tickets for your events
              </p>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div className="p-4 border rounded-lg">
                <Zap className="h-8 w-8 text-yellow-500 mx-auto mb-2" />
                <h3 className="font-semibold mb-1">Quick Setup</h3>
                <p className="text-sm text-muted-foreground">Get started in under 5 minutes</p>
              </div>
              <div className="p-4 border rounded-lg">
                <Globe className="h-8 w-8 text-blue-500 mx-auto mb-2" />
                <h3 className="font-semibold mb-1">Web2 + Web3</h3>
                <p className="text-sm text-muted-foreground">Accept all payment methods</p>
              </div>
              <div className="p-4 border rounded-lg">
                <Shield className="h-8 w-8 text-green-500 mx-auto mb-2" />
                <h3 className="font-semibold mb-1">Secure</h3>
                <p className="text-sm text-muted-foreground">Blockchain-verified tickets</p>
              </div>
            </div>
          </div>
        );

      case 1:
        return (
          <div className="space-y-6">
            <div className="text-center">
              <h2 className="text-2xl font-bold mb-2">How should customers pay?</h2>
              <p className="text-muted-foreground">
                Choose the payment methods that work best for your audience
              </p>
            </div>
            
            <div className="space-y-4">
              <Card 
                className={`cursor-pointer transition-all ${
                  config.paymentMethod === 'hybrid' 
                    ? 'border-blue-500 bg-blue-50 dark:bg-blue-950' 
                    : 'hover:border-gray-300'
                }`}
                onClick={() => setConfig({ ...config, paymentMethod: 'hybrid' })}
              >
                <CardContent className="p-4">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-3">
                      <Globe className="h-6 w-6 text-blue-500" />
                      <div>
                        <div className="flex items-center gap-2">
                          <h3 className="font-semibold">Smart Payments (Recommended)</h3>
                          <Badge className="bg-green-500">Best Choice</Badge>
                        </div>
                        <p className="text-sm text-muted-foreground">Credit cards, PayPal, Apple Pay + Crypto</p>
                      </div>
                    </div>
                    <div className={`w-5 h-5 rounded-full border-2 ${
                      config.paymentMethod === 'hybrid' 
                        ? 'border-blue-500 bg-blue-500' 
                        : 'border-gray-300'
                    }`}>
                      {config.paymentMethod === 'hybrid' && (
                        <div className="w-full h-full rounded-full bg-white scale-50" />
                      )}
                    </div>
                  </div>
                </CardContent>
              </Card>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <Card 
                  className={`cursor-pointer transition-all ${
                    config.paymentMethod === 'traditional' 
                      ? 'border-blue-500 bg-blue-50 dark:bg-blue-950' 
                      : 'hover:border-gray-300'
                  }`}
                  onClick={() => setConfig({ ...config, paymentMethod: 'traditional' })}
                >
                  <CardContent className="p-4">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-3">
                        <div className="w-6 h-6 bg-gray-100 rounded flex items-center justify-center">💳</div>
                        <div>
                          <h3 className="font-semibold">Traditional Only</h3>
                          <p className="text-sm text-muted-foreground">Cards & PayPal</p>
                        </div>
                      </div>
                      <div className={`w-5 h-5 rounded-full border-2 ${
                        config.paymentMethod === 'traditional' 
                          ? 'border-blue-500 bg-blue-500' 
                          : 'border-gray-300'
                      }`}>
                        {config.paymentMethod === 'traditional' && (
                          <div className="w-full h-full rounded-full bg-white scale-50" />
                        )}
                      </div>
                    </div>
                  </CardContent>
                </Card>

                <Card 
                  className={`cursor-pointer transition-all ${
                    config.paymentMethod === 'crypto' 
                      ? 'border-blue-500 bg-blue-50 dark:bg-blue-950' 
                      : 'hover:border-gray-300'
                  }`}
                  onClick={() => setConfig({ ...config, paymentMethod: 'crypto' })}
                >
                  <CardContent className="p-4">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-3">
                        <div className="w-6 h-6 bg-gray-100 rounded flex items-center justify-center">⚡</div>
                        <div>
                          <h3 className="font-semibold">Crypto Only</h3>
                          <p className="text-sm text-muted-foreground">ETH, USDC, etc.</p>
                        </div>
                      </div>
                      <div className={`w-5 h-5 rounded-full border-2 ${
                        config.paymentMethod === 'crypto' 
                          ? 'border-blue-500 bg-blue-500' 
                          : 'border-gray-300'
                      }`}>
                        {config.paymentMethod === 'crypto' && (
                          <div className="w-full h-full rounded-full bg-white scale-50" />
                        )}
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </div>
            </div>
          </div>
        );

      case 2:
        return (
          <div className="space-y-6">
            <div className="text-center">
              <h2 className="text-2xl font-bold mb-2">Connect Your Wallet</h2>
              <p className="text-muted-foreground">
                Connect a wallet to mint NFT tickets on the blockchain
              </p>
            </div>
            
            <div className="flex flex-col items-center space-y-4">
              <div className="w-32 h-32 border-2 border-dashed border-gray-300 rounded-lg flex items-center justify-center">
                <div className="text-center">
                  <div className="w-8 h-8 bg-gray-200 rounded mx-auto mb-2"></div>
                  <p className="text-sm text-muted-foreground">Wallet Icon</p>
                </div>
              </div>
              
              <Button 
                size="lg" 
                onClick={() => setConfig({ ...config, walletConnected: true })}
                className="w-full max-w-sm"
              >
                Connect Wallet
              </Button>
              
              <p className="text-xs text-muted-foreground text-center">
                Supports MetaMask, WalletConnect, Coinbase Wallet, and more
              </p>
            </div>
          </div>
        );

      case 3:
        return (
          <div className="text-center space-y-6">
            <div className="mx-auto w-20 h-20 bg-gradient-to-br from-green-500 to-emerald-600 rounded-full flex items-center justify-center">
              <CheckCircle className="h-10 w-10 text-white" />
            </div>
            <div>
              <h2 className="text-2xl font-bold mb-2">You're All Set!</h2>
              <p className="text-muted-foreground">
                Your Tick3rt account is ready. Start creating your first event.
              </p>
            </div>
            
            <div className="bg-green-50 dark:bg-green-950 p-4 rounded-lg border border-green-200 dark:border-green-800">
              <h3 className="font-semibold text-green-800 dark:text-green-200 mb-2">What's Next?</h3>
              <ul className="text-sm text-green-700 dark:text-green-300 space-y-1">
                <li>• Create your first event with our designer</li>
                <li>• Customize professional ticket designs</li>
                <li>• Set pricing and payment options</li>
                <li>• Launch and start selling tickets</li>
              </ul>
            </div>
          </div>
        );

      default:
        return null;
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-50 dark:from-slate-950 dark:via-slate-900 dark:to-slate-800 flex items-center justify-center p-4">
      <Card className="w-full max-w-2xl">
        <CardHeader>
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center space-x-2">
              {steps.map((step, index) => (
                <div key={step.id} className="flex items-center">
                  <div className={`w-8 h-8 rounded-full flex items-center justify-center text-sm font-medium ${
                    index <= currentStep 
                      ? 'bg-blue-500 text-white' 
                      : 'bg-gray-200 text-gray-600'
                  }`}>
                    {index < currentStep ? (
                      <CheckCircle className="h-4 w-4" />
                    ) : (
                      index + 1
                    )}
                  </div>
                  {index < steps.length - 1 && (
                    <div className={`w-8 h-1 mx-2 ${
                      index < currentStep ? 'bg-blue-500' : 'bg-gray-200'
                    }`} />
                  )}
                </div>
              ))}
            </div>
            <Badge variant="outline">
              {currentStep + 1} of {steps.length}
            </Badge>
          </div>
        </CardHeader>
        
        <CardContent className="space-y-6">
          {renderStepContent()}
          
          <div className="flex justify-between pt-6">
            <div>
              {currentStep === 2 && (
                <Button variant="outline" onClick={handleSkip}>
                  Skip for now
                </Button>
              )}
            </div>
            
            <Button onClick={handleNext} className="flex items-center gap-2">
              {currentStep === steps.length - 1 ? (
                <>
                  <Sparkles className="h-4 w-4" />
                  Create First Event
                </>
              ) : (
                <>
                  Continue
                  <ArrowRight className="h-4 w-4" />
                </>
              )}
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default SimplifiedOnboarding;
