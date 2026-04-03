
import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet";
import { Menu, User, Calendar, Ticket, ShoppingBag } from "lucide-react";
import { useAuth } from "@/contexts/AuthContext";
import { useTheme } from "next-themes";
import ThemeToggle from "@/components/ThemeToggle";

const Header = () => {
  const [isOpen, setIsOpen] = useState(false);
  const { user, logout } = useAuth();
  const { theme } = useTheme();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate("/");
    setIsOpen(false);
  };

  const navigationItems = [
    { href: "/events", label: "Events", icon: Calendar },
    { href: "/marketplace", label: "Marketplace", icon: ShoppingBag },
  ];

  // Choose logo based on theme
  const logoSrc = theme === 'dark' 
    ? "/lovable-uploads/426ad065-11b6-44a4-accc-c8b230d0cd1f.png"
    : "/lovable-uploads/658387a1-c740-4733-b2a5-3c1bebd8ed00.png";

  return (
    <header className="sticky top-0 z-50 w-full border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
      <div className="container flex h-16 items-center justify-between px-4 sm:px-6 lg:px-8">
        <div className="flex items-center space-x-4">
          <Link to="/" className="flex items-center space-x-2 hover:opacity-80 transition-opacity">
            <img 
              src={logoSrc}
              alt="Tick3rt" 
              className="h-8 w-auto"
            />
          </Link>
        </div>

        {/* Desktop Navigation */}
        <nav className="hidden md:flex items-center space-x-6">
          {navigationItems.map((item) => (
            <Link
              key={item.href}
              to={item.href}
              className="text-sm font-medium transition-colors hover:text-primary flex items-center space-x-1"
            >
              <item.icon className="h-4 w-4" />
              <span>{item.label}</span>
            </Link>
          ))}
        </nav>

        {/* Desktop Actions */}
        <div className="hidden md:flex items-center space-x-4">
          <ThemeToggle />
          {user ? (
            <div className="flex items-center space-x-2">
              <Link to={user.isOrganizer ? "/organizer-dashboard" : "/dashboard"}>
                <Button variant="ghost" size="sm" className="flex items-center space-x-2">
                  <User className="h-4 w-4" />
                  <span>Dashboard</span>
                </Button>
              </Link>
              {user.role === 'organizer' && (
                <Link to="/create-event">
                  <Button size="sm" className="flex items-center space-x-2">
                    <Calendar className="h-4 w-4" />
                    <span>Create Event</span>
                  </Button>
                </Link>
              )}
              <Button variant="outline" size="sm" onClick={handleLogout}>
                Logout
              </Button>
            </div>
          ) : (
            <Link to="/auth">
              <Button size="sm">Sign In</Button>
            </Link>
          )}
        </div>

        {/* Mobile Menu */}
        <div className="md:hidden flex items-center space-x-2">
          <ThemeToggle />
          <Sheet open={isOpen} onOpenChange={setIsOpen}>
            <SheetTrigger asChild>
              <Button variant="ghost" size="icon">
                <Menu className="h-5 w-5" />
                <span className="sr-only">Toggle menu</span>
              </Button>
            </SheetTrigger>
            <SheetContent side="right" className="w-[300px] sm:w-[400px]">
              <nav className="flex flex-col space-y-4 mt-8">
                {navigationItems.map((item) => (
                  <Link
                    key={item.href}
                    to={item.href}
                    className="flex items-center space-x-3 text-lg font-medium transition-colors hover:text-primary py-2"
                    onClick={() => setIsOpen(false)}
                  >
                    <item.icon className="h-5 w-5" />
                    <span>{item.label}</span>
                  </Link>
                ))}
                
                {user ? (
                  <>
                    <Link
                      to={user.isOrganizer ? "/organizer-dashboard" : "/dashboard"}
                      className="flex items-center space-x-3 text-lg font-medium transition-colors hover:text-primary py-2"
                      onClick={() => setIsOpen(false)}
                    >
                      <User className="h-5 w-5" />
                      <span>Dashboard</span>
                    </Link>
                    <Link
                      to="/my-tickets"
                      className="flex items-center space-x-3 text-lg font-medium transition-colors hover:text-primary py-2"
                      onClick={() => setIsOpen(false)}
                    >
                      <Ticket className="h-5 w-5" />
                      <span>My Tickets</span>
                    </Link>
                    {user.role === 'organizer' && (
                      <Link
                        to="/create-event"
                        className="flex items-center space-x-3 text-lg font-medium transition-colors hover:text-primary py-2"
                        onClick={() => setIsOpen(false)}
                      >
                        <Calendar className="h-5 w-5" />
                        <span>Create Event</span>
                      </Link>
                    )}
                    <Button 
                      variant="outline" 
                      onClick={handleLogout}
                      className="w-full justify-start mt-4"
                    >
                      Logout
                    </Button>
                  </>
                ) : (
                  <Link to="/auth" onClick={() => setIsOpen(false)}>
                    <Button className="w-full">Sign In</Button>
                  </Link>
                )}
              </nav>
            </SheetContent>
          </Sheet>
        </div>
      </div>
    </header>
  );
};

export default Header;
