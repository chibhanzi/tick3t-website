
import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';

// Safe localStorage wrapper
const safeLocalStorage = {
  getItem: (key: string): string | null => {
    try {
      return typeof window !== 'undefined' && window.localStorage ? localStorage.getItem(key) : null;
    } catch (error) {
      console.warn('localStorage access failed:', error);
      return null;
    }
  },
  setItem: (key: string, value: string): void => {
    try {
      if (typeof window !== 'undefined' && window.localStorage) {
        localStorage.setItem(key, value);
      }
    } catch (error) {
      console.warn('localStorage write failed:', error);
    }
  },
  removeItem: (key: string): void => {
    try {
      if (typeof window !== 'undefined' && window.localStorage) {
        localStorage.removeItem(key);
      }
    } catch (error) {
      console.warn('localStorage remove failed:', error);
    }
  }
};

interface User {
  id: string;
  email: string;
  name: string;
  role: 'user' | 'organizer';
  profilePicture?: string;
  isVerified?: boolean;
}

interface AuthContextType {
  user: User | null;
  isAuthenticated: boolean;
  isOrganizer: boolean;
  isLoading: boolean;
  login: (email: string, password: string) => Promise<boolean>;
  register: (email: string, password: string, name: string) => Promise<boolean>;
  logout: () => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    // Check for existing session on app load
    const savedUser = safeLocalStorage.getItem('user');
    if (savedUser) {
      try {
        setUser(JSON.parse(savedUser));
      } catch (error) {
        console.error('Failed to parse saved user:', error);
        safeLocalStorage.removeItem('user');
      }
    }
    setIsLoading(false);
  }, []);

  const login = async (email: string, password: string): Promise<boolean> => {
    setIsLoading(true);
    
    // Simulate API call
    await new Promise(resolve => setTimeout(resolve, 1000));
    
    // Determine user role based on email patterns
    const isOrganizerEmail = email.toLowerCase().includes('organizer') || 
                           email.toLowerCase().includes('admin') || 
                           email.toLowerCase().includes('event') ||
                           email.toLowerCase().includes('host') ||
                           email.toLowerCase().includes('creator');
    
    const mockUser: User = {
      id: Math.random().toString(36).substr(2, 9),
      email,
      name: email.split('@')[0].replace(/[0-9]/g, '').replace(/[._-]/g, ' '),
      role: isOrganizerEmail ? 'organizer' : 'user',
      profilePicture: `https://api.dicebear.com/7.x/avataaars/svg?seed=${email}`,
      isVerified: true
    };
    
    setUser(mockUser);
    safeLocalStorage.setItem('user', JSON.stringify(mockUser));
    setIsLoading(false);
    
    return true;
  };

  const register = async (email: string, password: string, name: string): Promise<boolean> => {
    setIsLoading(true);
    
    // Simulate API call
    await new Promise(resolve => setTimeout(resolve, 1000));
    
    // Determine user role based on email patterns
    const isOrganizerEmail = email.toLowerCase().includes('organizer') || 
                           email.toLowerCase().includes('admin') || 
                           email.toLowerCase().includes('event') ||
                           email.toLowerCase().includes('host') ||
                           email.toLowerCase().includes('creator');
    
    const mockUser: User = {
      id: Math.random().toString(36).substr(2, 9),
      email,
      name,
      role: isOrganizerEmail ? 'organizer' : 'user',
      profilePicture: `https://api.dicebear.com/7.x/avataaars/svg?seed=${email}`,
      isVerified: false
    };
    
    setUser(mockUser);
    safeLocalStorage.setItem('user', JSON.stringify(mockUser));
    setIsLoading(false);
    
    return true;
  };

  const logout = () => {
    setUser(null);
    safeLocalStorage.removeItem('user');
  };

  const value: AuthContextType = {
    user,
    isAuthenticated: !!user,
    isOrganizer: user?.role === 'organizer',
    isLoading,
    login,
    register,
    logout,
  };

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = (): AuthContextType => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};
