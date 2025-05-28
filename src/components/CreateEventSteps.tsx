
import React, { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Check, Calendar, MapPin, Palette, Rocket } from "lucide-react";
import TicketTemplates, { TicketTemplate } from "./TicketTemplates";
import LayeredTicketDesigner from "./LayeredTicketDesigner";

interface EventData {
  title: string;
  date: string;
  location: string;
  description: string;
  price: string;
  currency: string;
  totalTickets: string;
  category: string;
  ticketDesign?: any;
}

interface CreateEventStepsProps {
  onComplete: (eventData: EventData) => void;
}

const CreateEventSteps = ({ onComplete }: CreateEventStepsProps) => {
  const [currentStep, setCurrentStep] = useState(1);
  const [selectedTemplate, setSelectedTemplate] = useState<TicketTemplate | undefined>();
  const [ticketLayers, setTicketLayers] = useState<any[]>([]);
  const [eventData, setEventData] = useState<EventData>({
    title: "",
    date: "",
    location: "",
    description: "",
    price: "",
    currency: "ETH",
    totalTickets: "",
    category: ""
  });

  const steps = [
    { id: 1, title: "Basic Info", icon: Calendar, description: "Event details" },
    { id: 2, title: "Pricing", icon: MapPin, description: "Tickets & pricing" },
    { id: 3, title: "Design", icon: Palette, description: "Customize tickets" },
    { id: 4, title: "Launch", icon: Rocket, description: "Review & publish" }
  ];

  const currencies = [
    { value: "ETH", label: "ETH", symbol: "Ξ" },
    { value: "USDC", label: "USDC", symbol: "$" },
    { value: "USDT", label: "USDT", symbol: "$" },
    { value: "DAI", label: "DAI", symbol: "$" },
    { value: "MATIC", label: "MATIC", symbol: "◊" },
    { value: "BTC", label: "BTC", symbol: "₿" }
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
        return eventData.price && eventData.currency && eventData.totalTickets && eventData.category;
      case 3:
        return true; // Design step is optional
      case 4:
        return true; // Review step
      default:
        return false;
    }
  };

  const handleComplete = () => {
    onComplete({
      ...eventData,
      ticketDesign: { template: selectedTemplate, layers: ticketLayers }
    });
  };

  const selectedCurrency = currencies.find(c => c.value === eventData.currency);

  return (
    <div className="max-w-6xl mx-auto">
      {/* Progress Steps */}
      <div className="mb-8">
        <div className="flex items-center justify-between mb-6">
          {steps.map((step, index) => (
            <div key={step.id} className="flex items-center">
              <div className={`
                flex items-center justify-center w-12 h-12 rounded-full border-3 transition-all duration-300
                ${currentStep >= step.id 
                  ? 'bg-gradient-to-r from-blue-500 to-indigo-500 border-blue-500 text-white shadow-lg' 
                  : 'border-slate-300 text-slate-400 dark:border-slate-600 dark:text-slate-500'
                }
              `}>
                {currentStep > step.id ? (
                  <Check className="h-6 w-6" />
                ) : (
                  <step.icon className="h-6 w-6" />
                )}
              </div>
              {index < steps.length - 1 && (
                <div className={`
                  h-1 w-20 mx-3 rounded-full transition-all duration-300
                  ${currentStep > step.id ? 'bg-gradient-to-r from-blue-500 to-indigo-500' : 'bg-slate-300 dark:bg-slate-600'}
                `} />
              )}
            </div>
          ))}
        </div>
        <div className="text-center">
          <h2 className="text-2xl font-bold text-foreground mb-2">{steps[currentStep - 1].title}</h2>
          <p className="text-muted-foreground text-lg">{steps[currentStep - 1].description}</p>
        </div>
      </div>

      {/* Step Content */}
      <Card className="mb-8 border-slate-200 dark:border-slate-700 shadow-xl">
        <CardHeader className="bg-gradient-to-r from-blue-50 to-indigo-50 dark:from-slate-800 dark:to-slate-700">
          <CardTitle className="flex items-center gap-3 text-blue-600 dark:text-blue-400 text-xl">
            {(() => {
              const IconComponent = steps[currentStep - 1].icon;
              return <IconComponent className="h-6 w-6" />;
            })()}
            Step {currentStep}: {steps[currentStep - 1].title}
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-8 p-8">
          {currentStep === 1 && (
            <>
              <div>
                <Label htmlFor="title" className="text-base font-medium">Event Title *</Label>
                <Input
                  id="title"
                  placeholder="My Amazing Event"
                  value={eventData.title}
                  onChange={(e) => handleInputChange("title", e.target.value)}
                  className="mt-2 h-12 border-blue-200 focus:border-blue-400 dark:border-slate-600"
                />
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <Label htmlFor="date" className="text-base font-medium">Date & Time *</Label>
                  <Input
                    id="date"
                    type="datetime-local"
                    value={eventData.date}
                    onChange={(e) => handleInputChange("date", e.target.value)}
                    className="mt-2 h-12 border-blue-200 focus:border-blue-400 dark:border-slate-600"
                  />
                </div>
                <div>
                  <Label htmlFor="location" className="text-base font-medium">Location *</Label>
                  <Input
                    id="location"
                    placeholder="Paradise Beach Club"
                    value={eventData.location}
                    onChange={(e) => handleInputChange("location", e.target.value)}
                    className="mt-2 h-12 border-blue-200 focus:border-blue-400 dark:border-slate-600"
                  />
                </div>
              </div>

              <div>
                <Label htmlFor="description" className="text-base font-medium">Description *</Label>
                <textarea
                  id="description"
                  placeholder="Tell the world about your amazing event..."
                  value={eventData.description}
                  onChange={(e) => handleInputChange("description", e.target.value)}
                  className="mt-2 w-full p-4 border border-blue-200 dark:border-slate-600 rounded-md focus:border-blue-400 focus:outline-none focus:ring-2 focus:ring-blue-200 min-h-[120px] bg-background text-foreground"
                />
              </div>
            </>
          )}

          {currentStep === 2 && (
            <>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <div className="md:col-span-2 grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <Label htmlFor="price" className="text-base font-medium">Ticket Price *</Label>
                    <div className="relative mt-2">
                      <Input
                        id="price"
                        type="number"
                        step="0.001"
                        placeholder="0.05"
                        value={eventData.price}
                        onChange={(e) => handleInputChange("price", e.target.value)}
                        className="h-12 pr-16 border-blue-200 focus:border-blue-400 dark:border-slate-600"
                      />
                      <div className="absolute right-3 top-1/2 transform -translate-y-1/2 text-sm font-medium text-muted-foreground">
                        {selectedCurrency?.symbol}
                      </div>
                    </div>
                  </div>
                  <div>
                    <Label htmlFor="currency" className="text-base font-medium">Currency *</Label>
                    <Select value={eventData.currency} onValueChange={(value) => handleInputChange("currency", value)}>
                      <SelectTrigger className="mt-2 h-12 border-blue-200 focus:border-blue-400 dark:border-slate-600">
                        <SelectValue placeholder="Select Currency" />
                      </SelectTrigger>
                      <SelectContent>
                        {currencies.map((currency) => (
                          <SelectItem key={currency.value} value={currency.value}>
                            <div className="flex items-center gap-2">
                              <span className="font-mono">{currency.symbol}</span>
                              <span>{currency.label}</span>
                            </div>
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                </div>
                <div>
                  <Label htmlFor="totalTickets" className="text-base font-medium">Total Tickets *</Label>
                  <Input
                    id="totalTickets"
                    type="number"
                    placeholder="500"
                    value={eventData.totalTickets}
                    onChange={(e) => handleInputChange("totalTickets", e.target.value)}
                    className="mt-2 h-12 border-blue-200 focus:border-blue-400 dark:border-slate-600"
                  />
                </div>
              </div>

              <div>
                <Label htmlFor="category" className="text-base font-medium">Category *</Label>
                <Select value={eventData.category} onValueChange={(value) => handleInputChange("category", value)}>
                  <SelectTrigger className="mt-2 h-12 border-blue-200 focus:border-blue-400 dark:border-slate-600">
                    <SelectValue placeholder="Select Category" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="music">🎵 Music</SelectItem>
                    <SelectItem value="art">🎨 Art & Culture</SelectItem>
                    <SelectItem value="tech">💻 Technology</SelectItem>
                    <SelectItem value="sports">⚽ Sports</SelectItem>
                    <SelectItem value="food">🍕 Food & Drink</SelectItem>
                    <SelectItem value="business">💼 Business</SelectItem>
                    <SelectItem value="other">🎭 Other</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div className="bg-gradient-to-r from-blue-50 to-indigo-50 dark:from-slate-800 dark:to-slate-700 p-6 rounded-xl">
                <h3 className="font-bold text-lg mb-4 text-foreground">💰 Revenue Estimation</h3>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                  <div className="text-center">
                    <div className="text-sm text-muted-foreground mb-1">Total Revenue</div>
                    <div className="text-2xl font-bold text-foreground">
                      {eventData.price && eventData.totalTickets 
                        ? `${selectedCurrency?.symbol}${(parseFloat(eventData.price) * parseInt(eventData.totalTickets)).toFixed(3)}`
                        : `${selectedCurrency?.symbol}0`
                      }
                    </div>
                  </div>
                  <div className="text-center">
                    <div className="text-sm text-muted-foreground mb-1">Platform Fee (2.5%)</div>
                    <div className="text-2xl font-bold text-orange-600">
                      {eventData.price && eventData.totalTickets 
                        ? `${selectedCurrency?.symbol}${(parseFloat(eventData.price) * parseInt(eventData.totalTickets) * 0.025).toFixed(3)}`
                        : `${selectedCurrency?.symbol}0`
                      }
                    </div>
                  </div>
                  <div className="text-center">
                    <div className="text-sm text-muted-foreground mb-1">Your Earnings</div>
                    <div className="text-2xl font-bold text-green-600">
                      {eventData.price && eventData.totalTickets 
                        ? `${selectedCurrency?.symbol}${(parseFloat(eventData.price) * parseInt(eventData.totalTickets) * 0.975).toFixed(3)}`
                        : `${selectedCurrency?.symbol}0`
                      }
                    </div>
                  </div>
                </div>
              </div>
            </>
          )}

          {currentStep === 3 && (
            <div className="space-y-6">
              {!selectedTemplate ? (
                <TicketTemplates onSelectTemplate={setSelectedTemplate} />
              ) : (
                <div className="space-y-6">
                  <div className="flex items-center justify-between">
                    <h3 className="text-xl font-bold text-foreground">🎨 Design Your Ticket</h3>
                    <Button 
                      variant="outline" 
                      onClick={() => setSelectedTemplate(undefined)}
                      className="border-blue-200 hover:bg-blue-50 dark:border-slate-600 dark:hover:bg-slate-700"
                    >
                      Choose Different Template
                    </Button>
                  </div>
                  <LayeredTicketDesigner
                    eventTitle={eventData.title || "Your Event Title"}
                    eventDate={eventData.date || "Event Date"}
                    eventLocation={eventData.location || "Event Location"}
                    template={selectedTemplate}
                    onDesignChange={setTicketLayers}
                  />
                </div>
              )}
            </div>
          )}

          {currentStep === 4 && (
            <div className="space-y-8">
              <div className="text-center py-6">
                <Rocket className="h-20 w-20 text-green-500 mx-auto mb-4" />
                <h3 className="text-2xl font-bold mb-2 text-foreground">🚀 Ready to Launch!</h3>
                <p className="text-lg text-muted-foreground">Review your event details before publishing to the blockchain</p>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                <Card className="border-slate-200 dark:border-slate-700">
                  <CardHeader>
                    <CardTitle className="text-lg text-muted-foreground">📋 Event Details</CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-3">
                    <div><strong>Title:</strong> {eventData.title}</div>
                    <div><strong>Date:</strong> {new Date(eventData.date).toLocaleDateString()}</div>
                    <div><strong>Location:</strong> {eventData.location}</div>
                    <div><strong>Category:</strong> {eventData.category}</div>
                    <div><strong>Description:</strong> {eventData.description.substring(0, 100)}...</div>
                  </CardContent>
                </Card>

                <Card className="border-slate-200 dark:border-slate-700">
                  <CardHeader>
                    <CardTitle className="text-lg text-muted-foreground">💰 Pricing Details</CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-3">
                    <div><strong>Price:</strong> {selectedCurrency?.symbol}{eventData.price} {eventData.currency}</div>
                    <div><strong>Total Tickets:</strong> {eventData.totalTickets}</div>
                    <div><strong>Total Revenue:</strong> {selectedCurrency?.symbol}{(parseFloat(eventData.price || "0") * parseInt(eventData.totalTickets || "0")).toFixed(3)} {eventData.currency}</div>
                    <div><strong>Your Earnings:</strong> {selectedCurrency?.symbol}{(parseFloat(eventData.price || "0") * parseInt(eventData.totalTickets || "0") * 0.975).toFixed(3)} {eventData.currency}</div>
                  </CardContent>
                </Card>
              </div>

              {selectedTemplate && (
                <Card className="border-slate-200 dark:border-slate-700">
                  <CardHeader>
                    <CardTitle className="text-lg text-muted-foreground">🎨 Ticket Design</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="text-center p-4 bg-gradient-to-r from-blue-50 to-indigo-50 dark:from-slate-800 dark:to-slate-700 rounded-lg">
                      <p className="text-sm text-muted-foreground mb-2">Selected Template: <strong>{selectedTemplate.name}</strong></p>
                      <Badge variant="secondary" className="bg-blue-100 text-blue-700 dark:bg-slate-700 dark:text-blue-300">
                        ✨ Custom Design Applied
                      </Badge>
                    </div>
                  </CardContent>
                </Card>
              )}
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
          className="px-8 py-3 border-slate-300 dark:border-slate-600"
        >
          ← Previous
        </Button>
        
        {currentStep < steps.length ? (
          <Button 
            onClick={nextStep}
            disabled={!isStepValid(currentStep)}
            className="px-8 py-3 bg-gradient-to-r from-blue-500 to-indigo-500 hover:from-blue-600 hover:to-indigo-600"
          >
            Next Step →
          </Button>
        ) : (
          <Button 
            onClick={handleComplete}
            className="px-8 py-3 bg-gradient-to-r from-green-500 to-emerald-500 hover:from-green-600 hover:to-emerald-600"
          >
            🚀 Launch Event
          </Button>
        )}
      </div>
    </div>
  );
};

export default CreateEventSteps;
