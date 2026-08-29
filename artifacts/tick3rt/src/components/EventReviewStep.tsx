
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { CheckCircle, Calendar, MapPin, DollarSign, Palette, Zap, Users } from "lucide-react";
import PaymentMethodMark from "./pricing/PaymentMethodMark";

interface EventReviewStepProps {
  eventData: any;
  ticketDesign: any;
  generationConfig: any;
  pricingData: any;
  onComplete: () => void;
}

const EventReviewStep = ({ 
  eventData, 
  ticketDesign, 
  generationConfig, 
  pricingData, 
  onComplete 
}: EventReviewStepProps) => {
  return (
    <div className="space-y-6">
      <Card className="border-slate-200 dark:border-slate-700">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <CheckCircle className="h-5 w-5 text-green-500" />
            Review Your Event
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-6">
          {/* Event Information */}
          <div>
            <h3 className="font-semibold mb-3 flex items-center gap-2">
              <Calendar className="h-4 w-4" />
              Event Details
            </h3>
            <div className="grid grid-cols-2 gap-4 text-sm">
              <div>
                <span className="text-muted-foreground">Title:</span>
                <p className="font-medium">{eventData.title}</p>
              </div>
              <div>
                <span className="text-muted-foreground">Category:</span>
                <p className="font-medium capitalize">{eventData.category}</p>
              </div>
              <div>
                <span className="text-muted-foreground">Date:</span>
                <p className="font-medium">{new Date(eventData.date).toLocaleString()}</p>
              </div>
              <div>
                <span className="text-muted-foreground">Location:</span>
                <p className="font-medium">{eventData.location}</p>
              </div>
            </div>
            <div className="mt-3">
              <span className="text-muted-foreground text-sm">Description:</span>
              <p className="text-sm mt-1">{eventData.description}</p>
            </div>
          </div>

          <Separator />

          {/* Pricing Information */}
          <div>
            <h3 className="font-semibold mb-3 flex items-center gap-2">
              <DollarSign className="h-4 w-4" />
              Pricing & Payments
            </h3>
            <div className="grid grid-cols-2 gap-4 text-sm">
              <div>
                <span className="text-muted-foreground">Currency:</span>
                <p className="font-medium">{pricingData.currency}</p>
              </div>
              <div>
                <span className="text-muted-foreground">Price:</span>
                <p className="font-medium">{pricingData.currency === 'USD' ? '$' : ''}{pricingData.price}</p>
              </div>
              {pricingData.earlyBirdPrice && (
                <>
                  <div>
                    <span className="text-muted-foreground">Early Bird:</span>
                    <p className="font-medium">{pricingData.currency === 'USD' ? '$' : ''}{pricingData.earlyBirdPrice}</p>
                  </div>
                  <div>
                    <span className="text-muted-foreground">Early Bird Deadline:</span>
                    <p className="font-medium">{new Date(pricingData.earlyBirdDeadline).toLocaleString()}</p>
                  </div>
                </>
              )}
            </div>
            <div className="mt-3">
              <span className="text-muted-foreground text-sm">Payment Methods:</span>
              <div className="flex flex-wrap gap-2 mt-1">
                {pricingData.acceptedPayments.map((method: string) => (
                  <Badge key={method} variant="secondary" className="gap-1.5 text-xs">
                    <PaymentMethodMark methodId={method} className="h-3.5 w-3.5" compact />
                    {method === "Credit Card" ? "Credit/Debit Card" : method}
                  </Badge>
                ))}
              </div>
            </div>
          </div>

          <Separator />

          {/* Generation Method */}
          <div>
            <h3 className="font-semibold mb-3 flex items-center gap-2">
              <Zap className="h-4 w-4" />
              Ticket Generation
            </h3>
            <div className="text-sm">
              <span className="text-muted-foreground">Method:</span>
              <p className="font-medium capitalize">{generationConfig.method} Generation</p>
              {generationConfig.method === 'batch' && generationConfig.batchSize && (
                <p className="text-muted-foreground text-xs mt-1">Batch size: {generationConfig.batchSize}</p>
              )}
              {generationConfig.method === 'realtime' && (
                <p className="text-muted-foreground text-xs mt-1">Buffer: {generationConfig.realtimeBuffer || 5} tickets</p>
              )}
              {generationConfig.method === 'limited' && (
                <p className="text-muted-foreground text-xs mt-1">Initial release: {generationConfig.limitedQuantity || 50} tickets</p>
              )}
            </div>
          </div>

          <Separator />

          {/* Ticket Design */}
          <div>
            <h3 className="font-semibold mb-3 flex items-center gap-2">
              <Palette className="h-4 w-4" />
              Ticket Design
            </h3>
            <div className="text-sm">
              <span className="text-muted-foreground">Template:</span>
              <p className="font-medium">{ticketDesign.template || 'Custom Design'}</p>
              {ticketDesign.backgroundImage && (
                <p className="text-muted-foreground text-xs mt-1">Custom background image applied</p>
              )}
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Final Actions */}
      <Card className="border-green-200 dark:border-green-800 bg-gradient-to-r from-green-50 to-emerald-50 dark:from-green-900/20 dark:to-emerald-900/20">
        <CardContent className="p-6 text-center">
          <h3 className="text-xl font-bold mb-2">Ready to Launch!</h3>
          <p className="text-muted-foreground mb-6">
            Your event is configured and ready to go live. Once published, tickets will be available for purchase.
          </p>
          <Button 
            onClick={onComplete}
            size="lg"
            className="bg-gradient-to-r from-green-500 to-emerald-500 hover:from-green-600 hover:to-emerald-600 text-white px-8"
          >
            <CheckCircle className="h-5 w-5 mr-2" />
            Publish Event
          </Button>
        </CardContent>
      </Card>
    </div>
  );
};

export default EventReviewStep;
