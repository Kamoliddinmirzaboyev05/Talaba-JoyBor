import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { jwtDecode } from 'jwt-decode';

interface User {
  username: string;
  first_name: string;
  last_name: string;
  email: string;
  image?: string;
  bio?: string;
  phone?: string;
  birth_date?: string;
  address?: string;
  telegram?: string;
}

interface AuthContextType {
  user: User | null;
  isLoading: boolean;
  isAuthenticated: boolean;
  login: (access: string, refresh: string) => void;
  logout: () => void;
  setUser: (user: User | null) => void;
  updateUserProfile: (profileData: User) => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};

interface AuthProviderProps {
  children: ReactNode;
}

export const AuthProvider: React.FC<AuthProviderProps> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const initializeAuth = async () => {
      const token = localStorage.getItem('access');
      if (token) {
        try {
          const decoded: { user_id: number; exp: number } = jwtDecode(token);
          // API dan to'liq profile ma'lumotlarini yuklash
          const response = await fetch('https://joyboryangi.pythonanywhere.com/profile/', {
            headers: {
              'Authorization': `Bearer ${token}`,
            },
          });
          
          if (response.ok) {
            const profileData = await response.json();
            setUser(profileData);
            setIsAuthenticated(true);
          } else {
            // API dan ma'lumot olishda xatolik bo'lsa, JWT dan asosiy ma'lumotlarni ishlatamiz
            setUser({
              username: decoded.username || '',
              first_name: decoded.first_name || '',
              last_name: decoded.last_name || '',
              email: decoded.email || '',
            });
            setIsAuthenticated(true);
          }
        } catch {
          setUser(null);
          setIsAuthenticated(false);
        }
      } else {
        setUser(null);
        setIsAuthenticated(false);
      }
      setIsLoading(false);
    };

    initializeAuth();
  }, []);

  const login = async (access: string, refresh: string) => {
    localStorage.setItem('access', access);
    localStorage.setItem('refresh', refresh);
    try {
      // JWT dan asosiy ma'lumotlarni olish
      const decoded: { user_id: number; exp: number } = jwtDecode(access);
      // API dan to'liq profile ma'lumotlarini olish
      const response = await fetch('https://joyboryangi.pythonanywhere.com/profile/', {
        headers: {
          'Authorization': `Bearer ${access}`,
        },
      });
      if (response.ok) {
        const profileData = await response.json();
        setUser(profileData);
      } else {
        setUser({
          username: decoded.username || '',
          first_name: decoded.first_name || '',
          last_name: decoded.last_name || '',
          email: decoded.email || '',
        });
      }
    } catch {
      setUser(null);
    }
    setIsAuthenticated(true);
  };

  const logout = () => {
    localStorage.removeItem('access');
    localStorage.removeItem('refresh');
    setUser(null);
    setIsAuthenticated(false);
  };

  const updateUserProfile = (profileData: User) => {
    setUser(profileData);
  };

  const value: AuthContextType = {
    user,
    isLoading,
    isAuthenticated,
    login,
    logout,
    setUser,
    updateUserProfile,
  };

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
}; 