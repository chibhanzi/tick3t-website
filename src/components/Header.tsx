
import { Button } from "@/components/ui/button";
import { useIsMobile } from "@/hooks/use-mobile";
import { Link } from "react-router-dom";
import WalletConnect from "./WalletConnect";

const Header = () => {
  const isMobile = useIsMobile();

  return (
    <header className="sticky top-0 z-50 w-full border-b bg-white/80 backdrop-blur-lg">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex h-16 items-center justify-between">
          <div className="flex items-center space-x-4">
            <Link to="/" className="flex items-center space-x-2">
              <div className="h-8 w-8 rounded-lg bg-gradient-to-r from-blue-500 to-purple-500 flex items-center justify-center">
                <span className="text-white font-bold text-lg">T</span>
              </div>
              <span className="font-bold text-xl bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
                Tick3rt
              </span>
            </Link>
          </div>

          {!isMobile && (
            <nav className="hidden md:flex items-center space-x-8">
              <Link to="/events" className="text-gray-600 hover:text-blue-600 transition-colors font-medium">
                Events
              </Link>
              <Link to="/create-event" className="text-gray-600 hover:text-blue-600 transition-colors font-medium">
                Create Event
              </Link>
              <Link to="/my-tickets" className="text-gray-600 hover:text-blue-600 transition-colors font-medium">
                My Tickets
              </Link>
            </nav>
          )}

          <div className="flex items-center space-x-4">
            <div className="hidden sm:block">
              <WalletConnect />
            </div>
            <Link to="/auth">
              <Button className="bg-gradient-to-r from-blue-500 to-purple-500 hover:from-blue-600 hover:to-purple-600 text-white transition-all duration-300 hover:scale-105 hover:shadow-lg">
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
