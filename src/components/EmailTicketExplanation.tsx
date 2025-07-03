
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Mail, Shield, Smartphone, Gift, ArrowRight } from "lucide-react";

const EmailTicketExplanation = () => {
  const steps = [
    {
      icon: Mail,
      title: "Buy with Email",
      description: "Purchase tickets using just your email and payment method",
      badge: "Easy"
    },
    {
      icon: Shield,
      title: "NFT Created",
      description: "Your ticket is minted as an NFT in the organizer's secure wallet",
      badge: "Secure"
    },
    {
      icon: Smartphone,
      title: "QR Code Entry",
      description: "Receive QR code via email for seamless event entry",
      badge: "Instant"
    },
    {
      icon: Gift,
      title: "Claim Later",
      description: "Optionally connect wallet later to claim your NFT collectible",
      badge: "Optional"
    }
  ];

  return (
    <Card className="border-blue-200 dark:border-blue-700 bg-gradient-to-r from-blue-50 to-indigo-50 dark:from-blue-950 dark:to-indigo-950">
      <CardHeader>
        <CardTitle className="flex items-center gap-2 text-lg">
          <Mail className="h-5 w-5 text-blue-500" />
          How Email Tickets Work as NFTs
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-6">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          {steps.map((step, index) => {
            const IconComponent = step.icon;
            return (
              <div key={index} className="relative">
                <div className="flex flex-col items-center text-center space-y-3 p-4 bg-white dark:bg-slate-800 rounded-lg border">
                  <div className="flex items-center gap-2">
                    <IconComponent className="h-6 w-6 text-blue-500" />
                    <Badge variant="secondary" className="text-xs">
                      {step.badge}
                    </Badge>
                  </div>
                  <h4 className="font-semibold text-sm">{step.title}</h4>
                  <p className="text-xs text-muted-foreground">{step.description}</p>
                </div>
                
                {index < steps.length - 1 && (
                  <ArrowRight className="hidden lg:block absolute -right-2 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                )}
              </div>
            );
          })}
        </div>

        <div className="bg-white dark:bg-slate-800 p-4 rounded-lg border">
          <h4 className="font-semibold mb-3 flex items-center gap-2">
            <Shield className="h-4 w-4 text-green-500" />
            The Best of Both Worlds
          </h4>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
            <div>
              <h5 className="font-medium text-green-600 dark:text-green-400 mb-2">For Normies</h5>
              <ul className="space-y-1 text-muted-foreground">
                <li>• No crypto knowledge needed</li>
                <li>• Familiar email + credit card flow</li>
                <li>• Instant QR code for entry</li>
                <li>• Works on any smartphone</li>
              </ul>
            </div>
            <div>
              <h5 className="font-medium text-purple-600 dark:text-purple-400 mb-2">For Crypto Users</h5>
              <ul className="space-y-1 text-muted-foreground">
                <li>• True NFT ownership available</li>
                <li>• Collectible value and rarity</li>
                <li>• Resale on secondary markets</li>
                <li>• Permanent proof of attendance</li>
              </ul>
            </div>
          </div>
        </div>

        <div className="text-center text-sm text-muted-foreground">
          <p>
            💡 <strong>Pro tip:</strong> Even email-only users get the security benefits of blockchain verification 
            without needing to understand the technology!
          </p>
        </div>
      </CardContent>
    </Card>
  );
};

export default EmailTicketExplanation;
