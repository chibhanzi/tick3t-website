
import { Button } from "@/components/ui/button";
import { useIsMobile } from "@/hooks/use-mobile";
import { Link } from "react-router-dom";
import WalletConnect from "./WalletConnect";
import ThemeToggle from "./ThemeToggle";

const Header = () => {
  const isMobile = useIsMobile();

  return (
    <header className="sticky top-0 z-50 w-full border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex h-16 items-center justify-between">
          <div className="flex items-center space-x-4">
            <Link to="/" className="flex items-center">
              <img 
                src="/lovable-uploads/ec067a0f-a119-4f95-a148-9ca1d5b161d0.png" 
                alt="Tick3rt Logo" 
                className="h-12 w-auto"
              />
            </Link>
          </div>

          {!isMobile && (
            <nav className="hidden md:flex items-center space-x-8">
              <Link to="/events" className="text-muted-foreground hover:text-primary transition-colors font-medium">
                Events
              </Link>
              <Link to="/marketplace" className="text-muted-foreground hover:text-primary transition-colors font-medium">
                Marketplace
              </Link>
              <Link to="/create-event" className="text-muted-foreground hover:text-primary transition-colors font-medium">
                Create Event
              </Link>
              <Link to="/my-tickets" className="text-muted-foreground hover:text-primary transition-colors font-medium">
                My Tickets
              </Link>
            </nav>
          )}

          <div className="flex items-center space-x-4">
            <ThemeToggle />
            <div className="hidden sm:block">
              <WalletConnect />
            </div>
            <Link to="/auth">
              <Button className="bg-gradient-to-r from-blue-500 to-indigo-500 hover:from-blue-600 hover:to-indigo-600 text-white transition-all duration-300 hover:scale-105 hover:shadow-lg">
                Sign In
              </Button>
            </Link>
          </div>
        </div>
      </div>
    </header>
  );
};

export default Header;
