
import { useState } from "react";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import CreateEventSteps from "@/components/CreateEventSteps";
import { Card, CardContent } from "@/components/ui/card";
import { Sparkles } from "lucide-react";
import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { useAuth } from "@/contexts/AuthContext";
import { publishEvent, type PublishableEventData } from "@/lib/publishedEvents";
import { useToast } from "@/hooks/use-toast";

const CreateEvent = () => {
  const [isCompleted, setIsCompleted] = useState(false);
  const [publishedEventId, setPublishedEventId] = useState<string | null>(null);
  const { user } = useAuth();
  const { toast } = useToast();

  const handleEventComplete = async (eventData: PublishableEventData) => {
    if (!user) return false;
    try {
      const publishedEvent = await publishEvent(eventData);
      setPublishedEventId(publishedEvent.id);
      setIsCompleted(true);
      return true;
    } catch (error) {
      toast({
        variant: "destructive",
        title: "Could not publish event",
        description:
          error instanceof Error ? error.message : "Please try again.",
      });
      return false;
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-50 dark:from-slate-950 dark:via-slate-900 dark:to-slate-800">
      <Header />
      
      <main className="container mx-auto px-4 sm:px-6 lg:px-8 py-4 sm:py-8">
        <div className="text-center mb-6 sm:mb-12">
          <h1 className="text-2xl sm:text-4xl font-bold mb-2 sm:mb-4 bg-gradient-to-r from-blue-600 to-indigo-600 dark:from-blue-400 dark:to-indigo-400 bg-clip-text text-transparent">
            Create Your Event
          </h1>
          <p className="text-lg sm:text-xl text-muted-foreground max-w-2xl mx-auto px-4">
            Design unique NFT tickets and bring your vision to life
          </p>
        </div>

        {!isCompleted ? (
          <CreateEventSteps onComplete={handleEventComplete} />
        ) : (
          <Card className="max-w-2xl mx-auto text-center border-green-200 dark:border-green-800 bg-white dark:bg-slate-900 mx-4">
            <CardContent className="p-6 sm:p-12">
              <Sparkles className="h-12 w-12 sm:h-16 sm:w-16 text-green-500 mx-auto mb-4 sm:mb-6" />
              <h2 className="text-2xl sm:text-3xl font-bold text-green-600 dark:text-green-400 mb-2 sm:mb-4">
                Event Created Successfully!
              </h2>
              <p className="text-muted-foreground mb-4 sm:mb-6 text-sm sm:text-base">
                Your event has been published to the blockchain. Tickets are now available for purchase.
              </p>
              <div className="bg-green-50 dark:bg-green-900/20 p-3 sm:p-4 rounded-lg">
                <p className="text-xs sm:text-sm text-green-700 dark:text-green-300">
                  Your event is live on the events page now.
                </p>
              </div>
              {publishedEventId && (
                <Button asChild className="mt-5">
                  <Link to={`/event/${publishedEventId}`}>View published event</Link>
                </Button>
              )}
            </CardContent>
          </Card>
        )}
      </main>

      <Footer />
    </div>
  );
};

export default CreateEvent;
