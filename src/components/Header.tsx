
import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { useAuth } from '@/contexts/AuthContext';
import { useTheme } from 'next-themes';
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
  const { theme } = useTheme();
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
    <header className="bg-white/95 dark:bg-slate-900/95 backdrop-blur-lg shadow-lg border-b border-slate-200/50 dark:border-slate-700/50 sticky top-0 z-50 transition-all duration-300">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          {/* Logo */}
          <Link to="/" className="flex items-center space-x-3 group">
            <div className="transition-transform duration-300 group-hover:scale-110">
              {theme === 'dark' ? (
                <img 
                  src="/lovable-uploads/dace9951-9667-4cb7-8c3f-4160753e1a11.png" 
                  alt="Tick3rt" 
                  className="h-10 w-auto"
                />
              ) : (
                <img 
                  src="/lovable-uploads/4f20ae97-3caf-4626-a5e4-720016037b0b.png" 
                  alt="Tick3rt" 
                  className="h-10 w-auto"
                />
              )}
            </div>
          </Link>

          {/* Desktop Navigation */}
          <nav className="hidden md:flex items-center space-x-8">
            {navigation.map((item) => (
              <div key={item.name} className="relative">
                <Link
                  to={item.href}
                  className="text-slate-700 dark:text-slate-300 hover:text-blue-600 dark:hover:text-blue-400 font-medium transition-all duration-200 flex items-center gap-2 hover:scale-105"
                >
                  {item.name}
                  {item.badge && (
                    <Badge variant="secondary" className="text-xs bg-gradient-to-r from-blue-100 to-purple-100 text-blue-700 dark:from-blue-900 dark:to-purple-900 dark:text-blue-300 animate-pulse">
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
                  <Button variant="ghost" className="relative h-10 w-10 rounded-full hover:scale-110 transition-all duration-300 hover:shadow-lg hover:shadow-blue-500/25">
                    <Avatar className="h-10 w-10 ring-2 ring-blue-500/20">
                      <AvatarImage src={user?.profilePicture} alt={user?.name} />
                      <AvatarFallback className="bg-gradient-to-br from-blue-500 to-purple-500 text-white">
                        {user?.name?.charAt(0).toUpperCase() || 'U'}
                      </AvatarFallback>
                    </Avatar>
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent className="w-64" align="end" forceMount>
                  <div className="flex items-center justify-start gap-3 p-3">
                    <div className="flex flex-col space-y-1 leading-none">
                      <p className="font-medium text-lg">{user?.name}</p>
                      <p className="w-[200px] truncate text-sm text-muted-foreground">
                        {user?.email}
                      </p>
                      <div className="flex items-center gap-2 mt-2">
                        <Badge variant={user?.role === 'organizer' ? 'default' : 'secondary'} className="text-xs">
                          {user?.role === 'organizer' ? '👑 Organizer' : '🎫 User'}
                        </Badge>
                        {user?.isVerified && (
                          <Badge variant="outline" className="text-xs border-green-500 text-green-600">
                            ✅ Verified
                          </Badge>
                        )}
                      </div>
                    </div>
                  </div>
                  <DropdownMenuSeparator />
                  
                  {userNavigation.map((item) => (
                    <DropdownMenuItem key={item.name} asChild>
                      <Link to={item.href} className="flex items-center justify-between w-full cursor-pointer">
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
                  <DropdownMenuItem onClick={handleLogout} className="text-red-600 dark:text-red-400 cursor-pointer">
                    <LogOut className="mr-2 h-4 w-4" />
                    <span>Log out</span>
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            ) : (
              <div className="flex items-center space-x-3">
                <Button asChild size="lg" className="bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white px-6 py-2 transition-all duration-300 hover:scale-105 hover:shadow-xl shadow-blue-500/25">
                  <Link to="/auth">Get Started</Link>
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
                className="hover:scale-110 transition-transform duration-200"
              >
                {isOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
              </Button>
            </div>
          </div>
        </div>

        {/* Mobile Navigation */}
        {isOpen && (
          <div className="md:hidden animate-fade-in">
            <div className="px-2 pt-2 pb-3 space-y-1 sm:px-3 border-t border-slate-200/50 dark:border-slate-700/50 bg-white/95 dark:bg-slate-900/95 backdrop-blur-lg">
              {navigation.map((item) => (
                <div key={item.name}>
                  <Link
                    to={item.href}
                    className="text-slate-700 dark:text-slate-300 hover:text-blue-600 dark:hover:text-blue-400 block px-3 py-2 text-base font-medium transition-colors duration-200 flex items-center justify-between rounded-lg hover:bg-slate-100 dark:hover:bg-slate-800"
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
                      className="text-slate-700 dark:text-slate-300 hover:text-blue-600 dark:hover:text-blue-400 block px-3 py-2 text-base font-medium transition-colors duration-200 flex items-center justify-between rounded-lg hover:bg-slate-100 dark:hover:bg-slate-800"
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
                    className="text-red-600 dark:text-red-400 hover:text-red-700 dark:hover:text-red-300 block px-3 py-2 text-base font-medium transition-colors duration-200 w-full text-left rounded-lg hover:bg-red-50 dark:hover:bg-red-900/20"
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
                    className="block px-3 py-2"
                    onClick={() => setIsOpen(false)}
                  >
                    <Button className="w-full bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white">
                      Get Started
                    </Button>
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
