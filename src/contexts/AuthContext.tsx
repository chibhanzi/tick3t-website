
import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { useNavigate } from 'react-router-dom';

interface User {
  id: string;
  name: string;
  email: string;
  isOrganizer: boolean;
  profilePicture: string;
  role?: string;
  isVerified?: boolean;
}

interface AuthContextProps {
  user: User | null;
  isLoading: boolean;
  isAuthenticated: boolean;
  isOrganizer: boolean;
  login: (email: string, password: string) => Promise<boolean>;
  logout: () => void;
  register: (email: string, password: string, name: string) => Promise<boolean>;
}

const AuthContext = createContext<AuthContextProps | undefined>(undefined);

export const useAuth = (): AuthContextProps => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
};

const getStoredUser = (): User | null => {
  try {
    const storedUser = localStorage.getItem('user');
    return storedUser ? JSON.parse(storedUser) as User : null;
  } catch (error) {
    console.error('Error parsing stored user:', error);
    return null;
  }
};

export const AuthProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    const storedUser = getStoredUser();
    if (storedUser) {
      setUser(storedUser);
    }
    setIsLoading(false);
  }, []);

  const login = async (email: string, password: string): Promise<boolean> => {
    try {
      // Check if user should be an organizer
      const isOrganizerEmail = email.toLowerCase().includes('organizer') || 
                             email.toLowerCase().includes('admin') || 
                             email.toLowerCase().includes('event') ||
                             email.toLowerCase().includes('host') ||
                             email.toLowerCase().includes('creator');

      // Mock user creation
      const mockUser: User = {
        id: '1',
        name: 'John Doe',
        email: email,
        isOrganizer: isOrganizerEmail,
        profilePicture: 'https://via.placeholder.com/150',
        role: isOrganizerEmail ? 'organizer' : 'user',
        isVerified: true
      };
      
      setUser(mockUser);
      
      try {
        localStorage.setItem('user', JSON.stringify(mockUser));
      } catch (error) {
        console.warn('localStorage write failed:', error);
      }
      
      // Navigate to correct dashboard
      if (mockUser.isOrganizer) {
        navigate('/organizer-dashboard');
      } else {
        navigate('/dashboard');
      }
      
      return true;
    } catch (error) {
      console.error('Login failed:', error);
      return false;
    }
  };

  const register = async (email: string, password: string, name: string): Promise<boolean> => {
    try {
      // Check if user should be an organizer
      const isOrganizerEmail = email.toLowerCase().includes('organizer') || 
                             email.toLowerCase().includes('admin') || 
                             email.toLowerCase().includes('event') ||
                             email.toLowerCase().includes('host') ||
                             email.toLowerCase().includes('creator');

      // Mock user creation
      const mockUser: User = {
        id: '1',
        name: name,
        email: email,
        isOrganizer: isOrganizerEmail,
        profilePicture: 'https://via.placeholder.com/150',
        role: isOrganizerEmail ? 'organizer' : 'user',
        isVerified: true
      };
      
      setUser(mockUser);
      
      try {
        localStorage.setItem('user', JSON.stringify(mockUser));
      } catch (error) {
        console.warn('localStorage write failed:', error);
      }
      
      // Navigate to correct dashboard
      if (mockUser.isOrganizer) {
        navigate('/organizer-dashboard');
      } else {
        navigate('/dashboard');
      }
      
      return true;
    } catch (error) {
      console.error('Registration failed:', error);
      return false;
    }
  };

  const logout = () => {
    setUser(null);
    try {
      localStorage.removeItem('user');
    } catch (error) {
      console.warn('localStorage write failed:', error);
    }
    navigate('/auth');
  };

  const contextValue: AuthContextProps = {
    user,
    isLoading,
    isAuthenticated: !!user,
    isOrganizer: !!user?.isOrganizer,
    login,
    logout,
    register,
  };

  return (
    <AuthContext.Provider value={contextValue}>
      {children}
    </AuthContext.Provider>
  );
};
