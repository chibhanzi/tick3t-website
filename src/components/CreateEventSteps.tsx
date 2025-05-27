
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Check, Calendar, MapPin, Palette, Rocket } from "lucide-react";

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

  const steps = [
    { id: 1, title: "Basic Info", icon: Calendar, description: "Event details" },
    { id: 2, title: "Pricing", icon: MapPin, description: "Tickets & pricing" },
    { id: 3, title: "Design", icon: Palette, description: "Customize tickets" },
    { id: 4, title: "Launch", icon: Rocket, description: "Review & publish" }
  ];

  const handleInputChange = (field: keyof EventData, value: string) => {
    setEventData(prev => ({ ...prev, [field]: value }));
  };

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

  const isStepValid = (step: number) => {
    switch (step) {
      case 1:
        return eventData.title && eventData.date && eventData.location && eventData.description;
      case 2:
        return eventData.price && eventData.totalTickets && eventData.category;
      case 3:
        return true; // Design step is optional
      case 4:
        return true; // Review step
      default:
        return false;
    }
  };

  const handleComplete = () => {
    onComplete(eventData);
  };

  return (
    <div className="max-w-4xl mx-auto">
      {/* Progress Steps */}
      <div className="mb-8">
        <div className="flex items-center justify-between mb-4">
          {steps.map((step, index) => (
            <div key={step.id} className="flex items-center">
              <div className={`
                flex items-center justify-center w-10 h-10 rounded-full border-2 transition-all
                ${currentStep >= step.id 
                  ? 'bg-blue-500 border-blue-500 text-white' 
                  : 'border-slate-300 text-slate-400 dark:border-slate-600 dark:text-slate-500'
                }
              `}>
                {currentStep > step.id ? (
                  <Check className="h-5 w-5" />
                ) : (
                  <step.icon className="h-5 w-5" />
                )}
              </div>
              {index < steps.length - 1 && (
                <div className={`
                  h-0.5 w-16 mx-2 transition-all
                  ${currentStep > step.id ? 'bg-blue-500' : 'bg-slate-300 dark:bg-slate-600'}
                `} />
              )}
            </div>
          ))}
        </div>
        <div className="text-center">
          <h2 className="text-xl font-bold text-foreground">{steps[currentStep - 1].title}</h2>
          <p className="text-muted-foreground">{steps[currentStep - 1].description}</p>
        </div>
      </div>

      {/* Step Content */}
      <Card className="mb-6 border-slate-200 dark:border-slate-700">
        <CardHeader>
          <CardTitle className="flex items-center gap-2 text-blue-600 dark:text-blue-400">
            {React.createElement(steps[currentStep - 1].icon, { className: "h-5 w-5" })}
            Step {currentStep}: {steps[currentStep - 1].title}
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-6">
          {currentStep === 1 && (
            <>
              <div>
                <Label htmlFor="title">Event Title *</Label>
                <Input
                  id="title"
                  placeholder="My Amazing Event"
                  value={eventData.title}
                  onChange={(e) => handleInputChange("title", e.target.value)}
                  className="border-blue-200 focus:border-blue-400 dark:border-slate-600"
                />
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="date">Date & Time *</Label>
                  <Input
                    id="date"
                    type="datetime-local"
                    value={eventData.date}
                    onChange={(e) => handleInputChange("date", e.target.value)}
                    className="border-blue-200 focus:border-blue-400 dark:border-slate-600"
                  />
                </div>
                <div>
                  <Label htmlFor="location">Location *</Label>
                  <Input
                    id="location"
                    placeholder="Paradise Beach Club"
                    value={eventData.location}
                    onChange={(e) => handleInputChange("location", e.target.value)}
                    className="border-blue-200 focus:border-blue-400 dark:border-slate-600"
                  />
                </div>
              </div>

              <div>
                <Label htmlFor="description">Description *</Label>
                <textarea
                  id="description"
                  placeholder="Tell the world about your amazing event..."
                  value={eventData.description}
                  onChange={(e) => handleInputChange("description", e.target.value)}
                  className="w-full p-3 border border-blue-200 dark:border-slate-600 rounded-md focus:border-blue-400 focus:outline-none focus:ring-2 focus:ring-blue-200 min-h-[100px] bg-background text-foreground"
                />
              </div>
            </>
          )}

          {currentStep === 2 && (
            <>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div>
                  <Label htmlFor="price">Ticket Price (ETH) *</Label>
                  <Input
                    id="price"
                    type="number"
                    step="0.001"
                    placeholder="0.05"
                    value={eventData.price}
                    onChange={(e) => handleInputChange("price", e.target.value)}
                    className="border-blue-200 focus:border-blue-400 dark:border-slate-600"
                  />
                </div>
                <div>
                  <Label htmlFor="totalTickets">Total Tickets *</Label>
                  <Input
                    id="totalTickets"
                    type="number"
                    placeholder="500"
                    value={eventData.totalTickets}
                    onChange={(e) => handleInputChange("totalTickets", e.target.value)}
                    className="border-blue-200 focus:border-blue-400 dark:border-slate-600"
                  />
                </div>
                <div>
                  <Label htmlFor="category">Category *</Label>
                  <select
                    id="category"
                    value={eventData.category}
                    onChange={(e) => handleInputChange("category", e.target.value)}
                    className="w-full p-2 border border-blue-200 dark:border-slate-600 rounded-md focus:border-blue-400 focus:outline-none focus:ring-2 focus:ring-blue-200 bg-background text-foreground"
                  >
                    <option value="">Select Category</option>
                    <option value="music">Music</option>
                    <option value="art">Art & Culture</option>
                    <option value="tech">Technology</option>
                    <option value="sports">Sports</option>
                    <option value="food">Food & Drink</option>
                    <option value="business">Business</option>
                    <option value="other">Other</option>
                  </select>
                </div>
              </div>

              <div className="bg-blue-50 dark:bg-slate-800 p-4 rounded-lg">
                <h3 className="font-semibold mb-2 text-foreground">Revenue Estimation</h3>
                <div className="grid grid-cols-2 gap-4 text-sm">
                  <div>
                    <span className="text-muted-foreground">Total Revenue:</span>
                    <div className="font-bold text-foreground">
                      {eventData.price && eventData.totalTickets 
                        ? `${(parseFloat(eventData.price) * parseInt(eventData.totalTickets)).toFixed(3)} ETH`
                        : '0 ETH'
                      }
                    </div>
                  </div>
                  <div>
                    <span className="text-muted-foreground">Platform Fee (2.5%):</span>
                    <div className="font-bold text-foreground">
                      {eventData.price && eventData.totalTickets 
                        ? `${(parseFloat(eventData.price) * parseInt(eventData.totalTickets) * 0.025).toFixed(3)} ETH`
                        : '0 ETH'
                      }
                    </div>
                  </div>
                </div>
              </div>
            </>
          )}

          {currentStep === 3 && (
            <div className="text-center py-8">
              <Palette className="h-16 w-16 text-blue-500 mx-auto mb-4" />
              <h3 className="text-xl font-bold mb-2 text-foreground">Design Your Tickets</h3>
              <p className="text-muted-foreground mb-6">
                This step will be integrated with the ticket designer component
              </p>
              <Badge variant="secondary" className="bg-blue-100 text-blue-700 dark:bg-slate-700 dark:text-blue-300">
                Ticket Designer Coming Next
              </Badge>
            </div>
          )}

          {currentStep === 4 && (
            <div className="space-y-6">
              <div className="text-center py-4">
                <Rocket className="h-16 w-16 text-green-500 mx-auto mb-4" />
                <h3 className="text-xl font-bold mb-2 text-foreground">Ready to Launch!</h3>
                <p className="text-muted-foreground">Review your event details before publishing</p>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <Card className="border-slate-200 dark:border-slate-700">
                  <CardHeader>
                    <CardTitle className="text-sm text-muted-foreground">Event Details</CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-2 text-sm">
                    <div><strong>Title:</strong> {eventData.title}</div>
                    <div><strong>Date:</strong> {eventData.date}</div>
                    <div><strong>Location:</strong> {eventData.location}</div>
                    <div><strong>Category:</strong> {eventData.category}</div>
                  </CardContent>
                </Card>

                <Card className="border-slate-200 dark:border-slate-700">
                  <CardHeader>
                    <CardTitle className="text-sm text-muted-foreground">Pricing</CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-2 text-sm">
                    <div><strong>Price:</strong> {eventData.price} ETH</div>
                    <div><strong>Total Tickets:</strong> {eventData.totalTickets}</div>
                    <div><strong>Total Revenue:</strong> {(parseFloat(eventData.price || "0") * parseInt(eventData.totalTickets || "0")).toFixed(3)} ETH</div>
                  </CardContent>
                </Card>
              </div>
            </div>
          )}
        </CardContent>
      </Card>

      {/* Navigation */}
      <div className="flex justify-between">
        <Button 
          variant="outline" 
          onClick={prevStep}
          disabled={currentStep === 1}
          className="border-slate-300 dark:border-slate-600"
        >
          Previous
        </Button>
        
        {currentStep < steps.length ? (
          <Button 
            onClick={nextStep}
            disabled={!isStepValid(currentStep)}
            className="bg-gradient-to-r from-blue-500 to-indigo-500 hover:from-blue-600 hover:to-indigo-600"
          >
            Next Step
          </Button>
        ) : (
          <Button 
            onClick={handleComplete}
            className="bg-gradient-to-r from-green-500 to-emerald-500 hover:from-green-600 hover:to-emerald-600"
          >
            Launch Event
          </Button>
        )}
      </div>
    </div>
  );
};

export default CreateEventSteps;
