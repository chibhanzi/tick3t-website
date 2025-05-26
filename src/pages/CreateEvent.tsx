
import { useState } from "react";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import TicketTemplates, { TicketTemplate } from "@/components/TicketTemplates";
import LayeredTicketDesigner from "@/components/LayeredTicketDesigner";
import { TicketLayer } from "@/components/TicketTemplates";

const CreateEvent = () => {
  const [eventData, setEventData] = useState({
    title: "",
    date: "",
    location: "",
    description: "",
    price: "",
    totalTickets: "",
    category: ""
  });

  const [selectedTemplate, setSelectedTemplate] = useState<TicketTemplate | undefined>();
  const [ticketLayers, setTicketLayers] = useState<TicketLayer[]>([]);
  const [activeTab, setActiveTab] = useState("template");

  const handleInputChange = (field: string, value: string) => {
    setEventData(prev => ({ ...prev, [field]: value }));
  };

  const handleTemplateSelect = (template: TicketTemplate) => {
    setSelectedTemplate(template);
    setTicketLayers(template.layers);
    setActiveTab("designer");
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    console.log("Event Data:", eventData);
    console.log("Ticket Layers:", ticketLayers);
    // Here we would integrate with blockchain to create the event
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-50">
      <Header />
      
      <main className="container mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="text-center mb-12">
          <h1 className="text-4xl font-bold mb-4 bg-gradient-to-r from-blue-600 to-indigo-600 bg-clip-text text-transparent">
            Create Your Event
          </h1>
          <p className="text-xl text-gray-600 max-w-2xl mx-auto">
            Design unique NFT tickets and bring your vision to life
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Event Details Form */}
          <Card>
            <CardHeader>
              <CardTitle className="text-2xl text-blue-600">Event Details</CardTitle>
            </CardHeader>
            <CardContent>
              <form onSubmit={handleSubmit} className="space-y-6">
                <div>
                  <Label htmlFor="title">Event Title</Label>
                  <Input
                    id="title"
                    placeholder="My Amazing Event"
                    value={eventData.title}
                    onChange={(e) => handleInputChange("title", e.target.value)}
                    className="border-blue-200 focus:border-blue-400"
                  />
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <Label htmlFor="date">Date & Time</Label>
                    <Input
                      id="date"
                      type="datetime-local"
                      value={eventData.date}
                      onChange={(e) => handleInputChange("date", e.target.value)}
                      className="border-blue-200 focus:border-blue-400"
                    />
                  </div>
                  <div>
                    <Label htmlFor="location">Location</Label>
                    <Input
                      id="location"
                      placeholder="Paradise Beach Club"
                      value={eventData.location}
                      onChange={(e) => handleInputChange("location", e.target.value)}
                      className="border-blue-200 focus:border-blue-400"
                    />
                  </div>
                </div>

                <div>
                  <Label htmlFor="description">Description</Label>
                  <textarea
                    id="description"
                    placeholder="Tell the world about your amazing event..."
                    value={eventData.description}
                    onChange={(e) => handleInputChange("description", e.target.value)}
                    className="w-full p-3 border border-blue-200 rounded-md focus:border-blue-400 focus:outline-none focus:ring-2 focus:ring-blue-200 min-h-[100px]"
                  />
                </div>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <div>
                    <Label htmlFor="price">Ticket Price (ETH)</Label>
                    <Input
                      id="price"
                      type="number"
                      step="0.001"
                      placeholder="0.05"
                      value={eventData.price}
                      onChange={(e) => handleInputChange("price", e.target.value)}
                      className="border-blue-200 focus:border-blue-400"
                    />
                  </div>
                  <div>
                    <Label htmlFor="totalTickets">Total Tickets</Label>
                    <Input
                      id="totalTickets"
                      type="number"
                      placeholder="500"
                      value={eventData.totalTickets}
                      onChange={(e) => handleInputChange("totalTickets", e.target.value)}
                      className="border-blue-200 focus:border-blue-400"
                    />
                  </div>
                  <div>
                    <Label htmlFor="category">Category</Label>
                    <select
                      id="category"
                      value={eventData.category}
                      onChange={(e) => handleInputChange("category", e.target.value)}
                      className="w-full p-2 border border-blue-200 rounded-md focus:border-blue-400 focus:outline-none focus:ring-2 focus:ring-blue-200"
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

                <Button 
                  type="submit" 
                  className="w-full bg-gradient-to-r from-blue-500 to-indigo-500 hover:from-blue-600 hover:to-indigo-600 text-white py-3"
                >
                  Launch Event
                </Button>
              </form>
            </CardContent>
          </Card>

          {/* Ticket Designer */}
          <Card>
            <CardHeader>
              <CardTitle className="text-2xl text-blue-600">Design Your Ticket</CardTitle>
            </CardHeader>
            <CardContent>
              <Tabs value={activeTab} onValueChange={setActiveTab}>
                <TabsList className="grid w-full grid-cols-2">
                  <TabsTrigger value="template">Templates</TabsTrigger>
                  <TabsTrigger value="designer">Designer</TabsTrigger>
                </TabsList>
                
                <TabsContent value="template">
                  <TicketTemplates onSelectTemplate={handleTemplateSelect} />
                </TabsContent>
                
                <TabsContent value="designer">
                  <LayeredTicketDesigner
                    eventTitle={eventData.title || "Your Amazing Event"}
                    eventDate={eventData.date}
                    eventLocation={eventData.location || "Amazing Venue"}
                    template={selectedTemplate}
                    onDesignChange={setTicketLayers}
                  />
                </TabsContent>
              </Tabs>
            </CardContent>
          </Card>
        </div>
      </main>

      <Footer />
    </div>
  );
};

export default CreateEvent;
