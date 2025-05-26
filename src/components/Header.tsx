
import { Button } from "@/components/ui/button";
import { useIsMobile } from "@/hooks/use-mobile";
import { Link } from "react-router-dom";

const Header = () => {
  const isMobile = useIsMobile();

  return (
    <header className="sticky top-0 z-50 w-full border-b bg-white/80 backdrop-blur-lg">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex h-16 items-center justify-between">
          <div className="flex items-center space-x-4">
            <Link to="/" className="flex items-center space-x-2">
              <div className="h-8 w-8 rounded-lg bg-gradient-to-r from-purple-500 to-pink-500 flex items-center justify-center animate-pulse">
                <span className="text-white font-bold text-lg">3</span>
              </div>
              <span className="font-bold text-xl bg-gradient-to-r from-purple-600 to-pink-600 bg-clip-text text-transparent">
                Tick3rt
              </span>
            </Link>
          </div>

          {!isMobile && (
            <nav className="hidden md:flex items-center space-x-8">
              <Link to="/events" className="text-gray-600 hover:text-purple-600 transition-colors font-medium">
                Events
              </Link>
              <Link to="/create-event" className="text-gray-600 hover:text-purple-600 transition-colors font-medium">
                Create Event
              </Link>
              <Link to="/my-tickets" className="text-gray-600 hover:text-purple-600 transition-colors font-medium">
                My Tickets
              </Link>
            </nav>
          )}

          <div className="flex items-center space-x-4">
            <Button variant="outline" className="hidden sm:inline-flex border-purple-200 hover:bg-purple-50">
              Connect Wallet
            </Button>
            <Link to="/auth">
              <Button className="bg-gradient-to-r from-purple-500 to-pink-500 hover:from-purple-600 hover:to-pink-600 text-white">
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
