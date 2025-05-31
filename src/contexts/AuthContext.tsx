
import React, { createContext, useContext, useState, useEffect } from 'react';

interface User {
  id: string;
  email: string;
  name: string;
  role: 'user' | 'organizer' | 'admin';
  profilePicture?: string;
  isVerified: boolean;
  memberSince: string;
}

interface AuthContextType {
  user: User | null;
  isLoading: boolean;
  login: (email: string, password: string) => Promise<boolean>;
  register: (email: string, password: string, name: string, role: 'user' | 'organizer') => Promise<boolean>;
  logout: () => void;
  isAuthenticated: boolean;
  isOrganizer: boolean;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};

// Safe localStorage wrapper
const safeLocalStorage = {
  getItem: (key: string): string | null => {
    try {
      return localStorage.getItem(key);
    } catch (error) {
      console.warn('localStorage getItem failed:', error);
      return null;
    }
  },
  setItem: (key: string, value: string): void => {
    try {
      localStorage.setItem(key, value);
    } catch (error) {
      console.warn('localStorage setItem failed:', error);
    }
  },
  removeItem: (key: string): void => {
    try {
      localStorage.removeItem(key);
    } catch (error) {
      console.warn('localStorage removeItem failed:', error);
    }
  }
};

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    // Check for existing session with safe localStorage access
    const savedUser = safeLocalStorage.getItem('tick3rt_user');
    if (savedUser) {
      try {
        const parsedUser = JSON.parse(savedUser);
        console.log('Loaded user from localStorage:', parsedUser);
        setUser(parsedUser);
      } catch (error) {
        console.warn('Failed to parse saved user data:', error);
        safeLocalStorage.removeItem('tick3rt_user');
      }
    }
    setIsLoading(false);
  }, []);

  const login = async (email: string, password: string): Promise<boolean> => {
    setIsLoading(true);
    try {
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      // Determine role based on email or explicit organizer keywords
      const isOrganizerEmail = email.includes('organizer') || email.includes('admin') || email.includes('event');
      
      // Mock user data - in real app, this would come from your auth service
      const mockUser: User = {
        id: Date.now().toString(),
        email,
        name: email.split('@')[0],
        role: isOrganizerEmail ? 'organizer' : 'user',
        isVerified: true,
        memberSince: new Date().toISOString(),
        profilePicture: `https://api.dicebear.com/7.x/avataaars/svg?seed=${email}`
      };
      
      console.log('Creating user with role:', mockUser.role, 'for email:', email);
      setUser(mockUser);
      safeLocalStorage.setItem('tick3rt_user', JSON.stringify(mockUser));
      return true;
    } catch (error) {
      console.error('Login failed:', error);
      return false;
    } finally {
      setIsLoading(false);
    }
  };

  const register = async (email: string, password: string, name: string, role: 'user' | 'organizer'): Promise<boolean> => {
    setIsLoading(true);
    try {
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      const newUser: User = {
        id: Date.now().toString(),
        email,
        name,
        role,
        isVerified: false,
        memberSince: new Date().toISOString(),
        profilePicture: `https://api.dicebear.com/7.x/avataaars/svg?seed=${email}`
      };
      
      setUser(newUser);
      safeLocalStorage.setItem('tick3rt_user', JSON.stringify(newUser));
      return true;
    } catch (error) {
      console.error('Registration failed:', error);
      return false;
    } finally {
      setIsLoading(false);
    }
  };

  const logout = () => {
    setUser(null);
    safeLocalStorage.removeItem('tick3rt_user');
  };

  const value: AuthContextType = {
    user,
    isLoading,
    login,
    register,
    logout,
    isAuthenticated: !!user,
    isOrganizer: user?.role === 'organizer' || user?.role === 'admin'
  };

  console.log('AuthContext values:', {
    isAuthenticated: !!user,
    isOrganizer: user?.role === 'organizer' || user?.role === 'admin',
    userRole: user?.role,
    userEmail: user?.email
  });

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
};
