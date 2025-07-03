
import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Users, CreditCard, Calendar, Bell, DollarSign } from "lucide-react";

interface PaymentOptionsProps {
  eventPrice: number;
  eventTitle: string;
}

const PaymentOptions = ({ eventPrice, eventTitle }: PaymentOptionsProps) => {
  const [paymentMethod, setPaymentMethod] = useState("full");
  const [groupSize, setGroupSize] = useState(2);
  const [priceAlert, setPriceAlert] = useState(false);

  const installmentOptions = [
    { id: "2-month", label: "2 Monthly Payments", amount: eventPrice / 2, fee: 5 },
    { id: "3-month", label: "3 Monthly Payments", amount: eventPrice / 3, fee: 8 },
    { id: "4-month", label: "4 Monthly Payments", amount: eventPrice / 4, fee: 12 }
  ];

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <DollarSign className="h-5 w-5" />
          Payment Options
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-6">
        <RadioGroup value={paymentMethod} onValueChange={setPaymentMethod}>
          {/* Full Payment */}
          <div className="flex items-center space-x-2 p-3 border rounded-lg">
            <RadioGroupItem value="full" id="full" />
            <div className="flex-1">
              <Label htmlFor="full" className="font-medium">Pay in Full</Label>
              <p className="text-sm text-muted-foreground">Pay ${eventPrice.toFixed(2)} now</p>
            </div>
            <Badge variant="secondary">No Fees</Badge>
          </div>

          {/* Group Buying */}
          <div className="flex items-center space-x-2 p-3 border rounded-lg">
            <RadioGroupItem value="group" id="group" />
            <div className="flex-1">
              <Label htmlFor="group" className="font-medium flex items-center gap-1">
                <Users className="h-4 w-4" />
                Group Buying
              </Label>
              <p className="text-sm text-muted-foreground">
                Split cost with friends - ${(eventPrice / groupSize).toFixed(2)} per person
              </p>
              {paymentMethod === "group" && (
                <div className="mt-2 flex items-center gap-2">
                  <Label htmlFor="group-size" className="text-xs">Group Size:</Label>
                  <Input
                    id="group-size"
                    type="number"
                    min="2"
                    max="10"
                    value={groupSize}
                    onChange={(e) => setGroupSize(parseInt(e.target.value) || 2)}
                    className="w-16 h-6 text-xs"
                  />
                </div>
              )}
            </div>
            <Badge className="bg-green-100 text-green-700">Save Money</Badge>
          </div>

          {/* Payment Plans */}
          <div className="space-y-2">
            <Label className="font-medium flex items-center gap-1">
              <Calendar className="h-4 w-4" />
              Payment Plans
            </Label>
            {installmentOptions.map((option) => (
              <div key={option.id} className="flex items-center space-x-2 p-3 border rounded-lg ml-6">
                <RadioGroupItem value={option.id} id={option.id} />
                <div className="flex-1">
                  <Label htmlFor={option.id} className="font-medium">{option.label}</Label>
                  <p className="text-sm text-muted-foreground">
                    ${option.amount.toFixed(2)}/month + ${option.fee} processing fee
                  </p>
                </div>
                <Badge variant="outline">${(eventPrice + option.fee).toFixed(2)} total</Badge>
              </div>
            ))}
          </div>
        </RadioGroup>

        {/* Price Alert */}
        <div className="flex items-center justify-between p-3 border rounded-lg">
          <div className="flex items-center gap-2">
            <Bell className="h-4 w-4" />
            <div>
              <Label className="font-medium">Price Drop Alert</Label>
              <p className="text-sm text-muted-foreground">Get notified if the price drops</p>
            </div>
          </div>
          <Button
            variant={priceAlert ? "default" : "outline"}
            size="sm"
            onClick={() => setPriceAlert(!priceAlert)}
          >
            {priceAlert ? "Enabled" : "Enable"}
          </Button>
        </div>

        {/* Action Buttons */}
        <div className="flex gap-2">
          <Button className="flex-1">
            <CreditCard className="h-4 w-4 mr-2" />
            {paymentMethod === "full" ? "Buy Now" : 
             paymentMethod === "group" ? "Start Group Buy" : "Set Up Payment Plan"}
          </Button>
          {paymentMethod !== "full" && (
            <Button variant="outline">Learn More</Button>
          )}
        </div>
      </CardContent>
    </Card>
  );
};

export default PaymentOptions;
