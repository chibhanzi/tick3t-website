
import { useState } from "react";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import CreateEventSteps from "@/components/CreateEventSteps";
import { Card, CardContent } from "@/components/ui/card";
import { Sparkles } from "lucide-react";

interface EventData {
  title: string;
  date: string;
  location: string;
  description: string;
  price: string;
  totalTickets: string;
  category: string;
}

const CreateEvent = () => {
  const [isCompleted, setIsCompleted] = useState(false);

  const handleEventComplete = (eventData: EventData) => {
    console.log("Event Data:", eventData);
    // Here we would integrate with blockchain to create the event
    setIsCompleted(true);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-50 dark:from-slate-950 dark:via-slate-900 dark:to-slate-800">
      <Header />
      
      <main className="container mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="text-center mb-12">
          <h1 className="text-4xl font-bold mb-4 bg-gradient-to-r from-blue-600 to-indigo-600 dark:from-blue-400 dark:to-indigo-400 bg-clip-text text-transparent">
            Create Your Event
          </h1>
          <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
            Design unique NFT tickets and bring your vision to life
          </p>
        </div>

        {!isCompleted ? (
          <CreateEventSteps onComplete={handleEventComplete} />
        ) : (
          <Card className="max-w-2xl mx-auto text-center border-green-200 dark:border-green-800 bg-white dark:bg-slate-900">
            <CardContent className="p-12">
              <Sparkles className="h-16 w-16 text-green-500 mx-auto mb-6" />
              <h2 className="text-3xl font-bold text-green-600 dark:text-green-400 mb-4">
                Event Created Successfully!
              </h2>
              <p className="text-muted-foreground mb-6">
                Your event has been published to the blockchain. Tickets are now available for purchase.
              </p>
              <div className="bg-green-50 dark:bg-green-900/20 p-4 rounded-lg">
                <p className="text-sm text-green-700 dark:text-green-300">
                  Your event will appear on the events page within a few minutes.
                </p>
              </div>
            </CardContent>
          </Card>
        )}
      </main>

      <Footer />
    </div>
  );
};

export default CreateEvent;
