
import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { CheckCircle, ArrowRight, ArrowLeft, RotateCcw, X, HistoryIcon } from "lucide-react";
import EventBasicInfo from "./EventBasicInfo";
import TicketDesignStep from "./TicketDesignStep";
import TicketGenerationMethods, { TicketGenerationConfig } from "./TicketGenerationMethods";
import TicketFeatures, { TicketFeaturesConfig } from "./TicketFeatures";
import EventPricingStep from "./EventPricingStep";
import EventReviewStep from "./EventReviewStep";
import type { PublishableEventData } from "@/lib/publishedEvents";

export interface EventData {
  title: string;
  date: string;
  location: string;
  description: string;
  price: string;
  totalTickets: string;
  category: string;
}

interface CreateEventStepsProps {
  onComplete: (eventData: PublishableEventData) => Promise<boolean>;
}

const DRAFT_KEY = "tick3t_create_event_draft";
const LEGACY_DRAFT_KEY = "tick3rt_create_event_draft";

const DEFAULT_EVENT_DATA: EventData = {
  title: "",
  date: "",
  location: "",
  description: "",
  price: "",
  totalTickets: "",
  category: ""
};

const DEFAULT_GENERATION_CONFIG: TicketGenerationConfig = {
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
};

const DEFAULT_TICKET_FEATURES: TicketFeaturesConfig = {
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
};

const DEFAULT_PRICING_DATA = {
  currency: 'USD',
  price: '',
  earlyBirdPrice: '',
  earlyBirdDeadline: '',
  acceptedPayments: ['ETH', 'USDC', 'Credit Card']
};

function getDraftRaw(): string | null {
  return localStorage.getItem(DRAFT_KEY) ?? localStorage.getItem(LEGACY_DRAFT_KEY);
}

function loadDraft() {
  try {
    const raw = getDraftRaw();
    if (!raw) return null;
    if (!localStorage.getItem(DRAFT_KEY)) {
      localStorage.setItem(DRAFT_KEY, raw);
      localStorage.removeItem(LEGACY_DRAFT_KEY);
    }
    return JSON.parse(raw);
  } catch {
    return null;
  }
}

function saveDraft(draft: object) {
  try {
    localStorage.setItem(DRAFT_KEY, JSON.stringify(draft));
  } catch {
    // Ignore storage quota errors
  }
}

function clearDraft() {
  try {
    localStorage.removeItem(DRAFT_KEY);
    localStorage.removeItem(LEGACY_DRAFT_KEY);
  } catch {
    // Ignore
  }
}

function isDraftNonEmpty(eventData: EventData, currentStep: number): boolean {
  return currentStep > 1 || Object.values(eventData).some((v) => v !== "");
}

const CreateEventSteps = ({ onComplete }: CreateEventStepsProps) => {
  // Read one immutable snapshot so every state value is restored from the same draft.
  const [initialDraft] = useState(() => loadDraft());
  const [currentStep, setCurrentStep] = useState<number>(() => initialDraft?.currentStep ?? 1);

  const [eventData, setEventData] = useState<EventData>(() => initialDraft?.eventData ?? DEFAULT_EVENT_DATA);

  const [ticketDesign, setTicketDesign] = useState<any>(() => initialDraft?.ticketDesign ?? {});

  const [generationConfig, setGenerationConfig] = useState<TicketGenerationConfig>(
    () => initialDraft?.generationConfig ?? DEFAULT_GENERATION_CONFIG,
  );

  const [ticketFeatures, setTicketFeatures] = useState<TicketFeaturesConfig>(
    () => initialDraft?.ticketFeatures ?? DEFAULT_TICKET_FEATURES,
  );

  const [pricingData, setPricingData] = useState(() => initialDraft?.pricingData ?? DEFAULT_PRICING_DATA);

  const persistDraft = (
    overrides: Partial<{
      currentStep: number;
      eventData: EventData;
      ticketDesign: any;
      generationConfig: TicketGenerationConfig;
      ticketFeatures: TicketFeaturesConfig;
      pricingData: typeof DEFAULT_PRICING_DATA;
    }> = {},
  ) => {
    saveDraft({
      currentStep,
      eventData,
      ticketDesign,
      generationConfig,
      ticketFeatures,
      pricingData,
      ...overrides,
    });
  };

  // Track whether we restored a non-empty draft on mount so we can show a banner
  const [showRestoredBanner, setShowRestoredBanner] = useState<boolean>(
    () => Boolean(
      initialDraft
      && ((initialDraft.currentStep ?? 1) > 1
        || Object.values(initialDraft.eventData ?? {}).some((v: unknown) => v !== "")),
    ),
  );

  // Persist entire draft to localStorage whenever any piece changes
  useEffect(() => {
    saveDraft({ currentStep, eventData, ticketDesign, generationConfig, ticketFeatures, pricingData });
  }, [currentStep, eventData, ticketDesign, generationConfig, ticketFeatures, pricingData]);

  // Warn before tab close when there is unsaved draft data
  useEffect(() => {
    const handler = (e: BeforeUnloadEvent) => {
      persistDraft();
      if (isDraftNonEmpty(eventData, currentStep)) {
        e.preventDefault();
        e.returnValue = "";
      }
    };
    window.addEventListener("beforeunload", handler);
    return () => window.removeEventListener("beforeunload", handler);
  }, [currentStep, eventData, ticketDesign, generationConfig, ticketFeatures, pricingData]);

  const handleStartOver = () => {
    clearDraft();
    setCurrentStep(1);
    setEventData(DEFAULT_EVENT_DATA);
    setTicketDesign({});
    setGenerationConfig(DEFAULT_GENERATION_CONFIG);
    setTicketFeatures(DEFAULT_TICKET_FEATURES);
    setPricingData(DEFAULT_PRICING_DATA);
    setShowRestoredBanner(false);
  };

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
      const next = currentStep + 1;
      persistDraft({ currentStep: next });
      setCurrentStep(next);
    }
  };

  const prevStep = () => {
    if (currentStep > 1) {
      const previous = currentStep - 1;
      persistDraft({ currentStep: previous });
      setCurrentStep(previous);
    }
  };

  const handleTicketFeaturesChange = (features: TicketFeaturesConfig) => {
    persistDraft({ ticketFeatures: features });
    setTicketFeatures(features);
  };

  const handleComplete = async () => {
    const finalEventData = {
      ...eventData,
      ...pricingData,
      ticketDesign,
      generationConfig,
      ticketFeatures,
    };
    const published = await onComplete(finalEventData);
    if (published) clearDraft();
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
            onFeaturesChange={handleTicketFeaturesChange}
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
            ticketFeatures={ticketFeatures}
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
      {/* Draft-restored banner */}
      {showRestoredBanner && (
        <div className="flex items-center gap-3 rounded-lg border border-blue-200 bg-blue-50 px-4 py-3 text-blue-800 dark:border-blue-800 dark:bg-blue-950/40 dark:text-blue-300">
          <HistoryIcon className="h-4 w-4 shrink-0" />
          <p className="flex-1 text-sm">
            <span className="font-medium">Draft restored.</span> We saved your progress from your last session — pick up right where you left off.
          </p>
          <button
            onClick={() => setShowRestoredBanner(false)}
            aria-label="Dismiss"
            className="shrink-0 rounded p-0.5 hover:bg-blue-100 dark:hover:bg-blue-900"
          >
            <X className="h-4 w-4" />
          </button>
        </div>
      )}

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
          <div className="hidden sm:flex w-full min-w-0 items-center justify-between">
            {steps.map((step, index) => (
              <div key={step.id} className="flex min-w-0 flex-1 items-center">
                <div className="flex min-w-0 flex-1 items-center">
                  <div className={`flex shrink-0 items-center justify-center w-8 h-8 lg:w-10 lg:h-10 rounded-full border-2 transition-all duration-300 ${
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
                  <div className="ml-2 lg:ml-3 min-w-0 text-left">
                    <p className={`text-xs lg:text-sm font-medium ${
                      currentStep >= step.id ? 'text-foreground' : 'text-muted-foreground'
                    } truncate`}>
                      {step.title}
                    </p>
                    <p className="hidden truncate text-xs text-muted-foreground lg:block">{step.description}</p>
                  </div>
                </div>
                {index < steps.length - 1 && (
                  <ArrowRight className="mx-2 h-3 w-3 shrink-0 text-gray-400 lg:mx-4 lg:h-4 lg:w-4" />
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
      <div className="flex justify-between items-center px-2 sm:px-0">
        <div className="flex items-center gap-2">
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

          <Button
            variant="ghost"
            onClick={handleStartOver}
            className="flex items-center gap-1 sm:gap-2 text-xs sm:text-sm text-muted-foreground hover:text-destructive"
            size="sm"
            aria-label="Start over"
          >
            <RotateCcw className="h-3 w-3 sm:h-4 sm:w-4" />
            <span className="hidden sm:inline">Start over</span>
          </Button>
        </div>
        
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
            <CheckCircle className="h-3 w-3 sm:h-4 sm:w-4" />
            <span className="hidden sm:inline">Publish Event</span>
            <span className="sm:hidden">Publish</span>
          </Button>
        )}
      </div>
    </div>
  );
};

export default CreateEventSteps;
