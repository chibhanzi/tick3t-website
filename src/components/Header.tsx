
import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { useAuth } from '@/contexts/AuthContext';
import { 
  Menu, 
  X, 
  User, 
  Settings, 
  LogOut, 
  Calendar, 
  Ticket,
  LayoutDashboard,
  Plus,
  Sparkles
} from 'lucide-react';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';

interface NavigationItem {
  name: string;
  href: string;
  badge?: string;
}

const Header = () => {
  const [isOpen, setIsOpen] = useState(false);
  const { user, logout, isAuthenticated, isOrganizer } = useAuth();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate('/');
  };

  const navigation: NavigationItem[] = [
    { name: 'Events', href: '/events' },
    { name: 'Marketplace', href: '/marketplace', badge: 'New' },
  ];

  const userNavigation: NavigationItem[] = isAuthenticated 
    ? [
        { name: 'Dashboard', href: '/dashboard' },
        { name: 'My Tickets', href: '/my-tickets' },
        ...(isOrganizer ? [
          { name: 'Organizer Dashboard', href: '/organizer-dashboard', badge: 'Pro' },
          { name: 'Create Event', href: '/create-event' }
        ] : [
          { name: 'Become Organizer', href: '/upgrade-to-organizer', badge: 'Upgrade' }
        ])
      ]
    : [];

  return (
    <header className="bg-white dark:bg-slate-900 shadow-lg border-b border-slate-200 dark:border-slate-700 sticky top-0 z-50">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          {/* Logo */}
          <Link to="/" className="flex items-center space-x-2">
            <div className="w-8 h-8 bg-gradient-to-r from-purple-600 to-pink-600 rounded-lg flex items-center justify-center">
              <Ticket className="h-5 w-5 text-white" />
            </div>
            <span className="text-xl font-bold bg-gradient-to-r from-purple-600 to-pink-600 bg-clip-text text-transparent">
              Tick3rt
            </span>
          </Link>

          {/* Desktop Navigation */}
          <nav className="hidden md:flex items-center space-x-8">
            {navigation.map((item) => (
              <div key={item.name} className="relative">
                <Link
                  to={item.href}
                  className="text-slate-700 dark:text-slate-300 hover:text-purple-600 dark:hover:text-purple-400 font-medium transition-colors duration-200 flex items-center gap-2"
                >
                  {item.name}
                  {item.badge && (
                    <Badge variant="secondary" className="text-xs bg-purple-100 text-purple-700 dark:bg-purple-900 dark:text-purple-300">
                      {item.badge}
                    </Badge>
                  )}
                </Link>
              </div>
            ))}
          </nav>

          {/* User Actions */}
          <div className="flex items-center space-x-4">
            {isAuthenticated ? (
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button variant="ghost" className="relative h-8 w-8 rounded-full">
                    <Avatar className="h-8 w-8">
                      <AvatarImage src={user?.profilePicture} alt={user?.name} />
                      <AvatarFallback>
                        {user?.name?.charAt(0).toUpperCase() || 'U'}
                      </AvatarFallback>
                    </Avatar>
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent className="w-56" align="end" forceMount>
                  <div className="flex items-center justify-start gap-2 p-2">
                    <div className="flex flex-col space-y-1 leading-none">
                      <p className="font-medium">{user?.name}</p>
                      <p className="w-[200px] truncate text-sm text-muted-foreground">
                        {user?.email}
                      </p>
                      <div className="flex items-center gap-2">
                        <Badge variant={user?.role === 'organizer' ? 'default' : 'secondary'} className="text-xs">
                          {user?.role === 'organizer' ? '👑 Organizer' : '🎫 User'}
                        </Badge>
                        {user?.isVerified && (
                          <Badge variant="outline" className="text-xs">
                            ✅ Verified
                          </Badge>
                        )}
                      </div>
                    </div>
                  </div>
                  <DropdownMenuSeparator />
                  
                  {userNavigation.map((item) => (
                    <DropdownMenuItem key={item.name} asChild>
                      <Link to={item.href} className="flex items-center justify-between w-full">
                        <div className="flex items-center">
                          {item.name === 'Dashboard' && <LayoutDashboard className="mr-2 h-4 w-4" />}
                          {item.name === 'My Tickets' && <Ticket className="mr-2 h-4 w-4" />}
                          {item.name === 'Organizer Dashboard' && <Settings className="mr-2 h-4 w-4" />}
                          {item.name === 'Create Event' && <Plus className="mr-2 h-4 w-4" />}
                          {item.name === 'Become Organizer' && <Sparkles className="mr-2 h-4 w-4" />}
                          {item.name}
                        </div>
                        {item.badge && (
                          <Badge variant="secondary" className="text-xs">
                            {item.badge}
                          </Badge>
                        )}
                      </Link>
                    </DropdownMenuItem>
                  ))}
                  
                  <DropdownMenuSeparator />
                  <DropdownMenuItem onClick={handleLogout}>
                    <LogOut className="mr-2 h-4 w-4" />
                    <span>Log out</span>
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            ) : (
              <div className="flex items-center space-x-3">
                <Button asChild variant="ghost" size="sm">
                  <Link to="/auth">Sign In</Link>
                </Button>
                <Button asChild size="sm" className="bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700">
                  <Link to="/auth?mode=register">Get Started</Link>
                </Button>
              </div>
            )}

            {/* Mobile menu button */}
            <div className="md:hidden">
              <Button
                variant="ghost"
                size="sm"
                onClick={() => setIsOpen(!isOpen)}
                aria-label="Toggle navigation"
              >
                {isOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
              </Button>
            </div>
          </div>
        </div>

        {/* Mobile Navigation */}
        {isOpen && (
          <div className="md:hidden">
            <div className="px-2 pt-2 pb-3 space-y-1 sm:px-3 border-t border-slate-200 dark:border-slate-700">
              {navigation.map((item) => (
                <div key={item.name}>
                  <Link
                    to={item.href}
                    className="text-slate-700 dark:text-slate-300 hover:text-purple-600 dark:hover:text-purple-400 block px-3 py-2 text-base font-medium transition-colors duration-200 flex items-center justify-between"
                    onClick={() => setIsOpen(false)}
                  >
                    <span>{item.name}</span>
                    {item.badge && (
                      <Badge variant="secondary" className="text-xs">
                        {item.badge}
                      </Badge>
                    )}
                  </Link>
                </div>
              ))}
              
              {isAuthenticated && (
                <>
                  <div className="border-t border-slate-200 dark:border-slate-700 my-2"></div>
                  {userNavigation.map((item) => (
                    <Link
                      key={item.name}
                      to={item.href}
                      className="text-slate-700 dark:text-slate-300 hover:text-purple-600 dark:hover:text-purple-400 block px-3 py-2 text-base font-medium transition-colors duration-200 flex items-center justify-between"
                      onClick={() => setIsOpen(false)}
                    >
                      <span>{item.name}</span>
                      {item.badge && (
                        <Badge variant="secondary" className="text-xs">
                          {item.badge}
                        </Badge>
                      )}
                    </Link>
                  ))}
                  <button
                    onClick={() => {
                      handleLogout();
                      setIsOpen(false);
                    }}
                    className="text-slate-700 dark:text-slate-300 hover:text-red-600 dark:hover:text-red-400 block px-3 py-2 text-base font-medium transition-colors duration-200 w-full text-left"
                  >
                    Sign Out
                  </button>
                </>
              )}
              
              {!isAuthenticated && (
                <>
                  <div className="border-t border-slate-200 dark:border-slate-700 my-2"></div>
                  <Link
                    to="/auth"
                    className="text-slate-700 dark:text-slate-300 hover:text-purple-600 dark:hover:text-purple-400 block px-3 py-2 text-base font-medium"
                    onClick={() => setIsOpen(false)}
                  >
                    Sign In
                  </Link>
                  <Link
                    to="/auth?mode=register"
                    className="text-purple-600 hover:text-purple-700 block px-3 py-2 text-base font-medium"
                    onClick={() => setIsOpen(false)}
                  >
                    Get Started
                  </Link>
                </>
              )}
            </div>
          </div>
        )}
      </div>
    </header>
  );
};

export default Header;
