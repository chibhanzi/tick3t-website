import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { CheckCircle, Circle, ArrowRight, ArrowLeft, Sparkles } from "lucide-react";
import EventBasicInfo from "./EventBasicInfo";
import TicketDesignStep from "./TicketDesignStep";
import TicketGenerationMethods, { TicketGenerationConfig } from "./TicketGenerationMethods";
import EventPricingStep from "./EventPricingStep";
import EventReviewStep from "./EventReviewStep";

interface EventData {
  title: string;
  date: string;
  location: string;
  description: string;
  price: string;
  totalTickets: string;
  category: string;
}

interface CreateEventStepsProps {
  onComplete: (eventData: EventData) => void;
}

const CreateEventSteps = ({ onComplete }: CreateEventStepsProps) => {
  const [currentStep, setCurrentStep] = useState(1);
  const [eventData, setEventData] = useState<EventData>({
    title: "",
    date: "",
    location: "",
    description: "",
    price: "",
    totalTickets: "",
    category: ""
  });
  const [ticketDesign, setTicketDesign] = useState<any>({});
  const [generationConfig, setGenerationConfig] = useState<TicketGenerationConfig>({
    method: 'batch'
  });
  const [pricingData, setPricingData] = useState({
    currency: 'USD',
    price: '',
    earlyBirdPrice: '',
    earlyBirdDeadline: '',
    acceptedPayments: ['ETH', 'USDC', 'Credit Card']
  });

  const steps = [
    { id: 1, title: "Event Details", description: "Basic event information" },
    { id: 2, title: "Ticket Design", description: "Create stunning ticket designs" },
    { id: 3, title: "Generation Method", description: "Choose how tickets are created" },
    { id: 4, title: "Pricing & Payments", description: "Set pricing and payment options" },
    { id: 5, title: "Review & Publish", description: "Final review and launch" }
  ];

  const nextStep = () => {
    if (currentStep < steps.length) {
      setCurrentStep(currentStep + 1);
    }
  };

  const prevStep = () => {
    if (currentStep > 1) {
      setCurrentStep(currentStep - 1);
    }
  };

  const handleComplete = () => {
    const finalEventData = {
      ...eventData,
      ...pricingData,
      ticketDesign,
      generationConfig
    };
    onComplete(finalEventData);
  };

  const renderStepContent = () => {
    switch (currentStep) {
      case 1:
        return (
          <EventBasicInfo 
            eventData={eventData}
            onEventDataChange={setEventData}
          />
        );
      case 2:
        return (
          <TicketDesignStep 
            eventData={eventData}
            design={ticketDesign}
            onDesignChange={setTicketDesign}
          />
        );
      case 3:
        return (
          <TicketGenerationMethods 
            config={generationConfig}
            onConfigChange={setGenerationConfig}
          />
        );
      case 4:
        return (
          <EventPricingStep 
            pricingData={pricingData}
            onPricingChange={setPricingData}
            generationConfig={generationConfig}
          />
        );
      case 5:
        return (
          <EventReviewStep 
            eventData={eventData}
            ticketDesign={ticketDesign}
            generationConfig={generationConfig}
            pricingData={pricingData}
            onComplete={handleComplete}
          />
        );
      default:
        return null;
    }
  };

  return (
    <div className="max-w-4xl mx-auto space-y-8">
      {/* Progress Steps */}
      <Card className="border-slate-200 dark:border-slate-700">
        <CardContent className="p-6">
          <div className="flex items-center justify-between">
            {steps.map((step, index) => (
              <div key={step.id} className="flex items-center">
                <div className="flex items-center">
                  <div className={`flex items-center justify-center w-10 h-10 rounded-full border-2 transition-all duration-300 ${
                    currentStep > step.id 
                      ? 'bg-green-500 border-green-500 text-white' 
                      : currentStep === step.id
                      ? 'bg-blue-500 border-blue-500 text-white'
                      : 'border-gray-300 dark:border-gray-600 text-gray-400'
                  }`}>
                    {currentStep > step.id ? (
                      <CheckCircle className="h-5 w-5" />
                    ) : (
                      <span className="text-sm font-medium">{step.id}</span>
                    )}
                  </div>
                  <div className="ml-3 text-left">
                    <p className={`text-sm font-medium ${
                      currentStep >= step.id ? 'text-foreground' : 'text-muted-foreground'
                    }`}>
                      {step.title}
                    </p>
                    <p className="text-xs text-muted-foreground">{step.description}</p>
                  </div>
                </div>
                {index < steps.length - 1 && (
                  <ArrowRight className="h-4 w-4 text-gray-400 mx-4" />
                )}
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Step Content */}
      <div className="min-h-96">
        {renderStepContent()}
      </div>

      {/* Navigation */}
      <div className="flex justify-between">
        <Button 
          variant="outline" 
          onClick={prevStep}
          disabled={currentStep === 1}
          className="flex items-center gap-2"
        >
          <ArrowLeft className="h-4 w-4" />
          Previous
        </Button>
        
        {currentStep < steps.length ? (
          <Button 
            onClick={nextStep}
            className="flex items-center gap-2 bg-gradient-to-r from-blue-500 to-indigo-500 hover:from-blue-600 hover:to-indigo-600"
          >
            Next
            <ArrowRight className="h-4 w-4" />
          </Button>
        ) : (
          <Button 
            onClick={handleComplete}
            className="flex items-center gap-2 bg-gradient-to-r from-green-500 to-emerald-500 hover:from-green-600 hover:to-emerald-600"
          >
            <Sparkles className="h-4 w-4" />
            Publish Event
          </Button>
        )}
      </div>
    </div>
  );
};

export default CreateEventSteps;
