
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { CreditCard, Plus, History, Trash2 } from "lucide-react";
import { useState } from "react";

const PaymentMethodsCard = () => {
  const [paymentMethods, setPaymentMethods] = useState([
    { id: 1, type: "visa", last4: "4242", expires: "12/25", isDefault: true },
    { id: 2, type: "mastercard", last4: "8888", expires: "09/26", isDefault: false }
  ]);

  const handleAddPaymentMethod = () => {
    // In a real app, this would open a Stripe payment method modal
    console.log("Adding new payment method...");
    alert("Add Payment Method functionality - would integrate with Stripe in production");
  };

  const handleViewBillingHistory = () => {
    // In a real app, this would navigate to billing history or open a modal
    console.log("Viewing billing history...");
    alert("Billing History functionality - would show transaction history in production");
  };

  const handleRemovePaymentMethod = (id: number) => {
    setPaymentMethods(prev => prev.filter(method => method.id !== id));
  };

  const handleSetDefault = (id: number) => {
    setPaymentMethods(prev => 
      prev.map(method => ({ 
        ...method, 
        isDefault: method.id === id 
      }))
    );
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <CreditCard className="h-5 w-5" />
          Payment Methods
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <p className="text-sm text-muted-foreground">
          Manage your payment methods and billing information
        </p>
        
        {paymentMethods.length > 0 && (
          <div className="space-y-3">
            {paymentMethods.map((method) => (
              <div key={method.id} className="flex items-center justify-between p-3 border rounded-lg">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-6 bg-gradient-to-r from-blue-500 to-indigo-500 rounded flex items-center justify-center">
                    <CreditCard className="h-3 w-3 text-white" />
                  </div>
                  <div>
                    <div className="flex items-center gap-2">
                      <span className="font-medium">•••• {method.last4}</span>
                      {method.isDefault && (
                        <Badge variant="default" className="text-xs">Default</Badge>
                      )}
                    </div>
                    <span className="text-sm text-muted-foreground">Expires {method.expires}</span>
                  </div>
                </div>
                <div className="flex gap-2">
                  {!method.isDefault && (
                    <Button 
                      variant="outline" 
                      size="sm"
                      onClick={() => handleSetDefault(method.id)}
                    >
                      Set Default
                    </Button>
                  )}
                  <Button 
                    variant="outline" 
                    size="sm"
                    onClick={() => handleRemovePaymentMethod(method.id)}
                  >
                    <Trash2 className="h-3 w-3" />
                  </Button>
                </div>
              </div>
            ))}
          </div>
        )}
        
        <div className="flex gap-2">
          <Button onClick={handleAddPaymentMethod} className="flex items-center gap-2">
            <Plus className="h-4 w-4" />
            Add Payment Method
          </Button>
          <Button variant="outline" onClick={handleViewBillingHistory} className="flex items-center gap-2">
            <History className="h-4 w-4" />
            View Billing History
          </Button>
        </div>
      </CardContent>
    </Card>
  );
};

export default PaymentMethodsCard;
