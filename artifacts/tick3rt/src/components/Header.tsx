import { useState } from "react";
import { Link, useNavigate, useLocation } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet";
import {
  DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger,
  DropdownMenuLabel, DropdownMenuSeparator,
} from "@/components/ui/dropdown-menu";
import {
  Menu, User, Calendar, ShoppingBag, LayoutDashboard, Plus, LogOut,
  Ticket, AtSign, ChevronDown, Home, Bell, Settings,
} from "lucide-react";
import { useAuth } from "@/contexts/AuthContext";
import { useFollow } from "@/contexts/FollowContext";
import { useTheme } from "next-themes";
import ThemeToggle from "@/components/ThemeToggle";

const Header = () => {
  const [isOpen, setIsOpen] = useState(false);
  const { user, isOrganizer, logout } = useAuth();
  const { hasUnread, clearUnread } = useFollow();
  const { theme } = useTheme();
  const navigate = useNavigate();
  const location = useLocation();

  const handleLogout = () => {
    logout();
    navigate("/");
    setIsOpen(false);
  };

  // Dashboard link varies by role
  const dashboardLink = isOrganizer ? "/organizer-dashboard" : "/dashboard";
  const dashboardLabel = isOrganizer ? "Organizer Dashboard" : "Dashboard";

  // Nav items — dashboard lives in the profile dropdown + the standalone "Dashboard" nav link
  const navigationItems = isOrganizer
    ? [
        { href: "/create-event", label: "Create Event", icon: Plus },
        { href: "/events", label: "Events", icon: Calendar },
      ]
    : [
        { href: "/events", label: "Events", icon: Calendar },
      ];

  const marketplaceItems = [
    { href: "/marketplace", label: "Ticket Resale", description: "Verified resale market", icon: ShoppingBag },
    { href: "/marketplace/usernames", label: "Usernames", description: "Own your @handle", icon: AtSign },
  ];

  const logoDark = "/lovable-uploads/426ad065-11b6-44a4-accc-c8b230d0cd1f.png";
  const logoLight = "/lovable-uploads/658387a1-c740-4733-b2a5-3c1bebd8ed00.png";
  const logoSrc = theme === "dark" ? logoDark : logoLight;

  // Initials for avatar
  const initials = user?.name
    ? user.name.split(" ").map((n: string) => n[0]).join("").toUpperCase().slice(0, 2)
    : "U";

  return (
    <header className="sticky top-0 z-50 w-full border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
      <div className="container flex h-16 items-center justify-between px-4 sm:px-6 lg:px-8">

        {/* Logo + role badge */}
        <div className="flex items-center space-x-4">
          <Link to="/" className="flex items-center space-x-2 transition-opacity hover:opacity-80">
            <span className="relative inline-block h-8 w-[110px]">
              <img src={logoLight} alt="Tick3t" className={`absolute inset-0 h-8 w-auto transition-opacity duration-500 ${theme === "dark" ? "opacity-0" : "opacity-100"}`} />
              <img src={logoDark} alt="" aria-hidden className={`absolute inset-0 h-8 w-auto transition-opacity duration-500 ${theme === "dark" ? "opacity-100" : "opacity-0"}`} />
            </span>
          </Link>
          {isOrganizer && (
            <Badge variant="outline" className="hidden text-[10px] sm:inline-flex">Organizer</Badge>
          )}
        </div>

        {/* Desktop nav */}
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

          {/* Marketplace dropdown — all users */}
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <button
                className={`flex items-center gap-1 text-sm font-medium transition-colors hover:text-primary outline-none ${location.pathname.startsWith("/marketplace") ? "text-primary" : ""}`}
              >
                <ShoppingBag className="h-4 w-4" />
                <span>Marketplace</span>
                <ChevronDown className="h-3.5 w-3.5 opacity-70" />
              </button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="start" className="w-64">
              <DropdownMenuLabel className="text-[10px] uppercase tracking-wider text-muted-foreground">
                Browse
              </DropdownMenuLabel>
              <DropdownMenuSeparator />
              {marketplaceItems.map((m) => (
                <DropdownMenuItem key={m.href} asChild>
                  <Link to={m.href} className="flex items-start gap-3 py-2 cursor-pointer">
                    <div className="flex h-8 w-8 items-center justify-center rounded-md bg-primary/10 text-primary shrink-0">
                      <m.icon className="h-4 w-4" />
                    </div>
                    <div className="min-w-0">
                      <p className="text-sm font-medium leading-tight">{m.label}</p>
                      <p className="text-xs text-muted-foreground">{m.description}</p>
                    </div>
                  </Link>
                </DropdownMenuItem>
              ))}
            </DropdownMenuContent>
          </DropdownMenu>

          {/* Dashboard — visible when signed in */}
          {user && (
            <Link
              to={dashboardLink}
              className={`flex items-center space-x-1 text-sm font-medium transition-colors hover:text-primary ${location.pathname === dashboardLink ? "text-primary" : ""}`}
            >
              <LayoutDashboard className="h-4 w-4" />
              <span>Dashboard</span>
            </Link>
          )}
        </nav>

        {/* Desktop right-side actions */}
        <div className="hidden items-center space-x-3 md:flex">
          <ThemeToggle />

          {user ? (
            <div className="flex items-center space-x-2">
              {/* Notification bell — attendees only */}
              {!isOrganizer && (
                <Link
                  to="/events"
                  onClick={clearUnread}
                  className="relative flex h-9 w-9 items-center justify-center rounded-md hover:bg-muted transition-colors"
                  title="Events for you"
                >
                  <Bell className="h-4 w-4 text-muted-foreground" />
                  {hasUnread && (
                    <span className="absolute top-1.5 right-1.5 h-2 w-2 rounded-full bg-red-500 ring-2 ring-background" />
                  )}
                </Link>
              )}

              {/* Profile dropdown */}
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <button className="flex items-center gap-2 rounded-full outline-none ring-offset-background focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2">
                    <Avatar className="h-8 w-8 cursor-pointer ring-2 ring-border hover:ring-primary/50 transition-all">
                      <AvatarFallback className="text-xs font-semibold bg-primary/10 text-primary">
                        {initials}
                      </AvatarFallback>
                    </Avatar>
                  </button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end" className="w-56">
                  {/* User info header */}
                  <div className="flex items-center gap-3 px-3 py-2.5">
                    <Avatar className="h-8 w-8 shrink-0">
                      <AvatarFallback className="text-xs font-semibold bg-primary/10 text-primary">
                        {initials}
                      </AvatarFallback>
                    </Avatar>
                    <div className="min-w-0">
                      <p className="text-sm font-medium truncate">{user.name || "User"}</p>
                      <p className="text-xs text-muted-foreground truncate">{user.email}</p>
                    </div>
                  </div>
                  <DropdownMenuSeparator />

                  <DropdownMenuItem asChild>
                    <Link to={dashboardLink} className="flex items-center gap-2 cursor-pointer">
                      <LayoutDashboard className="h-4 w-4" />
                      <span>{dashboardLabel}</span>
                    </Link>
                  </DropdownMenuItem>

                  <DropdownMenuItem asChild>
                    <Link to="/settings" className="flex items-center gap-2 cursor-pointer">
                      <Settings className="h-4 w-4" />
                      <span>Settings</span>
                    </Link>
                  </DropdownMenuItem>

                  {!isOrganizer && (
                    <DropdownMenuItem asChild>
                      <Link to="/marketplace" className="flex items-center gap-2 cursor-pointer">
                        <Ticket className="h-4 w-4" />
                        <span>My Tickets</span>
                      </Link>
                    </DropdownMenuItem>
                  )}

                  <DropdownMenuSeparator />

                  <DropdownMenuItem
                    onClick={handleLogout}
                    className="flex items-center gap-2 cursor-pointer text-destructive focus:text-destructive focus:bg-destructive/10"
                  >
                    <LogOut className="h-4 w-4" />
                    <span>Sign out</span>
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            </div>
          ) : (
            <Link to="/auth">
              <Button size="sm">Sign In</Button>
            </Link>
          )}
        </div>

        {/* Mobile: theme toggle + hamburger */}
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
                    <img src={logoSrc} alt="Tick3t" className="h-7 w-auto" />
                  </Link>
                </div>

                {/* Navigation Links */}
                <nav className="flex-1 overflow-y-auto px-3 py-4">
                  <div className="space-y-1">
                    {[{ href: "/", label: "Home", icon: Home }, ...navigationItems].map((item) => {
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

                  <div className="mt-4 mb-2 px-3 text-[10px] uppercase tracking-wider text-muted-foreground">
                    Marketplace
                  </div>
                  <div className="space-y-1">
                    {marketplaceItems.map((m) => {
                      const isActive = location.pathname === m.href;
                      return (
                        <Link
                          key={m.href}
                          to={m.href}
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
                            <m.icon className="h-4 w-4" />
                          </div>
                          <div className="min-w-0 flex-1">
                            <p className="leading-tight">{m.label}</p>
                            <p className="text-[11px] text-muted-foreground">{m.description}</p>
                          </div>
                        </Link>
                      );
                    })}
                  </div>

                  {user && (
                    <>
                      <div className="my-4 border-t border-border/40" />
                      <div className="mt-2 mb-2 px-3 text-[10px] uppercase tracking-wider text-muted-foreground">
                        Account
                      </div>
                      <div className="space-y-1">
                        <Link
                          to={dashboardLink}
                          onClick={() => setIsOpen(false)}
                          className={`flex items-center gap-3 rounded-lg px-3 py-2.5 text-sm font-medium transition-all duration-200 ${
                            location.pathname === dashboardLink
                              ? "bg-primary/10 text-primary ring-1 ring-primary/20"
                              : "text-foreground/80 hover:bg-muted hover:text-foreground"
                          }`}
                        >
                          <div className={`flex h-8 w-8 items-center justify-center rounded-md ${
                            location.pathname === dashboardLink ? "bg-primary/15 text-primary" : "bg-muted text-muted-foreground"
                          }`}>
                            <LayoutDashboard className="h-4 w-4" />
                          </div>
                          <span>{dashboardLabel}</span>
                        </Link>
                        <Link
                          to="/settings"
                          onClick={() => setIsOpen(false)}
                          className={`flex items-center gap-3 rounded-lg px-3 py-2.5 text-sm font-medium transition-all duration-200 ${
                            location.pathname === "/settings"
                              ? "bg-primary/10 text-primary ring-1 ring-primary/20"
                              : "text-foreground/80 hover:bg-muted hover:text-foreground"
                          }`}
                        >
                          <div className={`flex h-8 w-8 items-center justify-center rounded-md ${
                            location.pathname === "/settings" ? "bg-primary/15 text-primary" : "bg-muted text-muted-foreground"
                          }`}>
                            <Settings className="h-4 w-4" />
                          </div>
                          <span>Settings</span>
                        </Link>
                      </div>
                    </>
                  )}
                </nav>

                {/* Bottom: user info + sign out */}
                <div className="border-t border-border/40 px-3 py-4">
                  {user ? (
                    <div className="space-y-2">
                      <div className="flex items-center gap-3 px-3 py-2">
                        <Avatar className="h-9 w-9 shrink-0">
                          <AvatarFallback className="text-xs font-semibold bg-primary/10 text-primary">
                            {initials}
                          </AvatarFallback>
                        </Avatar>
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
                        Sign out
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
