
import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Mail, Wallet, Gift, Shield, ArrowRight, CheckCircle, Info } from "lucide-react";
import WalletConnect from "./WalletConnect";

interface TicketClaimFlowProps {
  ticketData: {
    id: string;
    eventTitle: string;
    eventDate: string;
    purchaseEmail: string;
    isNFTClaimed: boolean;
    nftTokenId?: string;
    claimDeadline?: string;
  };
}

const TicketClaimFlow = ({ ticketData }: TicketClaimFlowProps) => {
  const [currentStep, setCurrentStep] = useState<'email' | 'wallet' | 'claiming' | 'claimed'>('email');
  const [connectedWallet, setConnectedWallet] = useState<string | null>(null);
  const [isClaiming, setIsClaiming] = useState(false);

  const handleWalletConnected = (address: string, type: string) => {
    setConnectedWallet(address);
    setCurrentStep('wallet');
  };

  const handleClaimNFT = async () => {
    setIsClaiming(true);
    setCurrentStep('claiming');
    
    // Simulate NFT claiming process
    setTimeout(() => {
      setCurrentStep('claimed');
      setIsClaiming(false);
      console.log(`NFT claimed to wallet: ${connectedWallet}`);
    }, 3000);
  };

  const renderEmailTicketView = () => (
    <Card className="border-blue-200 dark:border-blue-700">
      <CardHeader>
        <CardTitle className="flex items-center gap-2 text-lg">
          <Mail className="h-5 w-5 text-blue-500" />
          Your Email Ticket
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="flex items-center justify-between p-3 bg-blue-50 dark:bg-blue-950 rounded-lg">
          <div>
            <h4 className="font-semibold">{ticketData.eventTitle}</h4>
            <p className="text-sm text-muted-foreground">{ticketData.eventDate}</p>
            <p className="text-xs text-muted-foreground">Sent to: {ticketData.purchaseEmail}</p>
          </div>
          <Badge className="bg-green-100 text-green-700 dark:bg-green-900 dark:text-green-300">
            ✅ Valid Entry
          </Badge>
        </div>

        <Alert>
          <Gift className="h-4 w-4" />
          <AlertDescription>
            <strong>Good news!</strong> Your ticket is also an NFT that you can claim to your wallet. 
            This gives you permanent ownership and potential collectible value.
          </AlertDescription>
        </Alert>

        <div className="space-y-3">
          <h5 className="font-medium">Why claim your NFT?</h5>
          <ul className="text-sm text-muted-foreground space-y-2">
            <li className="flex items-center gap-2">
              <Shield className="h-4 w-4 text-green-500" />
              Permanent proof of attendance
            </li>
            <li className="flex items-center gap-2">
              <Gift className="h-4 w-4 text-purple-500" />
              Collectible value and rarity
            </li>
            <li className="flex items-center gap-2">
              <Wallet className="h-4 w-4 text-blue-500" />
              Trade or transfer to others
            </li>
          </ul>
        </div>

        <div className="flex gap-2">
          <WalletConnect onWalletConnected={handleWalletConnected} />
          <Button variant="outline" size="sm">
            Keep Email Only
          </Button>
        </div>

        {ticketData.claimDeadline && (
          <p className="text-xs text-orange-600 dark:text-orange-400">
            ⏰ Claim deadline: {ticketData.claimDeadline}
          </p>
        )}
      </CardContent>
    </Card>
  );

  const renderWalletConnectedView = () => (
    <Card className="border-green-200 dark:border-green-700">
      <CardHeader>
        <CardTitle className="flex items-center gap-2 text-lg">
          <Wallet className="h-5 w-5 text-green-500" />
          Ready to Claim NFT
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="flex items-center justify-between p-3 bg-green-50 dark:bg-green-950 rounded-lg">
          <div>
            <h4 className="font-semibold">Wallet Connected</h4>
            <p className="text-xs font-mono text-muted-foreground">
              {connectedWallet?.slice(0, 8)}...{connectedWallet?.slice(-6)}
            </p>
          </div>
          <Badge className="bg-green-100 text-green-700 dark:bg-green-900 dark:text-green-300">
            <CheckCircle className="h-3 w-3 mr-1" />
            Connected
          </Badge>
        </div>

        <Alert>
          <Info className="h-4 w-4" />
          <AlertDescription>
            Your NFT ticket will be transferred from the organizer's wallet to your personal wallet. 
            This process is free (gas fees covered by the platform).
          </AlertDescription>
        </Alert>

        <Button onClick={handleClaimNFT} className="w-full" disabled={isClaiming}>
          {isClaiming ? (
            <>⏳ Claiming NFT...</>
          ) : (
            <>
              <Gift className="h-4 w-4 mr-2" />
              Claim My NFT Ticket
              <ArrowRight className="h-4 w-4 ml-2" />
            </>
          )}
        </Button>
      </CardContent>
    </Card>
  );

  const renderClaimingView = () => (
    <Card className="border-purple-200 dark:border-purple-700">
      <CardContent className="p-6 text-center space-y-4">
        <div className="text-4xl">🎫</div>
        <h3 className="text-lg font-semibold">Claiming Your NFT...</h3>
        <div className="space-y-2 text-sm text-muted-foreground">
          <p>✅ Verifying ticket ownership</p>
          <p>⏳ Transferring NFT to your wallet</p>
          <p>⏳ Updating blockchain records</p>
        </div>
        <div className="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-2">
          <div className="bg-purple-500 h-2 rounded-full animate-pulse" style={{ width: '60%' }} />
        </div>
      </CardContent>
    </Card>
  );

  const renderClaimedView = () => (
    <Card className="border-green-200 dark:border-green-700 bg-gradient-to-r from-green-50 to-emerald-50 dark:from-green-950 dark:to-emerald-950">
      <CardContent className="p-6 text-center space-y-4">
        <div className="text-4xl">🎉</div>
        <h3 className="text-lg font-semibold text-green-700 dark:text-green-300">
          NFT Successfully Claimed!
        </h3>
        <p className="text-sm text-muted-foreground">
          Your ticket NFT is now in your wallet and you own it forever!
        </p>
        
        <div className="p-3 bg-white dark:bg-slate-800 rounded-lg border">
          <p className="text-xs text-muted-foreground mb-1">Token ID</p>
          <p className="font-mono text-sm">{ticketData.nftTokenId || '#12345'}</p>
        </div>

        <div className="flex gap-2 justify-center">
          <Button variant="outline" size="sm">
            View in Wallet
          </Button>
          <Button variant="outline" size="sm">
            Share Achievement
          </Button>
        </div>
      </CardContent>
    </Card>
  );

  // Show appropriate view based on current step
  if (currentStep === 'claimed') return renderClaimedView();
  if (currentStep === 'claiming') return renderClaimingView();
  if (currentStep === 'wallet') return renderWalletConnectedView();
  return renderEmailTicketView();
};

export default TicketClaimFlow;
