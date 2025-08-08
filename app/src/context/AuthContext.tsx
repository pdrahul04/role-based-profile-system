import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';

export type UserRole = 'admin' | 'supervisor' | 'associate';

export interface AuthUser {
  id: string;
  username: string;
  role: UserRole;
  fullName: string;
}

interface AuthContextType {
  user: AuthUser | null;
  login: (username: string, password: string) => Promise<boolean>;
  logout: () => void;
  isAuthenticated: boolean;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

// Hardcoded users for demo
const DEMO_USERS: { [key: string]: { password: string; user: AuthUser } } = {
  admin: {
    password: 'admin123',
    user: {
      id: '1',
      username: 'admin',
      role: 'admin',
      fullName: 'Admin User'
    }
  },
  supervisor: {
    password: 'supervisor123',
    user: {
      id: '2',
      username: 'supervisor',
      role: 'supervisor',
      fullName: 'Supervisor User'
    }
  },
  associate: {
    password: 'associate123',
    user: {
      id: '3',
      username: 'associate',
      role: 'associate',
      fullName: 'Associate User'
    }
  }
};

interface AuthProviderProps {
  children: ReactNode;
}

export const AuthProvider: React.FC<AuthProviderProps> = ({ children }) => {
  const [user, setUser] = useState<AuthUser | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    // Check for existing session in localStorage
    const savedUser = localStorage.getItem('currentUser');
    if (savedUser) {
      try {
        setUser(JSON.parse(savedUser));
      } catch (error) {
        console.error('Error parsing saved user:', error);
        localStorage.removeItem('currentUser');
      }
    }
    setIsLoading(false);
  }, []);

  const login = async (username: string, password: string): Promise<boolean> => {
    const userCredentials = DEMO_USERS[username.toLowerCase()];
    
    if (userCredentials && userCredentials.password === password) {
      const authenticatedUser = userCredentials.user;
      setUser(authenticatedUser);
      localStorage.setItem('currentUser', JSON.stringify(authenticatedUser));
      return true;
    }
    
    return false;
  };

  const logout = () => {
    setUser(null);
    localStorage.removeItem('currentUser');
  };

  const value: AuthContextType = {
    user,
    login,
    logout,
    isAuthenticated: !!user
  };

  if (isLoading) {
    return <div className="loading">Loading...</div>;
  }

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};

export const useAuth = (): AuthContextType => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};