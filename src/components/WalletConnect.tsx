
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Wallet, Smartphone, Globe, Mail, Shield, Gift } from "lucide-react";

interface WalletConnectProps {
  onWalletConnected?: (walletAddress: string, walletType: string) => void;
  showBenefits?: boolean;
}

const WalletConnect = ({ onWalletConnected, showBenefits = true }: WalletConnectProps) => {
  const [isConnecting, setIsConnecting] = useState(false);
  const [connectedWallet, setConnectedWallet] = useState<string | null>(null);

  const walletOptions = [
    {
      name: "TON Wallet",
      icon: "💎",
      description: "Connect with TON blockchain",
      action: () => handleWalletConnect("ton")
    },
    {
      name: "MetaMask",
      icon: "🦊",
      description: "Most popular Ethereum wallet",
      action: () => handleWalletConnect("metamask")
    },
    {
      name: "WalletConnect",
      icon: "🔗",
      description: "Connect any mobile wallet",
      action: () => handleWalletConnect("walletconnect")
    },
    {
      name: "Coinbase Wallet",
      icon: "🟦",
      description: "Easy and secure",
      action: () => handleWalletConnect("coinbase")
    }
  ];

  const handleWalletConnect = async (walletType: string) => {
    setIsConnecting(true);
    console.log(`Connecting to ${walletType}...`);
    
    // Simulate connection delay
    setTimeout(() => {
      const mockAddress = `0x${Math.random().toString(16).substr(2, 40)}`;
      setConnectedWallet(mockAddress);
      setIsConnecting(false);
      onWalletConnected?.(mockAddress, walletType);
      console.log(`Connected to ${walletType}! Address: ${mockAddress}`);
    }, 2000);
  };

  if (connectedWallet) {
    return (
      <div className="flex items-center gap-2">
        <Badge className="bg-green-100 text-green-700 dark:bg-green-900 dark:text-green-300">
          <Wallet className="h-3 w-3 mr-1" />
          Connected
        </Badge>
        <span className="text-xs font-mono">
          {connectedWallet.slice(0, 6)}...{connectedWallet.slice(-4)}
        </span>
      </div>
    );
  }

  return (
    <Dialog>
      <DialogTrigger asChild>
        <Button 
          variant="outline" 
          className="border-blue-200 hover:bg-blue-50 group transition-all duration-300 hover:scale-105"
        >
          <Wallet className="mr-2 h-4 w-4 group-hover:rotate-12 transition-transform" />
          Connect Wallet
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle className="text-center text-xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
            Connect Your Wallet
          </DialogTitle>
        </DialogHeader>
        
        {showBenefits && (
          <div className="mb-4 p-3 bg-gradient-to-r from-purple-50 to-blue-50 dark:from-slate-800 dark:to-slate-700 rounded-lg">
            <h4 className="font-semibold text-sm mb-2 flex items-center gap-1">
              <Gift className="h-4 w-4 text-purple-500" />
              Wallet Benefits
            </h4>
            <ul className="text-xs space-y-1 text-muted-foreground">
              <li>• Own your NFT tickets forever</li>
              <li>• Trade tickets on secondary markets</li>
              <li>• Collect rare event memorabilia</li>
              <li>• Access exclusive holder benefits</li>
            </ul>
          </div>
        )}

        <div className="grid gap-4 py-4">
          {walletOptions.map((wallet, index) => (
            <Button
              key={wallet.name}
              variant="outline"
              className="h-16 p-4 justify-start border-2 hover:border-blue-300 hover:bg-blue-50 transition-all duration-300 hover:scale-102 group"
              onClick={wallet.action}
              disabled={isConnecting}
            >
              <span className="text-2xl mr-4 group-hover:scale-110 transition-transform">{wallet.icon}</span>
              <div className="text-left">
                <div className="font-semibold">{wallet.name}</div>
                <div className="text-sm text-gray-500">{wallet.description}</div>
              </div>
            </Button>
          ))}
        </div>

        <div className="text-center">
          <Button variant="ghost" className="text-sm text-muted-foreground hover:text-foreground">
            <Mail className="h-4 w-4 mr-1" />
            Continue with Email Only
          </Button>
          <p className="text-xs text-muted-foreground mt-2">
            You can connect a wallet later to claim your NFT tickets
          </p>
        </div>

        <div className="text-center text-sm text-gray-500">
          By connecting, you agree to our Terms of Service
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default WalletConnect;
