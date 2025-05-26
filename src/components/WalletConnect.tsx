
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Wallet, Smartphone, Globe } from "lucide-react";

const WalletConnect = () => {
  const [isConnecting, setIsConnecting] = useState(false);

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
      setIsConnecting(false);
      console.log(`Connected to ${walletType}!`);
    }, 2000);
  };

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
        <div className="text-center text-sm text-gray-500">
          By connecting, you agree to our Terms of Service
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default WalletConnect;
