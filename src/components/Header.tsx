import { useState } from "react";
import { Link, useNavigate, useLocation } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet";
import {
  DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger, DropdownMenuLabel, DropdownMenuSeparator,
} from "@/components/ui/dropdown-menu";
import { Menu, User, Calendar, ShoppingBag, LayoutDashboard, Plus, LogOut, Ticket, AtSign, ChevronDown } from "lucide-react";
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

  const logoDark = "/lovable-uploads/426ad065-11b6-44a4-accc-c8b230d0cd1f.png";
  const logoLight = "/lovable-uploads/658387a1-c740-4733-b2a5-3c1bebd8ed00.png";
  const logoSrc = theme === "dark" ? logoDark : logoLight;

  const dashboardLink = isOrganizer ? "/organizer-dashboard" : "/dashboard";
  const dashboardLabel = isOrganizer ? "Organizer Dashboard" : "Dashboard";

  return (
    <header className="sticky top-0 z-50 w-full border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
      <div className="container flex h-16 items-center justify-between px-4 sm:px-6 lg:px-8">
        <div className="flex items-center space-x-4">
          <Link to="/" className="flex items-center space-x-2 transition-opacity hover:opacity-80">
            <span className="relative inline-block h-8 w-[110px]">
              <img src={logoLight} alt="Tick3rt" className={`absolute inset-0 h-8 w-auto transition-opacity duration-500 ${theme === "dark" ? "opacity-0" : "opacity-100"}`} />
              <img src={logoDark} alt="" aria-hidden className={`absolute inset-0 h-8 w-auto transition-opacity duration-500 ${theme === "dark" ? "opacity-100" : "opacity-0"}`} />
            </span>
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
            <SheetContent side="right" className="w-[320px] sm:w-[380px] border-l border-border/50 p-0 bg-background/95 backdrop-blur-xl">
              <div className="flex flex-col h-full">
                {/* Drawer Header */}
                <div className="flex items-center justify-between px-5 py-4 border-b border-border/40">
                  <Link to="/" onClick={() => setIsOpen(false)} className="flex items-center gap-2">
                    <img src={logoSrc} alt="Tick3rt" className="h-7 w-auto" />
                  </Link>
                </div>

                {/* Navigation Links */}
                <nav className="flex-1 overflow-y-auto px-3 py-4">
                  <div className="space-y-1">
                    {navigationItems.map((item) => {
                      const isActive = location.pathname === item.href;
                      return (
                        <Link
                          key={item.href}
                          to={item.href}
                          onClick={() => setIsOpen(false)}
                          className={`flex items-center gap-3 rounded-lg px-3 py-2.5 text-sm font-medium transition-all duration-200 ${
                            isActive
                              ? "bg-primary/10 text-primary ring-1 ring-primary/20"
                              : "text-foreground/80 hover:bg-muted hover:text-foreground"
                          }`}
                        >
                          <div className={`flex h-8 w-8 items-center justify-center rounded-md ${
                            isActive ? "bg-primary/15 text-primary" : "bg-muted text-muted-foreground"
                          }`}>
                            <item.icon className="h-4 w-4" />
                          </div>
                          <span>{item.label}</span>
                        </Link>
                      );
                    })}
                  </div>

                  {user && (
                    <>
                      <div className="my-4 border-t border-border/40" />
                      <div className="space-y-1">
                        {!isOrganizer && (
                          <Link
                            to="/dashboard"
                            onClick={() => setIsOpen(false)}
                            className={`flex items-center gap-3 rounded-lg px-3 py-2.5 text-sm font-medium transition-all duration-200 ${
                              location.pathname === "/dashboard"
                                ? "bg-primary/10 text-primary ring-1 ring-primary/20"
                                : "text-foreground/80 hover:bg-muted hover:text-foreground"
                            }`}
                          >
                            <div className={`flex h-8 w-8 items-center justify-center rounded-md ${
                              location.pathname === "/dashboard" ? "bg-primary/15 text-primary" : "bg-muted text-muted-foreground"
                            }`}>
                              <User className="h-4 w-4" />
                            </div>
                            <span>Dashboard</span>
                          </Link>
                        )}
                      </div>
                    </>
                  )}
                </nav>

                {/* Bottom Actions */}
                <div className="border-t border-border/40 px-3 py-4">
                  {user ? (
                    <div className="space-y-2">
                      <div className="flex items-center gap-3 px-3 py-2">
                        <div className="flex h-9 w-9 items-center justify-center rounded-full bg-primary/10 ring-1 ring-primary/20">
                          <User className="h-4 w-4 text-primary" />
                        </div>
                        <div className="flex-1 min-w-0">
                          <p className="text-sm font-medium truncate">{user?.name || "User"}</p>
                          <p className="text-xs text-muted-foreground truncate">{user?.email || ""}</p>
                        </div>
                      </div>
                      <Button
                        variant="ghost"
                        onClick={handleLogout}
                        className="w-full justify-start gap-3 px-3 text-sm font-medium text-muted-foreground hover:text-destructive hover:bg-destructive/5"
                      >
                        <LogOut className="h-4 w-4" />
                        Logout
                      </Button>
                    </div>
                  ) : (
                    <Link to="/auth" onClick={() => setIsOpen(false)} className="block">
                      <Button className="w-full gap-2 text-sm">
                        <Ticket className="h-4 w-4" />
                        Sign In
                      </Button>
                    </Link>
                  )}
                </div>
              </div>
            </SheetContent>
          </Sheet>
        </div>
      </div>
    </header>
  );
};

export default Header;
