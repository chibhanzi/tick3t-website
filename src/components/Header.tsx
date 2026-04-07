import { useState } from "react";
import { Link, useNavigate, useLocation } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet";
import { Menu, User, Calendar, ShoppingBag, LayoutDashboard, Plus } from "lucide-react";
import { useAuth } from "@/contexts/AuthContext";
import { useTheme } from "next-themes";
import ThemeToggle from "@/components/ThemeToggle";

const Header = () => {
  const [isOpen, setIsOpen] = useState(false);
  const { user, isOrganizer, logout } = useAuth();
  const { theme } = useTheme();
  const navigate = useNavigate();
  const location = useLocation();

  const handleLogout = () => {
    logout();
    navigate("/");
    setIsOpen(false);
  };

  const navigationItems = isOrganizer
    ? [
        { href: "/organizer-dashboard", label: "Organizer Dashboard", icon: LayoutDashboard },
        { href: "/create-event", label: "Create Event", icon: Plus },
        { href: "/events", label: "Events", icon: Calendar },
      ]
    : [
        { href: "/events", label: "Events", icon: Calendar },
        { href: "/marketplace", label: "Marketplace", icon: ShoppingBag },
      ];

  const logoSrc = theme === "dark"
    ? "/lovable-uploads/426ad065-11b6-44a4-accc-c8b230d0cd1f.png"
    : "/lovable-uploads/658387a1-c740-4733-b2a5-3c1bebd8ed00.png";

  const dashboardLink = isOrganizer ? "/organizer-dashboard" : "/dashboard";
  const dashboardLabel = isOrganizer ? "Organizer Dashboard" : "Dashboard";

  return (
    <header className="sticky top-0 z-50 w-full border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
      <div className="container flex h-16 items-center justify-between px-4 sm:px-6 lg:px-8">
        <div className="flex items-center space-x-4">
          <Link to="/" className="flex items-center space-x-2 transition-opacity hover:opacity-80">
            <img src={logoSrc} alt="Tick3rt" className="h-8 w-auto" />
          </Link>
          {isOrganizer && (
            <Badge variant="outline" className="hidden text-[10px] sm:inline-flex">Organizer</Badge>
          )}
        </div>

        <nav className="hidden items-center space-x-6 md:flex">
          {navigationItems.map((item) => (
            <Link
              key={item.href}
              to={item.href}
              className={`flex items-center space-x-1 text-sm font-medium transition-colors hover:text-primary ${location.pathname === item.href ? "text-primary" : ""}`}
            >
              <item.icon className="h-4 w-4" />
              <span>{item.label}</span>
            </Link>
          ))}
        </nav>

        <div className="hidden items-center space-x-3 md:flex">
          <ThemeToggle />
          {user ? (
            <div className="flex items-center space-x-2">
              <Link to={dashboardLink}>
                <Button variant="ghost" size="sm">
                  {isOrganizer ? <LayoutDashboard className="mr-1 h-4 w-4" /> : <User className="mr-1 h-4 w-4" />}
                  <span>{dashboardLabel}</span>
                </Button>
              </Link>
              <Button variant="outline" size="sm" onClick={handleLogout}>Logout</Button>
            </div>
          ) : (
            <Link to="/auth">
              <Button size="sm">Sign In</Button>
            </Link>
          )}
        </div>

        <div className="flex items-center space-x-2 md:hidden">
          <ThemeToggle />
          <Sheet open={isOpen} onOpenChange={setIsOpen}>
            <SheetTrigger asChild>
              <Button variant="ghost" size="icon">
                <Menu className="h-5 w-5" />
                <span className="sr-only">Toggle menu</span>
              </Button>
            </SheetTrigger>
            <SheetContent side="right" className="w-[300px] sm:w-[400px]">
              <nav className="mt-8 flex flex-col space-y-4">
                {navigationItems.map((item) => (
                  <Link
                    key={item.href}
                    to={item.href}
                    className="flex items-center space-x-3 py-2 text-lg font-medium transition-colors hover:text-primary"
                    onClick={() => setIsOpen(false)}
                  >
                    <item.icon className="h-5 w-5" />
                    <span>{item.label}</span>
                  </Link>
                ))}

                {user ? (
                  <>
                    {!isOrganizer && (
                      <Link
                        to="/dashboard"
                        className="flex items-center space-x-3 py-2 text-lg font-medium transition-colors hover:text-primary"
                        onClick={() => setIsOpen(false)}
                      >
                        <User className="h-5 w-5" />
                        <span>Dashboard</span>
                      </Link>
                    )}

                    <Button
                      variant="outline"
                      onClick={handleLogout}
                      className="mt-4 w-full justify-start"
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
