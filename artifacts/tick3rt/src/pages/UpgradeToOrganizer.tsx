import { useState } from "react";
import { useNavigate } from "react-router-dom";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Check, Zap, Calendar, BarChart3, Shield, Loader2, Star, Users } from "lucide-react";
import { useAuth } from "@/contexts/AuthContext";
import { useToast } from "@/hooks/use-toast";

const UpgradeToOrganizer = () => {
  const navigate = useNavigate();
  const { upgradeToOrganizer, isAuthenticated } = useAuth();
  const { toast } = useToast();
  const [isJoining, setIsJoining] = useState(false);

  const handleJoinFree = async () => {
    setIsJoining(true);
    await new Promise(r => setTimeout(r, 900));
    upgradeToOrganizer();
    toast({ title: "Welcome to Tick3t Organiser! 🎉", description: "Your organiser dashboard is ready." });
    navigate("/organizer-dashboard");
  };

  const starterFeatures = [
    "Create up to 3 events / month",
    "Basic ticket designer",
    "Attendee list & check-in",
    "Standard email support",
    "Public event listing",
  ];

  const proFeatures = [
    "Unlimited events",
    "Advanced analytics & revenue tracking",
    "Custom branding & ticket art",
    "Waitlist & capacity management",
    "Priority 24/7 support",
    "Early access to new features",
    "Revenue goal tracker",
    "Post-event share cards",
  ];

  return (
    <div className="min-h-screen bg-background">
      <Header />

      <main className="container mx-auto px-4 sm:px-6 lg:px-8 py-16 max-w-5xl">

        {/* Hero */}
        <div className="text-center mb-12">
          <Badge className="mb-4 bg-primary/10 text-primary border-primary/20 text-xs font-semibold px-3 py-1">
            <Zap className="h-3 w-3 mr-1" />
            Start for free — no credit card needed
          </Badge>
          <h1 className="text-4xl sm:text-5xl font-black tracking-tight mb-4">
            Become a Tick3t Organiser
          </h1>
          <p className="text-lg text-muted-foreground max-w-xl mx-auto">
            Create events, sell tickets, and grow your audience — free to start, upgrade when you need more.
          </p>
        </div>

        {/* Tier cards */}
        <div className="grid md:grid-cols-2 gap-6 mb-16">

          {/* Starter — Free */}
          <Card className="border-border/60 relative overflow-hidden">
            <div className="absolute top-0 inset-x-0 h-1 bg-primary/30" />
            <CardHeader className="pb-4">
              <div className="flex items-center justify-between">
                <CardTitle className="text-xl font-black">Starter</CardTitle>
                <Badge variant="outline" className="text-xs">Free forever</Badge>
              </div>
              <div className="mt-2">
                <span className="text-4xl font-black">$0</span>
                <span className="text-muted-foreground text-sm ml-1">/ month</span>
              </div>
              <p className="text-sm text-muted-foreground mt-1">
                Everything you need to run your first events.
              </p>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2.5">
                {starterFeatures.map((f) => (
                  <div key={f} className="flex items-center gap-2.5 text-sm">
                    <Check className="h-4 w-4 text-primary shrink-0" />
                    <span>{f}</span>
                  </div>
                ))}
              </div>

              <Button
                className="w-full mt-2"
                onClick={handleJoinFree}
                disabled={isJoining}
              >
                {isJoining ? (
                  <>
                    <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                    Setting up your dashboard…
                  </>
                ) : (
                  "Get Started — It's Free"
                )}
              </Button>
              <p className="text-[11px] text-center text-muted-foreground">
                Instant access · No credit card · Upgrade anytime
              </p>
            </CardContent>
          </Card>

          {/* Pro */}
          <Card className="border-primary/40 relative overflow-hidden shadow-lg shadow-primary/5">
            <div className="absolute top-0 inset-x-0 h-1 bg-gradient-to-r from-primary to-violet-500" />
            <CardHeader className="pb-4">
              <div className="flex items-center justify-between">
                <CardTitle className="text-xl font-black">Pro</CardTitle>
                <Badge className="bg-primary text-primary-foreground text-xs">
                  <Star className="h-3 w-3 mr-1" />
                  Most popular
                </Badge>
              </div>
              <div className="mt-2">
                <span className="text-4xl font-black">$29</span>
                <span className="text-muted-foreground text-sm ml-1">/ month</span>
              </div>
              <p className="text-sm text-muted-foreground mt-1">
                Advanced tools for serious event organisers.
              </p>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2.5">
                {proFeatures.map((f) => (
                  <div key={f} className="flex items-center gap-2.5 text-sm">
                    <Check className="h-4 w-4 text-primary shrink-0" />
                    <span>{f}</span>
                  </div>
                ))}
              </div>

              <Button
                variant="outline"
                className="w-full mt-2 border-primary/30 hover:bg-primary/5"
                onClick={() => {
                  toast({ title: "Pro plan coming soon", description: "Start free and we'll notify you when Pro launches." });
                }}
              >
                Upgrade to Pro
              </Button>
              <p className="text-[11px] text-center text-muted-foreground">
                7-day free trial · Cancel anytime
              </p>
            </CardContent>
          </Card>
        </div>

        {/* Social proof */}
        <div className="text-center space-y-4">
          <div className="flex justify-center gap-8 text-sm text-muted-foreground flex-wrap">
            <span className="flex items-center gap-1.5"><Users className="h-4 w-4" /> 10,000+ organisers</span>
            <span className="flex items-center gap-1.5"><Calendar className="h-4 w-4" /> 50,000+ events created</span>
            <span className="flex items-center gap-1.5"><Shield className="h-4 w-4" /> NFT-verified tickets</span>
            <span className="flex items-center gap-1.5"><BarChart3 className="h-4 w-4" /> Keep 95% of revenue</span>
          </div>
        </div>

      </main>

      <Footer />
    </div>
  );
};

export default UpgradeToOrganizer;
