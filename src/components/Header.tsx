
import { Button } from "@/components/ui/button";
import { useIsMobile } from "@/hooks/use-mobile";

const Header = () => {
  const isMobile = useIsMobile();

  return (
    <header className="sticky top-0 z-50 w-full border-b bg-white/80 backdrop-blur-lg">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex h-16 items-center justify-between">
          <div className="flex items-center space-x-4">
            <div className="flex items-center space-x-2">
              <div className="h-8 w-8 rounded-lg bg-neon-gradient flex items-center justify-center">
                <span className="text-white font-bold text-lg">T</span>
              </div>
              <span className="font-bold text-xl blockchain-gradient-text">
                TicketChain
              </span>
            </div>
          </div>

          {!isMobile && (
            <nav className="hidden md:flex items-center space-x-8">
              <a href="#" className="text-gray-600 hover:text-gray-900 transition-colors">
                Events
              </a>
              <a href="#" className="text-gray-600 hover:text-gray-900 transition-colors">
                Create Event
              </a>
              <a href="#" className="text-gray-600 hover:text-gray-900 transition-colors">
                My Tickets
              </a>
            </nav>
          )}

          <div className="flex items-center space-x-4">
            <Button variant="outline" className="hidden sm:inline-flex">
              Connect Wallet
            </Button>
            <Button className="bg-neon-gradient hover:opacity-90 text-white">
              Sign In
            </Button>
          </div>
        </div>
      </div>
    </header>
  );
};

export default Header;
