import { useState } from "react";
import { useNavigate } from "react-router-dom";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Check, Star, Users, Calendar, BarChart3, Shield, Loader2 } from "lucide-react";

const UpgradeToOrganizer = () => {
  const navigate = useNavigate();
  const [isUpgrading, setIsUpgrading] = useState(false);

  const handleUpgrade = async () => {
    setIsUpgrading(true);
    
    // Simulate payment processing
    await new Promise(resolve => setTimeout(resolve, 2000));
    
    // In a real app, this would integrate with Stripe for payment processing
    console.log("Processing organizer upgrade...");
    
    // Show success and redirect to organizer dashboard
    alert("Upgrade successful! Welcome to the organizer platform!");
    navigate("/organizer");
    
    setIsUpgrading(false);
  };

  const features = [
    { icon: Calendar, title: "Unlimited Events", description: "Create and manage unlimited events" },
    { icon: Users, title: "Advanced Analytics", description: "Detailed insights on attendees and sales" },
    { icon: BarChart3, title: "Revenue Tracking", description: "Monitor earnings and financial reports" },
    { icon: Shield, title: "Priority Support", description: "24/7 premium customer support" }
  ];

  const benefits = [
    "Custom event branding",
    "Advanced ticket customization",
    "Real-time sales dashboard",
    "Attendee management tools",
    "Marketing integrations",
    "Revenue analytics",
    "Priority customer support",
    "Early access to new features"
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-50 via-pink-50 to-yellow-50 dark:from-slate-900 dark:via-slate-800 dark:to-slate-900">
      <Header />
      
      <main className="container mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <div className="text-center mb-12">
          <Badge className="mb-4 bg-gradient-to-r from-purple-500 to-pink-500 text-white">
            <Star className="h-3 w-3 mr-1" />
            Organizer Access Required
          </Badge>
          <h1 className="text-4xl font-bold mb-4 bg-gradient-to-r from-purple-600 to-pink-600 bg-clip-text text-transparent">
            Become an Event Organizer
          </h1>
          <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
            Unlock powerful tools to create, manage, and monetize your events with our organizer platform
          </p>
        </div>

        <div className="grid md:grid-cols-2 gap-12 items-center mb-16">
          <div>
            <h2 className="text-2xl font-bold mb-6">Why Choose Organizer Access?</h2>
            <div className="grid grid-cols-2 gap-4">
              {features.map((feature, index) => (
                <Card key={index} className="border-purple-200 hover:shadow-lg transition-shadow">
                  <CardContent className="p-4 text-center">
                    <feature.icon className="h-8 w-8 text-purple-500 mx-auto mb-2" />
                    <h3 className="font-medium text-sm mb-1">{feature.title}</h3>
                    <p className="text-xs text-muted-foreground">{feature.description}</p>
                  </CardContent>
                </Card>
              ))}
            </div>
          </div>

          <Card className="border-purple-200 shadow-xl">
            <CardHeader className="text-center">
              <CardTitle className="text-2xl bg-gradient-to-r from-purple-600 to-pink-600 bg-clip-text text-transparent">
                Organizer Plan
              </CardTitle>
              <div className="text-3xl font-bold">$29<span className="text-lg text-muted-foreground">/month</span></div>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-3">
                {benefits.map((benefit, index) => (
                  <div key={index} className="flex items-center space-x-2">
                    <Check className="h-4 w-4 text-green-500 flex-shrink-0" />
                    <span className="text-sm">{benefit}</span>
                  </div>
                ))}
              </div>
              
              <Button 
                onClick={handleUpgrade}
                disabled={isUpgrading}
                className="w-full bg-gradient-to-r from-purple-500 to-pink-500 hover:from-purple-600 hover:to-pink-600 text-white"
              >
                {isUpgrading ? (
                  <>
                    <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                    Processing...
                  </>
                ) : (
                  'Upgrade to Organizer'
                )}
              </Button>
              
              <p className="text-xs text-center text-muted-foreground">
                7-day free trial • Cancel anytime • No setup fees
              </p>
            </CardContent>
          </Card>
        </div>

        <div className="text-center">
          <h3 className="text-xl font-bold mb-4">Trusted by 10,000+ Event Organizers</h3>
          <p className="text-muted-foreground mb-6">
            Join thousands of successful event organizers who trust our platform
          </p>
          <div className="flex justify-center space-x-4 text-sm text-muted-foreground">
            <span>✨ Easy setup in minutes</span>
            <span>🚀 Start selling immediately</span>
            <span>💰 Keep 95% of revenue</span>
          </div>
        </div>
      </main>

      <Footer />
    </div>
  );
};

export default UpgradeToOrganizer;
