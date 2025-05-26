
import { useState } from "react";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import TicketDesigner from "@/components/TicketDesigner";

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

  const [ticketDesign, setTicketDesign] = useState({
    backgroundColor: "#7c3aed",
    textColor: "#ffffff",
    borderColor: "#ec4899",
    pattern: "gradient"
  });

  const handleInputChange = (field: string, value: string) => {
    setEventData(prev => ({ ...prev, [field]: value }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    console.log("Event Data:", eventData);
    console.log("Ticket Design:", ticketDesign);
    // Here we would integrate with blockchain to create the event
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-50 via-pink-50 to-yellow-50">
      <Header />
      
      <main className="container mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="text-center mb-12">
          <h1 className="text-4xl font-bold mb-4 bg-gradient-to-r from-purple-600 to-pink-600 bg-clip-text text-transparent">
            🎨 Create Your Epic Event
          </h1>
          <p className="text-xl text-gray-600 max-w-2xl mx-auto">
            Design unique NFT tickets and bring your vision to life! 🚀
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Event Details Form */}
          <Card className="border-purple-200">
            <CardHeader>
              <CardTitle className="text-2xl text-purple-600">📝 Event Details</CardTitle>
            </CardHeader>
            <CardContent>
              <form onSubmit={handleSubmit} className="space-y-6">
                <div>
                  <Label htmlFor="title">Event Title</Label>
                  <Input
                    id="title"
                    placeholder="🎉 My Amazing Event"
                    value={eventData.title}
                    onChange={(e) => handleInputChange("title", e.target.value)}
                    className="border-purple-200 focus:border-purple-400"
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
                      className="border-purple-200 focus:border-purple-400"
                    />
                  </div>
                  <div>
                    <Label htmlFor="location">Location</Label>
                    <Input
                      id="location"
                      placeholder="🌴 Paradise Beach Club"
                      value={eventData.location}
                      onChange={(e) => handleInputChange("location", e.target.value)}
                      className="border-purple-200 focus:border-purple-400"
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
                    className="w-full p-3 border border-purple-200 rounded-md focus:border-purple-400 focus:outline-none focus:ring-2 focus:ring-purple-200 min-h-[100px]"
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
                      className="border-purple-200 focus:border-purple-400"
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
                      className="border-purple-200 focus:border-purple-400"
                    />
                  </div>
                  <div>
                    <Label htmlFor="category">Category</Label>
                    <select
                      id="category"
                      value={eventData.category}
                      onChange={(e) => handleInputChange("category", e.target.value)}
                      className="w-full p-2 border border-purple-200 rounded-md focus:border-purple-400 focus:outline-none focus:ring-2 focus:ring-purple-200"
                    >
                      <option value="">Select Category</option>
                      <option value="music">🎶 Music</option>
                      <option value="art">🎨 Art & Culture</option>
                      <option value="tech">💻 Tech</option>
                      <option value="sports">⚽ Sports</option>
                      <option value="food">🍕 Food & Drink</option>
                      <option value="other">🎪 Other</option>
                    </select>
                  </div>
                </div>

                <Button 
                  type="submit" 
                  className="w-full bg-gradient-to-r from-purple-500 to-pink-500 hover:from-purple-600 hover:to-pink-600 text-white py-3"
                >
                  🚀 Launch My Event!
                </Button>
              </form>
            </CardContent>
          </Card>

          {/* Ticket Designer */}
          <Card className="border-purple-200">
            <CardHeader>
              <CardTitle className="text-2xl text-purple-600">🎨 Design Your Ticket</CardTitle>
            </CardHeader>
            <CardContent>
              <TicketDesigner 
                eventTitle={eventData.title || "Your Amazing Event"}
                eventDate={eventData.date}
                eventLocation={eventData.location || "Amazing Venue"}
                design={ticketDesign}
                onDesignChange={setTicketDesign}
              />
            </CardContent>
          </Card>
        </div>
      </main>

      <Footer />
    </div>
  );
};

export default CreateEvent;
