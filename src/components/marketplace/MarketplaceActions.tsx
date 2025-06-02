
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { useNavigate } from "react-router-dom";

const MarketplaceActions = () => {
  const navigate = useNavigate();

  const handleListTickets = () => {
    // In a real app, this would navigate to a ticket listing form
    console.log("Listing tickets...");
    alert("List Your Tickets functionality - would navigate to ticket listing form in production");
    // navigate("/list-tickets");
  };

  const handleLearnMore = () => {
    // In a real app, this would navigate to documentation or help page
    console.log("Learning more about marketplace...");
    alert("Learn More functionality - would show marketplace documentation in production");
    // navigate("/marketplace/help");
  };

  return (
    <div className="text-center mt-16">
      <Card className="max-w-4xl mx-auto border-slate-200 dark:border-slate-700 bg-gradient-to-br from-blue-50 to-indigo-50 dark:from-slate-800 dark:to-slate-700">
        <CardContent className="p-12">
          <div className="text-6xl mb-6">🎫</div>
          <h2 className="text-3xl font-bold mb-4 text-foreground">Ready to sell your tickets?</h2>
          <p className="text-lg text-muted-foreground mb-8 max-w-2xl mx-auto">
            Join thousands of verified sellers on our secure marketplace. Set your own prices and reach buyers worldwide.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Button 
              onClick={handleListTickets}
              className="bg-gradient-to-r from-blue-500 to-indigo-500 hover:from-blue-600 hover:to-indigo-600 text-lg px-8 py-3"
            >
              🚀 List Your Tickets
            </Button>
            <Button 
              variant="outline" 
              onClick={handleLearnMore}
              className="text-lg px-8 py-3 border-blue-200 hover:bg-blue-50 dark:border-slate-600 dark:hover:bg-slate-700"
            >
              📖 Learn More
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default MarketplaceActions;
