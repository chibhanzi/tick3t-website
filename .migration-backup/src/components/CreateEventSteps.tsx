
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { CheckCircle, Circle, ArrowRight, ArrowLeft, Sparkles } from "lucide-react";
import EventBasicInfo from "./EventBasicInfo";
import TicketDesignStep from "./TicketDesignStep";
import TicketGenerationMethods, { TicketGenerationConfig } from "./TicketGenerationMethods";
import TicketFeatures, { TicketFeaturesConfig } from "./TicketFeatures";
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
    method: 'batch',
    vouchIntegration: {
      enabled: true,
      validatorWallets: [],
      multiSigRequired: false,
      biometricAuth: false,
      qrCodeValidation: true,
      offlineValidation: false
    },
    blockchainSecurity: {
      smartContractValidation: true,
      merkleTreeProof: false,
      timestampValidation: true,
      walletSignatureRequired: true
    }
  });
  const [ticketFeatures, setTicketFeatures] = useState<TicketFeaturesConfig>({
    hasQrCode: true,
    hasTransferProtection: true,
    hasTimelock: false,
    timelockHours: 24,
    hasLocationVerification: false,
    hasCapacityLimit: false,
    capacityLimit: 1,
    hasRoyalties: false,
    royaltyPercentage: 2.5,
    hasBonusRewards: false,
    hasEarlyAccess: false,
    earlyAccessHours: 2
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
    { id: 4, title: "Security Features", description: "Configure advanced security" },
    { id: 5, title: "Pricing & Payments", description: "Set pricing and payment options" },
    { id: 6, title: "Review & Publish", description: "Final review and launch" }
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
          <TicketFeatures
            features={ticketFeatures}
            onFeaturesChange={setTicketFeatures}
          />
        );
      case 5:
        return (
          <EventPricingStep 
            pricingData={pricingData}
            onPricingChange={setPricingData}
            generationConfig={generationConfig}
          />
        );
      case 6:
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
    <div className="max-w-6xl mx-auto space-y-4 sm:space-y-8 px-2 sm:px-0">
      {/* Progress Steps - Mobile Responsive */}
      <Card className="border-slate-200 dark:border-slate-700">
        <CardContent className="p-3 sm:p-6">
          {/* Mobile Progress - Simplified */}
          <div className="block sm:hidden">
            <div className="flex items-center justify-between mb-2">
              <span className="text-sm font-medium">Step {currentStep} of {steps.length}</span>
              <span className="text-xs text-muted-foreground">{Math.round((currentStep / steps.length) * 100)}%</span>
            </div>
            <div className="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-2 mb-3">
              <div 
                className="bg-blue-500 h-2 rounded-full transition-all duration-300" 
                style={{ width: `${(currentStep / steps.length) * 100}%` }}
              />
            </div>
            <div className="text-center">
              <h3 className="font-medium text-sm">{steps[currentStep - 1].title}</h3>
              <p className="text-xs text-muted-foreground">{steps[currentStep - 1].description}</p>
            </div>
          </div>

          {/* Desktop Progress - Full */}
          <div className="hidden sm:flex items-center justify-between">
            {steps.map((step, index) => (
              <div key={step.id} className="flex items-center">
                <div className="flex items-center">
                  <div className={`flex items-center justify-center w-8 h-8 lg:w-10 lg:h-10 rounded-full border-2 transition-all duration-300 ${
                    currentStep > step.id 
                      ? 'bg-green-500 border-green-500 text-white' 
                      : currentStep === step.id
                      ? 'bg-blue-500 border-blue-500 text-white'
                      : 'border-gray-300 dark:border-gray-600 text-gray-400'
                  }`}>
                    {currentStep > step.id ? (
                      <CheckCircle className="h-4 w-4 lg:h-5 lg:w-5" />
                    ) : (
                      <span className="text-xs lg:text-sm font-medium">{step.id}</span>
                    )}
                  </div>
                  <div className="ml-2 lg:ml-3 text-left">
                    <p className={`text-xs lg:text-sm font-medium ${
                      currentStep >= step.id ? 'text-foreground' : 'text-muted-foreground'
                    }`}>
                      {step.title}
                    </p>
                    <p className="text-xs text-muted-foreground hidden lg:block">{step.description}</p>
                  </div>
                </div>
                {index < steps.length - 1 && (
                  <ArrowRight className="h-3 w-3 lg:h-4 lg:w-4 text-gray-400 mx-2 lg:mx-4" />
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
      <div className="flex justify-between px-2 sm:px-0">
        <Button 
          variant="outline" 
          onClick={prevStep}
          disabled={currentStep === 1}
          className="flex items-center gap-1 sm:gap-2 text-xs sm:text-sm"
          size="sm"
        >
          <ArrowLeft className="h-3 w-3 sm:h-4 sm:w-4" />
          <span className="hidden sm:inline">Previous</span>
          <span className="sm:hidden">Prev</span>
        </Button>
        
        {currentStep < steps.length ? (
          <Button 
            onClick={nextStep}
            className="flex items-center gap-1 sm:gap-2 bg-gradient-to-r from-blue-500 to-indigo-500 hover:from-blue-600 hover:to-indigo-600 text-xs sm:text-sm"
            size="sm"
          >
            <span className="hidden sm:inline">Next</span>
            <span className="sm:hidden">Next</span>
            <ArrowRight className="h-3 w-3 sm:h-4 sm:w-4" />
          </Button>
        ) : (
          <Button 
            onClick={handleComplete}
            className="flex items-center gap-1 sm:gap-2 bg-gradient-to-r from-green-500 to-emerald-500 hover:from-green-600 hover:to-emerald-600 text-xs sm:text-sm"
            size="sm"
          >
            <Sparkles className="h-3 w-3 sm:h-4 sm:w-4" />
            <span className="hidden sm:inline">Publish Event</span>
            <span className="sm:hidden">Publish</span>
          </Button>
        )}
      </div>
    </div>
  );
};

export default CreateEventSteps;
